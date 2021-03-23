import { ActivityIndicator, Pressable, PressableProps } from 'react-native'
import { DateTime } from 'luxon'
import { useDispatch } from 'react-redux'
import React, { FC, useEffect, useState } from 'react'

import { Box, TextArea, TextView, VAIcon, VA_ICON_MAP } from 'components'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import { SecureMessagingMessageAttributes } from 'store/api/types'
import { getMessage } from 'store/actions'
import { useTheme } from 'utils/hooks'

export type ThreadMessageProps = {
  message: SecureMessagingMessageAttributes
  isInitialMessage: boolean
}

const CollapsibleMessage: FC<ThreadMessageProps> = ({ message, isInitialMessage }) => {
  const [expanded, setExpanded] = useState(isInitialMessage)
  const [loadingAttachments, setLoadingAttachments] = useState(false)
  const iconName: keyof typeof VA_ICON_MAP = expanded ? 'ArrowUp' : 'ArrowDown'
  const theme = useTheme()
  const dispatch = useDispatch()
  const { condensedMarginBetween } = theme.dimensions
  const { attachment, attachments, senderName, sentDate, body } = message

  useEffect(() => {
    if (attachments?.length) {
      setLoadingAttachments(false)
    }
  }, [attachments?.length])

  const pressableProps: PressableProps = {
    onPress: (): void => {
      // Fetching a message thread only includes a summary of the message, and no attachments.
      // If the message has an attachment but we only have the summary, fetch the message details
      if (!expanded === true && attachment && !attachments?.length) {
        setLoadingAttachments(true)
        dispatch(getMessage(message.messageId, ScreenIDTypesConstants.SECURE_MESSAGING_VIEW_MESSAGE_SCREEN_ID, true, false))
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
