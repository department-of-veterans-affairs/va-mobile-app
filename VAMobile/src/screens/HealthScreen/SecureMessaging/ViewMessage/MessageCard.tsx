import { DateTime } from 'luxon'
import { Pressable } from 'react-native'
import { SecureMessagingAttachment, SecureMessagingMessageAttributes } from 'store/api'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import React, { FC, ReactNode } from 'react'

import { AttachmentLink, Box, CollapsibleView, LoadingComponent, TextView } from 'components'
import { DemoState } from 'store/slices/demoSlice'
import { NAMESPACE } from 'constants/namespaces'
import { REPLY_WINDOW_IN_DAYS } from 'constants/secureMessaging'
import { RootState } from 'store'
import { SecureMessagingState, downloadFileAttachment } from 'store/slices'
import { bytesToFinalSizeDisplay, bytesToFinalSizeDisplayA11y } from 'utils/common'
import { formatSubject } from 'utils/secureMessaging'
import { getFormattedDateAndTimeZone } from 'utils/formattingUtils'
import { useAppDispatch, useRouteNavigation, useTheme } from 'utils/hooks'
import ReplyMessageButton from '../ReplyMessageButton/ReplyMessageButton'
import StartNewMessageButton from '../StartNewMessageButton/StartNewMessageButton'

export type MessageCardProps = {
  /* message object */
  message: SecureMessagingMessageAttributes
}

const MessageCard: FC<MessageCardProps> = ({ message }) => {
  const theme = useTheme()
  const { t: th } = useTranslation(NAMESPACE.HEALTH)
  const { t: t } = useTranslation(NAMESPACE.COMMON)
  const { t: tFunction } = useTranslation()
  const { hasAttachments, attachment, attachments, senderName, sentDate, body, messageId, subject, category } = message
  const dateTime = getFormattedDateAndTimeZone(sentDate)
  const navigateTo = useRouteNavigation()
  const dispatch = useAppDispatch()
  const { loadingAttachments } = useSelector<RootState, SecureMessagingState>((state) => state.secureMessaging)

  const { demoMode } = useSelector<RootState, DemoState>((state) => state.demo)
  const replyExpired = demoMode && message.messageId === 2092809 ? false : DateTime.fromISO(message.sentDate).diffNow('days').days < REPLY_WINDOW_IN_DAYS

  const onPressAttachment = async (file: SecureMessagingAttachment, key: string): Promise<void> => {
    dispatch(downloadFileAttachment(file, key))
  }

  const getHeader = (): ReactNode => {
    return (
      <Box flexDirection={'column'}>
        <TextView variant="MobileBodyBold" accessibilityRole={'header'} mt={theme.dimensions.standardMarginBetween}>
          {formatSubject(category, subject, th)}
        </TextView>
        <TextView variant="MobileBody" mt={theme.dimensions.condensedMarginBetween}>
          {senderName}
        </TextView>
        <Box flexDirection={'row'}>
          <TextView variant="MobileBody" paragraphSpacing={true} testID={dateTime}>
            {dateTime}
          </TextView>
        </Box>
      </Box>
    )
  }

  const getContent = (): ReactNode => {
    return (
      <Box>
        <TextView variant="MobileBody" selectable={true} paragraphSpacing={true}>
          {body}
        </TextView>
      </Box>
    )
  }

  const getAttachment = (): ReactNode => {
    if (loadingAttachments && !attachments?.length) {
      return (
        <Box mx={theme.dimensions.gutter} mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom}>
          <LoadingComponent justTheSpinnerIcon={true} />
        </Box>
      )
    } else if (attachments?.length) {
      return (
        <Box mb={theme.dimensions.condensedMarginBetween} mr={theme.dimensions.gutter}>
          <Box accessible={true} accessibilityRole="header">
            <TextView variant={'MobileBodyBold'}>{t('secureMessaging.viewMessage.attachments')}</TextView>
          </Box>
          {attachments?.map((a, index) => (
            <Box key={`attachment-${a.id}`} mb={theme.dimensions.condensedMarginBetween}>
              <AttachmentLink
                name={a.filename}
                formattedSize={bytesToFinalSizeDisplay(a.size, tFunction)}
                formattedSizeA11y={bytesToFinalSizeDisplayA11y(a.size, tFunction)}
                a11yHint={th('secureMessaging.viewAttachment.a11yHint')}
                a11yValue={t('listPosition', { position: index + 1, total: attachments.length })}
                onPress={() => onPressAttachment(a, `attachment-${a.id}`)}
              />
            </Box>
          ))}
        </Box>
      )
    } else {
      return <></>
    }
  }

  const getMessageHelp = (): ReactNode => {
    return (
      <Box mb={theme.dimensions.condensedMarginBetween}>
        <Pressable
          onPress={navigateTo('ReplyHelp')}
          accessibilityRole={'button'}
          accessibilityLabel={t('secureMessaging.replyHelp.onlyUseMessages')}
          importantForAccessibility={'yes'}>
          <Box pointerEvents={'none'} accessible={false} importantForAccessibility={'no-hide-descendants'}>
            <CollapsibleView text={t('secureMessaging.replyHelp.onlyUseMessages')} showInTextArea={false} />
          </Box>
        </Pressable>
      </Box>
    )
  }

  const getReplyOrStartNewMessageButton = (): ReactNode => {
    return <Box mb={theme.dimensions.standardMarginBetween}>{!replyExpired ? <ReplyMessageButton messageID={messageId} /> : <StartNewMessageButton />}</Box>
  }

  return (
    <Box backgroundColor={'contentBox'}>
      <Box mx={theme.dimensions.gutter}>
        {getHeader()}
        {getContent()}
        {(hasAttachments || attachment) && getAttachment()}
        {getMessageHelp()}
        {getReplyOrStartNewMessageButton()}
      </Box>
    </Box>
  )
}

export default MessageCard
