import { ActivityIndicator, Pressable, PressableProps } from 'react-native'
import { DateTime } from 'luxon'
import { useDispatch, useSelector } from 'react-redux'
import React, { FC, useState } from 'react'

import { Box, TextArea, TextView, VAIcon, VA_ICON_MAP } from 'components'
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
  const [expanded, setExpanded] = useState(isInitialMessage)
  const iconName: keyof typeof VA_ICON_MAP = expanded ? 'ArrowUp' : 'ArrowDown'
  const theme = useTheme()
  const dispatch = useDispatch()
  const { condensedMarginBetween } = theme.dimensions
  const { attachment, attachments, senderName, sentDate, body } = message
  const { loadingAttachments } = useSelector<StoreState, SecureMessagingState>((state) => state.secureMessaging)

  const pressableProps: PressableProps = {
    onPress: (): void => {
      // Fetching a message thread only includes a summary of the message, and no attachments.
      // If the message has an attachment but we only have the summary, fetch the message details
      if (!expanded === true && attachment && !attachments?.length) {
        dispatch(getMessage(message.messageId, ScreenIDTypesConstants.SECURE_MESSAGING_VIEW_MESSAGE_SCREEN_ID, true, true))
      }
      setExpanded(!expanded)
    },
    accessibilityState: { expanded },
    accessibilityRole: 'spinbutton',
  }

  return (
    <TextArea>
      <Pressable {...pressableProps}>
        <Box flexDirection={'row'}>
          <Box flexDirection={'column'} justifyContent={'flex-start'} flex={1}>
            <TextView variant="MobileBodyBold">{senderName}</TextView>
            <TextView variant="MobileBody">{DateTime.fromISO(sentDate).toFormat("dd MMM '@' HHmm ZZZZ")}</TextView>
            {attachment && <TextView variant="MobileBody">(has attachment)</TextView>}
          </Box>
          <VAIcon name={iconName} fill={'#000'} />
        </Box>
      </Pressable>
      {expanded && (
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
      )}
    </TextArea>
  )
}

export default CollapsibleMessage
