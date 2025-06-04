import React from 'react'
import { useTranslation } from 'react-i18next'

import { Box, TextView, VAScrollView } from 'components'
import { useSubtaskProps } from 'components/Templates/MultiStepSubtask'
import { NAMESPACE } from 'constants/namespaces'
import AddressSummary, {
  addressDataField,
  profileAddressOptions,
} from 'screens/HomeScreen/ProfileScreen/ContactInformationScreen/AddressSummary'
import { useOrientation, useRouteNavigation, useTheme } from 'utils/hooks'
import { getCommonSubtaskProps, useSMOCAnalyticsPageView } from 'utils/travelPay'

function AddressScreen() {
  const { t } = useTranslation(NAMESPACE.COMMON)

  useSMOCAnalyticsPageView('address')

  const navigateTo = useRouteNavigation()

  useSubtaskProps(getCommonSubtaskProps(t, navigateTo, 'address', 'VehicleScreen', 'ReviewClaimScreen'))

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
