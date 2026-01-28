import * as React from 'react'

import data from '@site/static/data/whats-new-history.json'

/**
 * TYPES & INTERFACES
 */

interface FeatureContent {
  content?: Record<string, string>
  featureName?: string // Internal ID (e.g., 'TravelListAndStatus' or '2.65')
  title?: string // Human-readable override (used in MANUAL_ENTRIES)
  bullets?: string[] // Manual bullets override
  link?: { text: string; url: string } // Manual link override
  releaseNotes?: string // For AppStoreReleaseNotes type
}

interface WhatsNewItem {
  version: string
  releaseDate: string
  features: FeatureContent[]
}

/**
 * MANUAL OVERRIDES
 * Add versions or features here that aren't captured by the automated script.
 */
const MANUAL_ENTRIES: WhatsNewItem[] = [
  // Example structure for manual entries:
  // {
  //   version: 'v2.62.0',
  //   releaseDate: '2026-03-02',
  //   features: [
  //     {
  //       featureName: 'ManualFeature',
  //       title: 'Description of a manually added feature.',
  //       bullets: ['First important point.', 'Second important point.'],
  //       link: { text: 'Learn more online', url: 'https://example.com' },
  //     },
  //   ],
  // },
]

/**
 * SUB-COMPONENTS
 */

/**
 * Renders the App Store Release Notes block.
 */
const ReleaseNotesSection = ({ notes }: { notes: string }) => (
  <div
    style={{
      marginBottom: '1.5rem',
      marginLeft: '1rem',
      padding: '1rem',
      backgroundColor: '#f9f9f9',
      borderRadius: '8px',
      borderLeft: '4px solid #003e67',
    }}>
    <h3
      style={{
        fontSize: '1rem',
        marginBottom: '0.5rem',
        color: '#003e67',
        textTransform: 'uppercase',
        letterSpacing: '1px',
      }}>
      App Store Release Notes
    </h3>
    <p style={{ whiteSpace: 'pre-wrap', color: '#444', lineHeight: '1.5' }}>{notes}</p>
  </div>
)

/**
 * Renders a single "What's New" feature entry.
 */
const FeatureSection = ({ feature }: { feature: FeatureContent }) => {
  const featureName = feature.featureName || feature.title || ''

  // Resolve title, bullets, and link (prioritizing translation content if available)
  const details = {
    title: feature.title || '',
    bullets: feature.bullets ? [...feature.bullets] : ([] as string[]),
    link: feature.link || { text: '', url: '' },
  }

  if (feature.content) {
    const prefix = `whatsNew.bodyCopy.${featureName}`
    Object.keys(feature.content).forEach((key) => {
      const keyWithoutPrefix = key === prefix ? '' : key.replace(`${prefix}.`, '')

      if (!keyWithoutPrefix) {
        details.title = feature.content![key]
      } else if (keyWithoutPrefix.startsWith('bullet.')) {
        if (!key.endsWith('a11yLabel')) {
          details.bullets.push(feature.content![key])
        }
      } else if (keyWithoutPrefix.startsWith('link.')) {
        if (keyWithoutPrefix === 'link.text' && !details.link.text) {
          details.link.text = feature.content![key]
        } else if (keyWithoutPrefix === 'link.url' && !details.link.url) {
          details.link.url = feature.content![key]
        }
      }
    })
  }

  return (
    <div style={{ marginBottom: '1.5rem', marginLeft: '1rem' }}>
      <h3
        style={{
          fontSize: '1.2rem',
          marginBottom: '0.5rem',
          color: '#333',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
        {details.title || `Release ${featureName}`}
      </h3>
      {details.bullets.length > 0 && (
        <ul style={{ marginBottom: '0.5rem' }}>
          {details.bullets.map((bullet, i) => (
            <li key={i}>{bullet}</li>
          ))}
        </ul>
      )}
      {details.link.url && (
        <p>
          <a href={details.link.url} target="_blank" rel="noopener noreferrer">
            {details.link.text || 'Learn more'}
          </a>
        </p>
      )}
    </div>
  )
}

/**
 * MAIN COMPONENT
 */

const WhatsNewReport = () => {
  const mergedData = React.useMemo(() => {
    // 1. Merge automated history and manual overrides
    const combined = [...(data as WhatsNewItem[]), ...MANUAL_ENTRIES]

    // 2. Group items by version (handling potential duplicates between sources)
    const grouped = combined.reduce(
      (acc, item) => {
        const { version, releaseDate, features } = item
        const existing = acc[version]

        if (!existing) {
          acc[version] = { ...item, features: [...features] }
        } else {
          // Merge features and keep the later release date
          existing.features = [...existing.features, ...features]
          if (new Date(releaseDate) > new Date(existing.releaseDate)) {
            existing.releaseDate = releaseDate
          }
        }
        return acc
      },
      {} as Record<string, WhatsNewItem>,
    )

    // 3. Sort by version number descending (SemVer-style)
    return Object.values(grouped).sort((a, b) => {
      const v1 = a.version.replace(/^v/, '').split('.').map(Number)
      const v2 = b.version.replace(/^v/, '').split('.').map(Number)

      for (let i = 0; i < Math.max(v1.length, v2.length); i++) {
        const p1 = v1[i] || 0
        const p2 = v2[i] || 0
        if (p1 !== p2) return p2 - p1
      }
      return 0
    })
  }, [])

  return (
    <div>
      {mergedData.map((release, index) => (
        <div key={index} style={{ marginBottom: '3rem', borderBottom: '1px solid #ddd', paddingBottom: '1rem' }}>
          <h2 style={{ color: '#003e67' }}>{release.version}</h2>
          <p style={{ fontStyle: 'italic', color: '#666' }}>
            Released on: {new Date(release.releaseDate).toLocaleDateString()}
          </p>

          {release.features.map((feature, fIndex) => {
            const isReleaseNotes = feature.featureName === 'AppStoreReleaseNotes'
            const notes = feature.releaseNotes || feature.content?.releaseNotes

            return isReleaseNotes && notes ? (
              <ReleaseNotesSection key={fIndex} notes={notes} />
            ) : (
              <FeatureSection key={fIndex} feature={feature} />
            )
          })}
        </div>
      ))}
    </div>
  )
}

export default WhatsNewReport
