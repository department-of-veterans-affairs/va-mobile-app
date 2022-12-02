import { TouchableWithoutFeedback } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import React, { FC } from 'react'

import { a11yHintProp } from 'utils/accessibility'
import { useAccessibilityFocus, useTheme } from 'utils/hooks'
import Box from './Box'
import TextView from './TextView'
import VAIcon from './VAIcon'

/**
 *  Signifies the props that need to be passed in to {@link DescriptiveBackButton}
 */
export type DescBackButtonProps = {
  /** the onPress function for the back button */
  onPress: (() => void) | undefined
  /** already translated display text */
  label: string
  /** optional param to add accessibility hint to back button */
  a11yHint?: string
  /** boolean to specify if we want accessibility to focus on the back button */
  focusOnButton?: boolean
}

/**
 * Button used by the stack navigation to go back to the previous screen
 */
export const DescriptiveBackButton: FC<DescBackButtonProps> = ({ onPress, label, a11yHint, focusOnButton = true }) => {
  const theme = useTheme()

  const [focusRef, setFocus] = useAccessibilityFocus<TouchableWithoutFeedback>()

  useFocusEffect(focusOnButton ? setFocus : () => {})

  const a11yHintPropParam = a11yHint ? a11yHint : label

  return (
    <TouchableWithoutFeedback ref={focusRef} onPress={onPress} {...a11yHintProp(a11yHintPropParam)} accessibilityRole="button" accessible={true}>
      <Box display="flex" flexDirection="row" ml={theme.dimensions.headerButtonSpacing} height={theme.dimensions.headerHeight} alignItems={'center'}>
        <VAIcon mt={1} name={'ArrowLeft'} fill={theme.colors.icon.link} />
        <TextView variant="ActionBar" color="descriptiveBackButton" ml={theme.dimensions.textIconMargin} allowFontScaling={false} accessible={false}>
          {label}
        </TextView>
      </Box>
    </TouchableWithoutFeedback>
  )
}

export default DescriptiveBackButton
