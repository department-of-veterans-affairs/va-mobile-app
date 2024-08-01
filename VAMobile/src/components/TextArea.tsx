import React, { FC } from 'react'
import { TouchableWithoutFeedback } from 'react-native'

import { useTheme } from 'utils/hooks'

import Box, { BoxProps } from './Box'

/**
 *  Signifies the props that need to be passed in to {@link TextArea}
 */
export type TextAreaProps = {
  /** onPress callback */
  onPress?: () => void
  /** prop to remove border */
  noBorder?: boolean
}

/**
 * Text area block for content
 *
 * @returns TextView component
 */
const TextArea: FC<TextAreaProps> = ({ onPress, noBorder, children }) => {
  const theme = useTheme()

  const borderProps: BoxProps = noBorder ? {} : {}

  const boxProps: BoxProps = {
    p: theme.dimensions.cardPadding,
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

  return (
    <Box {...boxProps} {...borderProps}>
      {children}
    </Box>
  )
}

export default TextArea
