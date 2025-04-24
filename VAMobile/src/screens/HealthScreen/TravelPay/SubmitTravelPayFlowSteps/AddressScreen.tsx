import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { StackScreenProps } from '@react-navigation/stack'

import { useContactInformation } from 'api/contactInformation'
import { Box, TextView, VAScrollView } from 'components'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import AddressSummary, {
  addressDataField,
  profileAddressOptions,
} from 'screens/HomeScreen/ProfileScreen/ContactInformationScreen/AddressSummary'
import { logAnalyticsEvent } from 'utils/analytics'
import { useOrientation, useRouteNavigation, useTheme } from 'utils/hooks'

import { SubmitTravelPayFlowModalStackParamList } from '../SubmitMileageTravelPayScreen'
import { TravelPayHelp } from './components'

type AddressScreenProps = StackScreenProps<SubmitTravelPayFlowModalStackParamList, 'AddressScreen'>

function AddressScreen({ navigation, route }: AddressScreenProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const navigateTo = useRouteNavigation()

  const contactInformationQuery = useContactInformation({ enabled: true })
  const [retried, setRetried] = useState(false)

  useEffect(() => {
    if (contactInformationQuery.failureCount > 0) {
      setRetried(true)
    }

    if (retried && !contactInformationQuery.isFetching) {
      const retryStatus = contactInformationQuery.error ? 'fail' : 'success'
      logAnalyticsEvent(Events.vama_react_query_retry(retryStatus))
    }
  }, [contactInformationQuery.failureCount, contactInformationQuery.error, contactInformationQuery.isFetching, retried])

  const address = contactInformationQuery.data?.residentialAddress

  const onResidentialAddress = () => {
    logAnalyticsEvent(Events.vama_click(t('contactInformation.residentialAddress'), t('contactInformation.title')))
    navigateTo('EditAddress', {
      displayTitle: t('contactInformation.residentialAddress'),
      addressType: profileAddressOptions.RESIDENTIAL_ADDRESS,
    })
  }

  const addressData: Array<addressDataField> = [
    { addressType: profileAddressOptions.RESIDENTIAL_ADDRESS, onPress: onResidentialAddress },
  ]

  const theme = useTheme()
  const isPortrait = useOrientation()

  return (
    <VAScrollView>
      <Box
        mb={theme.dimensions.contentMarginBottom}
        mx={isPortrait ? theme.dimensions.gutter : theme.dimensions.headerHeight}>
        <TextView variant="BitterBoldHeading" accessibilityRole="header">
          {t('travelPay.addressQuestion')}
        </TextView>
        <Box mt={theme.dimensions.standardMarginBetween}>
          {address ? (
            <>
              <TextView variant="MobileBody" mt={theme.dimensions.standardMarginBetween}>
                {t('travelPay.addressQualifier')}
              </TextView>
              <TextView variant="MobileBody" mt={theme.dimensions.standardMarginBetween}>
                {t('travelPay.referToPortal')}
              </TextView>
              <AddressSummary addressData={addressData} />
              <TextView variant="MobileBody" mt={theme.dimensions.standardMarginBetween}>
                {t('travelPay.addressPOBox')}
              </TextView>
            </>
          ) : (
            <>
              <AddressSummary addressData={addressData} />
              <TextView variant="MobileBody" mt={theme.dimensions.standardMarginBetween}>
                {t('travelPay.noAddressText')}
              </TextView>
              <TravelPayHelp />
            </>
          )}
        </Box>
      </Box>
    </VAScrollView>
  )
}

export default AddressScreen
