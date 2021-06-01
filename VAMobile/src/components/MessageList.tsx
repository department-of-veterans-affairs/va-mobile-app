import React, { FC } from 'react'

import { List, ListItemObj, ListProps, TextLineWithIconProps } from './index'
import { NAMESPACE } from 'constants/namespaces'
import { READ } from '../constants/secureMessaging'
import { TextLineWithIcon } from './TextLineWithIcon'
import { generateTestIDForTextIconList } from 'utils/common'
import { useTheme, useTranslation } from 'utils/hooks'
import Box from './Box'
import MessagesSentReadTag from './MessagesSentReadTag'

/**
 * Signifies each item in the list of items in {@link MessageListProps}
 */
export type MessageListItemObj = {
  /** lines of text to display */
  textLinesWithIcon: Array<TextLineWithIconProps>
  /** Tells if one is displaying sent folder messages list - needed for READ tag display conditional */
  isSentFolder: boolean
  /** Attribute for whether recipient has read user's sent message (Sent folder) OR whether user has read received message (Inbox || Folders other than 'Sent')
   * Usage depends on which folder you're in */
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
  const t = useTranslation(NAMESPACE.HEALTH)
  const themes = useTheme()
  const listItemObjs: Array<ListItemObj> = items.map((item) => {
    // Move all of the properties except text lines to the standard list item object
    const { textLinesWithIcon, testId, ...listItemObj } = item
    let testIdToUse = testId ? testId : generateTestIDForTextIconList(textLinesWithIcon, t)

    // We want to display black 'READ' tag only for sent messages that have been seen by the recipients
    const isSentReadTag = item.isSentFolder && item.readReceipt === READ
    const sentReadTagA11y = isSentReadTag ? t('secureMessaging.folders.sent.read.a11y') : ''

    const content = (
      // Package individual textLineWithIcon components together into one message
      <Box flex={1} mr={themes.dimensions.gutter}>
        <Box flexDirection="column" mb={themes.dimensions.navigationBarIconMarginTop}>
          {textLinesWithIcon?.map((textObj: TextLineWithIconProps, index: number) => {
            return <TextLineWithIcon key={index} {...textObj} />
          })}
          {isSentReadTag && (
            <Box ml={themes.dimensions.messageSentReadLeftMargin} mt={themes.dimensions.navigationBarIconMarginTop}>
              <MessagesSentReadTag text={t('secureMessaging.folders.read.tag')} />
            </Box>
          )}
        </Box>
      </Box>
    )

    // Append accessibility label for Sent messages 'READ' tag
    testIdToUse = `${testIdToUse} ${sentReadTagA11y}`.trim()

    return { ...listItemObj, content, testId: testIdToUse }
  })

  return <List items={listItemObjs} title={title} titleA11yLabel={titleA11yLabel} />
}

export default MessageList
