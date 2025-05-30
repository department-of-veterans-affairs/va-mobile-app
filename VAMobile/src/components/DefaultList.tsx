import React, { FC } from 'react'

import { generateTestIDForTextList } from 'utils/common'

import { TextLines } from './TextLines'
import { List, ListItemObj, ListProps } from './index'
import { TextLine } from './types'

/**
 * Signifies each item in the list of items in {@link DefaultListProps}
 */
export type DefaultListItemObj = {
  /** lines of text to display */
  textLines: Array<TextLine>
} & Partial<ListItemObj>

/**
 * Props for {@link DefaultList}
 */
export type DefaultListProps = {
  /** list of items of which a button will be rendered per item */
  items: Array<DefaultListItemObj>
  /** if true the text will be selectable */
  selectable?: boolean
} & Partial<ListProps>

/**
 *Component to show a list composed of lines of display text built using TextLines
 */
const DefaultList: FC<DefaultListProps> = ({
  items,
  title,
  titleA11yLabel,
  rightTitleTextA11yLabel,
  rightTitleText,
  selectable,
}) => {
  const listItemObjs: Array<ListItemObj> = items.map((item) => {
    // Move all of the properties except text lines to the standard list item object
    const { textLines, testId, detoxTestID, ...listItemObj } = { ...item }
    const testIdToUse = testId ? testId : generateTestIDForTextList(textLines)
    const detoxTestIDToUse = detoxTestID ? detoxTestID : testIdToUse

    const content = <TextLines listOfText={textLines} selectable={selectable} />

    return { ...listItemObj, content, testId: testIdToUse, detoxTestID: detoxTestIDToUse }
  })

  return (
    <List
      items={listItemObjs}
      title={title}
      titleA11yLabel={titleA11yLabel}
      rightTitleText={rightTitleText}
      rightTitleTextA11yLabel={rightTitleTextA11yLabel}
    />
  )
}

export default DefaultList
