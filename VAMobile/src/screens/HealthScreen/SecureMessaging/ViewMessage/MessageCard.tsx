import { DateTime } from 'luxon'
import { Pressable } from 'react-native'
import { SecureMessagingAttachment, SecureMessagingMessageAttributes } from 'store/api'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import React, { FC, ReactNode } from 'react'
import _ from 'underscore'

import { AttachmentLink, Box, CollapsibleView, LoadingComponent, TextView } from 'components'
import { DemoState } from 'store/slices/demoSlice'
import { EMAIL_REGEX_EXP } from 'constants/common'
import { Events } from 'constants/analytics'
import { HealthStackParamList } from 'screens/HealthScreen/HealthStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { REPLY_WINDOW_IN_DAYS } from 'constants/secureMessaging'
import { RootState } from 'store'
import { SecureMessagingState, downloadFileAttachment } from 'store/slices'
import { StackNavigationProp } from '@react-navigation/stack'
import { bytesToFinalSizeDisplay, bytesToFinalSizeDisplayA11y } from 'utils/common'
import { formatSubject } from 'utils/secureMessaging'
import { getFormattedDateAndTimeZone } from 'utils/formattingUtils'
import { logAnalyticsEvent } from 'utils/analytics'
import { useAppDispatch, useTheme } from 'utils/hooks'
import { useNavigation } from '@react-navigation/native'
import ReplyMessageButton from '../ReplyMessageButton/ReplyMessageButton'
import StartNewMessageButton from '../StartNewMessageButton/StartNewMessageButton'

export type MessageCardProps = {
  /* message object */
  message: SecureMessagingMessageAttributes
}

const MessageCard: FC<MessageCardProps> = ({ message }) => {
  const theme = useTheme()
  const { t: t } = useTranslation(NAMESPACE.COMMON)
  const { t: tFunction } = useTranslation()
  const { hasAttachments, attachment, attachments, senderName, sentDate, body, messageId, subject, category } = message
  const dateTime = getFormattedDateAndTimeZone(sentDate)
  const navigation = useNavigation<StackNavigationProp<HealthStackParamList, keyof HealthStackParamList>>()
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

  const MAIL_TO_REGEX_EXP = new RegExp(
    /^(mailto:([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  )

  const PHONE_REGEX_EXP = new RegExp(/^[-0-9()+]+/)

  const URL_REGEX_EXP = new RegExp(/^((https:|http:|www\.)\S*)|([a-zA-Z]*\.([a-z]){2,3})/)

  const getContent = (): ReactNode => {
    /** this does preserve newline characters just not spaces, TODO:change the mobile body link text views to be clickable and launch the right things */

    if (body) {
      const textReconstructedBody: Array<ReactNode> = []
      const bodySplit = body.split(' ')
      let dontAddNextString = false
      _.forEach(bodySplit, (text, index) => {
        if (dontAddNextString) {
          //if previous entry was a phone number with xxx xxx xxxx format need to not add xxxx again
          dontAddNextString = false
          return
        }

        if (index != 0 && index != bodySplit.length - 1) {
          //phone number with spaces xxx xxx xxxx format
          const previousText = bodySplit[index - 1]
          const nextText = bodySplit[index + 1]
          if (
            previousText.length === 3 &&
            text.length === 3 &&
            nextText.length === 4 &&
            PHONE_REGEX_EXP.test(previousText) &&
            PHONE_REGEX_EXP.test(text) &&
            PHONE_REGEX_EXP.test(nextText)
          ) {
            textReconstructedBody.pop()
            textReconstructedBody.push(<TextView variant="MobileBodyLink">{previousText + ' ' + text + ' ' + nextText}</TextView>)
            textReconstructedBody.push(<TextView variant="MobileBody"> </TextView>)
            dontAddNextString = true
            return
          }
        }

        const emailMatch = EMAIL_REGEX_EXP.exec(text)
        const mailToMatch = MAIL_TO_REGEX_EXP.exec(text)
        const phoneMatch = PHONE_REGEX_EXP.exec(text)
        const urlMatch = URL_REGEX_EXP.exec(text)
        if (emailMatch) {
          //matches <email address> only
          textReconstructedBody.push(<TextView variant="MobileBodyLink">{text}</TextView>)
          textReconstructedBody.push(<TextView variant="MobileBody"> </TextView>)
        } else if (mailToMatch) {
          // matches mailto:<email address>
          textReconstructedBody.push(<TextView variant="MobileBodyLink">{text}</TextView>)
          textReconstructedBody.push(<TextView variant="MobileBody"> </TextView>)
        } else if (phoneMatch) {
          // matches 8006982411 800-698-2411 1-800-698-2411 (800)698-2411 (800)-698-2411 +8006982411 +18006982411
          textReconstructedBody.push(<TextView variant="MobileBodyLink">{text}</TextView>)
          textReconstructedBody.push(<TextView variant="MobileBody"> </TextView>)
        } else if (urlMatch) {
          // matches any https, http, www url as well as links like google.com (limit is 2 or 3 characters after the . to turn it into a link - may need to update this if we need to include other domains greater than 3 digits)
          textReconstructedBody.push(<TextView variant="MobileBodyLink">{text}</TextView>)
          textReconstructedBody.push(<TextView variant="MobileBody"> </TextView>)
        } else {
          textReconstructedBody.push(<TextView variant="MobileBody">{text + ' '}</TextView>)
        }
      })
      return (
        <Box>
          <TextView selectable={true} paragraphSpacing={true}>
            {textReconstructedBody}
          </TextView>
        </Box>
      )
    }
    return <></>
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
    navigation.navigate('ReplyHelp')
  }

  const getMessageHelp = (): ReactNode => {
    return (
      <Box mb={theme.dimensions.condensedMarginBetween}>
        <Pressable onPress={navigateToReplyHelp} accessibilityRole={'button'} accessibilityLabel={t('secureMessaging.replyHelp.onlyUseMessages')} importantForAccessibility={'yes'}>
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
