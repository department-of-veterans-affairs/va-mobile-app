import React from 'react'
import { useTranslation } from 'react-i18next'

import { Box, TextView, VAScrollView } from 'components'
import { useSubtaskProps } from 'components/Templates/MultiStepSubtask'
import { NAMESPACE } from 'constants/namespaces'
import { useOrientation, useRouteNavigation, useTheme } from 'utils/hooks'

function MileageScreen() {
  const { t } = useTranslation(NAMESPACE.COMMON)

  const theme = useTheme()
  const isPortrait = useOrientation()
  const navigateTo = useRouteNavigation()

  useSubtaskProps({
    leftButtonText: t('back'),
    onLeftButtonPress: () => navigateTo('InterstitialScreen'),
    leftButtonTestID: 'leftBackTestID',
    rightButtonText: t('help'),
    rightButtonTestID: 'rightHelpTestID',
    onRightButtonPress: () => navigateTo('TravelClaimHelpScreen'),
    rightIconProps: {
      name: 'Help',
      fill: 'default',
    },
    primaryContentButtonText: t('yes'),
    primaryButtonTestID: 'yesTestID',
    onPrimaryContentButtonPress: () => navigateTo('VehicleScreen'),
    secondaryContentButtonText: t('no'),
    onSecondaryContentButtonPress: () => navigateTo('ErrorScreen', { error: 'unsupportedType' }),
  })

  return (
    <VAScrollView>
      <Box
        mb={theme.dimensions.contentMarginBottom}
        mx={isPortrait ? theme.dimensions.gutter : theme.dimensions.headerHeight}>
        <TextView testID="milageQuestionID" variant="BitterHeading" accessibilityRole="header">
          {t('travelPay.mileageQuestion')}
        </TextView>
      </Box>
    </VAScrollView>
  )
}

export default MileageScreen
