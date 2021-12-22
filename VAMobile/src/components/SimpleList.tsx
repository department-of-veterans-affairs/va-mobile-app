import React, { FC } from 'react'

import { List, ListItemObj, ListProps } from './index'
import { TextLine } from './types'
import { TextLines } from './TextLines'
import { generateTestIDForTextList } from 'utils/common'

/**
 * Signifies each item in the list of items in {@link SimpleListProps}
 */
export type SimpleListItemObj = {
  /** lines of text to display */
  text: string
} & Partial<ListItemObj>

/**
 * Props for {@link SimpleList}
 */
export type SimpleListProps = {
  items: Array<SimpleListItemObj>
} & Partial<ListProps>

/**Component to show a list with one line of text per item*/
const SimpleList: FC<SimpleListProps> = ({ items, title, titleA11yLabel }) => {
  const listItemObjs: Array<ListItemObj> = items.map((item: SimpleListItemObj) => {
    // Move all of the properties except text lines to the standard list item object
    const { text, testId, ...listItemObj } = { ...item }

    const textLine: Array<TextLine> = [{ text } as TextLine]

    const testIdToUse = testId ? testId : generateTestIDForTextList(textLine)
    const content = <TextLines listOfText={textLine} />

    return { ...listItemObj, content, testId: testIdToUse }
  })

  return <List items={listItemObjs} title={title} titleA11yLabel={titleA11yLabel} />
}

export default SimpleList
