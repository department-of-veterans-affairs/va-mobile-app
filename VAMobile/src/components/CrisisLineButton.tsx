import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { TouchableWithoutFeedback, TouchableWithoutFeedbackProps } from 'react-native'

import { Box, BoxProps, TextView } from 'components/index'
import { NAMESPACE } from 'constants/namespaces'
import { useRouteNavigation, useTheme } from 'utils/hooks'

/**
 * Crisis Line Button component
 */
const CrisisLineButton: FC = () => {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const navigateTo = useRouteNavigation()

  const touchableProps: TouchableWithoutFeedbackProps = {
    accessible: true,
    accessibilityRole: 'link',
  }

  const boxProps: BoxProps = {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: 'ctaButton',
    minHeight: theme.dimensions.touchableMinHeight,
    mx: theme.dimensions.gutter,
    my: theme.dimensions.standardMarginBetween,
    py: theme.dimensions.headerLeftButtonFromTextPadding,
    px: theme.dimensions.cardPadding,
    borderRadius: 40,
  }

  return (
    <TouchableWithoutFeedback onPress={() => navigateTo('VeteransCrisisLine')} {...touchableProps}>
      <Box {...boxProps}>
        <TextView variant={'CrisisLineButton'}>{t('crisisLineButton.label')}</TextView>
      </Box>
    </TouchableWithoutFeedback>
  )
}

export default CrisisLineButton
