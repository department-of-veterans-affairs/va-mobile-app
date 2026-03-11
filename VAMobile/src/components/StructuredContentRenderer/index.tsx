import React from 'react'

import { StructuredContent } from 'api/types'
import { Box } from 'components'
import { BlockRenderer } from 'components/StructuredContentRenderer/BlockRenderer'

export type StructuredContentRendererProps = {
  /** Structured content (e.g. longDescription or nextSteps from API). Renders nothing if null/undefined or empty blocks. */
  content: StructuredContent | null | undefined
  testID?: string
}

/** Renders structured content (longDescription/nextSteps) from the API. */
const StructuredContentRenderer = ({ content, testID }: StructuredContentRendererProps): React.ReactElement | null => {
  if (!content?.blocks || !Array.isArray(content.blocks) || content.blocks.length === 0) {
    return null
  }

  return (
    <Box testID={testID}>
      {content.blocks.map((block, idx) => (
        <BlockRenderer key={idx} block={block} isLast={idx === content.blocks.length - 1} />
      ))}
    </Box>
  )
}

export default StructuredContentRenderer
export { BlockRenderer } from 'components/StructuredContentRenderer/BlockRenderer'
export { InlineRenderer } from 'components/StructuredContentRenderer/InlineRenderer'
