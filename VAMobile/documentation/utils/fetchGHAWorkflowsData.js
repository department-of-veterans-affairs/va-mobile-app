/**
 * fetchGHAWorkflowsData.js
 *
 * This script is responsible for generating the metadata source for the
 * GitHub Actions documentation site. It performs the following steps:
 * 1. Discovers all workflow YAML files in .github/workflows.
 * 2. Parses YAML content to extract triggers (on), jobs, and names.
 * 3. Scans for "uses:" references to build a reverse-map of reusable workflow callers.
 * 4. Extracts descriptive comments from the top of each file.
 * 5. Writes a sanitized, consolidated JSON file to the static data directory.
 */

const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')

// --- Paths Configuration ---

/**
 * Absolute path to the repository's GitHub Actions workflow files.
 */
const WORKFLOWS_DIR = path.resolve(__dirname, '../../../.github/workflows')

/**
 * Output path for the generated JSON data, consumed by the Docusaurus WorkflowsList component.
 */
const OUTPUT_PATH = path.resolve(__dirname, '../static/data/workflows.json')

/**
 * List of workflow filenames to exclude from the documentation.
 * These are technical workarounds or implementation details that do not
 * represent high-level architectural flows.
 */
const EXCLUDED_WORKFLOWS = [
  'native_build_check_android_reusable.yml',
  'native_build_check_android_skip.yml',
  'native_build_check_ios_reusable.yml',
  'native_build_check_ios_skip.yml',
]

// --- Extraction Utilities ---

/**
 * Extracts a human-readable description from a workflow file's leading comments.
 * It identifies the first block of comments at the top of the file and merges them
 * into a single continuous string.
 *
 * @param {string} content - Raw file content of the workflow YAML.
 * @returns {string|null} - The extracted description string, or null if no comments were found.
 */
function extractDescription(content) {
  const lines = content.split('\n')
  let description = ''
  let inBlock = false

  for (const line of lines) {
    const trimmedLine = line.trim()

    // If the line starts with #, it's a comment we want to capture
    if (trimmedLine.startsWith('#')) {
      inBlock = true
      // Strip leading # and optional space to get the raw text
      const text = trimmedLine.replace(/^#\s*/, '').trim()

      if (text) {
        description += (description ? ' ' : '') + text
      }
    } else if (inBlock && trimmedLine === '') {
      // Allow empty comments (bare #) within the block, treating them as separators
      continue
    } else if (trimmedLine !== '') {
      // The first non-empty, non-comment line (like 'name:' or 'on:') marks the end of our description block
      break
    }
  }

  // Sanitize: collapse multiple spaces and return null if the result is empty
  return description.replace(/  +/g, ' ').trim() || null
}

/**
 * Pre-scans all workflow files to identify which workflows call which reusable workflows.
 * This allows us to display "Used By" information for every reusable workflow.
 *
 * @param {string[]} files - List of workflow filenames (e.g. ['build.yml', 'deploy.yml']).
 * @returns {Object} - A map where keys are filenames and values are arrays of { name, fileName } callers.
 */
function buildUsedByMap(files) {
  const userMap = {}

  files.forEach((fileName) => {
    const filePath = path.join(WORKFLOWS_DIR, fileName)
    const content = fs.readFileSync(filePath, 'utf8')

    /**
     * Regex to find internal reusable workflow calls.
     * Matches:
     * - uses: ./.github/workflows/reusable.yml
     * - uses: department-of-veterans-affairs/va-mobile-app/.github/workflows/reusable.yml
     */
    const usesRegex = /uses:\s+(?:\.\/)?(?:[\w.-]+\/[\w.-]+\/)?\.github\/workflows\/([\w-]+\.yml)(?:@[\w.-]+)?/g
    let match

    // Get the workflow name from the file to facilitate better linking
    const nameMatch = content.match(/^name:\s+['"]?(.*?)['"]?\s*$/m)
    const workflowName = nameMatch ? nameMatch[1] : fileName

    while ((match = usesRegex.exec(content)) !== null) {
      const reusableFile = match[1]

      // Initialize the map entry for this reusable workflow if it doesn't exist
      if (!userMap[reusableFile]) {
        userMap[reusableFile] = []
      }

      // Prevent duplicate entries (a workflow calling another multiple times)
      if (!userMap[reusableFile].find((c) => c.fileName === fileName)) {
        userMap[reusableFile].push({ name: workflowName, fileName })
      }
    }
  })

  return userMap
}

/**
 * Removes internal technical details from the 'on' trigger configuration.
 * Secrets and Outputs are excluded as they are implementation details that
 * clutter the architectural documentation.
 *
 * @param {object} on - The parsed `on` trigger map from the workflow YAML.
 */
function stripSensitiveKeys(on) {
  Object.keys(on).forEach((trigger) => {
    if (on[trigger] && typeof on[trigger] === 'object') {
      delete on[trigger].secrets
      delete on[trigger].outputs
    }
  })
}

/**
 * Reads, parses, and extracts high-level metadata from a single workflow file.
 *
 * @param {string} fileName - The filename of the workflow.
 * @param {Object} userMap - The pre-built map of reusable workflow callers.
 * @returns {object|null} - A sanitized metadata object, or null if parsing fails.
 */
function parseWorkflow(fileName, userMap) {
  const filePath = path.join(WORKFLOWS_DIR, fileName)
  const content = fs.readFileSync(filePath, 'utf8')

  // 1. Extract the high-level description from top-of-file comments
  const description = extractDescription(content)

  // 2. Map callers from our relationship scan
  const users = userMap[fileName] || null
  const usedBy = users ? users.map((c) => `${c.name} (${c.fileName})`) : null

  // 3. Parse the YAML content
  let data
  try {
    data = yaml.load(content)
  } catch (e) {
    console.error(`Error parsing YAML in ${fileName}:`, e.message)
    return null
  }

  if (!data) return null

  // 4. Sanitize the trigger ('on') configuration
  const on = data.on || {}
  stripSensitiveKeys(on)

  // 5. Build the final documentation object
  return {
    fileName,
    name: data.name || fileName,
    description,
    usedBy,
    on,
    // Store only the keys (names) of the jobs to provide a high-level overview
    jobs: data.jobs ? Object.keys(data.jobs) : [],
  }
}

// --- Main Execution Flow ---

/**
 * Orchestrates the metadata extraction process.
 */
function main() {
  console.log(`Scanning workflows in: ${WORKFLOWS_DIR}`)

  if (!fs.existsSync(WORKFLOWS_DIR)) {
    console.error(`Fatal Error: Workflows directory not found at ${WORKFLOWS_DIR}`)
    process.exit(1)
  }

  // 1. Find all YAML files in the directory, excluding technical workarounds
  const files = fs.readdirSync(WORKFLOWS_DIR).filter((file) => {
    const isYaml = file.endsWith('.yml') || file.endsWith('.yaml')
    const isExcluded = EXCLUDED_WORKFLOWS.includes(file)
    return isYaml && !isExcluded
  })

  // 2. Perform a pre-scan to build the "Used By" relationship map
  const userMap = buildUsedByMap(files)

  // 3. Parse each file into a sanitized metadata object
  const workflows = files
    .map((file) => parseWorkflow(file, userMap))
    .filter(Boolean) // Remove any null results from parsing errors
    .sort((a, b) => a.name.localeCompare(b.name)) // Alphabetize by display name

  // 4. Persistence: write the consolidated data to JSON
  try {
    fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true })
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(workflows, null, 2))

    console.log(`✅ Documentation data successfully written to ${OUTPUT_PATH}`)
    console.log(`Successfully processed ${workflows.length} workflows.`)
  } catch (err) {
    console.error(`Fatal Error: Failed to write output file:`, err.message)
    process.exit(1)
  }
}

// Kick off the process
main()
