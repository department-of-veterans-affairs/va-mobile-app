import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native'
import { useTheme } from 'utils/hooks'
import { sortBy as sortByFunc } from 'underscore'

import { StackScreenProps } from '@react-navigation/stack'

import { DateTime } from 'luxon'

import { useTravelPayClaims } from 'api/travelPay'
import { Box, ErrorComponent, FeatureLandingTemplate, TextView } from 'components'
import { VAScrollViewProps } from 'components/VAScrollView'
import { NAMESPACE } from 'constants/namespaces'
import { HealthStackParamList } from 'screens/HealthScreen/HealthStackScreens'
import TravelPayClaimsList from 'screens/HealthScreen/TravelPay/TravelPayClaims/TravelPayClaimsList'
import { ScreenIDTypesConstants } from 'store/api'
import TravelPayClaimsFilter, { SortOption, SortOptionType } from './TravelPayClaimsFilter'
import { TravelPayClaimData } from 'api/types'

type TravelPayClaimsProps = StackScreenProps<HealthStackParamList, 'TravelPayClaims'>

const filteredAndSortedClaims = (
  claims: Array<TravelPayClaimData>,
  filter: Set<string>,
  sortBy: SortOptionType,
) => {
  if (filter.size === 0) {
    return claims;
  }

  let result = claims.filter(claim => {
    return filter.has(claim.attributes.claimStatus) 
  });


  result = sortByFunc(result, (claim) => {
    switch (sortBy) {
      case SortOption.Recent:
        return -claim.attributes.createdOn;
      case SortOption.Oldest:
        return claim.attributes.createdOn;
      default:
        return 0;
    }
  });
  return result;
}

function TravelPayClaimsScreen({ navigation }: TravelPayClaimsProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()

  const [filter, setFilter] = useState<Set<string>>(new Set())
  const [sortBy, setSortBy] = useState(SortOption.Recent);

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

  const filteredClaims = useMemo(() => 
    filteredAndSortedClaims(claims, filter, sortBy), [claims, filter, sortBy]
  )

  const scrollViewRef = useRef<ScrollView | null>(null)
  const scrollViewProps: VAScrollViewProps = {
    scrollViewRef: scrollViewRef,
  }

  const listTitle = () => {
    return t('travelPay.statusList.list.title', {
      count: filteredClaims.length,
      filter: filter.size > 0 ? 'Filtered' : 'All',
      sort: t(`travelPay.statusList.sortOption.${sortBy}`).toLowerCase()
    })
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
            filter={filter}
            setFilter={setFilter}
            sortBy={sortBy}
            setSortBy={setSortBy}
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
