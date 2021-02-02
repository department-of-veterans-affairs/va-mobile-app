import { FC } from 'react'
import React from 'react'
import _ from 'underscore'

import { SwitchProps } from './Switch'
import { TextLine } from './types'
import { useTheme } from 'utils/hooks'
import Box from './Box'
import ListItem, { ListItemProps } from './ListItem'

/**
 * Signifies each item in the list of items in {@link ListProps}
 */
export type ListItemObj = {
  /** lines of text to display */
  textLines: Array<TextLine> | string

  /** optional text to use as the button's accessibility hint */
  a11yHintText?: string

  /** on press event */
  onPress?: () => void
} & Partial<ListItemProps>

/**
 * Props for {@link List}
 */
export type ListProps = {
  /** list of items of which a button will be rendered per item */
  items: Array<ListItemObj>
}

/**
 * Display a list of buttons with text and optional actions
 */
const List: FC<ListProps> = ({ items }) => {
  const theme = useTheme()

  const buttons = items.map((item, index) => {
    const { textLines, a11yHintText, decoratorProps } = item
    const dProps = decoratorProps as Partial<SwitchProps>

    // Handle case of a single string passed in rather than the text line objects
    const updatedTextLines = _.isArray(textLines) ? textLines : [{ text: textLines }]

    return <ListItem key={index} listOfText={updatedTextLines} a11yHint={a11yHintText || dProps?.a11yHint || ''} {...item} />
  })

  return (
    <Box borderTopWidth={theme.dimensions.borderWidth} borderStyle="solid" borderColor="primary">
      <Box backgroundColor={'list'}>{buttons}</Box>
    </Box>
  )
}

export default List
