import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { ButtonDecoratorType } from 'components'
import { InlineTextWithIcons } from './InlineTextWithIcons'
import { InlineTextWithIconsProps, List, ListItemObj, ListProps } from './index'
import { NAMESPACE } from 'constants/namespaces'
import { READ } from '../constants/secureMessaging'
import { generateTestIDForInlineTextIconList } from 'utils/common'
import Box from './Box'
import LabelTag, { LabelTagTypeConstants } from './LabelTag'

/**
 * Signifies each item in the list of items in {@link MessageListProps}
 */
export type MessageListItemObj = {
  /** lines of text to display */
  inlineTextWithIcons: Array<InlineTextWithIconsProps>
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
  const { t } = useTranslation(NAMESPACE.COMMON)
  const listItemObjs: Array<ListItemObj> = items.map((item) => {
    // Move all of the properties except text lines to the standard list item object
    const { inlineTextWithIcons, testId, ...listItemObj } = item
    let testIdToUse = testId ? testId : generateTestIDForInlineTextIconList(inlineTextWithIcons, t)

    // We want to display black 'Read' tag only for sent messages that have been seen by the recipients
    const isSentReadTag = item.isSentFolder && item.readReceipt === READ
    const sentReadTagA11y = isSentReadTag ? t('secureMessaging.folders.sent.read.a11y') : ''

    const content = (
      // Package individual textLineWithIcon components together into one message
      <Box flex={1}>
        <Box flexDirection="column" mb={7}>
          {inlineTextWithIcons?.map((textObj: InlineTextWithIconsProps, index: number) => {
            return <InlineTextWithIcons key={index} {...textObj} />
          })}
          {isSentReadTag && (
            <Box ml={23} mt={7}>
              <LabelTag text={t('secureMessaging.folders.read.tag')} labelType={LabelTagTypeConstants.tagInactive} />
            </Box>
          )}
        </Box>
      </Box>
    )

    // Append accessibility label for Sent messages 'READ' tag
    testIdToUse = `${testIdToUse} ${sentReadTagA11y}`.trim()

    return { ...listItemObj, content, testId: testIdToUse, decorator: ButtonDecoratorType.None }
  })

  return <List items={listItemObjs} title={title} titleA11yLabel={titleA11yLabel} />
}

export default MessageList
