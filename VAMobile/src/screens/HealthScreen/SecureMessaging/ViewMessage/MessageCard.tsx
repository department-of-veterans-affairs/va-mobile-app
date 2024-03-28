import React from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable } from 'react-native'
import { useSelector } from 'react-redux'

import { Button } from '@department-of-veterans-affairs/mobile-component-library'
import { DateTime } from 'luxon'

import { AttachmentLink, Box, CollapsibleView, LoadingComponent, TextView } from 'components'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { REPLY_WINDOW_IN_DAYS } from 'constants/secureMessaging'
import { RootState } from 'store'
import { SecureMessagingAttachment, SecureMessagingMessageAttributes } from 'store/api'
import { SecureMessagingState, downloadFileAttachment } from 'store/slices'
import { DemoState } from 'store/slices/demoSlice'
import { logAnalyticsEvent } from 'utils/analytics'
import { bytesToFinalSizeDisplay, bytesToFinalSizeDisplayA11y } from 'utils/common'
import { getFormattedDateAndTimeZone } from 'utils/formattingUtils'
import { useAppDispatch, useExternalLink, useRouteNavigation, useTheme } from 'utils/hooks'
import { fixSpecialCharacters, formatSubject, getLinkifiedText } from 'utils/secureMessaging'

export type MessageCardProps = {
  /* message object */
  message: SecureMessagingMessageAttributes
}

function MessageCard({ message }: MessageCardProps) {
  const theme = useTheme()
  const { t: t } = useTranslation(NAMESPACE.COMMON)
  const { t: tFunction } = useTranslation()
  const { hasAttachments, attachment, attachments, senderName, sentDate, body, messageId, subject, category } = message
  const dateTime = getFormattedDateAndTimeZone(sentDate)
  const dispatch = useAppDispatch()
  const { loadingAttachments } = useSelector<RootState, SecureMessagingState>((state) => state.secureMessaging)
  const navigateTo = useRouteNavigation()
  const launchLink = useExternalLink()
  const { demoMode } = useSelector<RootState, DemoState>((state) => state.demo)
  const replyExpired =
    demoMode && message.messageId === 2092809
      ? false
      : DateTime.fromISO(message.sentDate).diffNow('days').days < REPLY_WINDOW_IN_DAYS

  const onPressAttachment = async (file: SecureMessagingAttachment, key: string): Promise<void> => {
    dispatch(downloadFileAttachment(file, key))
  }

  function getHeader() {
    return (
      <Box flexDirection={'column'}>
        <TextView variant="MobileBodyBold" accessibilityRole={'header'} mt={theme.dimensions.standardMarginBetween}>
          {formatSubject(category, subject, t)}
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

  function getContent() {
    /** this does preserve newline characters just not spaces
     * TODO: change the mobile body link text views to be clickable and launch the right things */
    if (body) {
      return getLinkifiedText(fixSpecialCharacters(body), t, launchLink)
    }
    return <></>
  }

  function getAttachment() {
    if (loadingAttachments && !attachments?.length) {
      return (
        <Box
          mx={theme.dimensions.gutter}
          mt={theme.dimensions.contentMarginTop}
          mb={theme.dimensions.contentMarginBottom}>
          <LoadingComponent text={t('secureMessaging.viewMessage.loadingAttachment')} inlineSpinner={true} />
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
                a11yHint={t('secureMessaging.viewAttachment.a11yHint')}
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

  const navigateToReplyHelp = () => {
    logAnalyticsEvent(Events.vama_sm_nonurgent())
    navigateTo('ReplyHelp')
  }

  function getMessageHelp() {
    return (
      <Box mb={theme.dimensions.condensedMarginBetween}>
        <Pressable
          onPress={navigateToReplyHelp}
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

  const onStartMessagePress = () => {
    logAnalyticsEvent(Events.vama_sm_start())
    navigateTo('StartNewMessage', { attachmentFileToAdd: {}, attachmentFileToRemove: {} })
  }

  const onReplyPress = () =>
    navigateTo('ReplyMessage', { messageID: messageId, attachmentFileToAdd: {}, attachmentFileToRemove: {} })

  function getReplyOrStartNewMessageButton() {
    return (
      <Box mb={theme.dimensions.standardMarginBetween}>
        {!replyExpired ? (
          <Box mx={theme.dimensions.buttonPadding} mt={theme.dimensions.buttonPadding}>
            <Button label={t('reply')} onPress={onReplyPress} testID={'replyTestID'} />
          </Box>
        ) : (
          <Box mx={theme.dimensions.buttonPadding}>
            <Button
              label={t('secureMessaging.startNewMessage')}
              onPress={onStartMessagePress}
              testID={'startNewMessageButtonTestID'}
            />
          </Box>
        )}
      </Box>
    )
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
