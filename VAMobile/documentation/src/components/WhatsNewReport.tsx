import * as React from 'react'

import data from '@site/static/data/whats-new-history.json'

interface FeatureContent {
  content?: Record<string, string>
  featureName?: string // Internal ID
  title?: string // Human-readable override
  bullets?: string[]
  link?: { text: string; url: string }
  releaseNotes?: string
}

interface WhatsNewItem {
  version: string
  releaseDate: string
  features: FeatureContent[]
}

/**
 * Manual overrides for the What's New report.
 * Add versions or features here that aren't captured by the automated script.
 */
const MANUAL_REPORTS: WhatsNewItem[] = [
  // {
  //   version: 'v2.62.0',
  //   /This is overridden by version release date if version exists already in log
  //   releaseDate: '2026-03-02',
  //   features: [
  //     {
  //       featureName: 'ManualFeature',
  //       title: 'Description of a manually added feature.',
  //       bullets: ['First important point.', 'Second important point.'],
  //       link: {
  //         text: 'Learn more online',
  //         url: 'https://example.com',
  //       },
  //     },
  //   ],
  // },
]

const WhatsNewReport = () => {
  const mergedData = React.useMemo(() => {
    // Combine fetched data with manual reports
    const combined = [...(data as WhatsNewItem[]), ...MANUAL_REPORTS]

    // Group features by version
    const grouped = combined.reduce(
      (acc, item) => {
        const version = item.version
        const features = Array.isArray(item.features)
          ? item.features
          : Object.keys(item.features).map((k) => ({ ...(item.features as any)[k], featureName: k }))

        if (!acc[version]) {
          acc[version] = { ...item, features }
        } else {
          acc[version].features = [...acc[version].features, ...features]
          if (new Date(item.releaseDate) > new Date(acc[version].releaseDate)) {
            acc[version].releaseDate = item.releaseDate
          }
        }
        return acc
      },
      {} as Record<string, WhatsNewItem>,
    )

    // Sort by version number descending
    return Object.values(grouped).sort((a, b) => {
      const v1Parts = a.version.replace(/^v/, '').split('.').map(Number)
      const v2Parts = b.version.replace(/^v/, '').split('.').map(Number)

      for (let i = 0; i < Math.max(v1Parts.length, v2Parts.length); i++) {
        const p1 = v1Parts[i] || 0
        const p2 = v2Parts[i] || 0
        if (p1 !== p2) return p2 - p1
      }
      return 0
    })
  }, [])

  const parseFeatureDetails = (feature: FeatureContent) => {
    const featureName = feature.featureName || feature.title || ''
    const details = {
      title: feature.title || '',
      bullets: feature.bullets ? [...feature.bullets] : ([] as string[]),
      link: feature.link || { text: '', url: '' },
    }

    // If we have content (from translations), it might override the title
    if (feature.content) {
      Object.keys(feature.content).forEach((key) => {
        const prefix = `whatsNew.bodyCopy.${featureName}`
        const keyWithoutPrefix = key === prefix ? '' : key.replace(`${prefix}.`, '')

        if (!keyWithoutPrefix) {
          // Prioritize the translation for the title
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

    return details
  }

  return (
    <div>
      {mergedData.map((release, index) => (
        <div key={index} style={{ marginBottom: '3rem', borderBottom: '1px solid #ddd', paddingBottom: '1rem' }}>
          <h2 style={{ color: '#003e67' }}>{release.version}</h2>
          <p style={{ fontStyle: 'italic', color: '#666' }}>
            Released on: {new Date(release.releaseDate).toLocaleDateString()}
          </p>
          {release.features.map((feature, fIndex) => {
            const featureName = feature.featureName || feature.title
            const details = parseFeatureDetails(feature)
            if (featureName === 'AppStoreReleaseNotes') {
              const notes = feature.releaseNotes || feature.content?.releaseNotes
              return (
                <div
                  key={fIndex}
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
            }

            return (
              <div key={fIndex} style={{ marginBottom: '1.5rem', marginLeft: '1rem' }}>
                <h3
                  style={{
                    fontSize: '1.2rem',
                    marginBottom: '0.5rem',
                    color: '#333',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}>
                  {details.title || `Release ${featureName || fIndex}`}
                </h3>
                {details.bullets.length > 0 && (
                  <ul style={{ marginBottom: '0.5rem' }}>
                    {details.bullets.map((bullet, bIndex) => (
                      <li key={bIndex}>{bullet}</li>
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
          })}
        </div>
      ))}
    </div>
  )
}

export default WhatsNewReport
