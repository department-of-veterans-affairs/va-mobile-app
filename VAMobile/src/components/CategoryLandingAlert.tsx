import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'

import { Box, TextView, VAIcon } from 'components'
import { NAMESPACE } from 'constants/namespaces'
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
    </Box>
  )
}

export default CategoryLandingAlert
