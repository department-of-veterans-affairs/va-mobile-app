import React, { useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native'

import { StackScreenProps } from '@react-navigation/stack'

import { DateTime } from 'luxon'

import { useTravelPayClaims } from 'api/travelPay'
import { Box, ErrorComponent, FeatureLandingTemplate, TextView } from 'components'
import { VAScrollViewProps } from 'components/VAScrollView'
import { NAMESPACE } from 'constants/namespaces'
import { HealthStackParamList } from 'screens/HealthScreen/HealthStackScreens'
import TravelPayClaimsFilter, { SortOption } from 'screens/HealthScreen/TravelPay/TravelPayClaims/TravelPayClaimsFilter'
import { FILTER_KEY_ALL } from 'screens/HealthScreen/TravelPay/TravelPayClaims/TravelPayClaimsFilterModal'
import TravelPayClaimsList from 'screens/HealthScreen/TravelPay/TravelPayClaims/TravelPayClaimsList'
import { ScreenIDTypesConstants } from 'store/api'
import { useTheme } from 'utils/hooks'
import { filteredClaims, sortedClaims } from 'utils/travelPay'

type TravelPayClaimsProps = StackScreenProps<HealthStackParamList, 'TravelPayClaims'>

function TravelPayClaimsScreen({ navigation }: TravelPayClaimsProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()

  const scrollViewRef = useRef<ScrollView | null>(null)
  const scrollViewProps: VAScrollViewProps = {
    scrollViewRef: scrollViewRef,
  }
  const [filter, setFilter] = useState<Set<string>>(new Set())
  const [sortBy, setSortBy] = useState(SortOption.Recent)

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

  const claims = useMemo(() => claimsPayload?.data ?? [], [claimsPayload])

  // Filter and sort the claims based on the selections
  const sortedFilteredClaims = useMemo(() => {
    return claims.length === 0 ? claims : sortedClaims(filteredClaims(claims, filter), sortBy)
  }, [claims, filter, sortBy])

  const listTitle = () => {
    return t('travelPay.statusList.list.title', {
      count: sortedFilteredClaims.length,
      filter: filter.has(FILTER_KEY_ALL) || filter.size === 0 ? 'All' : 'Filtered',
      sort: t(`travelPay.statusList.sortOption.${sortBy}`).toLowerCase(),
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
          <TravelPayClaimsList claims={sortedFilteredClaims} isLoading={isLoading} scrollViewRef={scrollViewRef} />
        </Box>
      )}
    </FeatureLandingTemplate>
  )
}

export default TravelPayClaimsScreen
