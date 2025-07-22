import React, { forwardRef } from 'react'
import { TouchableWithoutFeedback, View } from 'react-native'

import { Icon } from '@department-of-veterans-affairs/mobile-component-library'

import { Box, TextView } from 'components'
import { useTheme } from 'utils/hooks'

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
  /** optional testID */
  backButtonTestID?: string
}

/**
 * Descriptive button used by the stack navigation to go back to the previous screen
 */
export const DescriptiveBackButton = forwardRef<View, DescBackButtonProps>(
  ({ onPress, label, labelA11y, backButtonTestID }, ref) => {
    const theme = useTheme()

    if (!onPress) {
      return null
    }

    return (
      <View ref={ref}>
        {/* eslint-disable-next-line react-native-a11y/has-accessibility-hint */}
        <TouchableWithoutFeedback
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
      </View>
    )
  },
)

export default DescriptiveBackButton
