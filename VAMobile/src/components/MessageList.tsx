import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'

import { Icon } from '@department-of-veterans-affairs/mobile-component-library'

import { ButtonDecoratorType } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { generateTestIDForInlineTextIconList } from 'utils/common'
import { useTheme } from 'utils/hooks'

import { READ } from '../constants/secureMessaging'
import Box from './Box'
import { InlineTextWithIcons } from './InlineTextWithIcons'
import LabelTag, { LabelTagTypeConstants } from './LabelTag'
import { InlineTextWithIconsProps, List, ListItemObj, ListProps } from './index'

/**
 * Signifies each item in the list of items in {@link MessageListProps}
 */
export type MessageListItemObj = {
  /** lines of text to display */
  inlineTextWithIcons: Array<InlineTextWithIconsProps>
  /** Tells if one is displaying sent folder messages list - needed for READ tag display conditional */
  isSentFolder: boolean
  /** Attribute for whether recipient has read user's sent message (Sent folder)
   * OR whether user has read received message (Inbox || Folders other than 'Sent')
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
  const theme = useTheme()
  const listItemObjs: Array<ListItemObj> = items.map((item) => {
    // Move all of the properties except text lines to the standard list item object
    const { inlineTextWithIcons, testId, detoxTestID, ...listItemObj } = item
    let testIdToUse = testId ? testId : generateTestIDForInlineTextIconList(inlineTextWithIcons, t)

    // We want to display black 'Read' tag only for sent messages that have been seen by the recipients
    const isSentReadTag = item.isSentFolder && item.readReceipt === READ
    const sentReadTagA11y = isSentReadTag ? t('secureMessaging.folders.sent.read.a11y') : ''

    const content = (
      // Package individual textLineWithIcon components together into one message
      <Box flex={1} flexDirection="row" alignItems="center">
        <Box flex={1} flexDirection="column" mb={7}>
          {inlineTextWithIcons?.map((textObj: InlineTextWithIconsProps, index: number) => {
            return <InlineTextWithIcons key={index} {...textObj} />
          })}
          {isSentReadTag && (
            <Box mt={7}>
              <LabelTag text={t('secureMessaging.folders.read.tag')} labelType={LabelTagTypeConstants.tagInactive} />
            </Box>
          )}
        </Box>
        <Icon
          name="ChevronRight"
          width={theme.dimensions.chevronListItemWidth}
          height={theme.dimensions.chevronListItemHeight}
          fill={theme.colors.icon.chevronListItem}
          testID="ChevronRight"
        />
      </Box>
    )

    // Append accessibility label for Sent messages 'READ' tag
    testIdToUse = `${testIdToUse} ${sentReadTagA11y}`.trim()
    const detoxTestIDToUse = detoxTestID ? detoxTestID : testIdToUse

    return {
      ...listItemObj,
      content,
      testId: testIdToUse,
      decorator: ButtonDecoratorType.None,
      detoxTestID: detoxTestIDToUse,
    }
  })

  return <List items={listItemObjs} title={title} titleA11yLabel={titleA11yLabel} />
}

export default MessageList
