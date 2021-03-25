import React, { FC } from 'react'

import { SwitchProps } from './Switch'
import { useTheme } from 'utils/hooks'
import Box from './Box'
import ListItem, { ListItemProps } from './ListItem'

/**
 * Signifies each item in the list of items in {@link ListProps}
 */
export type ListItemObj = {
  /** optional text to use as the button's accessibility hint */
  a11yHintText?: string

  /** display content for the item */
  content?: React.ReactNode

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
    const { content, a11yHintText, decoratorProps } = item
    const dProps = decoratorProps as Partial<SwitchProps>

    console.log(item.testId)

    return (
      <ListItem key={index} a11yHint={a11yHintText || dProps?.a11yHint || ''} {...item}>
        {content}
      </ListItem>
    )
  })

  return (
    <Box borderTopWidth={theme.dimensions.borderWidth} borderStyle="solid" borderColor="primary">
      <Box backgroundColor={'list'}>{buttons}</Box>
    </Box>
  )
}

export default List
