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
      minWidth={theme.dimensions.tagCountMinWidth}
      justifyContent={'center'}
      alignSelf={'flex-start'}
      backgroundColor={backgroundColor || 'unreadMessagesTag'}
      borderRadius={theme.dimensions.tagCountCurvedBorder}
      {...testIdProps(text)}
      accessible={true}>
      <TextView flexWrap={'wrap'} color={color || 'primaryContrast'} variant={variant || 'LabelTag'} px={theme.dimensions.alertPaddingX} pt={theme.dimensions.tagCountTopPadding}>
        {text}
      </TextView>
    </Box>
  )
}

export default LabelTag
