import React from 'react'
import { useTranslation } from 'react-i18next'

import { InlineContent, LinkInline, StructuredContentBlock, TelephoneInline } from 'api/types'
import { Box, LinkWithAnalytics, TextView } from 'components'
import { InlineRenderer, getAccessibilityLabel } from 'components/StructuredContentRenderer/InlineRenderer'
import StructuredContentLink from 'components/StructuredContentRenderer/StructuredContentLink'
import { extractInteractiveElements, stripInteractiveContent } from 'components/StructuredContentRenderer/utils'
import { NAMESPACE } from 'constants/namespaces'
import {
  displayedTextPhoneNumber,
  getNumberAccessibilityLabelFromString,
  getNumbersFromString,
} from 'utils/formattingUtils'
import { useTheme } from 'utils/hooks'

/** Renders interactive elements (links, telephones) as block-level components. */
const InteractiveElements = ({
  elements,
}: {
  elements: (LinkInline | TelephoneInline)[]
}): React.ReactElement | null => {
  if (elements.length === 0) return null
  return (
    <>
      {elements.map((element, idx) => {
        if (element.type === 'link') {
          return <StructuredContentLink key={idx} content={element} />
        }
        const digits = getNumbersFromString(element.contact)
        const displayText = element.tty
          ? `TTY: ${displayedTextPhoneNumber(element.contact)}`
          : displayedTextPhoneNumber(element.contact)
        const a11yLabel = getNumberAccessibilityLabelFromString(element.contact)
        return element.tty ? (
          <LinkWithAnalytics key={idx} type="call TTY" TTYnumber={digits} text={displayText} a11yLabel={a11yLabel} />
        ) : (
          <LinkWithAnalytics key={idx} type="call" phoneNumber={digits} text={displayText} a11yLabel={a11yLabel} />
        )
      })}
    </>
  ) as React.ReactElement
}

type BlockRendererProps = {
  block: StructuredContentBlock
  /** When true, omits bottom margin so the parent container controls spacing. */
  isLast?: boolean
}

/** Renders one block: paragraph, list, or line break. */
export const BlockRenderer = ({ block, isLast }: BlockRendererProps): React.ReactElement | null => {
  const theme = useTheme()
  const { listItemDecoratorMarginLeft, listItemMinWidth } = theme.dimensions
  const { t } = useTranslation(NAMESPACE.COMMON)
  const marginBetween = isLast ? 0 : theme.dimensions.standardMarginBetween

  if (!block || typeof block !== 'object') {
    return null
  }

  switch (block.type) {
    case 'paragraph': {
      const interactiveElements = extractInteractiveElements(block.content)
      const textContent = stripInteractiveContent(block.content)

      return (
        <Box mb={marginBetween}>
          {textContent != null && (
            <TextView variant="MobileBody">
              <InlineRenderer content={textContent} />
            </TextView>
          )}
          <InteractiveElements elements={interactiveElements} />
        </Box>
      )
    }
    case 'list': {
      const items = block.items || []
      const validItems = items.filter((item: InlineContent) => {
        if (item == null) return false
        if (typeof item === 'string') return item.trim().length > 0
        if (Array.isArray(item)) {
          const plain = getAccessibilityLabel(item).trim()
          return plain.length > 0
        }
        return true
      })

      if (validItems.length === 0) {
        return null
      }

      return (
        <Box mb={marginBetween} accessibilityRole="list">
          {validItems.map((item, idx) => {
            const a11yLabel = getAccessibilityLabel(item)
            const interactiveElements = extractInteractiveElements(item)
            const textContent = stripInteractiveContent(item)
            const hasInteractive = interactiveElements.length > 0

            return (
              // eslint-disable-next-line react-native-a11y/has-accessibility-hint
              <Box
                key={idx}
                display="flex"
                flexDirection="row"
                alignItems="flex-start"
                accessible={!hasInteractive}
                accessibilityRole={!hasInteractive ? 'text' : undefined}
                accessibilityLabel={
                  !hasInteractive
                    ? `${a11yLabel}, ${t('listPosition', { position: idx + 1, total: validItems.length })}`
                    : undefined
                }>
                {block.style === 'numbered' ? (
                  <Box ml={listItemDecoratorMarginLeft} minWidth={listItemMinWidth} accessible={false}>
                    <TextView variant="MobileBody">{idx + 1}.</TextView>
                  </Box>
                ) : (
                  <Box ml={listItemDecoratorMarginLeft} minWidth={listItemMinWidth} my="auto" accessible={false}>
                    <Box backgroundColor="bullet" height={6} width={6} />
                  </Box>
                )}
                <Box flex={1} ml={listItemDecoratorMarginLeft}>
                  {textContent != null && (
                    <TextView variant="MobileBody">
                      <InlineRenderer content={textContent} />
                    </TextView>
                  )}
                  <InteractiveElements elements={interactiveElements} />
                </Box>
              </Box>
            )
          })}
        </Box>
      )
    }
    case 'lineBreak':
      return <Box height={theme.dimensions.condensedMarginBetween} accessible={false} />
    default:
      return null
  }
}
