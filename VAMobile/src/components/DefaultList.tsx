import React, { FC } from 'react'

import { List, ListItemObj, ListProps } from './index'
import { TextLine } from './types'
import { TextLines } from './TextLines'
import { generateTestIDForTextList } from 'utils/common'

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
} & Partial<ListProps>

/**
 * Display a list of buttons with text and optional actions
 */
const DefaultList: FC<DefaultListProps> = ({ items, title, titleA11yLabel }) => {
  const listItemObjs: Array<ListItemObj> = items.map((item) => {
    // Move all of the properties except text lines to the standard list item object
    const { textLines, testId, ...listItemObj } = { ...item }
    const testIdToUse = testId ? testId : generateTestIDForTextList(textLines)

    const content = <TextLines listOfText={textLines} />

    return { ...listItemObj, content, testId: testIdToUse }
  })

  return <List items={listItemObjs} title={title} titleA11yLabel={titleA11yLabel} />
}

export default DefaultList
