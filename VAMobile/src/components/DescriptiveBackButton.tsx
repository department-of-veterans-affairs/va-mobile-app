import React, { FC } from 'react'
import { TouchableWithoutFeedback } from 'react-native'

import { useFocusEffect } from '@react-navigation/native'

import { Icon } from '@department-of-veterans-affairs/mobile-component-library'

import { useAccessibilityFocus, useTheme } from 'utils/hooks'

import Box from './Box'
import TextView from './TextView'

/**
 *  Signifies the props that need to be passed in to {@link DescriptiveBackButton}
 */
export type DescBackButtonProps = {
  /** the onPress function for the back button */
  onPress?: () => void
  /** already translated display text */
  label: string
  /** already translated a11y text */
  labelA11y?: string
  /** boolean to specify if we want accessibility to focus on the back button */
  focusOnButton?: boolean
  /** optional testID */
  backButtonTestID?: string
}

/**
 * Descriptive button used by the stack navigation to go back to the previous screen
 */
export const DescriptiveBackButton: FC<DescBackButtonProps> = ({
  onPress,
  label,
  labelA11y,
  focusOnButton = true,
  backButtonTestID,
}) => {
  const theme = useTheme()

  const [focusRef, setFocus] = useAccessibilityFocus<TouchableWithoutFeedback>()

  useFocusEffect(focusOnButton ? setFocus : () => {})
  if (!onPress) {
    return null
  }

  return (
    // eslint-disable-next-line react-native-a11y/has-accessibility-hint
    <TouchableWithoutFeedback
      ref={focusRef}
      onPress={onPress}
      accessibilityRole="link"
      accessibilityLabel={labelA11y ? labelA11y : label}
      testID={backButtonTestID}>
      <Box
        display="flex"
        flexDirection="row"
        ml={theme.dimensions.headerButtonSpacing}
        mt={theme.dimensions.buttonPadding}
        height={theme.dimensions.headerHeight} // Uniform height ensures proper screen reader order in header
        alignItems={'center'}>
        <Icon name={'ChevronLeft'} fill={theme.colors.icon.link} width={30} height={28} maxWidth={36} />
        <TextView variant="DescriptiveBackButton" color="link" allowFontScaling={false} accessible={false}>
          {label}
        </TextView>
      </Box>
    </TouchableWithoutFeedback>
  )
}

export default DescriptiveBackButton
