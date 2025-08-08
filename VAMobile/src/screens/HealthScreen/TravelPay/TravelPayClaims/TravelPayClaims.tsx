import React, { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native'

import { StackScreenProps } from '@react-navigation/stack'

import { Box, FeatureLandingTemplate } from 'components'
import { VAScrollViewProps } from 'components/VAScrollView'
import { NAMESPACE } from 'constants/namespaces'
import { HealthStackParamList } from 'screens/HealthScreen/HealthStackScreens'
import { TravelPayClaimsFilters } from 'screens/HealthScreen/TravelPay/TravelPayClaims/TravelPayClaimsFilters'
import TravelPaySummaryList from 'screens/HealthScreen/TravelPay/TravelPayClaims/TravelPaySummaryList'

type TravelPayClaimsProps = StackScreenProps<HealthStackParamList, 'TravelPayClaims'>

export function TravelPayClaims({ navigation }: TravelPayClaimsProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)

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
      <TravelPayClaimsFilters />

      <Box flex={1}>
        <TravelPaySummaryList scrollViewRef={scrollViewRef} />
      </Box>
    </FeatureLandingTemplate>
  )
}

export default TravelPayClaims
