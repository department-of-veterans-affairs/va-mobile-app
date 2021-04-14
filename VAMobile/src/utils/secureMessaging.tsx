import { TFunction } from 'i18next'

import { DefaultListItemObj, PickerItem, TextLine } from 'components'
import { SecureMessagingMessageList } from 'store/api/types'
import { getFormattedDateTimeYear } from './formattingUtils'
import { getTestIDFromTextLines } from './accessibility'

export const getMessagesListItems = (
  messages: SecureMessagingMessageList,
  t: TFunction,
  onMessagePress: (messageID: number) => void,
  folderName?: string,
): Array<DefaultListItemObj> => {
  return messages.map((message, index) => {
    const { attributes } = message
    const { recipientName, senderName, subject, sentDate } = attributes

    const textLines: Array<TextLine> = [
      { text: t('common:text.raw', { text: folderName === 'Sent' ? recipientName : senderName }), variant: 'MobileBodyBold' },
      { text: t('common:text.raw', { text: t('secureMessaging.viewMessage.subject', { subject: subject }) }) },
      { text: t('common:text.raw', { text: getFormattedDateTimeYear(sentDate) }) },
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

export const getComposeMessageSubjectPickerOptions = (t: TFunction): Array<PickerItem> => {
  return [
    {
      value: '',
      label: '',
    },
    {
      value: t('secureMessaging.composeMessage.general'),
      label: t('secureMessaging.composeMessage.general'),
    },
    {
      value: t('secureMessaging.composeMessage.covid'),
      label: t('secureMessaging.composeMessage.covid'),
    },
    {
      value: t('appointments.appointment'),
      label: t('appointments.appointment'),
    },
    {
      value: t('secureMessaging.composeMessage.medication'),
      label: t('secureMessaging.composeMessage.medication'),
    },
    {
      value: t('secureMessaging.composeMessage.test'),
      label: t('secureMessaging.composeMessage.test'),
    },
    {
      value: t('secureMessaging.composeMessage.education'),
      label: t('secureMessaging.composeMessage.education'),
    },
  ]
}
