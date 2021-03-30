import { DateTime } from 'luxon'
import { SecureMessagingMessageList } from 'store/api/types'
import { TFunction } from 'i18next'
import { TextLine, TextLinesList } from 'components'
import React, { ReactNode } from 'react'

export const renderMessages = (messages: SecureMessagingMessageList, t: TFunction, onMessagePress: (messageID: number) => void, folderName?: string): ReactNode => {
  if (!messages || !messages.length) {
    return null
  }

  const listItems = messages.map((message) => {
    const { attributes } = message
    const { recipientName, senderName, subject, sentDate } = attributes

    const textLines: Array<TextLine> = [
      { text: t('common:text.raw', { text: folderName === 'Sent' ? recipientName : senderName }), variant: 'MobileBodyBold' },
      { text: t('common:text.raw', { text: subject }) },
      { text: t('common:text.raw', { text: DateTime.fromISO(sentDate).toFormat("dd MMM '@' HHmm ZZZZ") }) },
    ]

    return { textLines, onPress: () => onMessagePress(message.id), a11yHintText: t('secureMessaging.viewMessage.a11yHint') }
  })

  return <TextLinesList items={listItems} />
}
