import React, { Ref, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { useDownloadFileAttachment, useMessage } from 'api/secureMessaging'
import {
  AccordionCollapsible,
  AccordionCollapsibleProps,
  AttachmentLink,
  Box,
  LoadingComponent,
  TextView,
  VAIcon,
} from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { SecureMessagingAttachment, SecureMessagingMessageAttributes } from 'store/api/types'
import { bytesToFinalSizeDisplay, bytesToFinalSizeDisplayA11y } from 'utils/common'
import { getFormattedDateAndTimeZone } from 'utils/formattingUtils'
import { useExternalLink, useIsScreenReaderEnabled, useTheme } from 'utils/hooks'
import { getLinkifiedText } from 'utils/secureMessaging'

import IndividualMessageErrorComponent from './IndividualMessageErrorComponent'

export type ThreadMessageProps = {
  /* message object */
  message: SecureMessagingMessageAttributes
  /* if it is the message selected */
  isInitialMessage?: boolean
  /* ref for the message */
  collapsibleMessageRef?: Ref<View>
}

function CollapsibleMessage({ message, isInitialMessage, collapsibleMessageRef }: ThreadMessageProps) {
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const { t: tFunction } = useTranslation()
  const launchLink = useExternalLink()
  const { condensedMarginBetween } = theme.dimensions
  const [fetchMessageWithAttachment, setFetchMessageWithAttachment] = useState(false)
  const [fetchFile, setFetchFile] = useState(false)
  const [fileToGet, setFile] = useState({} as SecureMessagingAttachment)
  const {
    data: messageWithAttachmentData,
    isLoading: loadingAttachments,
    isError: messageWithAttachmentError,
  } = useMessage(message.messageId, {
    enabled: fetchMessageWithAttachment,
  })
  const { isFetched: attachmentFetched, isPending: attachmentFetchPending } = useDownloadFileAttachment(fileToGet, {
    enabled: fetchFile,
  })

  const messageToUse = messageWithAttachmentData?.data.attributes || message
  const { attachment, hasAttachments, attachments, senderName, sentDate, body } = messageToUse
  const screenReaderEnabled = useIsScreenReaderEnabled(true)
  const dateTime = getFormattedDateAndTimeZone(sentDate)
  const attachmentBoolean = hasAttachments || attachment
  const attachLabel = attachmentBoolean ? t('secureMessaging.attachments.hasAttachment').toLowerCase() : ''

  if (isInitialMessage) {
    return <></>
  }

  const onPress = (expandedValue?: boolean): void => {
    // Fetching a message thread only includes a summary of the message, and no attachments.
    // If the message has an attachment but we only have the summary, fetch the message details
    if (expandedValue && attachmentBoolean && !attachments?.length) {
      setFetchMessageWithAttachment(true)
    }
  }

  const onPressAttachment = async (file: SecureMessagingAttachment): Promise<void> => {
    if (!attachmentFetched && !attachmentFetchPending) {
      setFile(file)
      setFetchFile(true)
    }
  }

  function getBody() {
    /** this does preserve newline characters just not spaces
     * TODO: change the mobile body link text views to be clickable and launch the right things */
    if (body) {
      return getLinkifiedText(body, t, launchLink)
    }
    return <></>
  }

  function getExpandedContent() {
    return (
      <Box>
        <Box mt={condensedMarginBetween} accessible={true}>
          {getBody()}
          {loadingAttachments && !attachments?.length && attachmentBoolean && (
            <Box
              mx={theme.dimensions.gutter}
              mt={theme.dimensions.contentMarginTop}
              mb={theme.dimensions.contentMarginBottom}>
              <LoadingComponent text={t('secureMessaging.viewMessage.loadingAttachment')} inlineSpinner={true} />
            </Box>
          )}
        </Box>
        <Box>
          {attachments?.length && (
            <Box mt={theme.dimensions.condensedMarginBetween} mr={theme.dimensions.gutter}>
              <Box accessible={true} accessibilityRole="header">
                <TextView variant={'MobileBodyBold'}>{t('secureMessaging.viewMessage.attachments')}</TextView>
              </Box>
              {attachments?.map((a, index) => (
                <Box key={`attachment-${a.id}`} mt={theme.dimensions.condensedMarginBetween}>
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
          )}
        </Box>
      </Box>
    )
  }

  function getHeader() {
    return (
      <Box flexDirection={'column'}>
        <TextView variant="MobileBodyBold" accessible={false}>
          {senderName}
        </TextView>
        <Box flexDirection={'row'} mr={theme.dimensions.textIconMargin}>
          {attachmentBoolean && (
            <Box mt={theme.dimensions.attachmentIconTopMargin} mr={theme.dimensions.textIconMargin}>
              <VAIcon name={'PaperClip'} fill={'spinner'} width={16} height={16} />
            </Box>
          )}
          <TextView accessible={false} variant="MobileBody">
            {dateTime}
          </TextView>
        </Box>
      </Box>
    )
  }

  function getCollapsedContent() {
    return (
      <Box>
        <TextView mt={condensedMarginBetween} variant="MobileBody" numberOfLines={2}>
          {body?.trimStart()}
        </TextView>
      </Box>
    )
  }

  const errorContent = (
    <Box mt={theme.dimensions.gutter}>
      <IndividualMessageErrorComponent />
    </Box>
  )

  const accordionProps: AccordionCollapsibleProps = {
    header: getHeader(),
    testID: `${senderName} ${dateTime} ${attachLabel}`,
    expandedContent: messageWithAttachmentError ? errorContent : getExpandedContent(),
    collapsedContent: !screenReaderEnabled ? getCollapsedContent() : undefined,
    customOnPress: onPress,
    noBorder: true,
    headerRef: collapsibleMessageRef,
  }

  return <AccordionCollapsible {...accordionProps} />
}

export default CollapsibleMessage
