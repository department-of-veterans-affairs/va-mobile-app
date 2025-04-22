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
  /** optional testID */
  testID?: string
}

/**
 * Text area block for content
 *
 * @returns TextView component
 */
const TextArea: FC<TextAreaProps> = ({ onPress, noBorder, children, testID }) => {
  const theme = useTheme()

  const borderProps: BoxProps = noBorder
    ? {}
    : {
        borderStyle: 'solid',
        borderBottomWidth: 'default',
        borderBottomColor: 'primary',
        borderTopWidth: 'default',
        borderTopColor: 'primary',
      }

  const boxProps: BoxProps = {
    backgroundColor: 'contentBox',
    p: theme.dimensions.cardPadding,
  }

  const _onPress = (): void => {
    if (onPress) {
      onPress()
    }
  }

  if (onPress) {
    return (
      <TouchableWithoutFeedback accessibilityRole="button" onPress={_onPress}>
        <Box {...boxProps}>{children}</Box>
      </TouchableWithoutFeedback>
    )
  }

  return (
    <Box {...boxProps} {...borderProps} testID={testID}>
      {children}
    </Box>
  )
}

export default TextArea
