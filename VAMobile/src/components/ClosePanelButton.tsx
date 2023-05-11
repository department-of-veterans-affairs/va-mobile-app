import { TouchableWithoutFeedback } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import React, { FC } from 'react'

import { VATextColors } from 'styles/theme'
import { useAccessibilityFocus, useTheme } from 'utils/hooks'
import Box from './Box'
import TextView from './TextView'

/**
 *  Signifies the props that need to be passed in to {@link ClosePanelButton}
 */
export type ClosePanelButton = {
  /** the onPress function for the close button */
  onPress: (() => void) | undefined
  /** optional param to add accessibility hint to close button */
  a11yHint?: string
  /** boolean to specify if we want accessibility to focus on the close button */
  focusOnButton?: boolean
  /** button text */
  buttonText: string
  /** button text color */
  buttonTextColor?: keyof VATextColors
}

/**
 * Button used by the panel
 */
export const ClosePanelButton: FC<ClosePanelButton> = ({ onPress, a11yHint, focusOnButton, buttonText, buttonTextColor }) => {
  const theme = useTheme()

  const [focusRef, setFocus] = useAccessibilityFocus<TouchableWithoutFeedback>()

  useFocusEffect(focusOnButton ? setFocus : () => {})

  return (
    <TouchableWithoutFeedback
      ref={focusRef}
      onPress={onPress}
      accessibilityLabel={buttonText}
      accessibilityHint={a11yHint ? a11yHint : undefined}
      accessibilityRole="button"
      accessible={true}>
      <Box display="flex" flexDirection="row" ml={16} height={theme?.dimensions?.headerHeight} width={80} alignItems={'center'}>
        <TextView variant="MobileBody" color={buttonTextColor} ml={theme?.dimensions?.textIconMargin} allowFontScaling={false} accessible={false}>
          {buttonText}
        </TextView>
      </Box>
    </TouchableWithoutFeedback>
  )
}

export default ClosePanelButton
