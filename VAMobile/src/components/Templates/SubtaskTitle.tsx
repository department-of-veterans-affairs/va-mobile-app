import React from 'react'

import { Box, TextView } from 'components'
import { useTheme } from 'utils/hooks'

interface SubtaskTitleProps {
  /** Title to display */
  title: string
  /** Accessibility label for title (optional) */
  a11yLabel?: string
  /** Top margin (optional, defaults to buttonPadding) */
  mt?: number
}

/**
 * Title for FullScreenSubtask and MultiStepSubtask templates
 */
const SubtaskTitle = ({ title, a11yLabel, mt }: SubtaskTitleProps) => {
  const theme = useTheme()
  const { buttonPadding, gutter } = theme.dimensions

  return (
    <Box mt={mt ?? buttonPadding} mb={buttonPadding} mx={gutter}>
      {/*eslint-disable-next-line react-native-a11y/has-accessibility-hint*/}
      <TextView variant="BitterHeading" accessibilityLabel={a11yLabel} accessibilityRole="header">
        {title}
      </TextView>
    </Box>
  )
}

export default SubtaskTitle
