import { TouchableWithoutFeedback } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { NAMESPACE } from 'constants/namespaces'
import { useAccessibilityFocus, useTheme } from 'utils/hooks'
import Box from './Box'
import TextView from './TextView'
import VAIcon from './VAIcon'

/**
 *  Signifies the props that need to be passed in to {@link DescriptiveBackButton}
 */
export type DescBackButtonProps = {
  /** the onPress function for the back button */
  onPress: () => void
  /** already translated display text */
  label: string
  /** already translated a11y text */
  labelA11y?: string
  /** boolean to specify if we want accessibility to focus on the back button */
  focusOnButton?: boolean
}

/**
 * Descriptive button used by the stack navigation to go back to the previous screen
 */
export const DescriptiveBackButton: FC<DescBackButtonProps> = ({ onPress, label, labelA11y, focusOnButton = true }) => {
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)

  const [focusRef, setFocus] = useAccessibilityFocus<TouchableWithoutFeedback>()

  useFocusEffect(focusOnButton ? setFocus : () => {})

  return (
    <TouchableWithoutFeedback ref={focusRef} onPress={onPress} accessibilityRole="button" accessibilityLabel={labelA11y ? labelA11y + t('back') : label + t('back')}>
      <Box display="flex" flexDirection="row" ml={theme.dimensions.headerButtonSpacing} mt={theme.dimensions.buttonPadding} alignItems={'center'}>
        <VAIcon mt={1} name={'ArrowLeft'} fill={theme.colors.icon.link} height={13} />
        <TextView variant="DescriptiveBackButton" color="descriptiveBackButton" ml={theme.dimensions.textIconMargin} allowFontScaling={false} accessible={false}>
          {label}
        </TextView>
      </Box>
    </TouchableWithoutFeedback>
  )
}

export default DescriptiveBackButton
