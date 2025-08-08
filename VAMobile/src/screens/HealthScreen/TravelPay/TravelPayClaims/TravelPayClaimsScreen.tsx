import React, { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native'

import { StackScreenProps } from '@react-navigation/stack'

import { useTravelPayClaims } from 'api/travelPay'
import { Box, FeatureLandingTemplate } from 'components'
import { VAScrollViewProps } from 'components/VAScrollView'
import { NAMESPACE } from 'constants/namespaces'
import { HealthStackParamList } from 'screens/HealthScreen/HealthStackScreens'
import TravelPayClaimsFilter from 'screens/HealthScreen/TravelPay/TravelPayClaims/TravelPayClaimsFilter'
import TravelPayClaimsList from 'screens/HealthScreen/TravelPay/TravelPayClaims/TravelPayClaimsList'

type TravelPayClaimsProps = StackScreenProps<HealthStackParamList, 'TravelPayClaims'>

function TravelPayClaimsScreen({ navigation }: TravelPayClaimsProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)

  // TODO - will factor in filter and sort by - for now just placeholder
  const [selectedFilter, setSelectedFilter] = useState('')
  const [selectedSortBy, setSelectedSortBy] = useState('')

  // TODO: fill in start and end date (part of filter state)
  const { data: claimsPayload, isLoading } = useTravelPayClaims({ startDate: '', endDate: '' })

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
      <TravelPayClaimsFilter
        totalClaims={totalClaims}
        selectedFilter={selectedFilter}
        setSelectedFilter={setSelectedFilter}
        selectedSortBy={selectedSortBy}
        setSelectedSortBy={setSelectedSortBy}
      />
      <Box flex={1}>
        <TravelPayClaimsList
          claims={claims}
          isLoading={isLoading}
          filter={selectedFilter}
          sortBy={selectedSortBy}
          scrollViewRef={scrollViewRef}
        />
      </Box>
    </FeatureLandingTemplate>
  )
}

export default TravelPayClaimsScreen
