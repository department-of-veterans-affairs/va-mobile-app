const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

/**
 * PATHS & CONSTANTS
 */
const TRANSLATIONS_PATH = 'VAMobile/src/translations/en/common.json'
const WHATS_NEW_CONFIG_PATH = 'VAMobile/src/constants/whatsNew.ts'
const REMOTE_CONFIG_PATH = 'VAMobile/src/utils/remoteConfig.ts'
const RELEASE_NOTES_PATH = 'VAMobile/ios/fastlane/metadata/en-US/release_notes.txt'
const OUTPUT_PATH = path.resolve('static', 'data', 'whats-new-history.json')

const GENERIC_NOTES_VARIANTS = [
  'We added general improvements and fixed a few bugs.',
  'We added general improvements.',
  'We added general improvements',
  'General improvements and bug fixes.',
]

/**
 * CORE HELPERS
 */

/**
 * Runs a git command in the repository root.
 * @param {string} cmd - The git command to run.
 * @param {boolean} silent - Whether to suppress error warnings.
 * @returns {string|null} - The command output or null if failed.
 */
function runGit(cmd, silent = false) {
  try {
    return execSync(cmd, {
      cwd: path.resolve('..', '..'),
      encoding: 'utf-8',
      stdio: silent ? ['ignore', 'pipe', 'ignore'] : 'pipe',
    }).trim()
  } catch (e) {
    if (!silent) {
      console.warn(`⚠️ Git command failed: ${cmd}`, e.message)
    }
    return null
  }
}

/**
 * Fetches a file's content from a specific git tag.
 * @param {string} tag - The git tag (e.g., v2.65.0).
 * @param {string} filePath - Path relative to repo root.
 * @param {boolean} isJson - If true, parses the content as JSON.
 * @returns {any} - File content or parsed JSON.
 */
function gitShow(tag, filePath, isJson = false) {
  const content = runGit(`git show ${tag}:${filePath}`, true)
  if (!content) return null
  if (isJson) {
    try {
      return JSON.parse(content)
    } catch (e) {
      return null
    }
  }
  return content
}

/**
 * Converts a TypeScript object string (from WhatsNewConfig or remoteConfig defaults)
 * into a valid JSON string for parsing.
 * @param {string} content - The TypeScript snippet.
 * @returns {string} - Cleaned JSON string.
 */
function cleanTsObjectToJson(content) {
  return content
    .replace(/,\s*/g, ',') // Basic whitespace cleanup
    .replace(/,}/g, '}') // Trailing commas in objects
    .replace(/,]/g, ']') // Trailing commas in arrays
    .replace(/([a-zA-Z0-9]+):/g, '"$1":') // Quote keys
    .replace(/'/g, '"') // Replace single quotes with double quotes
}

/**
 * Extracts a feature name from a translation key like 'whatsNew.bodyCopy.FeatureName.bullet.1'.
 * @param {string} key - The full translation key.
 * @returns {string} - The extracted feature name.
 */
function extractFeatureName(key) {
  const keyWithoutPrefix = key.replace('whatsNew.bodyCopy.', '')
  if (keyWithoutPrefix.includes('.bullet.')) {
    return keyWithoutPrefix.substring(0, keyWithoutPrefix.indexOf('.bullet.'))
  }
  if (keyWithoutPrefix.includes('.link.')) {
    return keyWithoutPrefix.substring(0, keyWithoutPrefix.indexOf('.link.'))
  }
  return keyWithoutPrefix
}

/**
 * Checks if release notes are redundant given the gathered What's New features.
 */
function isSimilar(releaseNotes, whatsNewFeatures) {
  if (!releaseNotes || !whatsNewFeatures || Object.keys(whatsNewFeatures).length === 0) return false

  let combinedWhatsNew = ''
  Object.values(whatsNewFeatures).forEach((feature) => {
    Object.values(feature.content || {}).forEach((text) => {
      combinedWhatsNew += ' ' + text
    })
  })

  const normalize = (str) => str.toLowerCase().replace(/[^a-z0-9]/g, '')
  const normalizedNotes = normalize(releaseNotes)
  const normalizedWhatsNew = normalize(combinedWhatsNew)

  if (!normalizedWhatsNew) return false
  return normalizedWhatsNew.includes(normalizedNotes) || normalizedNotes.includes(normalizedWhatsNew)
}

/**
 * MAIN PROCESSING
 */

async function fetchWhatsNewHistory() {
  console.log('🔍 Discovering version tags locally...')

  const tagsOutput = runGit('git tag -l "v*" --sort=-v:refname')
  if (!tagsOutput) {
    console.error('❌ Could not find any git tags.')
    return
  }

  const tags = tagsOutput.split('\n')
  const historyData = []
  const seenFeatures = new Set()
  let lastReleaseNotes = ''
  let lastFlags = {}

  // Process chronologically to track flag transitions
  const chronologicalTags = [...tags].reverse()

  for (const tag of chronologicalTags) {
    const versionMatch = tag.match(/^v(\d+\.\d+)\.\d+$/)
    if (!versionMatch) continue

    const majorMinor = versionMatch[1]
    const whatsNewForTag = {} // Stores features found in this version
    const introducedThisTag = new Set()

    // 1. Fetch Key Files
    const translations = gitShow(tag, TRANSLATIONS_PATH, true)
    if (!translations) continue

    /**
     * SECTION A: VERSION-MATCHED FEATURES
     * Looks for keys like 'whatsNew.bodyCopy.2.65'
     */
    Object.keys(translations).forEach((key) => {
      if (key.startsWith('whatsNew.bodyCopy.')) {
        const featureName = extractFeatureName(key)
        const isVersionString = /^\d+(\.\d+)*$/.test(featureName)

        if (isVersionString && featureName === majorMinor && !seenFeatures.has(featureName)) {
          if (!whatsNewForTag[featureName]) {
            whatsNewForTag[featureName] = { content: {} }
          }
          whatsNewForTag[featureName].content[key] = translations[key]
          introducedThisTag.add(featureName)
        }
      }
    })

    /**
     * SECTION B: FEATURE FLAG TRANSITIONS
     * Triggered if a flag in remoteConfig.ts flips to 'true' in this version.
     */
    const configContent = runGit(`git show ${tag}:${WHATS_NEW_CONFIG_PATH}`, true)
    if (configContent) {
      // Parse Config
      const configMatch = configContent.match(/export const WhatsNewConfig: WhatsNewConfigItem\[\] = (\[[\s\S]*?\])/)
      const config = configMatch ? JSON.parse(cleanTsObjectToJson(configMatch[1])) : []

      // Parse current Remote Config Defaults
      const rcContent = runGit(`git show ${tag}:${REMOTE_CONFIG_PATH}`, true)
      const rcDefaultsMatch = rcContent
        ? rcContent.match(/export const defaults: FeatureToggleValues = ({[\s\S]*?})/)
        : null
      const currentFlags = rcDefaultsMatch ? JSON.parse(cleanTsObjectToJson(rcDefaultsMatch[1])) : {}

      config.forEach((item) => {
        const { featureName, featureFlag } = item
        if (seenFeatures.has(featureName)) return

        // We introduce if flag transitioned false -> true
        const wasTrueBefore = lastFlags[featureFlag] === true
        const isTrueNow = currentFlags[featureFlag] === true

        if (!wasTrueBefore && isTrueNow) {
          const baseKey = `whatsNew.bodyCopy.${featureName}`
          const featureTranslations = {}

          // Gather all translation keys for this feature
          Object.keys(translations).forEach((k) => {
            if (k === baseKey || k.startsWith(`${baseKey}.`)) {
              featureTranslations[k] = translations[k]
            }
          })

          if (Object.keys(featureTranslations).length > 0) {
            whatsNewForTag[featureName] = { content: featureTranslations }
            introducedThisTag.add(featureName)
          }
        }
      })
      lastFlags = currentFlags
    }

    /**
     * SECTION 2: APP STORE RELEASE NOTES
     */
    const rawReleaseNotes = runGit(`git show ${tag}:${RELEASE_NOTES_PATH}`, true)
    if (rawReleaseNotes) {
      const cleanNotes = rawReleaseNotes.trim()

      const isGeneric = !cleanNotes || GENERIC_NOTES_VARIANTS.includes(cleanNotes)
      const isDuplicate = cleanNotes === lastReleaseNotes
      const isRedundant = isSimilar(cleanNotes, whatsNewForTag)

      if (!isGeneric && !isDuplicate && !isRedundant) {
        whatsNewForTag['AppStoreReleaseNotes'] = {
          content: { releaseNotes: cleanNotes },
        }
        lastReleaseNotes = cleanNotes
      }
    }

    // Wrap up version data
    if (Object.keys(whatsNewForTag).length > 0) {
      console.log(`✅ Found content for ${tag}`)
      const tagDate = runGit(`git log -1 --format=%cI ${tag}`)

      // Convert features to array format
      const featuresArray = Object.keys(whatsNewForTag).map((name) => ({
        ...whatsNewForTag[name],
        featureName: name,
      }))

      historyData.unshift({
        version: tag,
        releaseDate: tagDate || new Date().toISOString(),
        features: featuresArray,
      })

      // Update seen status
      introducedThisTag.forEach((f) => seenFeatures.add(f))
    }
  }

  // OUTPUT
  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true })
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(historyData, null, 2))
  console.log(`✅ What's New history data written to ${OUTPUT_PATH}`)
}

fetchWhatsNewHistory()
