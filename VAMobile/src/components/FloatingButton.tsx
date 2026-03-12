import React, { FC } from 'react'
import { ViewStyle, useWindowDimensions } from 'react-native'

import { Button, ButtonProps, useIsScreenReaderEnabled } from '@department-of-veterans-affairs/mobile-component-library'
import { colors } from '@department-of-veterans-affairs/mobile-tokens'

import { Box } from 'components'
import { FAB_INLINE_FONT_SCALE_THRESHOLD } from 'constants/common'
import { useTheme } from 'utils/hooks'

/**
 *  Signifies the props that need to be passed in to {@link FloatingButton}
 */
export type FloatingButtonProps = {
  /** boolean to specify if the floating button should be displayed */
  isHidden: boolean
} & ButtonProps

/**
 * Button that sticks to the bottom of its container when the screen reader is disabled and renders in-place otherwise.
 * Also renders in-place when text size is significantly enlarged via accessibility settings (>= 1.5x).
 */
const FloatingButton: FC<FloatingButtonProps> = ({ isHidden, ...buttonProps }: FloatingButtonProps) => {
  const theme = useTheme()
  const screenReaderEnabled = useIsScreenReaderEnabled()
  const fontScale = useWindowDimensions().fontScale

  // Render in-place if screen reader enabled OR font scale is in a clearly large-text range.
  // useWindowDimensions().fontScale is reactive to iOS Dynamic Type changes.
  const shouldRenderInPlace = screenReaderEnabled || fontScale >= FAB_INLINE_FONT_SCALE_THRESHOLD

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
      mt={!shouldRenderInPlace ? 0 : theme.dimensions.standardMarginBetween}
      mb={theme.dimensions.standardMarginBetween}
      style={!shouldRenderInPlace ? floatingButtonStyle : {}}>
      <Button {...buttonProps} />
    </Box>
  )
}

export default FloatingButton
