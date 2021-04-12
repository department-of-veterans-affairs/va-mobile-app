import { useTheme } from '../utils/hooks'
import Box from './Box'
import React, { FC } from 'react'
import TextView from './TextView'

export type UnreadButtonProps = {
  unread: number
}

const MessagesUnreadButton: FC<UnreadButtonProps> = ({ unread }) => {
  const theme = useTheme()
  return (
    <Box
      height={theme.dimensions.tagCountHeight}
      minWidth={theme.dimensions.tagCountMinWidth}
      justifyContent={'center'}
      alignSelf={'center'}
      backgroundColor="profileBanner"
      borderRadius={theme.dimensions.tagCountCurvedBorder}>
      <TextView color="primaryContrast" variant="MobileBodyBoldTag" px={theme.dimensions.condensedMarginBetween} pt={theme.dimensions.tagCountTopPadding}>
        {unread}
      </TextView>
    </Box>
  )
}

export default MessagesUnreadButton
