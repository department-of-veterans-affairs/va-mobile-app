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
 * Converts a TypeScript object string into a valid JSON string for parsing.
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
 * Extracts a feature ID from a translation key.
 */
function extractFeatureId(key) {
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
 * Uses a word-set overlap approach to handle formatting differences.
 */
function isSimilar(releaseNotes, whatsNewFeatures) {
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
 * DOMAIN SPECIFIC SCRAPERS
 */

/**
 * Scans translations for version-matched features (e.g., 'whatsNew.bodyCopy.2.65').
 */
function getFeaturesFromTranslations(majorMinor, translations, seenIds) {
  const discovered = {}

  Object.keys(translations).forEach((key) => {
    if (key.startsWith('whatsNew.bodyCopy.')) {
      const featureId = extractFeatureId(key)
      const isVersionString = /^\d+(\.\d+)*$/.test(featureId)

      if (isVersionString && featureId === majorMinor && !seenIds.has(featureId)) {
        if (!discovered[featureId]) {
          discovered[featureId] = { content: {} }
        }
        discovered[featureId].content[key] = translations[key]
      }
    }
  })

  return discovered
}

/**
 * Scans for features that were introduced via feature flag flips in this version.
 */
function getFeaturesFromFlagTransitions(tag, translations, lastFlags, seenIds) {
  const discovered = {}
  const configContent = gitShow(tag, WHATS_NEW_CONFIG_PATH)
  if (!configContent) return { discovered, currentFlags: lastFlags }

  // Parse WhatsNewConfig array
  const configMatch = configContent.match(/export const WhatsNewConfig: WhatsNewConfigItem\[\] = (\[[\s\S]*?\])/)
  const config = configMatch ? JSON.parse(cleanTsObjectToJson(configMatch[1])) : []

  // Parse Remote Config Defaults
  const rcContent = gitShow(tag, REMOTE_CONFIG_PATH)
  const rcDefaultsMatch = rcContent
    ? rcContent.match(/export const defaults: FeatureToggleValues = ({[\s\S]*?})/)
    : null
  const currentFlags = rcDefaultsMatch ? JSON.parse(cleanTsObjectToJson(rcDefaultsMatch[1])) : {}

  config.forEach((item) => {
    const { featureName, featureFlag } = item
    const featureId = featureName // Renaming for consistency
    if (seenIds.has(featureId)) return

    // Introduce if flag transitioned false/undefined -> true
    const wasTrueBefore = lastFlags[featureFlag] === true
    const isTrueNow = currentFlags[featureFlag] === true

    if (!wasTrueBefore && isTrueNow) {
      const baseKey = `whatsNew.bodyCopy.${featureId}`
      const featureTranslations = {}

      Object.keys(translations).forEach((k) => {
        if (k === baseKey || k.startsWith(`${baseKey}.`)) {
          featureTranslations[k] = translations[k]
        }
      })

      if (Object.keys(featureTranslations).length > 0) {
        discovered[featureId] = { content: featureTranslations }
      }
    }
  })

  return { discovered, currentFlags }
}

/**
 * Fetches and filters the App Store release notes for a specific tag.
 */
function getReleaseNotes(tag, discoveredFeatures, lastNotes) {
  const rawNotes = gitShow(tag, RELEASE_NOTES_PATH)
  if (!rawNotes) return null

  const cleanNotes = rawNotes.trim()
  const isGeneric = !cleanNotes || GENERIC_NOTES_VARIANTS.includes(cleanNotes)
  const isDuplicate = cleanNotes === lastNotes
  const isRedundant = isSimilar(cleanNotes, discoveredFeatures)

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

  const tagsOutput = runGit('git tag -l "v*" --sort=-v:refname')
  if (!tagsOutput) return console.error('❌ Could not find any git tags.')

  const tags = tagsOutput.split('\n')
  const historyData = []
  const seenIds = new Set()

  let lastReleaseNotes = ''
  let lastFlags = {}

  // Process chronologically to track flag transitions accurately
  const chronologicalTags = [...tags].reverse()

  for (const tag of chronologicalTags) {
    const versionMatch = tag.match(/^v(\d+\.\d+)\.\d+$/)
    if (!versionMatch) continue

    const majorMinor = versionMatch[1]
    const translations = gitShow(tag, TRANSLATIONS_PATH, true)
    if (!translations) continue

    // 1. Collect features from translations and flags
    const versionFeatures = getFeaturesFromTranslations(majorMinor, translations, seenIds)
    const { discovered: flagFeatures, currentFlags } = getFeaturesFromFlagTransitions(
      tag,
      translations,
      lastFlags,
      seenIds,
    )

    lastFlags = currentFlags
    const allDiscoveredForTag = { ...versionFeatures, ...flagFeatures }

    // 2. Process Release Notes
    const releaseNotesResult = getReleaseNotes(tag, allDiscoveredForTag, lastReleaseNotes)
    if (releaseNotesResult) {
      allDiscoveredForTag['AppStoreReleaseNotes'] = { content: { releaseNotes: releaseNotesResult.notes } }
      lastReleaseNotes = releaseNotesResult.rawNotes
    }

    // 3. Finalize version entry
    if (Object.keys(allDiscoveredForTag).length > 0) {
      console.log(`✅ Found content for ${tag}`)
      const tagDate = runGit(`git log -1 --format=%cI ${tag}`)

      const featuresArray = Object.keys(allDiscoveredForTag).map((id) => ({
        ...allDiscoveredForTag[id],
        featureId: id,
      }))

      historyData.unshift({
        version: tag,
        releaseDate: tagDate || new Date().toISOString(),
        features: featuresArray,
      })

      // Mark IDs as seen to prevent repetition in future versions
      Object.keys(allDiscoveredForTag).forEach((id) => seenIds.add(id))
    }
  }

  // Final Output
  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true })
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(historyData, null, 2))
  console.log(`✅ What's New history data written to ${OUTPUT_PATH}`)
}

fetchWhatsNewHistory()
