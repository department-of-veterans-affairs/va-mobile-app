import React, { FC } from 'react'
import { TouchableWithoutFeedback } from 'react-native'

import { Box, BoxProps } from 'components'
import { useTheme } from 'utils/hooks'

export const StandardTextAreaBorder: BoxProps = {
  borderStyle: 'solid',
  borderBottomWidth: 'default',
  borderBottomColor: 'primary',
  borderTopWidth: 'default',
  borderTopColor: 'primary',
}

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
  /** optional styling for the Box component - would encourage this taking over for borderBoxStyle */
  /** The difference here is that the specific border name is not super helpful and that one only gets
   * evaluated if no onPress is passed in. */
  overrideBoxProps?: BoxProps
}

/**
 * Text area block for content
 *
 * @returns TextView component
 */
const TextArea: FC<TextAreaProps> = ({
  onPress,
  noBorder,
  children,
  testID,
  borderBoxStyle = {},
  overrideBoxProps = {},
}) => {
  const theme = useTheme()

  const borderProps: BoxProps = noBorder ? {} : StandardTextAreaBorder

  const boxProps: BoxProps = {
    backgroundColor: 'contentBox',
    p: theme.dimensions.cardPadding,
    ...overrideBoxProps, // override default box props if passed in
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
