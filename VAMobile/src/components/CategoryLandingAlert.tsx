import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { HapticFeedbackTypes } from 'react-native-haptic-feedback'

import { useIsFocused } from '@react-navigation/native'

import { Box, TextView, VAIcon } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { triggerHaptic } from 'utils/haptics'
import { useTheme } from 'utils/hooks'

interface CategoryLandingAlertProps {
  /** Text for alert */
  text: string
  /** Optional boolean for indicating an error by setting the text color to red */
  isError?: boolean
}

/**
 * Component for alerts displayed on CategoryLanding screens
 */
const CategoryLandingAlert: FC<CategoryLandingAlertProps> = ({ text, isError }: CategoryLandingAlertProps) => {
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const isFocused = useIsFocused()

  const vibrate = (): void => {
    triggerHaptic(isError ? HapticFeedbackTypes.notificationError : HapticFeedbackTypes.notificationWarning)
  }

  const alertVariant = isError ? 'CategoryLandingError' : 'CategoryLandingWarning'

  return (
    <Box
      mx={theme.dimensions.condensedMarginBetween}
      mt={theme.dimensions.condensedMarginBetween}
      flexDirection="row"
      accessible={true}
      accessibilityRole={'text'}
      accessibilityLabel={`${t('errorIcon')} ${text}`}>
      <VAIcon
        accessible={false}
        importantForAccessibility="no"
        width={24}
        height={24}
        preventScaling={true}
        name="ExclamationCircle"
        fill="categoryLandingAlert"
        mt={3}
      />
      <TextView
        accessible={false}
        importantForAccessibility="no"
        variant={alertVariant}
        ml={theme.dimensions.condensedMarginBetween}
        flex={1}>
        {text}
      </TextView>
      {isFocused && vibrate()}
    </Box>
  )
}

export default CategoryLandingAlert
