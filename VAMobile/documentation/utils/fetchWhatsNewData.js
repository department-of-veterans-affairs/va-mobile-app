const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

const TRANSLATIONS_PATH = 'VAMobile/src/translations/en/common.json'
const OUTPUT_PATH = path.resolve('static', 'data', 'whats-new-history.json')

// Helper to run git commands
function runGit(cmd) {
  try {
    // Run from the root of the repo (one level up from VAMobile/documentation)
    return execSync(cmd, { cwd: path.resolve('..', '..'), encoding: 'utf-8' }).trim()
  } catch (e) {
    console.warn(`⚠️ Git command failed: ${cmd}`, e.message)
    return null
  }
}

function fetchWhatsNewHistory() {
  console.log('🔍 Discovering version tags locally...')

  // Get all tags matching v* and sort by version descending
  const tagsOutput = runGit('git tag -l "v*" --sort=-v:refname')
  if (!tagsOutput) {
    console.error('❌ Could not find any git tags.')
    return
  }

  const tags = tagsOutput.split('\n')
  const historyData = []
  const processedMajorMinors = new Set()

  for (const tag of tags) {
    const versionMatch = tag.match(/^v(\d+\.\d+)\.\d+$/)
    if (!versionMatch) continue

    const majorMinor = versionMatch[1] // "2.56"

    // Only process the latest patch of each Major.Minor version to avoid redundancy
    if (processedMajorMinors.has(majorMinor)) continue

    // Limit to v2.0.0 onwards
    const major = parseInt(majorMinor.split('.')[0])
    if (major < 2) continue

    console.log(`Processing ${tag}...`)

    const translationsContent = runGit(`git show ${tag}:${TRANSLATIONS_PATH}`)
    if (!translationsContent) continue

    let translations
    try {
      translations = JSON.parse(translationsContent)
    } catch (e) {
      console.warn(`⚠️ Failed to parse common.json for ${tag}`)
      continue
    }

    const whatsNewContentForVersion = {}

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

        // Match if feature name is a version string (X.Y or X.Y.Z)
        // and its major.minor matches the tag's major.minor
        if (/^\d+(\.\d+)*$/.test(featureName)) {
          const featureParts = featureName.split('.')
          const featureMajorMinor = featureParts.length >= 2 ? featureParts.slice(0, 2).join('.') : featureParts[0]

          if (featureMajorMinor === majorMinor) {
            if (!whatsNewContentForVersion[featureName]) {
              whatsNewContentForVersion[featureName] = { content: {}, type: 'version' }
            }
            whatsNewContentForVersion[featureName].content[key] = translations[key]
          }
        }
      }
    })

    if (Object.keys(whatsNewContentForVersion).length > 0) {
      console.log(`✅ Found content for ${tag}`)

      const tagDate = runGit(`git log -1 --format=%cI ${tag}`)

      historyData.push({
        version: tag,
        date: tagDate || new Date().toISOString(),
        features: whatsNewContentForVersion,
      })
      processedMajorMinors.add(majorMinor)
    }
  }

  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true })
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(historyData, null, 2))
  console.log(`✅ What's New history data written to ${OUTPUT_PATH}`)
}

fetchWhatsNewHistory()
