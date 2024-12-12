import React, { Ref, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View, ViewStyle } from 'react-native'

import { useIsFocused } from '@react-navigation/native'

import { Icon } from '@department-of-veterans-affairs/mobile-component-library'
import { useIsScreenReaderEnabled } from '@department-of-veterans-affairs/mobile-component-library'

import { useDownloadFileAttachment, useMessage } from 'api/secureMessaging'
import { SecureMessagingAttachment, SecureMessagingMessageAttributes } from 'api/types'
import {
  AccordionCollapsible,
  AccordionCollapsibleProps,
  AttachmentLink,
  Box,
  LabelTag,
  LabelTagTypeConstants,
  LoadingComponent,
  TextView,
} from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { bytesToFinalSizeDisplay, bytesToFinalSizeDisplayA11y } from 'utils/common'
import { getFormattedDateAndTimeZone } from 'utils/formattingUtils'
import { useOrientation, useTheme } from 'utils/hooks'
import { fixSpecialCharacters } from 'utils/jsonFormatting'
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
  const isFocused = useIsFocused()
  const isPortrait = useOrientation()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const { t: tFunction } = useTranslation()
  const { condensedMarginBetween } = theme.dimensions
  const fileToGet = {} as SecureMessagingAttachment
  const [attachments, setAttachments] = useState<SecureMessagingAttachment[]>([])
  const {
    data: messageWithAttachmentData,
    isFetching: loadingAttachments,
    isError: messageWithAttachmentError,
    isFetched: fetchedMessage,
    refetch: fetchMessage,
  } = useMessage(message.messageId, {
    enabled: false && isFocused,
  })
  const { refetch: refetchFile, isFetching: attachmentFetchPending } = useDownloadFileAttachment(fileToGet, {
    enabled: false,
  })

  const messageToUse = messageWithAttachmentData?.data.attributes || message
  const { attachment, hasAttachments, senderName, sentDate, body } = messageToUse
  const screenReaderEnabled = useIsScreenReaderEnabled()
  const dateTime = getFormattedDateAndTimeZone(sentDate)
  const attachmentBoolean = hasAttachments || attachment
  const attachLabel = attachmentBoolean ? t('secureMessaging.attachments.hasAttachment').toLowerCase() : ''

  useEffect(() => {
    if (fetchedMessage) {
      const includedAttachments = messageWithAttachmentData?.included?.filter(
        (included) => included.type === 'attachments',
      )
      if (includedAttachments?.length) {
        const attachmentsToSet: Array<SecureMessagingAttachment> = includedAttachments.map((attachmentToMap) => ({
          id: attachmentToMap.id,
          filename: attachmentToMap.attributes.name,
          link: attachmentToMap.links.download,
          size: attachmentToMap.attributes.attachmentSize,
        }))
        setAttachments(attachmentsToSet)
      }
    }
  }, [messageWithAttachmentData, fetchedMessage])

  if (isInitialMessage) {
    return <></>
  }

  const onPress = (expandedValue?: boolean): void => {
    // Fetching a message thread only includes a summary of the message, and no attachments.
    // If the message has an attachment but we only have the summary, fetch the message details
    if (expandedValue && attachmentBoolean) {
      fetchMessage()
    }
  }

  const onPressAttachment = async (file: SecureMessagingAttachment): Promise<void> => {
    fileToGet.filename = file.filename
    fileToGet.id = file.id
    fileToGet.link = file.link
    fileToGet.size = file.size
    refetchFile()
  }

  function getBody() {
    /** this does preserve newline characters just not spaces
     * TODO: change the mobile body link text views to be clickable and launch the right things */
    if (body) {
      return getLinkifiedText(fixSpecialCharacters(body), t, isPortrait)
    }
    return <></>
  }

  function getExpandedContent() {
    const loadingScrollViewStyle: ViewStyle = {
      backgroundColor: theme.colors.background.contentBox,
    }
    return (
      <Box>
        <Box mt={condensedMarginBetween} accessible={true}>
          {getBody()}
          {(loadingAttachments || attachmentFetchPending) && !attachments?.length && attachmentBoolean ? (
            <Box
              mx={theme.dimensions.gutter}
              mt={theme.dimensions.contentMarginTop}
              mb={theme.dimensions.contentMarginBottom}>
              <LoadingComponent
                text={t('secureMessaging.viewMessage.loadingAttachment')}
                scrollViewStyle={loadingScrollViewStyle}
              />
            </Box>
          ) : undefined}
        </Box>
        <Box>
          {attachments?.length ? (
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
          ) : undefined}
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
              <Icon name={'AttachFile'} fill={theme.colors.icon.spinner} width={20} height={20} />
            </Box>
          )}
          {sentDate && sentDate.length > 1 ? (
            <TextView accessible={false} variant="MobileBody">
              {dateTime}
            </TextView>
          ) : (
            <Box mt={condensedMarginBetween}>
              <LabelTag text={t('draft')} labelType={LabelTagTypeConstants.tagInactive} />
            </Box>
          )}
        </Box>
      </Box>
    )
  }

  function getCollapsedContent() {
    return (
      <Box>
        <TextView mt={condensedMarginBetween} variant="MobileBody" numberOfLines={2}>
          {fixSpecialCharacters(body || '').trimStart()}
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
