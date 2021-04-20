import React, { FC } from 'react'

import { ButtonDecoratorType, List, ListItemObj, ListProps } from 'components'
import { TextLine } from 'components/types'
import { TextLines } from 'components/TextLines'

/**
 * Signifies each item in the list of items in {@link PickerListProps}
 */
export type PickerListItemObj = {
  /** lines of text to display */
  text: string
  /** whether this item is the selected value **/
  isSelected: boolean
} & Partial<ListItemObj>

/**
 * Props for {@link PickerList}
 */
export type PickerListProps = {
  /** list of items of which a button will be rendered per item */
  items: Array<PickerListItemObj>
} & Partial<ListProps>

/**
 * Display a list of buttons with text and optional actions
 */
const PickerList: FC<PickerListProps> = ({ items, title, titleA11yLabel }) => {
  const listItemObjs: Array<ListItemObj> = items.map((item: PickerListItemObj) => {
    // Move all of the properties except text lines to the standard list item object
    const { text, testId, isSelected, ...listItemObj } = item

    const textLine: Array<TextLine> = [{ text } as TextLine]
    const content = <TextLines listOfText={textLine} />

    const backgroundColor = isSelected ? 'pickerSelectedItem' : 'list'
    const decorator = isSelected ? ButtonDecoratorType.SelectedItem : ButtonDecoratorType.None

    return { ...listItemObj, content, backgroundColor, decorator, testId: testId }
  })

  return <List items={listItemObjs} title={title} titleA11yLabel={titleA11yLabel} />
}

export default PickerList
