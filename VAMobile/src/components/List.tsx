import React, { FC } from 'react'

import { SwitchProps } from './Switch'
import { useTheme } from 'utils/hooks'
import BaseListItem, { BaseListItemProps } from './BaseListItem'
import Box from './Box'

/**
 * Signifies each item in the list of items in {@link ListProps}
 */
export type ListItemObj = {
  /** optional text to use as the button's accessibility hint */
  a11yHintText?: string

  /** optional text to use as the button's accessibility value*/
  accessibilityValue?: string

  /** display content for the item */
  content?: React.ReactNode

  /** on press event */
  onPress?: () => void
} & Partial<BaseListItemProps>

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
    const { content, a11yHintText, accessibilityValue, decoratorProps } = item
    const dProps = decoratorProps as Partial<SwitchProps>

    return (
      <BaseListItem key={index} a11yHint={a11yHintText || dProps?.a11yHint || ''} a11yValue={accessibilityValue} {...item}>
        {content}
      </BaseListItem>
    )
  })

  return (
    <Box borderTopWidth={theme.dimensions.borderWidth} borderStyle="solid" borderColor="primary">
      <Box backgroundColor={'list'}>{buttons}</Box>
    </Box>
  )
}

export default List
