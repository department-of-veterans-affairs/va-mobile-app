import { View } from 'react-native'
import { useTranslation } from 'react-i18next'
import React, { FC, ReactNode, Ref } from 'react'

import { AccordionCollapsible, AccordionCollapsibleProps, AttachmentLink, Box, LoadingComponent, TextView, VAIcon } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { RootState } from 'store'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import { SecureMessagingAttachment, SecureMessagingMessageAttributes } from 'store/api/types'
import { SecureMessagingState, downloadFileAttachment, getMessage } from 'store/slices'
import { bytesToFinalSizeDisplay, bytesToFinalSizeDisplayA11y } from 'utils/common'
import { getFormattedDateAndTimeZone } from 'utils/formattingUtils'
import { useAppDispatch, useTheme } from 'utils/hooks'
import { useSelector } from 'react-redux'
import IndividualMessageErrorComponent from './IndividualMessageErrorComponent'

export type ThreadMessageProps = {
  /* message object */
  message: SecureMessagingMessageAttributes
  /* if it is the message selected */
  isInitialMessage: boolean
  /* ref for the message */
  collapsibleMessageRef?: Ref<View>
}

const CollapsibleMessage: FC<ThreadMessageProps> = ({ message, isInitialMessage, collapsibleMessageRef }) => {
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.HEALTH)
  const { t: tCom } = useTranslation(NAMESPACE.COMMON)
  const { t: tFunction } = useTranslation()
  const dispatch = useAppDispatch()
  const { condensedMarginBetween } = theme?.dimensions?
  const { attachment, attachments, senderName, sentDate, body } = message
  const { loadingAttachments, messageIDsOfError } = useSelector<RootState, SecureMessagingState>((state) => state.secureMessaging)

  const dateTime = getFormattedDateAndTimeZone(sentDate)
  const attachLabel = (attachment && 'has attachment') || ''

  const onPress = (expandedValue?: boolean): void => {
    // Fetching a message thread only includes a summary of the message, and no attachments.
    // If the message has an attachment but we only have the summary, fetch the message details
    if (expandedValue && attachment && !attachments?.length) {
      dispatch(getMessage(message.messageId, ScreenIDTypesConstants.SECURE_MESSAGING_VIEW_MESSAGE_SCREEN_ID, true, true))
    }
  }

  const onPressAttachment = async (file: SecureMessagingAttachment, key: string): Promise<void> => {
    dispatch(downloadFileAttachment(file, key))
  }

  const getExpandedContent = (): ReactNode => {
    return (
      <Box>
        <Box mt={condensedMarginBetween} accessible={true}>
          <TextView variant="MobileBody" selectable={true}>
            {body}
          </TextView>
          {loadingAttachments && !attachments?.length && attachment && (
            <Box mx={theme?.dimensions?.gutter} mt={theme?.dimensions?.contentMarginTop} mb={theme?.dimensions?.contentMarginBottom}>
              <LoadingComponent justTheSpinnerIcon={true} />
            </Box>
          )}
        </Box>
        <Box>
          {attachments?.length && (
            <Box mt={theme?.dimensions?.condensedMarginBetween} mr={theme?.dimensions?.gutter}>
              <Box accessible={true} accessibilityRole="header">
                <TextView variant={'MobileBodyBold'}>{t('secureMessaging.viewMessage.attachments')}</TextView>
              </Box>
              {attachments?.map((a, index) => (
                <Box key={`attachment-${a.id}`} mt={theme?.dimensions?.condensedMarginBetween}>
                  <AttachmentLink
                    name={a.filename}
                    formattedSize={bytesToFinalSizeDisplay(a.size, tFunction)}
                    formattedSizeA11y={bytesToFinalSizeDisplayA11y(a.size, tFunction)}
                    a11yHint={t('secureMessaging.viewAttachment.a11yHint')}
                    a11yValue={tCom('listPosition', { position: index + 1, total: attachments.length })}
                    onPress={() => onPressAttachment(a, `attachment-${a.id}`)}
                  />
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </Box>
    )
  }

  const getHeader = (): ReactNode => {
    return (
      <Box flexDirection={'column'}>
        <TextView variant="MobileBodyBold" accessible={false}>
          {senderName}
        </TextView>
        <Box flexDirection={'row'} mr={theme?.dimensions?.textIconMargin}>
          {attachment && (
            <Box mt={theme?.dimensions?.attachmentIconTopMargin} mr={theme?.dimensions?.textIconMargin}>
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

  const loadMessageError = messageIDsOfError?.includes(message.messageId)

  const accordionProps: AccordionCollapsibleProps = {
    header: getHeader(),
    testID: `${senderName} ${dateTime} ${attachLabel}`,
    expandedContent: loadMessageError ? <IndividualMessageErrorComponent /> : getExpandedContent(),
    customOnPress: onPress,
    expandedInitialValue: isInitialMessage,
    noBorder: true,
    headerRef: collapsibleMessageRef,
  }

  return <AccordionCollapsible {...accordionProps} />
}

export default CollapsibleMessage
