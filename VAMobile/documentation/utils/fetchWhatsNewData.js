const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')
const admin = require('firebase-admin')

const TRANSLATIONS_PATH = 'VAMobile/src/translations/en/common.json'
const WHATS_NEW_CONFIG_PATH = 'VAMobile/src/constants/whatsNew.ts'
const OUTPUT_PATH = path.resolve('static', 'data', 'whats-new-history.json')
const SERVICE_ACCOUNT_PATH = process.env.FIREBASE_SERVICE_ACCOUNT_PATH

if (SERVICE_ACCOUNT_PATH && fs.existsSync(SERVICE_ACCOUNT_PATH)) {
  admin.initializeApp({
    credential: admin.credential.cert(SERVICE_ACCOUNT_PATH),
  })
}

// Helper to run git commands
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

function parseWhatsNewConfig(tsContent) {
  if (!tsContent) return []
  const configMatch = tsContent.match(/export const WhatsNewConfig: WhatsNewConfigItem\[] = \[([\s\S]*?)\]/)
  if (!configMatch) return []

  const itemsContent = configMatch[1]
  const items = []
  const itemRegex = /\{([\s\S]*?)\}/g
  let match
  while ((match = itemRegex.exec(itemsContent)) !== null) {
    const itemContent = match[1]
    const featureNameMatch = itemContent.match(/featureName:\s*['"](.*?)['"]/)
    const featureFlagMatch = itemContent.match(/featureFlag:\s*['"](.*?)['"]/)

    if (featureNameMatch) {
      items.push({
        featureName: featureNameMatch[1],
        featureFlag: featureFlagMatch ? featureFlagMatch[1] : null,
      })
    }
  }
  return items
}

/**
 * Fetches Remote Config version history and determines when flags were first enabled.
 * Note: Limited to 300 versions / 90 days of history by Firebase.
 */
async function fetchRemoteConfigHistory() {
  if (!SERVICE_ACCOUNT_PATH) {
    console.warn('⚠️ FIREBASE_SERVICE_ACCOUNT_PATH not set. Skipping Remote Config history.')
    return {}
  }

  console.log('📡 Fetching Firebase Remote Config history...')
  const flagEnablementDates = {}

  try {
    const remoteConfig = admin.remoteConfig()
    const { versions } = await remoteConfig.listVersions({ pageSize: 100 })

    // Sort versions by number (oldest first to find first enablement)
    const sortedVersions = versions.sort((a, b) => parseInt(a.versionNumber) - parseInt(b.versionNumber))

    for (const version of sortedVersions) {
      try {
        const template = await remoteConfig.getTemplateAtVersion(version.versionNumber)
        Object.keys(template.parameters).forEach((key) => {
          const param = template.parameters[key]
          const isEnabled = param.defaultValue && param.defaultValue.value === 'true'

          if (isEnabled && !flagEnablementDates[key]) {
            flagEnablementDates[key] = version.updateTime
          }
        })
      } catch (e) {
        console.warn(`⚠️ Failed to fetch template for version ${version.versionNumber}`)
      }
    }
  } catch (err) {
    console.error('❌ Failed to fetch Firebase history:', err.message)
  }

  return flagEnablementDates
}

async function fetchWhatsNewHistory() {
  const flagDates = await fetchRemoteConfigHistory()
  console.log('🔍 Discovering version tags locally...')

  const tagsOutput = runGit('git tag -l "v*" --sort=-v:refname')
  if (!tagsOutput) {
    console.error('❌ Could not find any git tags.')
    return
  }

  const tags = tagsOutput.split('\n')
  const historyData = []
  const seenFeatures = new Set()

  // We process chronologically to track when a feature first "appeared" in translations/config
  const chronologicalTags = [...tags].reverse()

  for (const tag of chronologicalTags) {
    const versionMatch = tag.match(/^v(\d+\.\d+)\.\d+$/)
    if (!versionMatch) continue

    const majorMinor = versionMatch[1]
    const major = parseInt(majorMinor.split('.')[0])
    if (major < 2) continue

    const translationsContent = runGit(`git show ${tag}:${TRANSLATIONS_PATH}`)
    if (!translationsContent) continue

    let translations
    try {
      translations = JSON.parse(translationsContent)
    } catch (e) {
      continue
    }

    // Fetch config for this tag (silently as it won't exist in older tags)
    let config = []
    const configContent = runGit(`git show ${tag}:${WHATS_NEW_CONFIG_PATH}`, true)
    if (configContent) {
      config = parseWhatsNewConfig(configContent)
    } else {
      const configContentTsx = runGit(`git show ${tag}:${WHATS_NEW_CONFIG_PATH}x`, true)
      if (configContentTsx) config = parseWhatsNewConfig(configContentTsx)
    }

    const whatsNewContentForVersion = {}
    const featuresIntroducedInThisTag = new Set()

    // 1. Version-matched features (e.g., "2.56")
    Object.keys(translations).forEach((key) => {
      if (key.startsWith('whatsNew.bodyCopy.')) {
        const keyWithoutPrefix = key.replace('whatsNew.bodyCopy.', '')
        let featureName = ''
        if (keyWithoutPrefix.includes('.bullet.')) {
          featureName = keyWithoutPrefix.substring(0, keyWithoutPrefix.indexOf('.bullet.'))
        } else if (keyWithoutPrefix.includes('.link.')) {
          featureName = keyWithoutPrefix.substring(0, keyWithoutPrefix.indexOf('.link.'))
        } else {
          featureName = keyWithoutPrefix
        }

        const isVersionString = /^\d+(\.\d+)*$/.test(featureName)
        // We only "introduce" a version key if it matches THIS tag's Major.Minor
        if (isVersionString && featureName === majorMinor && !seenFeatures.has(featureName)) {
          if (!whatsNewContentForVersion[featureName]) {
            whatsNewContentForVersion[featureName] = { content: {}, type: 'version' }
          }
          whatsNewContentForVersion[featureName].content[key] = translations[key]
          featuresIntroducedInThisTag.add(featureName)
        }
      }
    })

    // 2. Config-matched features
    config.forEach((item) => {
      if (!seenFeatures.has(item.featureName)) {
        const featureKeyBase = `whatsNew.bodyCopy.${item.featureName}`
        const featureTranslations = {}

        Object.keys(translations).forEach((key) => {
          if (key === featureKeyBase || key.startsWith(`${featureKeyBase}.`)) {
            featureTranslations[key] = translations[key]
          }
        })

        if (Object.keys(featureTranslations).length > 0) {
          whatsNewContentForVersion[item.featureName] = {
            content: featureTranslations,
            type: 'feature',
            flag: item.featureFlag,
          }
          featuresIntroducedInThisTag.add(item.featureName)
        }
      }
    })

    if (Object.keys(whatsNewContentForVersion).length > 0) {
      console.log(`✅ Found content for ${tag}`)
      const tagDate = runGit(`git log -1 --format=%cI ${tag}`)

      // Update dates based on feature flags if possible
      Object.keys(whatsNewContentForVersion).forEach((fName) => {
        const feature = whatsNewContentForVersion[fName]
        if (feature.flag && flagDates[feature.flag]) {
          console.log(`📡 Feature ${fName} flag ${feature.flag} enabled at ${flagDates[feature.flag]}`)
          feature.enabledDate = flagDates[feature.flag]
        }
      })

      historyData.unshift({
        version: tag,
        date: tagDate || new Date().toISOString(),
        features: whatsNewContentForVersion,
      })

      // Mark these features as seen so they aren't "re-introduced" in newer tags
      featuresIntroducedInThisTag.forEach((f) => seenFeatures.add(f))
    }
  }

  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true })
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(historyData, null, 2))
  console.log(`✅ What's New history data written to ${OUTPUT_PATH}`)
}

fetchWhatsNewHistory()
