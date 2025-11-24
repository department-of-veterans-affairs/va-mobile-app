import React, { FC } from 'react'
import { TouchableWithoutFeedback } from 'react-native'

import { Box, BoxProps } from 'components'
import { useTheme } from 'utils/hooks'

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
  /** optional styling for a TextArea with borders */
  borderBoxStyle?: BoxProps
}

/**
 * Text area block for content
 *
 * @returns TextView component
 */
const TextArea: FC<TextAreaProps> = ({ onPress, noBorder, children, testID, borderBoxStyle = {} }) => {
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
    <Box {...boxProps} {...borderProps} {...borderBoxStyle} testID={testID}>
      {children}
    </Box>
  )
}

export default TextArea
