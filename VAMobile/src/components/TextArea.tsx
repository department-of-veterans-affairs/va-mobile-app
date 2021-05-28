import { TouchableWithoutFeedback } from 'react-native'
import { useTheme } from 'utils/hooks'
import React, { FC } from 'react'

import Box, { BoxProps } from './Box'

/**
 *  Signifies the props that need to be passed in to {@link TextArea}
 */
export type TextAreaProps = {
  /** onPress callback */
  onPress?: () => void
  /** prop to remove border width */
  noBorderWidth?: boolean
}

/**
 * Text area block for content
 *
 * @returns TextView component
 */
const TextArea: FC<TextAreaProps> = ({ onPress, noBorderWidth, children }) => {
  const theme = useTheme()

  const boxProps: BoxProps = {
    backgroundColor: 'textBox',
    borderStyle: 'solid',
    borderBottomWidth: noBorderWidth ? undefined : 'default',
    borderBottomColor: 'primary',
    borderTopWidth: noBorderWidth ? undefined : 'default',
    borderTopColor: 'primary',
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

  return <Box {...boxProps}>{children}</Box>
}

export default TextArea
