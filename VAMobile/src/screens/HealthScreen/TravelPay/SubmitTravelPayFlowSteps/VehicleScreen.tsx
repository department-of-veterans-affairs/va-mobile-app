import React from 'react'
import { useTranslation } from 'react-i18next'

import { useQueryClient } from '@tanstack/react-query'

import { contactInformationKeys } from 'api/contactInformation'
import { UserContactInformation } from 'api/types'
import { Box, TextView, VAScrollView } from 'components'
import { useSubtaskProps } from 'components/Templates/MultiStepSubtask'
import { NAMESPACE } from 'constants/namespaces'
import { useOrientation, useRouteNavigation, useTheme } from 'utils/hooks'

function VehicleScreen() {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const queryClient = useQueryClient()

  const theme = useTheme()
  const isPortrait = useOrientation()
  const navigateTo = useRouteNavigation()

  const onPrimaryContentButtonPress = () => {
    const contactInformation = queryClient.getQueryData<UserContactInformation>(
      contactInformationKeys.contactInformation,
    )
    const residentialAddress = contactInformation?.residentialAddress
    if (residentialAddress) {
      navigateTo('AddressScreen')
    } else {
      navigateTo('ErrorScreen', { error: 'noAddress' })
    }
  }

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
    onPrimaryContentButtonPress,
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
