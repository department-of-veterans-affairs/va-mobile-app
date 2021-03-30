import React, { FC } from 'react'
import _ from 'underscore'

import { List, ListItemObj } from './index'
import { TextLine } from './types'
import { TextLines } from './TextLines'
import { generateTestIDForTextList } from 'utils/common'

/**
 * Signifies each item in the list of items in {@link TextListProps}
 */
export type TextListItemObj = {
  /** lines of text to display */
  textLines: Array<TextLine> | string
} & Partial<ListItemObj>

/**
 * Props for {@link TextLinesList}
 */
export type TextListProps = {
  /** list of items of which a button will be rendered per item */
  items: Array<TextListItemObj>
}

/**
 * Display a list of buttons with text and optional actions
 */
const TextLinesList: FC<TextListProps> = ({ items }) => {
  const listItemObjs: Array<ListItemObj> = items.map((item) => {
    // Move all of the properties except text lines to the standard list item object
    const { textLines, testId, ...listItemObj } = { ...item }
    const updatedTextLines: Array<TextLine> = _.isArray(textLines) ? textLines : [{ text: textLines } as TextLine]
    const testIdToUse = testId ? testId : generateTestIDForTextList(updatedTextLines)
    const content = <TextLines listOfText={updatedTextLines} />

    return { ...listItemObj, content, testId: testIdToUse }
  })

  return <List items={listItemObjs} />
}

export default TextLinesList
