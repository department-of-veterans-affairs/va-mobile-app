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
 * SHARED STYLES
 */
const COLORS = {
  primary: '#003e67', // Dark Blue
  secondary: '#0071bb', // Light Blue
  text: '#1a1a1a',
  textSecondary: '#444',
  textMuted: '#666',
  background: '#f8f9fa',
  border: '#eaebec',
}

const STYLES = {
  CONTAINER: {
    marginBottom: '2rem',
    marginLeft: '1rem',
    padding: '1.25rem',
    backgroundColor: COLORS.background,
    borderRadius: '12px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  },
  SECTION_HEADER: {
    fontSize: '0.9rem',
    fontWeight: 700,
    marginBottom: '0.75rem',
    textTransform: 'uppercase' as const,
    letterSpacing: '1.5px',
  },
  LIST: {
    marginBottom: '1rem',
    paddingLeft: '1.5rem',
    color: COLORS.textSecondary,
  },
  LIST_ITEM: {
    marginBottom: '0.4rem',
  },
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
const ReleaseNotesSection = ({ notes }: { notes: string }) => {
  const lines = notes.split('\n')
  const content: React.ReactNode[] = []
  let currentList: string[] = []

  const flushList = (key: string) => {
    if (currentList.length > 0) {
      content.push(
        <ul key={key} style={STYLES.LIST}>
          {currentList.map((item, i) => (
            <li key={i} style={STYLES.LIST_ITEM}>
              {item}
            </li>
          ))}
        </ul>,
      )
      currentList = []
    }
  }

  lines.forEach((line, index) => {
    const trimmed = line.trim()
    if (trimmed.startsWith('-')) {
      currentList.push(trimmed.slice(1).trim())
    } else {
      flushList(`list-before-${index}`)
      if (trimmed) {
        content.push(
          <p key={index} style={{ marginBottom: '1rem', color: COLORS.textSecondary }}>
            {trimmed}
          </p>,
        )
      }
    }
  })
  flushList('list-final')

  return (
    <div style={{ ...STYLES.CONTAINER, borderLeft: `5px solid ${COLORS.primary}` }}>
      <h3 style={{ ...STYLES.SECTION_HEADER, color: COLORS.primary }}>Release Notes</h3>
      <div style={{ lineHeight: '1.6', fontSize: '1rem' }}>{content}</div>
    </div>
  )
}

/**
 * Renders a single "What's New" feature entry.
 */
const FeatureSection = ({ feature }: { feature: FeatureContent }) => {
  const featureName = feature.featureName || feature.title || ''
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
      } else if (keyWithoutPrefix.startsWith('bullet.') && !key.endsWith('a11yLabel')) {
        details.bullets.push(feature.content![key])
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
    <div style={{ ...STYLES.CONTAINER, borderLeft: `5px solid ${COLORS.secondary}` }}>
      <h3 style={{ ...STYLES.SECTION_HEADER, color: COLORS.secondary }}>What's New</h3>
      <p style={{ marginBottom: '0.75rem', color: COLORS.text }}>{details.title || `Update: ${featureName}`}</p>
      {details.bullets.length > 0 && (
        <ul style={STYLES.LIST}>
          {details.bullets.map((bullet, i) => (
            <li key={i} style={STYLES.LIST_ITEM}>
              {bullet}
            </li>
          ))}
        </ul>
      )}
      {details.link.url && (
        <p style={{ marginTop: '0.5rem' }}>
          <a
            href={details.link.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: COLORS.secondary,
              textDecoration: 'none',
              fontWeight: 500,
              borderBottom: '1px solid transparent',
              transition: 'border-color 0.2s',
            }}
            onMouseOver={(e) => (e.currentTarget.style.borderColor = COLORS.secondary)}
            onMouseOut={(e) => (e.currentTarget.style.borderColor = 'transparent')}>
            {details.link.text || 'View details online'} →
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
    const combined = [...(data as WhatsNewItem[]), ...MANUAL_ENTRIES]
    const grouped = combined.reduce(
      (acc, item) => {
        const { version, releaseDate, features } = item
        const existing = acc[version]
        if (!existing) {
          acc[version] = { ...item, features: [...features] }
        } else {
          existing.features = [...existing.features, ...features]
          if (new Date(releaseDate) > new Date(existing.releaseDate)) {
            existing.releaseDate = releaseDate
          }
        }
        return acc
      },
      {} as Record<string, WhatsNewItem>,
    )

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
    <div style={{ maxWidth: '900px', margin: '0 auto', fontFamily: 'inherit' }}>
      {mergedData.map((release, index) => (
        <div
          key={index}
          style={{ marginBottom: '4rem', borderBottom: `2px solid ${COLORS.border}`, paddingBottom: '2rem' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ color: COLORS.primary, fontSize: '2rem', margin: 0 }}>{release.version}</h2>
            <div style={{ color: COLORS.textMuted, fontSize: '0.95rem', fontWeight: 500, marginTop: '0.25rem' }}>
              {new Date(release.releaseDate).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
          </div>

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
