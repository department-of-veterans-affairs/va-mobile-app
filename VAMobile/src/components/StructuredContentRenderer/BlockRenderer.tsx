import React from 'react'

import { InlineContent, StructuredContentBlock } from 'api/types'
import { Box, TextView } from 'components'
import { InlineRenderer } from 'components/StructuredContentRenderer/InlineRenderer'
import { useTheme } from 'utils/hooks'

type BlockRendererProps = {
  block: StructuredContentBlock
}

/** Renders one block: paragraph, list, or line break. */
export const BlockRenderer = ({ block }: BlockRendererProps): React.ReactElement | null => {
  const theme = useTheme()
  const marginBetween = theme.dimensions.standardMarginBetween

  if (!block || typeof block !== 'object') {
    return null
  }

  switch (block.type) {
    case 'paragraph':
      return (
        <Box mb={marginBetween} display="flex" flexDirection="row" flexWrap="wrap">
          <InlineRenderer content={block.content} />
        </Box>
      )
    case 'list': {
      const items = block.items || []
      const validItems = items.filter((item: InlineContent) => {
        // Omit empty strings and empty arrays for a11y
        if (item == null) return false
        if (typeof item === 'string') return item.trim().length > 0
        if (Array.isArray(item)) return item.length > 0
        return true
      })

      if (validItems.length === 0) {
        return null
      }

      return (
        <Box mb={marginBetween} accessibilityRole="list">
          {validItems.map((item, idx) => (
            <Box
              key={idx}
              display="flex"
              flexDirection="row"
              alignItems="flex-start"
              mb={block.style === 'numbered' ? 8 : undefined}>
              {block.style === 'numbered' ? (
                <Box mr={20} mt={12} minWidth={16}>
                  <TextView variant="MobileBody">{idx + 1}.</TextView>
                </Box>
              ) : (
                <Box mr={20} mt={12}>
                  <Box backgroundColor="bullet" height={6} width={6} />
                </Box>
              )}
              <Box flex={1} flexWrap="wrap">
                <InlineRenderer content={item} />
              </Box>
            </Box>
          ))}
        </Box>
      )
    }
    case 'lineBreak':
      return <Box height={theme.dimensions.condensedMarginBetween} accessible={false} />
    default:
      return null
  }
}
