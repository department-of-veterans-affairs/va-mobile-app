/**
 * What's New History Scraper
 *
 * This script reconstructs the historical timeline of the VA Mobile App's "What's New" content
 * and App Store release notes. It works by iterating through all git version tags and:
 *
 * 1.  Static Feature Discovery: Identifying features explicitly tied to a version in translations.
 * 2.  Launch-Based Discovery: Identifying features that "launched" when a feature flag transitioned
 *     from false to true in that specific version's remote configuration.
 * 3.  Release Notes Extraction: Fetching the raw App Store metadata from Fastlane for each version.
 * 4.  Redundancy Filtering: Detecting when release notes are nearly identical to the feature content
 *     to prevent repetitive reading.
 *
 * The output is a flattened, sorted JSON file used to power the WhatsNewReport documentation page.
 */

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
 */
function runGitCommand(cmd, silent = false) {
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
 */
function gitFetchFileAtTag(tag, filePath, isJson = false) {
  const content = runGitCommand(`git show ${tag}:${filePath}`, true)
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
 * Converts a TypeScript object string into a valid JSON string.
 */
function cleanTsToJson(content) {
  return content
    .replace(/,\s*(?=[\]}])/g, '') // Trailing commas
    .replace(/([a-zA-Z0-9]+):/g, '"$1":') // Quote keys
    .replace(/'/g, '"') // Single to double quotes
}

/**
 * Groups translation keys by their feature ID (e.g., '2.65' or 'TravelListAndStatus').
 */
function groupTranslationsByFeature(translations) {
  const grouped = {}
  Object.keys(translations).forEach((key) => {
    if (key.startsWith('whatsNew.bodyCopy.')) {
      const featureId = extractFeatureId(key)
      if (!grouped[featureId]) grouped[featureId] = {}
      grouped[featureId][key] = translations[key]
    }
  })
  return grouped
}

/**
 * Extracts a feature ID from a translation key.
 */
function extractFeatureId(key) {
  const parts = key.replace('whatsNew.bodyCopy.', '').split('.')
  // Handle segments like '2.65' or 'featureName'
  if (/^\d+$/.test(parts[0]) && parts[1] && /^\d+$/.test(parts[1])) {
    return `${parts[0]}.${parts[1]}`
  }
  return parts[0]
}

/**
 * Checks if release notes are redundant given the gathered What's New features.
 * Uses a word-set overlap approach to handle formatting differences.
 */
function checkNotesRedundancy(releaseNotes, whatsNewFeatures) {
  if (!releaseNotes || !whatsNewFeatures || Object.keys(whatsNewFeatures).length === 0) return false

  let combinedWhatsNewText = ''
  Object.values(whatsNewFeatures).forEach((feature) => {
    Object.values(feature.content || {}).forEach((text) => {
      combinedWhatsNewText += ' ' + text
    })
  })

  const tokenize = (str) =>
    str
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .split(/\s+/)
      .filter(Boolean)
  const notesWords = new Set(tokenize(releaseNotes))
  const whatsNewWords = new Set(tokenize(combinedWhatsNewText))

  if (notesWords.size === 0) return false

  // Calculate how many words from release notes are present in What's New content
  let matchCount = 0
  notesWords.forEach((word) => {
    if (whatsNewWords.has(word)) matchCount++
  })

  const overlapRatio = matchCount / notesWords.size
  return overlapRatio > 0.85 // 85% overlap threshold
}

/**
 * Resolves raw translation keys for a feature into a structured object.
 *
 * @param {string} featureId - The unique identifier for the feature (e.g. '2.65').
 * @param {Object} rawContent - Map of translation keys to their values.
 * @returns {Object} Structured content with title, bullets, and link.
 */
function resolveFeatureContent(featureId, rawContent) {
  const result = {
    title: '',
    bullets: [],
    link: { text: '', url: '' },
  }

  const prefix = `whatsNew.bodyCopy.${featureId}`
  Object.keys(rawContent).forEach((key) => {
    const keyWithoutPrefix = key === prefix ? '' : key.replace(`${prefix}.`, '')

    if (!keyWithoutPrefix) {
      result.title = rawContent[key]
    } else if (keyWithoutPrefix.startsWith('bullet.') && !key.endsWith('a11yLabel')) {
      result.bullets.push(rawContent[key])
    } else if (keyWithoutPrefix.startsWith('link.')) {
      if (keyWithoutPrefix === 'link.text' && !result.link.text) {
        result.link.text = rawContent[key]
      } else if (keyWithoutPrefix === 'link.url' && !result.link.url) {
        result.link.url = rawContent[key]
      }
    }
  })

  // Fallback title if none found
  if (!result.title) {
    result.title = `Update: ${featureId}`
  }

  return result
}

/**
 * DOMAIN SPECIFIC SCRAPERS
 */

/**
 * Identifies features explicitly tied to a version string in translations.
 * (e.g. 'whatsNew.bodyCopy.2.65' for v2.65.0)
 *
 * @param {string} versionSegment - The major.minor version (e.g. '2.65').
 * @param {Object} groupedTranslations - Map of featureId to its translation keys.
 * @param {Set} seenIds - Set of features already discovered in previous versions.
 */
function getStaticVersionFeatures(versionSegment, groupedTranslations, seenIds) {
  if (groupedTranslations[versionSegment] && !seenIds.has(versionSegment)) {
    return { [versionSegment]: { content: groupedTranslations[versionSegment] } }
  }
  return {}
}

/**
 * Identifies features that "launched" in this version via a feature flag flip.
 *
 * @param {string} tag - The git tag being analyzed.
 * @param {Object} groupedTranslations - Map of featureId to its translation keys.
 * @param {Object} lastFlags - The state of feature flags in the previous version.
 * @param {Set} seenIds - Set of features already discovered.
 */
function getFeaturesFromFlagTransitions(tag, groupedTranslations, lastFlags, seenIds) {
  const discovered = {}
  const configContent = gitFetchFileAtTag(tag, WHATS_NEW_CONFIG_PATH)
  if (!configContent) return { discovered, currentFlags: lastFlags }

  const configMatch = configContent.match(/export const WhatsNewConfig: WhatsNewConfigItem\[\] = (\[[\s\S]*?\])/)
  const config = configMatch ? JSON.parse(cleanTsToJson(configMatch[1])) : []

  const rcContent = gitFetchFileAtTag(tag, REMOTE_CONFIG_PATH)
  const rcDefaultsMatch = rcContent?.match(/export const defaults: FeatureToggleValues = ({[\s\S]*?})/)
  const currentFlags = rcDefaultsMatch ? JSON.parse(cleanTsToJson(rcDefaultsMatch[1])) : {}

  config.forEach(({ featureName, featureFlag }) => {
    if (seenIds.has(featureName)) return

    if (!lastFlags[featureFlag] && currentFlags[featureFlag]) {
      if (groupedTranslations[featureName]) {
        discovered[featureName] = { content: groupedTranslations[featureName] }
      }
    }
  })

  return { discovered, currentFlags }
}

/**
 * Fetches and filters the App Store release notes for a specific tag.
 */
function getReleaseNotes(tag, discoveredFeatures, lastNotes) {
  const rawNotes = gitFetchFileAtTag(tag, RELEASE_NOTES_PATH)
  if (!rawNotes) return null

  const cleanNotes = rawNotes.trim()
  const isGeneric = !cleanNotes || GENERIC_NOTES_VARIANTS.includes(cleanNotes)
  const isDuplicate = cleanNotes === lastNotes
  const isRedundant = checkNotesRedundancy(cleanNotes, discoveredFeatures)

  if (isGeneric || isDuplicate) return null
  return {
    notes: isRedundant ? "Same content as What's New" : cleanNotes,
    rawNotes: cleanNotes,
  }
}

/**
 * MAIN PROCESSING
 */

async function fetchWhatsNewHistory() {
  console.log('🔍 Discovering version tags locally...')

  // Step 1: Get all version tags from git (v1.0.0, etc.)
  const tagsOutput = runGitCommand('git tag -l "v*" --sort=-v:refname')
  if (!tagsOutput) return console.error('❌ Could not find any git tags.')

  const tags = tagsOutput.split('\n')
  const historyData = []
  const seenIds = new Set() // Track discovered features to avoid duplicates in older tags

  let lastReleaseNotes = ''
  let lastFlags = {}

  /**
   * Step 2: Process tags chronologically (oldest to newest).
   * This is critical because feature flag transitions (false -> true)
   * can only be determined by comparing a tag to its predecessor.
   */
  const chronologicalTags = [...tags].reverse()

  for (const tag of chronologicalTags) {
    // Extract Major.Minor (e.g., '2.65' from 'v2.65.0')
    const versionMatch = tag.match(/^v(\d+\.\d+)\.\d+$/)
    if (!versionMatch) continue

    const majorMinor = versionMatch[1]

    /**
     * Step 3: Fetch common.json for this tag.
     * We group translations by feature ID immediately to optimize lookups
     * in the subsequent scraping steps.
     */
    const translations = gitFetchFileAtTag(tag, TRANSLATIONS_PATH, true)
    if (!translations) continue

    const groupedTranslations = groupTranslationsByFeature(translations)

    /**
     * Step 4: Discover features.
     * We look for features explicitly named after the version (e.g., whatsNew.bodyCopy.2.65)
     * and features that were "launched" via flag flips in this specific version.
     */
    const versionFeatures = getStaticVersionFeatures(majorMinor, groupedTranslations, seenIds)
    const { discovered: flagFeatures, currentFlags } = getFeaturesFromFlagTransitions(
      tag,
      groupedTranslations,
      lastFlags,
      seenIds,
    )

    lastFlags = currentFlags
    const allDiscoveredForTag = { ...versionFeatures, ...flagFeatures }

    /**
     * Step 5: Process App Store Release Notes.
     * Fetch the raw notes and check if they are redundant (similar to What's New content).
     */
    const releaseNotesResult = getReleaseNotes(tag, allDiscoveredForTag, lastReleaseNotes)
    let versionReleaseNotes = null
    if (releaseNotesResult) {
      versionReleaseNotes = releaseNotesResult.notes
      lastReleaseNotes = releaseNotesResult.rawNotes
    }

    /**
     * Step 6: Create the finalized version entry.
     * If we found either specific features or unique release notes, save the entry.
     */
    if (Object.keys(allDiscoveredForTag).length > 0 || versionReleaseNotes) {
      console.log(`✅ Found content for ${tag}`)
      const tagDate = runGitCommand(`git log -1 --format=%cI ${tag}`)

      // Resolve raw translation keys into clean title/bullets/link objects
      const whatsNew = []
      Object.keys(allDiscoveredForTag).forEach((id) => {
        const resolved = resolveFeatureContent(id, allDiscoveredForTag[id].content)
        whatsNew.push({
          featureId: id,
          ...resolved,
        })
      })

      // Unshift to keep the final JSON in descending SemVer order (newest first)
      historyData.unshift({
        version: tag,
        releaseDate: tagDate || new Date().toISOString(),
        releaseNotes: versionReleaseNotes,
        whatsNew,
      })

      // Mark IDs as seen to prevent repetition in past versions (since tags are processed chrono)
      Object.keys(allDiscoveredForTag).forEach((id) => seenIds.add(id))
    }
  }

  // Step 7: Write final history to disk
  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true })
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(historyData, null, 2))
  console.log(`✅ What's New history data written to ${OUTPUT_PATH}`)
}

fetchWhatsNewHistory()
