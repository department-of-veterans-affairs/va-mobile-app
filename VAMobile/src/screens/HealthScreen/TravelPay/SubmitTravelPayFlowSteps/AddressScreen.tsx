import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useContactInformation } from 'api/contactInformation'
import { Box, TextView, VAScrollView } from 'components'
import { useSubtaskProps } from 'components/Templates/MultiStepSubtask'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import AddressSummary, {
  addressDataField,
  profileAddressOptions,
} from 'screens/HomeScreen/ProfileScreen/ContactInformationScreen/AddressSummary'
import { logAnalyticsEvent } from 'utils/analytics'
import { useOrientation, useRouteNavigation, useTheme } from 'utils/hooks'

function AddressScreen() {
  const { t } = useTranslation(NAMESPACE.COMMON)

  const contactInformationQuery = useContactInformation({ enabled: true })
  const [retried, setRetried] = useState(false)
  const navigateTo = useRouteNavigation()

  useSubtaskProps({
    leftButtonText: t('back'),
    onLeftButtonPress: () => navigateTo('VehicleScreen'),
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
    onPrimaryContentButtonPress: () => navigateTo('ReviewClaimScreen'),
    secondaryContentButtonText: t('no'),
    onSecondaryContentButtonPress: () => navigateTo('ErrorScreen', { error: 'unsupportedType' }),
  })

  useEffect(() => {
    if (contactInformationQuery.failureCount > 0) {
      setRetried(true)
    }

    if (retried && !contactInformationQuery.isFetching) {
      const retryStatus = contactInformationQuery.error ? 'fail' : 'success'
      logAnalyticsEvent(Events.vama_react_query_retry(retryStatus))
    }
  }, [contactInformationQuery.failureCount, contactInformationQuery.error, contactInformationQuery.isFetching, retried])

  const addressData: Array<addressDataField> = [
    { addressType: profileAddressOptions.RESIDENTIAL_ADDRESS, onPress: undefined },
  ]

  const theme = useTheme()
  const isPortrait = useOrientation()

  return (
    <VAScrollView>
      <Box
        mb={theme.dimensions.contentMarginBottom}
        mx={isPortrait ? theme.dimensions.gutter : theme.dimensions.headerHeight}>
        <TextView testID="addressQuestionID" variant="BitterHeading" accessibilityRole="header">
          {t('travelPay.addressQuestion')}
        </TextView>
      </Box>
      <AddressSummary addressData={addressData} />
      <Box mt={theme.dimensions.standardMarginBetween} mx={theme.dimensions.gutter}>
        <TextView testID="addressConfirmationID" variant="MobileBody">
          {t('travelPay.addressConfirmation')}
        </TextView>
      </Box>
    </VAScrollView>
  )
}

export default AddressScreen
