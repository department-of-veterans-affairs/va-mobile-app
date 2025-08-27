import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native'
import { useTheme } from 'utils/hooks'

import { StackScreenProps } from '@react-navigation/stack'

import { DateTime } from 'luxon'

import { useTravelPayClaims } from 'api/travelPay'
import { Box, ErrorComponent, FeatureLandingTemplate, TextView } from 'components'
import { VAScrollViewProps } from 'components/VAScrollView'
import { NAMESPACE } from 'constants/namespaces'
import { HealthStackParamList } from 'screens/HealthScreen/HealthStackScreens'
import TravelPayClaimsList from 'screens/HealthScreen/TravelPay/TravelPayClaims/TravelPayClaimsList'
import { ScreenIDTypesConstants } from 'store/api'
import TravelPayClaimsFilter from './TravelPayClaimsFilter'
import { TravelPayClaimData } from 'api/types'

type TravelPayClaimsProps = StackScreenProps<HealthStackParamList, 'TravelPayClaims'>

export type TravelClaimsFilter = {
  filter: string
  sortBy: string
}

const getFilteredClaims = (
  claims: Array<TravelPayClaimData>,
  filter: TravelClaimsFilter,
) => {
  if (!filter.filter || filter.filter === 'All') {
    return claims;
  }

  const result = claims.filter(claim => {
    return claim.attributes.claimStatus === filter.filter // TODO: filter.filter might become an array of strings because of checkbox not radio
  });

  return result;
}

function TravelPayClaimsScreen({ navigation }: TravelPayClaimsProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()

  const [claimsFilter, setClaimsFilter] = useState<TravelClaimsFilter>({ filter: '', sortBy: '' })

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

  const filteredClaims = useMemo(() => {
    return getFilteredClaims(claims, claimsFilter);
  }, [claims, claimsFilter])

  const scrollViewRef = useRef<ScrollView | null>(null)
  const scrollViewProps: VAScrollViewProps = {
    scrollViewRef: scrollViewRef,
  }

  const listTitle = () => (
    t('travelPay.statusList.list.title', {
      count: filteredClaims.length,
      filter: claimsFilter.filter || 'All', // TODO: what are good defaults, or hide?
      sort: claimsFilter.sortBy || '????',  // TODO: what are good defaults, or hide?
    })
  )

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

          <Box mx={theme.dimensions.gutter} accessible={true}>
            <TextView
              mt={theme.dimensions.condensedMarginBetween}
              mb={theme.dimensions.condensedMarginBetween}
              accessibilityRole="header"
              variant={'MobileBodyBold'}>
                {listTitle()}
            </TextView>
          </Box>

          <TravelPayClaimsFilter 
            claims={claims}
            setClaimsFilter={setClaimsFilter}
          />
          <TravelPayClaimsList
            claims={filteredClaims}
            isLoading={isLoading}
            scrollViewRef={scrollViewRef}
          />
        </Box>
      )}
    </FeatureLandingTemplate>
  )
}

export default TravelPayClaimsScreen
