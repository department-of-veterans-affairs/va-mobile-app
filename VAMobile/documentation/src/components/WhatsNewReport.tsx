import * as React from 'react'

import data from '@site/static/data/whats-new-history.json'

interface FeatureContent {
  content: Record<string, string>
  type: 'version' | 'feature'
  flag?: string
  enabledDate?: string
}

interface WhatsNewItem {
  version: string
  date: string
  features: Record<string, FeatureContent>
}

const WhatsNewReport = () => {
  const parseFeatureDetails = (content: Record<string, string>, featureName: string) => {
    const details = {
      title: '',
      bullets: [] as string[],
      link: { text: '', url: '' },
    }

    Object.keys(content).forEach((key) => {
      const prefix = `whatsNew.bodyCopy.${featureName}`
      const keyWithoutPrefix = key === prefix ? '' : key.replace(`${prefix}.`, '')

      if (!keyWithoutPrefix) {
        details.title = content[key]
      } else if (keyWithoutPrefix.startsWith('bullet.')) {
        if (!key.endsWith('a11yLabel')) {
          details.bullets.push(content[key])
        }
      } else if (keyWithoutPrefix.startsWith('link.')) {
        if (keyWithoutPrefix === 'link.text') {
          details.link.text = content[key]
        } else if (keyWithoutPrefix === 'link.url') {
          details.link.url = content[key]
        }
      }
    })

    return details
  }

  return (
    <div>
      {(data as WhatsNewItem[]).map((release, index) => (
        <div key={index} style={{ marginBottom: '3rem', borderBottom: '1px solid #ddd', paddingBottom: '1rem' }}>
          <h2 style={{ color: '#003e67' }}>{release.version}</h2>
          <p style={{ fontStyle: 'italic', color: '#666' }}>
            Released on: {new Date(release.date).toLocaleDateString()}
          </p>
          {Object.keys(release.features).map((featureName) => {
            const feature = release.features[featureName]
            const details = parseFeatureDetails(feature.content, featureName)
            return (
              <div key={featureName} style={{ marginBottom: '1.5rem', marginLeft: '1rem' }}>
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
                  {feature.flag && (
                    <span
                      style={{
                        fontSize: '0.7rem',
                        backgroundColor: '#e1f5fe',
                        color: '#01579b',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        border: '1px solid #b3e5fc',
                      }}>
                      Flag: {feature.flag}
                    </span>
                  )}
                </h3>
                {feature.enabledDate && (
                  <p style={{ fontSize: '0.8rem', color: '#2e7d32', fontStyle: 'italic', marginBottom: '0.5rem' }}>
                    Enabled on: {new Date(feature.enabledDate).toLocaleDateString()}
                  </p>
                )}
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
