import React, { FC } from 'react'

import { SwitchProps } from './Switch'
import { TextView } from './index'
import { TextViewProps } from './TextView'
import { generateTestID } from 'utils/common'
import { testIdProps } from 'utils/accessibility'
import { useTheme } from 'utils/hooks'
import BaseListItem, { BaseListItemProps } from './BaseListItem'
import Box from './Box'

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
} & Partial<BaseListItemProps>

/**
 * Props for {@link List}
 */
export type ListProps = {
  /** list of items of which a button will be rendered per item */
  items: Array<ListItemObj>

  /** optional title to use for the list */
  title?: string

  /**optional a11y hint for the title */
  titleA11yLabel?: string
}

/**
 * Display a list of buttons with text and optional actions
 */
const List: FC<ListProps> = ({ items, title, titleA11yLabel }) => {
  const theme = useTheme()
  const { gutter, condensedMarginBetween, standardMarginBetween } = theme.dimensions

  const titleProps: TextViewProps = {
    variant: 'TableHeaderBold',
    mx: gutter,
    mb: condensedMarginBetween,
    mt: standardMarginBetween,
    accessibilityRole: 'header',
  }

  const buttons = items.map((item, index) => {
    const { content, a11yHintText, decoratorProps } = item
    const dProps = decoratorProps as Partial<SwitchProps>

    return (
      <BaseListItem key={index} a11yHint={a11yHintText || dProps?.a11yHint || ''} {...item}>
        {content}
      </BaseListItem>
    )
  })

  return (
    <Box>
      {title && (
        <Box accessible={true} accessibilityRole={'header'}>
          <TextView {...titleProps} {...testIdProps(generateTestID(titleA11yLabel ? titleA11yLabel : title, ''))}>
            {title}
          </TextView>
        </Box>
      )}
      <Box borderTopWidth={theme.dimensions.borderWidth} borderStyle="solid" borderColor="primary">
        <Box backgroundColor={'list'}>{buttons}</Box>
      </Box>
    </Box>
  )
}

export default List
