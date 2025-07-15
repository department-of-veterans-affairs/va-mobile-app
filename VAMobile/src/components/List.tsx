import React, { FC } from 'react'
import { FlatList } from 'react-native'

import { BaseListItem, BaseListItemProps, Box, SwitchProps, TextView, TextViewProps } from 'components'
import { useTheme } from 'utils/hooks'

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

  /** optional boolean to use a virtualized list */
  virtualized?: boolean
}

/**
 * A common component for showing a list of <ListItem>.
 */
const List: FC<ListProps> = ({
  items,
  title,
  titleA11yLabel,
  rightTitleText,
  rightTitleTextA11yLabel,
  virtualized = false,
}) => {
  const theme = useTheme()
  const { gutter, condensedMarginBetween, standardMarginBetween } = theme.dimensions

  const titleProps: TextViewProps = {
    variant: 'TableHeaderBold',
    mx: gutter,
    mb: condensedMarginBetween,
    mt: standardMarginBetween,
    accessibilityRole: 'header',
  }

  const renderButton = (item: ListItemObj, index: number) => {
    const { content, a11yHintText, decoratorProps } = item
    const dProps = decoratorProps as Partial<SwitchProps>

    return (
      <BaseListItem key={index} a11yHint={a11yHintText || dProps?.a11yHint || ''} {...item}>
        {content}
      </BaseListItem>
    )
  }

  const buttons = items.map(renderButton)

  return (
    <Box>
      <Box flexDirection="row" justifyContent={'space-between'} accessible={true}>
        {title && (
          // eslint-disable-next-line react-native-a11y/has-accessibility-hint
          <TextView
            {...titleProps}
            accessibilityLabel={titleA11yLabel}
            accessible={true}
            testID={titleA11yLabel || title}>
            {title}
          </TextView>
        )}
        {rightTitleText && (
          // eslint-disable-next-line react-native-a11y/has-accessibility-hint
          <TextView
            {...titleProps}
            accessibilityLabel={rightTitleTextA11yLabel}
            accessible={true}
            testID={rightTitleTextA11yLabel || rightTitleText}>
            {rightTitleText}
          </TextView>
        )}
      </Box>
      <Box borderTopWidth={theme.dimensions.borderWidth} borderStyle="solid" borderColor="primary">
        {virtualized ? (
          <Box backgroundColor={'list'}>{buttons}</Box>
        ) : (
          <FlatList data={items} renderItem={({ item, index }) => renderButton(item, index)} />
        )}
      </Box>
    </Box>
  )
}

export default List
