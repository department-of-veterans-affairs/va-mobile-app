import React from 'react'
import { TextStyle } from 'react-native'

import { InlineContent } from 'api/types'
import { ClickToCallPhoneNumber, LinkWithAnalytics, TextView } from 'components'
import type { FontVariant } from 'components/TextView'

const italicTextStyle: TextStyle = { fontStyle: 'italic' }

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
          icon="no icon"
          disablePadding
        />
      )
    case 'telephone':
      return <ClickToCallPhoneNumber phone={content.contact} ttyBypass={!!content.tty} />
    case 'lineBreak':
      return <TextView variant="MobileBody">{'\n'}</TextView>
    default:
      return null
  }
}
