import { TouchableWithoutFeedback } from 'react-native'
import React, { FC } from 'react'

import Box, { BoxProps } from './Box'

/**
 *  Signifies the props that need to be passed in to {@link TextArea}
 */
export type TextAreaProps = {
  /** onPress callback */
  onPress?: () => void
}

/**
 * Text area block for content
 *
 * @returns TextView component
 */
const TextArea: FC<TextAreaProps> = ({ onPress, children }) => {
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

  const _onPress = (): void => {
    if (onPress) {
      onPress()
    }
  }

  if (onPress) {
    return (
      <TouchableWithoutFeedback onPress={_onPress}>
        <Box {...boxProps}>{children}</Box>
      </TouchableWithoutFeedback>
    )
  }

  return <Box {...boxProps}>{children}</Box>
}

export default TextArea
