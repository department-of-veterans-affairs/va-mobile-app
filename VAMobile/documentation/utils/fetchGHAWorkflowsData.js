const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')

/** Absolute path to the repo's .github/workflows directory. */
const WORKFLOWS_DIR = path.resolve(__dirname, '../../../.github/workflows')

/** Output path for the JSON consumed by the Docusaurus WorkflowsList component. */
const OUTPUT_PATH = path.resolve(__dirname, '../static/data/workflows.json')

// Technical workarounds that don't represent high-level architectural flows
const EXCLUDED_WORKFLOWS = [
  'native_build_check_android_reusable.yml',
  'native_build_check_android_skip.yml',
  'native_build_check_ios_reusable.yml',
  'native_build_check_ios_skip.yml',
]

/**
 * Extracts a description from consecutive comment lines at the top of a workflow file.
 * Stops at the first non-comment, non-empty line (e.g. `name:` or `on:`).
 * @param {string} content - Raw workflow YAML file content.
 * @returns {string|null} Concatenated description or null if no comments found.
 */
function extractDescription(content) {
  const parts = []
  for (const line of content.split('\n')) {
    const trimmed = line.trim()
    if (trimmed.startsWith('#')) {
      const text = trimmed.replace(/^#\s*/, '').trim()
      if (text) parts.push(text)
    } else if (trimmed !== '') {
      break
    }
  }
  return parts.length ? parts.join(' ') : null
}

/**
 * Pre-scans all workflow files to build a reverse "Used By" map.
 * For each reusable workflow, records which other workflows call it.
 * @param {string[]} files - Workflow filenames (e.g. ['build.yml', 'deploy.yml']).
 * @returns {Object.<string, Array<{name: string, fileName: string}>>}
 */
function buildUsedByMap(files) {
  const userMap = {}

  files.forEach((fileName) => {
    const filePath = path.join(WORKFLOWS_DIR, fileName)
    const content = fs.readFileSync(filePath, 'utf8')

    // Matches 'uses: ./.github/workflows/X.yml' and 'uses: org/repo/.github/workflows/X.yml@ref'
    const usesRegex = /uses:\s+(?:\.\/)?(?:[\w.-]+\/[\w.-]+\/)?\.github\/workflows\/([\w-]+\.yml)(?:@[\w.-]+)?/g
    let match

    const nameMatch = content.match(/^name:\s+['"]?(.*?)['"]?\s*$/m)
    const workflowName = nameMatch ? nameMatch[1] : fileName

    while ((match = usesRegex.exec(content)) !== null) {
      const reusableFile = match[1]

      if (!userMap[reusableFile]) {
        userMap[reusableFile] = []
      }

      // Deduplicate — a workflow may call another multiple times
      if (!userMap[reusableFile].find((c) => c.fileName === fileName)) {
        userMap[reusableFile].push({ name: workflowName, fileName })
      }
    }
  })

  return userMap
}

/**
 * Builds a forward "uses" map: for each workflow, records which reusable workflows it calls.
 * @param {string[]} files - Workflow filenames.
 * @param {Object.<string, {name: string}>} nameMap - Map of fileName to parsed workflow name.
 * @returns {Object.<string, Array<{name: string, fileName: string}>>}
 */
function buildUsesMap(files, nameMap) {
  const usesMap = {}

  files.forEach((fileName) => {
    const filePath = path.join(WORKFLOWS_DIR, fileName)
    const content = fs.readFileSync(filePath, 'utf8')

    const usesRegex = /uses:\s+(?:\.\/)?(?:[\w.-]+\/[\w.-]+\/)?\.github\/workflows\/([\w-]+\.yml)(?:@[\w.-]+)?/g
    let match
    const refs = []

    while ((match = usesRegex.exec(content)) !== null) {
      const reusableFile = match[1]
      if (!refs.find((r) => r.fileName === reusableFile)) {
        const name = nameMap[reusableFile] || reusableFile
        refs.push({ name, fileName: reusableFile })
      }
    }

    if (refs.length > 0) {
      usesMap[fileName] = refs
    }
  })

  return usesMap
}

/**
 * Pre-scans all workflow files to build a name map (fileName → workflow name).
 * @param {string[]} files - Workflow filenames.
 * @returns {Object.<string, string>}
 */
function buildNameMap(files) {
  const nameMap = {}
  files.forEach((fileName) => {
    const filePath = path.join(WORKFLOWS_DIR, fileName)
    const content = fs.readFileSync(filePath, 'utf8')
    const nameMatch = content.match(/^name:\s+['"]?(.*?)['"]?\s*$/m)
    nameMap[fileName] = nameMatch ? nameMatch[1] : fileName
  })
  return nameMap
}

/**
 * Parses a single workflow file into a sanitized metadata object.
 * @param {string} fileName - The workflow filename.
 * @param {Object} userMap - The "Used By" reverse map from buildUsedByMap().
 * @param {Object} usesMap - The forward "Uses" map from buildUsesMap().
 * @returns {object|null} Metadata object, or null if parsing fails.
 */
function parseWorkflow(fileName, userMap, usesMap) {
  const filePath = path.join(WORKFLOWS_DIR, fileName)
  const content = fs.readFileSync(filePath, 'utf8')

  const description = extractDescription(content)

  const usedBy = userMap[fileName] || null
  const uses = usesMap[fileName] || null

  let data
  try {
    data = yaml.load(content, { schema: yaml.DEFAULT_SAFE_SCHEMA })
  } catch (e) {
    console.error(`Error parsing YAML in ${fileName}:`, e.message)
    return null
  }

  if (!data) return null

  const on = data.on || {}
  Object.values(on).forEach((config) => {
    if (config && typeof config === 'object') {
      delete config.secrets
      delete config.outputs
    }
  })

  return {
    fileName,
    name: data.name || fileName,
    description,
    usedBy,
    uses,
    on,
    jobs: data.jobs ? Object.keys(data.jobs) : [],
  }
}

/** Discovers workflow YAML files, parses metadata, and writes consolidated JSON. */
function main() {
  console.log(`Scanning workflows in: ${WORKFLOWS_DIR}`)

  if (!fs.existsSync(WORKFLOWS_DIR)) {
    console.error(`Fatal Error: Workflows directory not found at ${WORKFLOWS_DIR}`)
    process.exit(1)
  }

  const files = fs.readdirSync(WORKFLOWS_DIR).filter((file) => {
    const isYaml = file.endsWith('.yml') || file.endsWith('.yaml')
    const isExcluded = EXCLUDED_WORKFLOWS.includes(file)
    return isYaml && !isExcluded
  })

  const nameMap = buildNameMap(files)
  const userMap = buildUsedByMap(files)
  const usesMap = buildUsesMap(files, nameMap)

  const workflows = files
    .map((file) => parseWorkflow(file, userMap, usesMap))
    .filter(Boolean)
    .sort((a, b) => a.name.localeCompare(b.name))

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

main()
