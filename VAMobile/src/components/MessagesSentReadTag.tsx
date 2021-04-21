import { testIdProps } from 'utils/accessibility'
import { useTheme } from 'utils/hooks'
import Box from './Box'
import React, { FC } from 'react'
import TextView from './TextView'

export type MessagesSentTagProps = {
  text: string
}

const MessagesSentReadTag: FC<MessagesSentTagProps> = ({ text }) => {
  const theme = useTheme()
  return (
    <Box
      minWidth={theme.dimensions.tagCountMinWidth}
      justifyContent={'center'}
      alignSelf={'flex-start'}
      backgroundColor="unreadMessagesTag"
      borderRadius={theme.dimensions.tagCountCurvedBorder}
      {...testIdProps(text)}
      accessible={true}>
      <TextView flexWrap={'wrap'} color="primaryContrast" variant="SentMessagesReadTag" px={theme.dimensions.alertPaddingX} pt={theme.dimensions.tagCountTopPadding}>
        {text}
      </TextView>
    </Box>
  )
}

export default MessagesSentReadTag
