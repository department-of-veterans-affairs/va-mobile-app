import { testIdProps } from '../utils/accessibility'
import { useTheme } from '../utils/hooks'
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
      height={theme.dimensions.tagCountHeight}
      minWidth={theme.dimensions.tagCountMinWidth}
      justifyContent={'center'}
      alignSelf={'center'}
      backgroundColor="profileBanner"
      borderRadius={theme.dimensions.tagCountCurvedBorder}
      accessible={true}
      {...testIdProps(unread.toString())}>
      <TextView color="primaryContrast" variant="MobileBodyBoldTag" px={theme.dimensions.condensedMarginBetween} pt={theme.dimensions.tagCountTopPadding}>
        {unread}
      </TextView>
    </Box>
  )
}

export default MessagesCountTag
