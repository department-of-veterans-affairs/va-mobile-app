import React, { FC } from 'react'

import { List, ListItemObj, ListProps, TextLineWithIconProps } from './index'
import { NAMESPACE } from '../constants/namespaces'
import { TextLineWithIcon } from './TextLineWithIcon'
import { generateTestIDForTextIconList } from 'utils/common'
import { useTranslation } from '../utils/hooks'
import Box from './Box'

/**
 * Signifies each item in the list of items in {@link MessageListProps}
 */
export type MessageListItemObj = {
  /** lines of text to display */
  textLinesWithIcon: Array<TextLineWithIconProps>
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
  const t = useTranslation(NAMESPACE.HEALTH)
  const listItemObjs: Array<ListItemObj> = items.map((item) => {
    // Move all of the properties except text lines to the standard list item object
    const { textLinesWithIcon, testId, ...listItemObj } = { ...item }
    const testIdToUse = testId ? testId : generateTestIDForTextIconList(textLinesWithIcon, t)

    const content = (
      // Package individual textLineWithIcon components together into one message
      <Box flexDirection="column">
        {textLinesWithIcon?.map((textObj: TextLineWithIconProps, index: number) => {
          return <TextLineWithIcon key={index} {...textObj} />
        })}
      </Box>
    )

    return { ...listItemObj, content, testId: testIdToUse }
  })

  return <List items={listItemObjs} title={title} titleA11yLabel={titleA11yLabel} />
}

export default MessageList
