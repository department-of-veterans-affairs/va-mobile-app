import { ActivityIndicator } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import React, { FC, ReactNode } from 'react'

import { AccordionCollapsible, AccordionCollapsibleProps, AttachmentLink, Box, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import { SecureMessagingMessageAttributes } from 'store/api/types'
import { SecureMessagingState, StoreState } from 'store/reducers'
import { getFormattedDateTimeYear } from 'utils/formattingUtils'
import { getMessage } from 'store/actions'
import { useTheme, useTranslation } from 'utils/hooks'

export type ThreadMessageProps = {
  message: SecureMessagingMessageAttributes
  isInitialMessage: boolean
}

const CollapsibleMessage: FC<ThreadMessageProps> = ({ message, isInitialMessage }) => {
  const theme = useTheme()
  const t = useTranslation(NAMESPACE.HEALTH)
  const dispatch = useDispatch()
  const { condensedMarginBetween } = theme.dimensions
  const { attachment, attachments, senderName, sentDate, body } = message
  const { loadingAttachments } = useSelector<StoreState, SecureMessagingState>((state) => state.secureMessaging)

  const dateTime = getFormattedDateTimeYear(sentDate)
  const attachLabel = (attachment && 'has attachment') || ''

  const onPress = (expandedValue?: boolean): void => {
    // Fetching a message thread only includes a summary of the message, and no attachments.
    // If the message has an attachment but we only have the summary, fetch the message details
    if (expandedValue && attachment && !attachments?.length) {
      dispatch(getMessage(message.messageId, ScreenIDTypesConstants.SECURE_MESSAGING_VIEW_MESSAGE_SCREEN_ID, true, true))
    }
  }

  const getExpandedContent = (): ReactNode => {
    return (
      <Box mt={condensedMarginBetween} accessible={true}>
        <TextView variant="MobileBody">{body}</TextView>
        {loadingAttachments && !attachments?.length && (
          <Box mx={theme.dimensions.gutter} mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom}>
            <ActivityIndicator size="large" color={theme.colors.icon.spinner} />
          </Box>
        )}
        {attachments?.length && (
          <Box mt={theme.dimensions.condensedMarginBetween}>
            <TextView accessibilityRole="header" variant={'MobileBodyBold'}>
              {t('secureMessaging.viewMessage.attachments')}
            </TextView>
            {attachments?.length &&
              attachments?.map((a) => (
                <Box mt={theme.dimensions.condensedMarginBetween}>
                  <AttachmentLink name={a.filename} a11yHint={t('viewAttachment.a11yHint')} />
                </Box>
              ))}
            <Box mt={theme.dimensions.condensedMarginBetween}>
              <AttachmentLink name={'longest file name of all time to test multiple attachments what it looks like'} a11yHint={t('viewAttachment.a11yHint')} />
            </Box>
          </Box>
        )}
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
    expandedContent: getExpandedContent(),
    customOnPress: onPress,
    expandedInitialValue: isInitialMessage,
  }

  return <AccordionCollapsible {...accordionProps} />
}

export default CollapsibleMessage
