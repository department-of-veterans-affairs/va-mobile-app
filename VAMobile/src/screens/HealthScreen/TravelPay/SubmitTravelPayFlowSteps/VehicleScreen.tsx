import React from 'react'
import { useTranslation } from 'react-i18next'

import { useContactInformation } from 'api/contactInformation'
import { AddressData } from 'api/types'
import { Box, TextView, VAScrollView } from 'components'
import { useSubtaskProps } from 'components/Templates/MultiStepSubtask'
import { NAMESPACE } from 'constants/namespaces'
import { useOrientation, useRouteNavigation, useTheme } from 'utils/hooks'

function VehicleScreen() {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const contactInformationQuery = useContactInformation({ enabled: true })
  const address: AddressData | undefined | null = contactInformationQuery.data?.residentialAddress

  const theme = useTheme()
  const isPortrait = useOrientation()
  const navigateTo = useRouteNavigation()

  useSubtaskProps({
    leftButtonText: t('back'),
    onLeftButtonPress: () => navigateTo('MileageScreen'),
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
    onPrimaryContentButtonPress: address
      ? () => navigateTo('AddressScreen')
      : //TODO add unit test to cover this scenario once we update the logic for update address
        () => navigateTo('ErrorScreen', { error: 'noAddress' }),
    secondaryContentButtonText: t('no'),
    onSecondaryContentButtonPress: () => navigateTo('ErrorScreen', { error: 'unsupportedType' }),
  })

  return (
    <VAScrollView>
      <Box
        mb={theme.dimensions.contentMarginBottom}
        mx={isPortrait ? theme.dimensions.gutter : theme.dimensions.headerHeight}>
        <TextView testID="vehicleQuestionID" variant="BitterHeading" accessibilityRole="header">
          {t('travelPay.vehicleQuestion')}
        </TextView>
      </Box>
    </VAScrollView>
  )
}

export default VehicleScreen
