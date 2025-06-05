import React from 'react'
import { useTranslation } from 'react-i18next'

import { useQueryClient } from '@tanstack/react-query'

import { contactInformationKeys } from 'api/contactInformation'
import { UserContactInformation } from 'api/types'
import { Box, TextView, VAScrollView } from 'components'
import { useSubtaskProps } from 'components/Templates/MultiStepSubtask'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { logAnalyticsEvent } from 'utils/analytics'
import { useOrientation, useRouteNavigation, useTheme } from 'utils/hooks'
import { getCommonSubtaskProps, useSMOCAnalyticsPageView } from 'utils/travelPay'

function VehicleScreen() {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const queryClient = useQueryClient()

  useSMOCAnalyticsPageView('vehicle')

  const theme = useTheme()
  const isPortrait = useOrientation()
  const navigateTo = useRouteNavigation()

  const onPrimaryContentButtonPress = () => {
    const contactInformation = queryClient.getQueryData<UserContactInformation>(
      contactInformationKeys.contactInformation,
    )
    const residentialAddress = contactInformation?.residentialAddress
    if (residentialAddress) {
      logAnalyticsEvent(Events.vama_smoc_button_click('vehicle', 'yes'))
      navigateTo('AddressScreen')
    } else {
      navigateTo('ErrorScreen', { error: 'noAddress' })
    }
  }

  const commonProps = getCommonSubtaskProps(t, navigateTo, 'vehicle', 'MileageScreen', 'AddressScreen')

  useSubtaskProps({
    ...commonProps,
    onPrimaryContentButtonPress,
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
