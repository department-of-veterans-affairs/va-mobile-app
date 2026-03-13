import React from 'react'
import { TextStyle } from 'react-native'

import { InlineContent } from 'api/types'
import { TextView } from 'components'
import type { FontVariant } from 'components/TextView'
import { getNumberAccessibilityLabelFromString } from 'utils/formattingUtils'
import { useTheme } from 'utils/hooks'

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

/**
 * Renders text-like inline content (string, bold, italic, lineBreak) as nested
 * TextView nodes. Must be placed inside a parent TextView for proper inline layout.
 * Links and telephones are skipped (rendered as block-level elements by BlockRenderer).
 */
export const InlineRenderer = ({
  content,
  variantOverride,
  styleOverride,
}: InlineRendererProps): React.ReactElement | null => {
  const variant = variantOverride ?? 'MobileBody'
  const theme = useTheme()
  const { condensedMarginBetween } = theme.dimensions

  if (content == null) return null

  if (typeof content === 'string') {
    if (!content) return null
    return (
      <TextView variant={variant} style={styleOverride}>
        {content}
      </TextView>
    )
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
    case 'lineBreak':
      return <TextView mb={condensedMarginBetween}>{'\n'}</TextView>
    case 'link':
    case 'telephone':
      // Links and telephones render as View-based components (Pressable/Box) which cannot
      // nest inside a Text tree. BlockRenderer extracts them and renders them as block-level
      // elements below the paragraph text.
      return null
    default:
      return null
  }
}
