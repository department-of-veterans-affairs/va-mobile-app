import { ActivityIndicator } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import React, { FC, ReactNode } from 'react'

import { AccordionCollapsible, AccordionCollapsibleProps, AttachmentLink, Box, ErrorComponent, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import { SecureMessagingAttachment, SecureMessagingMessageAttributes } from 'store/api/types'
import { SecureMessagingState, StoreState } from 'store/reducers'
import { bytesToMegabytes } from 'utils/common'
import { downloadFileAttachment } from 'store/actions'
import { getFormattedDateTimeYear } from 'utils/formattingUtils'
import { getMessage } from 'store/actions'
import { useError, useTheme, useTranslation } from 'utils/hooks'

export type ThreadMessageProps = {
  message: SecureMessagingMessageAttributes
  isInitialMessage: boolean
}

const CollapsibleMessage: FC<ThreadMessageProps> = ({ message, isInitialMessage }) => {
  const theme = useTheme()
  const t = useTranslation(NAMESPACE.HEALTH)
  const tCom = useTranslation(NAMESPACE.COMMON)
  const dispatch = useDispatch()
  const { condensedMarginBetween } = theme.dimensions
  const { attachment, attachments, senderName, sentDate, body } = message
  const { loadingAttachments, loadingFile, loadingFileKey } = useSelector<StoreState, SecureMessagingState>((state) => state.secureMessaging)

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
    console.log('KELLY messageID of one you just clicked', message.messageId)

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
            <Box mt={theme.dimensions.condensedMarginBetween}>
              <Box accessible={true} accessibilityRole="header">
                <TextView variant={'MobileBodyBold'}>{t('secureMessaging.viewMessage.attachments')}</TextView>
              </Box>
              {attachments?.map((a, index) => (
                <Box accessible={true} key={`attachment-${a.id}`} mt={theme.dimensions.condensedMarginBetween}>
                  <AttachmentLink
                    name={a.filename}
                    size={bytesToMegabytes(a.size)}
                    sizeUnit={t('secureMessaging.viewMessage.attachments.MB')}
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
        <TextView variant="MobileBody">{dateTime}</TextView>
        {attachment && <TextView variant="MobileBody">(has attachment)</TextView>}
      </Box>
    )
  }

  const accordionProps: AccordionCollapsibleProps = {
    header: getHeader(),
    testID: `${senderName} ${dateTime} ${attachLabel}`,
    expandedContent: useError(ScreenIDTypesConstants.SECURE_MESSAGING_VIEW_MESSAGE_SCREEN_ID, message.messageId) ? <ErrorComponent /> : getExpandedContent(),
    customOnPress: onPress,
    expandedInitialValue: isInitialMessage,
  }

  return <AccordionCollapsible {...accordionProps} />
}

export default CollapsibleMessage
