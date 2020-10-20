import React, { FC } from 'react'

import Box, { BoxProps } from './Box'

/**
 * Text area block for content
 *
 * @returns TextView component
 */
const TextArea: FC = (props) => {
  const boxProps: BoxProps = {
    backgroundColor: 'textBox',
    p: 16,
    mb: 8,
    mt: 8,
    borderStyle: 'solid',
    borderBottomWidth: 'default',
    borderBottomColor: 'primary',
    borderTopWidth: 'default',
    borderTopColor: 'primary',
  }

  return <Box {...boxProps}>{props.children}</Box>
}

export default TextArea
