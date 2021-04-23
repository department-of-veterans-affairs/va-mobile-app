import { testIdProps } from 'utils/accessibility'
import { useTheme } from 'utils/hooks'
import Box from './Box'
import React, { FC } from 'react'
import TextView from './TextView'

export type CountTagProps = {
  unread: number
}

const MessagesCountTag: FC<CountTagProps> = ({ unread }) => {
  const theme = useTheme()
  return (
    <Box
      minWidth={theme.dimensions.tagCountMinWidth}
      justifyContent={'center'}
      alignSelf={'center'}
      backgroundColor="unreadMessagesTag"
      borderRadius={theme.dimensions.tagCountCurvedBorder}
      {...testIdProps(unread.toString())}
      accessible={true}>
      <TextView flexWrap={'wrap'} color="primaryContrast" variant="UnreadMessagesTag" px={theme.dimensions.condensedMarginBetween} pt={theme.dimensions.tagCountTopPadding}>
        {unread}
      </TextView>
    </Box>
  )
}

export default MessagesCountTag
