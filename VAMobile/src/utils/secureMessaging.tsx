import React, { ReactNode } from 'react'

import { DateTime } from 'luxon'
import { TFunction } from 'i18next'

import { DefaultList, TextLine } from 'components'
import { SecureMessagingMessageList } from 'store/api/types'
import { getTestIDFromTextLines } from './accessibility'

export const renderMessages = (messages: SecureMessagingMessageList, t: TFunction, onMessagePress: (messageID: number) => void, folderName?: string): ReactNode => {
  if (!messages || !messages.length) {
    return null
  }

  const listItems = messages.map((message) => {
    const { attributes } = message
    const { recipientName, senderName, subject, sentDate } = attributes

    const textLines: Array<TextLine> = [
      { text: t('common:text.raw', { text: folderName === 'Sent' ? recipientName : senderName }), variant: 'MobileBodyBold' },
      { text: t('common:text.raw', { text: t('secureMessaging.viewMessage.subject', { subject: subject }) }) },
      { text: t('common:text.raw', { text: DateTime.fromISO(sentDate).toFormat("dd MMM yyyy '@' HHmm ZZZZ") }) },
    ]

    return { textLines, onPress: () => onMessagePress(message.id), a11yHintText: t('secureMessaging.viewMessage.a11yHint'), testId: getTestIDFromTextLines(textLines) }
  })

  return <DefaultList items={listItems} />
}
