import { ActivityIndicator } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import React, { FC, ReactNode } from 'react'

import { AccordionCollapsible, AccordionCollapsibleProps, AttachmentLink, Box, TextView, VAIcon } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import { SecureMessagingAttachment, SecureMessagingMessageAttributes } from 'store/api/types'
import { SecureMessagingState, StoreState } from 'store/reducers'
import { bytesToFinalSizeDisplay } from 'utils/common'
import { downloadFileAttachment } from 'store/actions'
import { getFormattedDateTimeYear } from 'utils/formattingUtils'
import { getMessage } from 'store/actions'
import { useTheme, useTranslation } from 'utils/hooks'
import IndividualMessageErrorComponent from './IndividualMessageErrorComponent'

export type ThreadMessageProps = {
  message: SecureMessagingMessageAttributes
  isInitialMessage: boolean
}

const CollapsibleMessage: FC<ThreadMessageProps> = ({ message, isInitialMessage }) => {
  const theme = useTheme()
  const t = useTranslation(NAMESPACE.HEALTH)
  const tCom = useTranslation(NAMESPACE.COMMON)
  const tFunction = useTranslation()
  const dispatch = useDispatch()
  const { condensedMarginBetween } = theme.dimensions
  const { attachment, attachments, senderName, sentDate, body } = message
  const { loadingAttachments, loadingFile, loadingFileKey, messageIDsOfError } = useSelector<StoreState, SecureMessagingState>((state) => state.secureMessaging)

  const dateTime = getFormattedDateTimeYear(sentDate)
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
          <TextView variant="MobileBody">{body}</TextView>
          {loadingAttachments && !attachments?.length && (
            <Box mx={theme.dimensions.gutter} mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom}>
              <ActivityIndicator size="large" color={theme.colors.icon.spinner} />
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
                <Box accessible={true} key={`attachment-${a.id}`} mt={theme.dimensions.condensedMarginBetween}>
                  <AttachmentLink
                    name={a.filename}
                    formattedSize={bytesToFinalSizeDisplay(a.size, tFunction)}
                    a11yHint={t('secureMessaging.viewAttachment.a11yHint')}
                    a11yValue={tCom('listPosition', { position: index + 1, total: attachments.length })}
                    onPress={() => onPressAttachment(a, `attachment-${a.id}`)}
                    load={`attachment-${a.id}` === loadingFileKey && loadingFile}
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
        <TextView variant="MobileBodyBold">{senderName}</TextView>
        <Box flexDirection={'row'} mr={theme.dimensions.textIconMargin}>
          {attachment && (
            <Box mt={theme.dimensions.alertBorderWidth} mr={theme.dimensions.textIconMargin}>
              <VAIcon name={'PaperClip'} fill={'spinner'} width={16} height={16} />
            </Box>
          )}
          <TextView variant="MobileBody">{dateTime}</TextView>
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
  }

  return <AccordionCollapsible {...accordionProps} />
}

export default CollapsibleMessage
