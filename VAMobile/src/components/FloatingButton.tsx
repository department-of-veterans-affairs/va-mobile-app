import React, { FC } from 'react'
import { ViewStyle } from 'react-native'

import { Button, ButtonProps, useIsScreenReaderEnabled } from '@department-of-veterans-affairs/mobile-component-library'
import { colors } from '@department-of-veterans-affairs/mobile-tokens'

import { Box } from 'components'
import { useTheme } from 'utils/hooks'

/**
 *  Signifies the props that need to be passed in to {@link FloatingButton}
 */
export type FloatingButtonProps = {
  /** boolean to specify if the floating button should be displayed */
  isHidden: boolean
} & ButtonProps

/**
 * Button that sticks to the bottom of its container when the screen reader is disabled and renders in-place otherwise
 */
const FloatingButton: FC<FloatingButtonProps> = ({ isHidden, ...buttonProps }: FloatingButtonProps) => {
  const theme = useTheme()
  const screenReaderEnabled = useIsScreenReaderEnabled()

  const floatingButtonStyle: ViewStyle = {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.vadsColorBlack,
    borderRadius: 4,
    shadowColor: colors.vadsColorBlack,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 5,
  }

  if (isHidden) {
    return <></>
  }

  return (
    <Box
      mx={theme.dimensions.gutter}
      mt={screenReaderEnabled ? theme.dimensions.standardMarginBetween : 0}
      mb={theme.dimensions.standardMarginBetween}
      style={!screenReaderEnabled ? floatingButtonStyle : {}}>
      <Button {...buttonProps} />
    </Box>
  )
}

export default FloatingButton
