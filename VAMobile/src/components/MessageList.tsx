import React, { FC } from 'react'

import { List, ListItemObj, ListProps, VA_ICON_MAP } from './index'
import { TextLine } from './types'
import { TextLines } from './TextLines'
import { TextLinesWithIcon } from './TextLinesWithIcon'
import { generateTestIDForTextList } from 'utils/common'

/**
 * Signifies each item in the list of items in {@link MessageListProps}
 */
export type MessageListItemObj = {
  /** lines of text to display */
  textLines: Array<TextLine>
  /** indicates whether message has attachment or not */
  attachment: boolean
  /** message attribute where value is "READ" if message has been read */
  readReceipt?: string
} & Partial<ListItemObj>

/**
 * Props for {@link MessageList}
 */
export type MessageListProps = {
  /** list of items of which a button will be rendered per item */
  items: Array<MessageListItemObj>
} & Partial<ListProps>

/**
 * Display a list of buttons with text and optional actions
 */
const MessageList: FC<MessageListProps> = ({ items, title, titleA11yLabel }) => {
  const listItemObjs: Array<ListItemObj> = items.map((item) => {
    // Move all of the properties except text lines to the standard list item object
    const { textLines, testId, ...listItemObj } = { ...item }
    const testIdToUse = testId ? testId : generateTestIDForTextList(textLines)

    // Map icons onto specific text line numbers
    const iconList = new Map<number, keyof typeof VA_ICON_MAP>()

    //if item is unread
    if (item.readReceipt !== 'READ') {
      iconList.set(0, 'UnreadIcon')
    }

    //if item contains attachment
    if (item.attachment) {
      iconList.set(2, 'PaperClip')
    }

    const content = <TextLinesWithIcon listOfText={textLines} iconList={iconList} />

    return { ...listItemObj, content, testId: testIdToUse }
  })

  return <List items={listItemObjs} title={title} titleA11yLabel={titleA11yLabel} />
}

export default MessageList
