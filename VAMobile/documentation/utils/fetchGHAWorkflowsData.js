/**
 * fetchWorkflowsData.js
 *
 * Reads all GitHub Actions workflow YAML files from the .github/workflows directory,
 * extracts key metadata (name, triggers, inputs, job names, and developer description),
 * and writes the results to a static JSON file consumed by the documentation site.
 *
 * Run via: node utils/fetchWorkflowsData.js
 */

const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')

// --- Paths ---

/** Absolute path to the repository's GitHub Actions workflow files. */
const WORKFLOWS_DIR = path.resolve(__dirname, '../../../.github/workflows')

/** Output path for the generated JSON data, served statically by the docs site. */
const OUTPUT_PATH = path.resolve(__dirname, '../static/data/workflows.json')

// --- Helpers ---

/**
 * Extracts a human-readable description from a workflow file's leading comments.
 * Looks for a `# DESCRIPTION:` marker and collects all immediately following comment lines.
 *
 * @param {string} content - Raw file content of the workflow YAML.
 * @returns {string|null} - The extracted description string, or null if not found.
 */
function extractDescription(content) {
  const lines = content.split('\n')
  let description = ''
  let inBlock = false

  for (const line of lines) {
    const trimmedLine = line.trim()

    if (trimmedLine.startsWith('#')) {
      inBlock = true
      // Strip leading # and optional space
      const text = trimmedLine.replace(/^#\s*/, '').trim()

      if (text) {
        description += (description ? ' ' : '') + text
      }
    } else if (inBlock && trimmedLine === '') {
      // Allow empty comments (bare #) within the block, treated as spaces/separators
      continue
    } else if (trimmedLine !== '') {
      // First non-empty, non-comment line ends the block
      break
    }
  }

  // Collapse any double-spaces that crept in from continuation lines
  return description.replace(/  +/g, ' ').trim() || null
}

/**
 * Pre-scans all workflow files to build a map of reusable workflow usage.
 *
 * @param {string[]} files - List of workflow filenames.
 * @returns {Object} - Map of reusable file name to list of callers.
 */
function buildUserMap(files) {
  const userMap = {}

  files.forEach((fileName) => {
    const filePath = path.join(WORKFLOWS_DIR, fileName)
    const content = fs.readFileSync(filePath, 'utf8')

    // Find internal reusable workflow calls: "uses: ./.github/workflows/reusable.yml"
    // or direct internal references "uses: department-of-veterans-affairs/va-mobile-app/.github/workflows/reusable.yml"
    const usesRegex = /uses:\s+(?:\.\/)?(?:[\w.-]+\/[\w.-]+\/)?\.github\/workflows\/([\w-]+\.yml)(?:@[\w.-]+)?/g
    let match

    const nameMatch = content.match(/^name:\s+['"]?(.*?)['"]?\s*$/m)
    const workflowName = nameMatch ? nameMatch[1] : fileName

    while ((match = usesRegex.exec(content)) !== null) {
      const reusableFile = match[1]
      if (!userMap[reusableFile]) userMap[reusableFile] = []
      if (!userMap[reusableFile].find((c) => c.fileName === fileName)) {
        userMap[reusableFile].push({ name: workflowName, fileName })
      }
    }
  })

  return userMap
}

/**
 * Removes `secrets` and `outputs` from each trigger's configuration object.
 * These are internal CI details that don't add value in the documentation context
 * and may contain sensitive metadata.
 *
 * @param {object} on - The parsed `on` trigger map from a workflow file.
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
 * Reads, parses, and extracts metadata from a single workflow YAML file.
 *
 * @param {string} fileName - The file name (not full path) of the workflow file.
 * @param {Object} userMap - Map built by buildUserMap.
 * @returns {object|null} - Parsed workflow metadata, or null if the file is invalid.
 */
function parseWorkflow(fileName, userMap) {
  const filePath = path.join(WORKFLOWS_DIR, fileName)
  const content = fs.readFileSync(filePath, 'utf8')

  const description = extractDescription(content)

  // Get users from the pre-built userMap
  const users = userMap[fileName] || null
  const usedBy = users ? users.map((c) => `${c.name} (${c.fileName})`) : null

  let data
  try {
    data = yaml.load(content)
  } catch (e) {
    console.error(`Error parsing YAML in ${fileName}:`, e.message)
    return null
  }

  if (!data) return null

  // Extract and sanitize the trigger configuration
  const on = data.on || {}
  stripSensitiveKeys(on)

  return {
    fileName,
    name: data.name || fileName,
    description,
    usedBy,
    on,
    // Only store job names (keys), not full job configs
    jobs: data.jobs ? Object.keys(data.jobs) : [],
  }
}

// --- Main ---

/**
 * Entry point. Orchestrates:
 *  1. Discovering all workflow files in the .github/workflows directory.
 *  2. Parsing each file and extracting metadata.
 *  3. Writing the sorted results to a static JSON file.
 */
function main() {
  console.log(`Reading workflows from: ${WORKFLOWS_DIR}`)

  if (!fs.existsSync(WORKFLOWS_DIR)) {
    console.error(`Error: Workflows directory not found at ${WORKFLOWS_DIR}`)
    process.exit(1)
  }

  // 1. Discover: find all .yml/.yaml files
  const files = fs.readdirSync(WORKFLOWS_DIR).filter((file) => file.endsWith('.yml') || file.endsWith('.yaml'))

  // 2. Pre-scan for reusable workflow usage
  const userMap = buildUserMap(files)

  // 3. Parse: extract metadata and filter out any unparseable workflows
  const workflows = files
    .map((file) => parseWorkflow(file, userMap))
    .filter(Boolean)
    .sort((a, b) => a.name.localeCompare(b.name)) // Sort alphabetically by display name

  // 3. Write: serialize to JSON for use by the documentation site
  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true })
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(workflows, null, 2))

  console.log(`✅ Workflow data written to ${OUTPUT_PATH}`)
  console.log(`Extracted metadata for ${workflows.length} workflows.`)
}

main()
