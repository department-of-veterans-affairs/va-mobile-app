import { TouchableWithoutFeedback } from 'react-native'
import React, { FC } from 'react'

import Box, { BoxProps } from './Box'

export type paddingFields = {
  pt?: number
  pr?: number
  pb?: number
  pl?: number
}

/**
 *  Signifies the props that need to be passed in to {@link TextArea}
 */
export type TextAreaProps = {
  /** onPress callback */
  onPress?: () => void
  /** padding fields passed in */
  padding?: paddingFields
}

/**
 * Text area block for content
 *
 * @returns TextView component
 */
const TextArea: FC<TextAreaProps> = ({ onPress, padding, children }) => {
  const getConditionalPadding = (paddingKey: 'pt' | 'pb' | 'pl' | 'pr'): number | undefined => {
    return padding && padding[paddingKey] ? padding[paddingKey] : undefined
  }

  const conditionalPadding: BoxProps = {
    p: padding ? undefined : 16,
    pt: getConditionalPadding('pt'),
    pr: getConditionalPadding('pr'),
    pb: getConditionalPadding('pb'),
    pl: getConditionalPadding('pl'),
  }

  const boxProps: BoxProps = {
    backgroundColor: 'textBox',
    my: 8,
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
        <Box {...boxProps} {...conditionalPadding}>
          {children}
        </Box>
      </TouchableWithoutFeedback>
    )
  }

  return (
    <Box {...boxProps} {...conditionalPadding}>
      {children}
    </Box>
  )
}

export default TextArea
