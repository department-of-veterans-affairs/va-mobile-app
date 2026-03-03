import React from 'react'
import { TextStyle } from 'react-native'

import { InlineContent } from 'api/types'
import { Box, LinkWithAnalytics, TextView } from 'components'
import type { FontVariant } from 'components/TextView'
import { EnvironmentTypesConstants } from 'constants/common'
import getEnv from 'utils/env'
import {
  displayedTextPhoneNumber,
  getNumberAccessibilityLabelFromString,
  getNumbersFromString,
} from 'utils/formattingUtils'

const italicTextStyle: TextStyle = { fontStyle: 'italic' }

const { ENVIRONMENT, IS_TEST } = getEnv()
const isProduction = ENVIRONMENT === EnvironmentTypesConstants.Production

/** Resolves relative paths to full VA.gov URLs by environment; leaves absolute URLs unchanged. */
const getLinkUrl = (href: string) => {
  if (href.startsWith('https://')) return href

  const path = href.startsWith('/') ? href.slice(1) : href
  if (IS_TEST) return `https://test.va.gov/${path}`
  if (isProduction) return `https://www.va.gov/${path}`
  return `https://staging.va.gov/${path}`
}
/** Extracts plain text from InlineContent for use in accessibility labels. */
export const getAccessibilityLabel = (content: InlineContent): string => {
  if (content == null) return ''
  if (typeof content === 'string') return content
  if (Array.isArray(content)) return content.map(getAccessibilityLabel).join('')
  switch (content.type) {
    case 'bold':
    case 'italic':
      return getAccessibilityLabel(content.content)
    case 'link':
      return content.text
    case 'telephone':
      return content.tty
        ? `TTY: ${getNumberAccessibilityLabelFromString(content.contact)}`
        : getNumberAccessibilityLabelFromString(content.contact)
    case 'lineBreak':
      return ' '
    default:
      return ''
  }
}

type InlineRendererProps = {
  content: InlineContent
  variantOverride?: FontVariant
  styleOverride?: TextStyle
}

/** Renders inline content (bold, italic, link, telephone, lineBreak). */
export const InlineRenderer = ({
  content,
  variantOverride,
  styleOverride,
}: InlineRendererProps): React.ReactElement | null => {
  const variant = variantOverride ?? 'MobileBody'

  if (content == null) return null

  if (typeof content === 'string') {
    if (!content) return null
    const words = content.split(' ')
    return (
      <>
        {words.map((word, i) => (
          <TextView key={i} variant={variant} style={styleOverride}>
            {word}
            {i < words.length - 1 ? ' ' : ''}
          </TextView>
        ))}
      </>
    ) as React.ReactElement
  }

  if (Array.isArray(content)) {
    return (
      <>
        {content.map((item, idx) => (
          <InlineRenderer key={idx} content={item} variantOverride={variantOverride} styleOverride={styleOverride} />
        ))}
      </>
    ) as React.ReactElement
  }

  switch (content.type) {
    case 'bold':
      return <InlineRenderer content={content.content} variantOverride="MobileBodyBold" styleOverride={styleOverride} />
    case 'italic':
      return (
        <InlineRenderer
          content={content.content}
          variantOverride={variantOverride}
          styleOverride={{ ...styleOverride, ...italicTextStyle }}
        />
      )
    case 'link':
      return (
        <LinkWithAnalytics
          type="url"
          url={getLinkUrl(content.href)}
          text={content.text}
          a11yLabel={content.text}
          testID={content.testId}
          inline
        />
      )
    case 'telephone': {
      const digits = getNumbersFromString(content.contact)
      const displayText = content.tty
        ? `TTY: ${displayedTextPhoneNumber(content.contact)}`
        : displayedTextPhoneNumber(content.contact)
      const a11yLabel = getNumberAccessibilityLabelFromString(content.contact)
      return content.tty ? (
        <LinkWithAnalytics type="call TTY" TTYnumber={digits} text={displayText} a11yLabel={a11yLabel} inline />
      ) : (
        <LinkWithAnalytics type="call" phoneNumber={digits} text={displayText} a11yLabel={a11yLabel} inline />
      )
    }
    case 'lineBreak':
      return <Box width="100%" height={0} accessible={false} />
    default:
      return null
  }
}
