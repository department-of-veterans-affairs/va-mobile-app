import { testIdProps } from 'utils/accessibility'
import { useTheme } from 'utils/hooks'
import Box, { BackgroundVariant } from './Box'
import React, { FC } from 'react'
import TextView, { ColorVariant, FontVariant } from './TextView'

export type MessagesSentTagProps = {
  /**Message to be shown on the tag*/
  text: string
  /** optional background color for tag */
  backgroundColor?: BackgroundVariant
  /** optional text color for tag */
  color?: ColorVariant
  /** optional variant for tag text */
  variant?: FontVariant
}

/**Common component to show a text inside of a tag*/
const LabelTag: FC<MessagesSentTagProps> = ({ text, backgroundColor, color, variant }) => {
  const theme = useTheme()
  return (
    <Box
      minWidth={theme.dimensions.tagMinWidth}
      justifyContent={'center'}
      alignSelf={'flex-start'}
      backgroundColor={backgroundColor || 'unreadMessagesTag'}
      borderRadius={3}
      {...testIdProps(text)}
      accessible={true}>
      <TextView flexWrap={'wrap'} color={color || 'primaryContrast'} variant={variant || 'LabelTag'} px={12} py={4}>
        {text}
      </TextView>
    </Box>
  )
}

export default LabelTag
