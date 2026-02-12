import React from 'react'
import { TextStyle } from 'react-native'

import { InlineContent, InlineElement } from 'api/types'
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
          <InlineRenderer
            key={idx}
            content={item as InlineContent}
            variantOverride={variantOverride}
            styleOverride={styleOverride}
          />
        ))}
      </>
    ) as React.ReactElement
  }

  const el = content as InlineElement
  switch (el.type) {
    case 'bold':
      return (
        <InlineRenderer
          content={(el as { content: InlineContent }).content}
          variantOverride="MobileBodyBold"
          styleOverride={styleOverride}
        />
      )
    case 'italic':
      return (
        <InlineRenderer
          content={(el as { content: InlineContent }).content}
          variantOverride={variantOverride}
          styleOverride={italicTextStyle}
        />
      )
    case 'link': {
      const linkEl = el as { href: string; text: string; testId?: string }
      // linkEl.style ('active' | 'external') could be mapped when design system Link supports it
      return (
        <LinkWithAnalytics
          type="url"
          url={linkEl.href}
          text={linkEl.text}
          a11yLabel={linkEl.text}
          testID={linkEl.testId}
          icon="no icon"
          disablePadding
        />
      )
    }
    case 'telephone':
      return (
        <ClickToCallPhoneNumber
          phone={(el as { contact: string }).contact}
          ttyBypass={!(el as { tty?: boolean }).tty}
          a11yLabel={(el as { contact: string }).contact}
        />
      )
    case 'lineBreak':
      return <TextView variant="MobileBody">{'\n'}</TextView>
    default:
      return null
  }
}
