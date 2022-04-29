import { testIdProps } from 'utils/accessibility'
import { useTheme } from 'utils/hooks'
import Box, { BackgroundVariant } from './Box'
import React, { FC } from 'react'
import TextView, { ColorVariant, FontVariant } from './TextView'

export type LabelTagProps = {
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
const LabelTag: FC<LabelTagProps> = ({ text, backgroundColor, color, variant }) => {
  const theme = useTheme()
  return (
    <Box
      minWidth={theme.dimensions.tagMinWidth}
      justifyContent={'center'}
      alignSelf={'flex-start'}
      backgroundColor={backgroundColor || 'unreadMessagesTag'}
      borderRadius={theme.dimensions.tagCurvedBorder}
      {...testIdProps(text)}>
      <TextView flexWrap={'wrap'} color={color || 'primaryContrast'} variant={variant || 'LabelTag'} px={theme.dimensions.tagHorizontalPadding}>
        {text}
      </TextView>
    </Box>
  )
}

export default LabelTag
