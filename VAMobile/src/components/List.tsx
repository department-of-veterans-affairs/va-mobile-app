import React, { FC } from 'react'

import { useTheme } from 'utils/hooks'

import BaseListItem, { BaseListItemProps } from './BaseListItem'
import Box from './Box'
import { SwitchProps } from './Switch'
import { TextViewProps } from './TextView'
import { TextView } from './index'

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

  /** request file number for file indicator */
  requestNumber?: number

  /** request file if file was loaded */
  fileUploaded?: boolean
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

  /** optional text on the right on same row of title */
  rightTitleText?: string

  /** optional a11y hint for the rightTitleText */
  rightTitleTextA11yLabel?: string
}

/**
 * A common component for showing a list of <ListItem>.
 */
const List: FC<ListProps> = ({ items, title, titleA11yLabel, rightTitleText, rightTitleTextA11yLabel }) => {
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
      <Box flexDirection="row" justifyContent={'space-between'} accessible={true}>
        {title && (
          <TextView {...titleProps} accessibilityLabel={titleA11yLabel} testID={titleA11yLabel || title}>
            {title}
          </TextView>
        )}
        {rightTitleText && (
          <TextView
            {...titleProps}
            accessibilityLabel={rightTitleTextA11yLabel}
            testID={rightTitleTextA11yLabel || rightTitleText}>
            {rightTitleText}
          </TextView>
        )}
      </Box>
      <Box borderTopWidth={theme.dimensions.borderWidth} borderStyle="solid" borderColor="primary">
        <Box backgroundColor={'list'}>{buttons}</Box>
      </Box>
    </Box>
  )
}

export default List
