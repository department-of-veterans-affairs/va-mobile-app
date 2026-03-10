import React from 'react'
import { TextStyle } from 'react-native'

import { InlineContent } from 'api/types'
import { Box, LinkWithAnalytics, TextView } from 'components'
import StructuredContentLink from 'components/StructuredContentRenderer/StructuredContentLink'
import type { FontVariant } from 'components/TextView'
import {
  displayedTextPhoneNumber,
  getNumberAccessibilityLabelFromString,
  getNumbersFromString,
} from 'utils/formattingUtils'

const italicTextStyle: TextStyle = { fontStyle: 'italic' }
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
      return content.mobileText ?? content.text
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
    // Words are split into individual TextViews so that plain text wraps alongside inline
    // elements (links, bold, etc.) inside the flexDirection="row" flexWrap="wrap" container.
    // React Native doesn't support true inline layout mixing Text and View components, so each
    // word needs to be a separate flex item to allow natural line breaks.
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
    case 'link': {
      return <StructuredContentLink content={content} />
    }
    case 'telephone': {
      const digits = getNumbersFromString(content.contact)
      const displayText = content.tty
        ? `TTY: ${displayedTextPhoneNumber(content.contact)}`
        : displayedTextPhoneNumber(content.contact)
      const a11yLabel = getNumberAccessibilityLabelFromString(content.contact)
      return content.tty ? (
        <LinkWithAnalytics type="call TTY" TTYnumber={digits} text={displayText} a11yLabel={a11yLabel} />
      ) : (
        <LinkWithAnalytics type="call" phoneNumber={digits} text={displayText} a11yLabel={a11yLabel} />
      )
    }
    case 'lineBreak':
      return <Box width="100%" height={0} accessible={false} />
    default:
      return null
  }
}
