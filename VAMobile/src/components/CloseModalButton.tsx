import { TouchableWithoutFeedback } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import React, { FC } from 'react'

import { useAccessibilityFocus } from 'utils/hooks'
import { useTheme } from 'utils/hooks/useTheme'
import Box from './Box'
import TextView from './TextView'

/**
 *  Signifies the props that need to be passed in to {@link CloseModalButton}
 */
export type CloseModalButton = {
  /** the onPress function for the close button */
  onPress: (() => void) | undefined
  /** optional param to add accessibility hint to close button */
  a11yHint?: string
  /** boolean to specify if we want accesibility to focus on the close button */
  focusOnButton?: boolean
  /** button text */
  buttonText: string
}

/**
 * Button used by the request appointment modal
 */
export const CloseModalButton: FC<CloseModalButton> = ({ onPress, a11yHint, focusOnButton, buttonText }) => {
  const theme = useTheme()

  const [focusRef, setFocus] = useAccessibilityFocus<TouchableWithoutFeedback>()

  useFocusEffect(focusOnButton ? setFocus : () => {})

  const a11yHintPropParam = a11yHint ? a11yHint : ''

  return (
    <TouchableWithoutFeedback ref={focusRef} onPress={onPress} accessibilityLabel={buttonText} accessibilityHint={a11yHintPropParam} accessibilityRole="button" accessible={true}>
      <Box display="flex" flexDirection="row" ml={16} height={theme.dimensions.headerHeight} width={80} alignItems={'center'}>
        <TextView variant="MobileBody" ml={theme.dimensions.textIconMargin} allowFontScaling={false} accessible={false}>
          {buttonText}
        </TextView>
      </Box>
    </TouchableWithoutFeedback>
  )
}

export default CloseModalButton
