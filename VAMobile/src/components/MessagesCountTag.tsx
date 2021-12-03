import { testIdProps } from 'utils/accessibility'
import { useTheme } from 'utils/hooks'
import Box from './Box'
import React, { FC } from 'react'
import TextView from './TextView'

export type CountTagProps = {
  /**number to be shown on the tag */
  unread: number
}

/**A common component to show a count of a particular item within a page before clicking to enter that page. For example, this tag would be used to display the number of unread messages in one's inbox. */
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
