const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

const TRANSLATIONS_PATH = 'VAMobile/src/translations/en/common.json'
const RELEASE_NOTES_PATH = 'VAMobile/ios/fastlane/metadata/en-US/release_notes.txt'
const OUTPUT_PATH = path.resolve('static', 'data', 'whats-new-history.json')
const MD_OUTPUT_PATH = path.resolve('static', 'data', 'whats-new-report.md')
const GENERIC_RELEASE_NOTES = 'We added general improvements and fixed a few bugs.'

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

/**
 * Checks if the release notes content is significantly similar to the combined
 * What's New content to avoid redundancy.
 */
function isSimilar(releaseNotes, whatsNewFeatures) {
  if (!releaseNotes || !whatsNewFeatures || Object.keys(whatsNewFeatures).length === 0) return false

  // Combine all translation text from What's New features
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

  // If the release notes are mostly contained within the translation content, it's similar
  return normalizedWhatsNew.includes(normalizedNotes) || normalizedNotes.includes(normalizedWhatsNew)
}

/**
 * Generates a human-readable Markdown report from the history data.
 */
function generateMarkdownReport(historyData) {
  let md = "# What's New Historical Report\n\n"
  md += `*Generated on: ${new Date().toLocaleString()}*\n\n---\n\n`

  historyData.forEach((item) => {
    md += `## ${item.version}\n`
    md += `*Released on: ${new Date(item.releaseDate).toLocaleDateString()}*\n\n`

    item.features.forEach((feature) => {
      const featureName = feature.featureName || feature.title
      if (featureName === 'AppStoreReleaseNotes') {
        const notes = feature.releaseNotes || feature.content?.releaseNotes
        md += `### 📑 App Store Release Notes\n`
        md += `> ${notes.replace(/\n/g, '\n> ')}\n\n`
      } else {
        // Extract title (whatsNew.bodyCopy.FeatureName)
        const baseKey = `whatsNew.bodyCopy.${featureName}`
        // Try to find the translation first, then fallback to title override, then internal name
        const translatedTitle = feature.content && feature.content[baseKey]
        const title = translatedTitle || feature.title || featureName

        md += `### ${title}\n`

        if (feature.content) {
          // Bullets
          const bullets = Object.keys(feature.content)
            .filter((k) => k.startsWith(`${baseKey}.bullet.`) && !k.endsWith('a11yLabel'))
            .map((k) => feature.content[k])

          if (bullets.length > 0) {
            bullets.forEach((b) => (md += `- ${b}\n`))
            md += '\n'
          }

          // Link
          const linkText = feature.content[`${baseKey}.link.text`]
          const linkUrl = feature.content[`${baseKey}.link.url`]
          if (linkUrl) {
            md += `[${linkText || 'Learn more'}](${linkUrl})\n\n`
          }
        }
      }
    })

    md += '---\n\n'
  })

  return md
}

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

  // We process chronologically to track when a feature first "appeared"
  const chronologicalTags = [...tags].reverse()

  for (const tag of chronologicalTags) {
    const versionMatch = tag.match(/^v(\d+\.\d+)\.\d+$/)
    if (!versionMatch) continue

    const majorMinor = versionMatch[1]
    const whatsNewContentForVersion = {}
    const featuresIntroducedInThisTag = new Set()

    // 1. Translations
    const translationsContent = runGit(`git show ${tag}:${TRANSLATIONS_PATH}`, true)
    let translations = null
    if (translationsContent) {
      try {
        translations = JSON.parse(translationsContent)
      } catch (e) {}
    }

    if (translations) {
      // Version-matched features ONLY (e.g., "2.56")
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
          if (isVersionString && featureName === majorMinor && !seenFeatures.has(featureName)) {
            if (!whatsNewContentForVersion[featureName]) {
              whatsNewContentForVersion[featureName] = { content: {} }
            }
            whatsNewContentForVersion[featureName].content[key] = translations[key]
            featuresIntroducedInThisTag.add(featureName)
          }
        }
      })
    }

    // 2. App Store Release Notes
    const rawReleaseNotes = runGit(`git show ${tag}:${RELEASE_NOTES_PATH}`, true)
    if (rawReleaseNotes) {
      const cleanNotes = rawReleaseNotes.trim()
      const isGeneric = cleanNotes === GENERIC_RELEASE_NOTES
      const isDuplicate = cleanNotes === lastReleaseNotes
      const isRedundant = isSimilar(cleanNotes, whatsNewContentForVersion)

      if (!isGeneric && !isDuplicate && !isRedundant) {
        whatsNewContentForVersion['AppStoreReleaseNotes'] = {
          content: { releaseNotes: cleanNotes },
        }
        lastReleaseNotes = cleanNotes
      }
    }

    if (Object.keys(whatsNewContentForVersion).length > 0) {
      console.log(`✅ Found content for ${tag}`)
      const tagDate = runGit(`git log -1 --format=%cI ${tag}`)

      // Convert features object to an array for final output
      const featuresArray = Object.keys(whatsNewContentForVersion).map((name) => {
        const feature = whatsNewContentForVersion[name]
        return {
          ...feature,
          featureName: name, // Preserve internal ID
        }
      })

      historyData.unshift({
        version: tag,
        releaseDate: tagDate || new Date().toISOString(),
        features: featuresArray,
      })

      // Mark these features as seen
      featuresIntroducedInThisTag.forEach((f) => seenFeatures.add(f))
    }
  }

  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true })
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(historyData, null, 2))
  console.log(`✅ What's New history data written to ${OUTPUT_PATH}`)

  const mdReport = generateMarkdownReport(historyData)
  fs.writeFileSync(MD_OUTPUT_PATH, mdReport)
  console.log(`✅ What's New Markdown report written to ${MD_OUTPUT_PATH}`)
}

fetchWhatsNewHistory()
