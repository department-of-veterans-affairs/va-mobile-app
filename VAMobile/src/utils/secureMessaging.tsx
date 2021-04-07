import { DateTime } from 'luxon'
import { TFunction } from 'i18next'

import { DefaultListItemObj, TextLine } from 'components'
import { SecureMessagingMessageList } from 'store/api/types'
import { getTestIDFromTextLines } from './accessibility'

export const getMessagesListItems = (
  messages: SecureMessagingMessageList,
  t: TFunction,
  onMessagePress: (messageID: number) => void,
  folderName?: string,
): Array<DefaultListItemObj> => {
  if (!messages || !messages.length) {
    return []
  }

  return messages.map((message, index) => {
    const { attributes } = message
    const { recipientName, senderName, subject, sentDate } = attributes

    const textLines: Array<TextLine> = [
      { text: t('common:text.raw', { text: folderName === 'Sent' ? recipientName : senderName }), variant: 'MobileBodyBold' },
      { text: t('common:text.raw', { text: t('secureMessaging.viewMessage.subject', { subject: subject }) }) },
      { text: t('common:text.raw', { text: DateTime.fromISO(sentDate).toFormat("dd MMM yyyy '@' HHmm ZZZZ") }) },
    ]

    return {
      textLines,
      onPress: () => onMessagePress(message.id),
      a11yHintText: t('secureMessaging.viewMessage.a11yHint'),
      testId: getTestIDFromTextLines(textLines),
      a11yValue: t('common:listPosition', { position: index + 1, total: messages.length }),
    }
  })
}
