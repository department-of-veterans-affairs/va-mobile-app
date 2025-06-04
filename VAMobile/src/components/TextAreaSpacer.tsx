import React from 'react'

import { Box, BoxProps } from 'components'
import { VATheme } from 'styles/theme'
import { useTheme } from 'utils/hooks'

const createBoxProps = (theme: VATheme): BoxProps => {
  return {
    borderStyle: 'solid',
    borderBottomWidth: 'default',
    borderBottomColor: 'primary',
    borderTopWidth: 'default',
    borderTopColor: 'primary',
    height: theme.dimensions.standardMarginBetween,
    backgroundColor: 'main',
    mx: -theme.dimensions.gutter,
    testID: 'TextAreaSpacer',
  }
}

/**
 * A spacer component that is used to separate text areas in the app.
 * @returns A spacer component that is used to separate text areas in the app.
 */
const TextAreaSpacer = () => {
  const theme = useTheme()

  return <Box {...createBoxProps(theme)} />
}

export default TextAreaSpacer
