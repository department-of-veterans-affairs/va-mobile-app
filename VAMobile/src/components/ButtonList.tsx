import { FC } from 'react'
import React from 'react'
import _ from 'underscore'

import { TextLine } from './types'
import Box from './Box'
import WideButton, { WideButtonProps } from './WideButton'

/**
 * Signifies each item in the list of items in {@link ButtonListProps}
 */
export type ButtonListItemObj = {
  /** lines of text to display */
  textLines: Array<TextLine> | string

  /** optional text to use as the button's accessibility hint */
  a11yHintText?: string

  /** on press event */
  onPress?: () => void
} & Partial<WideButtonProps>

/**
 * Props for {@link ButtonList}
 */
export type ButtonListProps = {
  /** list of items of which a button will be rendered per item */
  items: Array<ButtonListItemObj>
}

/**
 * Display a list of buttons with text and optional actions
 */
const ButtonList: FC<ButtonListProps> = ({ items }) => {
  const buttons = items.map((item, index) => {
    const { textLines, a11yHintText } = item

    // Handle case of a single string passed in rather than the text line objects
    const updatedTextLines = _.isArray(textLines) ? textLines : [{ text: textLines }]

    return <WideButton key={index} listOfText={updatedTextLines} a11yHint={a11yHintText || ''} {...item} />
  })

  return (
    <Box borderTopWidth={1} borderStyle="solid" borderColor="primary">
      <Box backgroundColor={'buttonList'}>{buttons}</Box>
    </Box>
  )
}

export default ButtonList
