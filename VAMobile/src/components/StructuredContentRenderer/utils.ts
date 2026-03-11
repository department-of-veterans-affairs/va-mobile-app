import { InlineContent, InlineElement, LinkInline, TelephoneInline } from 'api/types'
import { EnvironmentTypesConstants } from 'constants/common'
import getEnv from 'utils/env'

/** Resolves relative paths to full VA.gov URLs by environment; leaves absolute URLs unchanged. */
export const getLinkUrl = (href: string): string => {
  if (href.startsWith('https://') || href.startsWith('http://')) return href

  const { ENVIRONMENT, IS_TEST } = getEnv()
  const isProduction = ENVIRONMENT === EnvironmentTypesConstants.Production
  const path = href.startsWith('/') ? href.slice(1) : href
  if (IS_TEST) return `https://test.va.gov/${path}`
  if (isProduction) return `https://www.va.gov/${path}`
  return `https://staging.va.gov/${path}`
}

/** Returns true if the item is an interactive inline element (link or telephone). */
const isInteractive = (item: string | InlineElement): item is LinkInline | TelephoneInline =>
  typeof item !== 'string' && (item.type === 'link' || item.type === 'telephone')

/** Extracts interactive elements (links, telephones) from InlineContent. */
export const extractInteractiveElements = (content: InlineContent): (LinkInline | TelephoneInline)[] => {
  if (typeof content === 'string') return []
  if (Array.isArray(content)) return content.filter(isInteractive)
  if (isInteractive(content)) return [content]
  if (content.type === 'bold' || content.type === 'italic') {
    return extractInteractiveElements(content.content)
  }
  return []
}

/** Strips interactive elements and trailing lineBreaks from InlineContent. Returns null if no text content remains. */
export const stripInteractiveContent = (content: InlineContent): InlineContent | null => {
  if (typeof content === 'string') return content

  if (Array.isArray(content)) {
    const filtered = content.filter((item) => !isInteractive(item))
    // Strip trailing lineBreaks (visual separators before links)
    while (filtered.length > 0) {
      const last = filtered[filtered.length - 1]
      if (typeof last !== 'string' && last.type === 'lineBreak') {
        filtered.pop()
      } else {
        break
      }
    }
    if (filtered.length === 0) return null
    if (filtered.length === 1) return filtered[0] as InlineContent
    return filtered as InlineContent
  }

  if (isInteractive(content)) return null

  if (content.type === 'bold' || content.type === 'italic') {
    const stripped = stripInteractiveContent(content.content)
    if (stripped == null) return null
    return { ...content, content: stripped } as InlineContent
  }

  return content
}
