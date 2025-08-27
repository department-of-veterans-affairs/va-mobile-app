import React, { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native'

import { StackScreenProps } from '@react-navigation/stack'

import { DateTime } from 'luxon'

import { useTravelPayClaims } from 'api/travelPay'
import { Box, ErrorComponent, FeatureLandingTemplate } from 'components'
import { VAScrollViewProps } from 'components/VAScrollView'
import { NAMESPACE } from 'constants/namespaces'
import { HealthStackParamList } from 'screens/HealthScreen/HealthStackScreens'
import TravelPayClaimsList from 'screens/HealthScreen/TravelPay/TravelPayClaims/TravelPayClaimsList'
import { ScreenIDTypesConstants } from 'store/api'
import TravelPayClaimsFilter from './TravelPayClaimsFilter'

type TravelPayClaimsProps = StackScreenProps<HealthStackParamList, 'TravelPayClaims'>

function TravelPayClaimsScreen({ navigation }: TravelPayClaimsProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)

  const [selectedFilter, setSelectedFilter] = useState('')
  const [selectedSortBy, setSelectedSortBy] = useState('')

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
  const totalClaims = claimsPayload?.meta.totalRecordCount ?? 0

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
        <Box>
          <TravelPayClaimsFilter 
            totalClaims={totalClaims}
            selectedFilter={selectedFilter}
            setSelectedFilter={setSelectedFilter}
            selectedSortBy={selectedSortBy}
            setSelectedSortBy={setSelectedSortBy}
          />
          <TravelPayClaimsList
            claims={claims}
            isLoading={isLoading}
            scrollViewRef={scrollViewRef}
            filter={selectedFilter}
            sortBy={selectedSortBy}
          />
        </Box>
      )}
    </FeatureLandingTemplate>
  )
}

export default TravelPayClaimsScreen
