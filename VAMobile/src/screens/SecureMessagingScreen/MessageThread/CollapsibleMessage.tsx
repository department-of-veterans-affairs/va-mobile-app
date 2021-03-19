import { Pressable, PressableProps } from 'react-native'
import React, { FC, useState } from 'react'
import moment from 'moment'

import { Box, TextArea, TextView, VAIcon, VA_ICON_MAP } from 'components'
import { SecureMessagingMessageAttributes } from 'store/api/types'
import { useTheme } from 'utils/hooks'

export type ThreadMessageProps = {
  message: SecureMessagingMessageAttributes
  isInitialMessage: boolean
}

const MessageThread: FC<ThreadMessageProps> = ({ message, isInitialMessage }) => {
  const [expanded, setExpanded] = useState(isInitialMessage)
  const iconName: keyof typeof VA_ICON_MAP = expanded ? 'ArrowUp' : 'ArrowDown'
  const theme = useTheme()
  const { condensedMarginBetween } = theme.dimensions
  // const hasAttachment = message.attachment

  // Note: If this message isn't the "main" message, we do not have the attachment details
  // yet.  We should do a fetch on expand to get the attachment details

  const pressableProps: PressableProps = {
    onPress: (): void => setExpanded(!expanded),
    accessibilityState: { expanded },
    accessibilityRole: 'spinbutton',
  }

  return (
    <TextArea>
      <Pressable {...pressableProps}>
        <Box flexDirection={'row'}>
          <Box flexDirection={'column'} justifyContent={'flex-start'} flex={1}>
            <TextView variant={'MobileBodyBold'}>{message.senderName}</TextView>
            <TextView variant={'MobileBody'}>{moment(message.sentDate).format('DD MMM @ HHmm zz')}</TextView>
          </Box>
          <VAIcon name={iconName} fill={'#000'} />
        </Box>
      </Pressable>
      {expanded && (
        <Box mt={condensedMarginBetween} accessible={true}>
          <TextView variant={'MobileBody'}>{message.body}</TextView>
        </Box>
      )}
    </TextArea>
  )
}

export default MessageThread
