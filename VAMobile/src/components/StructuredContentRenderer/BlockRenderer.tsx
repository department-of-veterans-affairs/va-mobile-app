import React from 'react'
import { useTranslation } from 'react-i18next'

import { InlineContent, StructuredContentBlock } from 'api/types'
import { Box, TextView } from 'components'
import { InlineRenderer, getAccessibilityLabel } from 'components/StructuredContentRenderer/InlineRenderer'
import { NAMESPACE } from 'constants/namespaces'
import { useTheme } from 'utils/hooks'

type BlockRendererProps = {
  block: StructuredContentBlock
}

/** Renders one block: paragraph, list, or line break. */
export const BlockRenderer = ({ block }: BlockRendererProps): React.ReactElement | null => {
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const marginBetween = theme.dimensions.standardMarginBetween

  if (!block || typeof block !== 'object') {
    return null
  }

  switch (block.type) {
    case 'paragraph':
      return (
        <Box flexDirection="row" flexWrap="wrap" alignItems="center" mb={marginBetween}>
          <InlineRenderer content={block.content} />
        </Box>
      )
    case 'list': {
      const items = block.items || []
      const validItems = items.filter((item: InlineContent) => {
        // Omit empty strings and empty arrays for a11y
        if (item == null) return false
        if (typeof item === 'string') return item.trim().length > 0
        if (Array.isArray(item)) {
          // Require at least one non-empty element so we don't show empty bullet/numbers (e.g. [""] or [" "])
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
            return (
              // eslint-disable-next-line react-native-a11y/has-accessibility-hint
              <Box
                key={idx}
                display="flex"
                flexDirection="row"
                alignItems="flex-start"
                accessible={true}
                accessibilityRole="text"
                accessibilityLabel={`${a11yLabel}, ${t('listPosition', { position: idx + 1, total: validItems.length })}`}>
                {block.style === 'numbered' ? (
                  <Box mr={20} minWidth={16}>
                    <TextView variant="MobileBody">{idx + 1}.</TextView>
                  </Box>
                ) : (
                  <Box mr={20} mt={12}>
                    <Box backgroundColor="bullet" height={6} width={6} />
                  </Box>
                )}
                <Box flexDirection="row" flexWrap="wrap" alignItems="center" flex={1}>
                  <InlineRenderer content={item} />
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
