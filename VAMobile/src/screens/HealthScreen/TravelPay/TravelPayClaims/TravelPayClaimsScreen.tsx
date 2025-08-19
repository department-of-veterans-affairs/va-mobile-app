import React, { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native'

import { StackScreenProps } from '@react-navigation/stack'

import { DateTime } from 'luxon'

import { useTravelPayClaims } from 'api/travelPay'
import { ErrorComponent, FeatureLandingTemplate } from 'components'
import { VAScrollViewProps } from 'components/VAScrollView'
import { NAMESPACE } from 'constants/namespaces'
import { HealthStackParamList } from 'screens/HealthScreen/HealthStackScreens'
import TravelPayClaimsList from 'screens/HealthScreen/TravelPay/TravelPayClaims/TravelPayClaimsList'
import { ScreenIDTypesConstants } from 'store/api'

type TravelPayClaimsProps = StackScreenProps<HealthStackParamList, 'TravelPayClaims'>

function TravelPayClaimsScreen({ navigation }: TravelPayClaimsProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)

  // TODO 112328: fill in start and end date from filtering view (part of filter state)
  const startDate = DateTime.now().minus({ months: 3 }).toISO()
  const endDate = DateTime.now().toISO()
  const {
    data: claimsPayload,
    isLoading,
    error,
    refetch,
  } = useTravelPayClaims({
    startDate,
    endDate,
  })

  const claims = claimsPayload?.data ?? []

  const scrollViewRef = useRef<ScrollView | null>(null)
  const scrollViewProps: VAScrollViewProps = {
    scrollViewRef: scrollViewRef,
  }

  return (
    <FeatureLandingTemplate
      backLabel={t('health.title')}
      backLabelOnPress={navigation.goBack}
      title={t('travelPay.statusList.title')}
      testID="travelPayClaimsTestID"
      scrollViewProps={scrollViewProps}>
      {error ? (
        <ErrorComponent
          onTryAgain={refetch}
          screenID={ScreenIDTypesConstants.TRAVEL_PAY_CLAIMS_SCREEN_ID}
          error={error}
        />
      ) : (
        <TravelPayClaimsList claims={claims} isLoading={isLoading} scrollViewRef={scrollViewRef} />
      )}
    </FeatureLandingTemplate>
  )
}

export default TravelPayClaimsScreen
