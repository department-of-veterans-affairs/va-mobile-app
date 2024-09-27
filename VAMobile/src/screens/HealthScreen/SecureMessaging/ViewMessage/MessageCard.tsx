import React from 'react'
import { useTranslation } from 'react-i18next'
import { ViewStyle } from 'react-native'
import { useSelector } from 'react-redux'

import { Button } from '@department-of-veterans-affairs/mobile-component-library'
import { DateTime } from 'luxon'

import { useDownloadFileAttachment } from 'api/secureMessaging'
import { SecureMessagingAttachment, SecureMessagingMessageAttributes } from 'api/types'
import { AttachmentLink, Box, LinkWithAnalytics, LoadingComponent, TextView } from 'components'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { REPLY_WINDOW_IN_DAYS } from 'constants/secureMessaging'
import { RootState } from 'store'
import { DemoState } from 'store/slices/demoSlice'
import { logAnalyticsEvent } from 'utils/analytics'
import { bytesToFinalSizeDisplay, bytesToFinalSizeDisplayA11y } from 'utils/common'
import { getFormattedDateAndTimeZone } from 'utils/formattingUtils'
import { useRouteNavigation, useTheme } from 'utils/hooks'
import { fixSpecialCharacters } from 'utils/jsonFormatting'
import { formatSubject, getLinkifiedText } from 'utils/secureMessaging'

export type MessageCardProps = {
  /* message object */
  message: SecureMessagingMessageAttributes
}

function MessageCard({ message }: MessageCardProps) {
  const theme = useTheme()
  const { t: t } = useTranslation(NAMESPACE.COMMON)
  const { t: tFunction } = useTranslation()
  const { hasAttachments, attachment, attachments, senderName, sentDate, body, subject, category } = message
  const dateTime = getFormattedDateAndTimeZone(sentDate)
  const navigateTo = useRouteNavigation()
  const fileToGet = {} as SecureMessagingAttachment
  const { isFetching: attachmentFetchPending, refetch: refetchFile } = useDownloadFileAttachment(fileToGet, {
    enabled: false,
  })
  const { demoMode } = useSelector<RootState, DemoState>((state) => state.demo)
  const replyExpired =
    demoMode && message.messageId === 2092809
      ? false
      : DateTime.fromISO(message.sentDate).diffNow('days').days < REPLY_WINDOW_IN_DAYS

  const onPressAttachment = (file: SecureMessagingAttachment) => {
    fileToGet.filename = file.filename
    fileToGet.id = file.id
    fileToGet.link = file.link
    fileToGet.size = file.size
    refetchFile()
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
      return getLinkifiedText(fixSpecialCharacters(body), t)
    }
    return <></>
  }

  function getAttachment() {
    if (attachmentFetchPending) {
      const loadingScrollViewStyle: ViewStyle = {
        backgroundColor: theme.colors.background.contentBox,
      }
      return (
        <Box
          mx={theme.dimensions.gutter}
          mt={theme.dimensions.contentMarginTop}
          mb={theme.dimensions.contentMarginBottom}>
          <LoadingComponent
            text={t('secureMessaging.viewMessage.loadingAttachment')}
            scrollViewStyle={loadingScrollViewStyle}
          />
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
                onPress={() => onPressAttachment(a)}
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
        <LinkWithAnalytics
          type="custom"
          text={t('secureMessaging.replyHelp.onlyUseMessages')}
          onPress={navigateToReplyHelp}
        />
      </Box>
    )
  }

  const onStartMessagePress = () => {
    logAnalyticsEvent(Events.vama_sm_start())
    navigateTo('StartNewMessage', { attachmentFileToAdd: {}, attachmentFileToRemove: {} })
  }

  const onReplyPress = () =>
    navigateTo('ReplyMessage', { messageID: message.messageId, attachmentFileToAdd: {}, attachmentFileToRemove: {} })

  function getReplyOrStartNewMessageButton() {
    return (
      <Box mb={theme.dimensions.standardMarginBetween}>
        {!replyExpired ? (
          <Button label={t('reply')} onPress={onReplyPress} testID={'replyTestID'} />
        ) : (
          <Button
            label={t('secureMessaging.startNewMessage')}
            onPress={onStartMessagePress}
            testID={'startNewMessageButtonTestID'}
          />
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
