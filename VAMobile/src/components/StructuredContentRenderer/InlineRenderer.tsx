import React from 'react'
import { TextStyle } from 'react-native'

import { InlineContent } from 'api/types'
import { LinkWithAnalytics, TextView } from 'components'
import type { FontVariant } from 'components/TextView'
import {
  displayedTextPhoneNumber,
  getNumberAccessibilityLabelFromString,
  getNumbersFromString,
} from 'utils/formattingUtils'

const italicTextStyle: TextStyle = { fontStyle: 'italic' }

/** Extracts plain text from InlineContent for use in accessibility labels. */
export const getPlainText = (content: InlineContent): string => {
  if (content == null) return ''
  if (typeof content === 'string') return content
  if (Array.isArray(content)) return content.map(getPlainText).join('')
  switch (content.type) {
    case 'bold':
    case 'italic':
      return getPlainText(content.content)
    case 'link':
      return content.text
    case 'telephone':
      return content.tty
        ? `TTY: ${displayedTextPhoneNumber(content.contact)}`
        : displayedTextPhoneNumber(content.contact)
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
    return content ? (
      <TextView variant={variant} style={styleOverride}>
        {content}
      </TextView>
    ) : null
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
          url={content.href}
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
      return (
        <LinkWithAnalytics
          type="url"
          url={`tel:${digits}`}
          text={displayText}
          a11yLabel={getNumberAccessibilityLabelFromString(content.contact)}
          inline
        />
      )
    }
    case 'lineBreak':
      return <TextView variant="MobileBody">{'\n'}</TextView>
    default:
      return null
  }
}
