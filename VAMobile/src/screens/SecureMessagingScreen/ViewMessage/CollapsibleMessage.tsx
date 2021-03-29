import { ActivityIndicator } from 'react-native'
import { DateTime } from 'luxon'
import { useDispatch, useSelector } from 'react-redux'
import React, { FC, ReactNode } from 'react'

import { AccordionCollapsible, AccordionCollapsibleProps, Box, TextView } from 'components'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import { SecureMessagingMessageAttributes } from 'store/api/types'
import { SecureMessagingState, StoreState } from 'store/reducers'
import { getMessage } from 'store/actions'
import { useTheme } from 'utils/hooks'

export type ThreadMessageProps = {
  message: SecureMessagingMessageAttributes
  isInitialMessage: boolean
}

const CollapsibleMessage: FC<ThreadMessageProps> = ({ message, isInitialMessage }) => {
  const theme = useTheme()
  const dispatch = useDispatch()
  const { condensedMarginBetween } = theme.dimensions
  const { attachment, attachments, senderName, sentDate, body } = message
  const { loadingAttachments } = useSelector<StoreState, SecureMessagingState>((state) => state.secureMessaging)

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
        {attachments?.length &&
          attachments?.map((a) => (
            <TextView mt={theme.dimensions.contentMarginTop} key={`attachment-${a.id}`} variant="MobileBody">
              {a.filename}
            </TextView>
          ))}
      </Box>
    )
  }

  const getHeader = (): ReactNode => {
    return (
      <Box flexDirection={'column'}>
        <TextView variant="MobileBodyBold">{senderName}</TextView>
        <TextView variant="MobileBody">{DateTime.fromISO(sentDate).toFormat("dd MMM '@' HHmm ZZZZ")}</TextView>
        {attachment && <TextView variant="MobileBody">(has attachment)</TextView>}
      </Box>
    )
  }

  const accordionProps: AccordionCollapsibleProps = {
    header: getHeader(),
    expandedContent: getExpandedContent(),
    customOnPress: onPress,
    expandedInitialValue: isInitialMessage,
  }

  return <AccordionCollapsible {...accordionProps} />
}

export default CollapsibleMessage
