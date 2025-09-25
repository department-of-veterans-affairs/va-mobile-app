import React, { useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native'

import { StackScreenProps } from '@react-navigation/stack'

import { useTravelPayClaims } from 'api/travelPay'
import { TravelPayClaimData } from 'api/types'
import { Box, ErrorComponent, FeatureLandingTemplate, LoadingComponent, TextView } from 'components'
import { VAScrollViewProps } from 'components/VAScrollView'
import { DEFAULT_PAGE_SIZE } from 'constants/common'
import { NAMESPACE } from 'constants/namespaces'
import { TimeFrameType, TimeFrameTypeConstants } from 'constants/timeframes'
import { HealthStackParamList } from 'screens/HealthScreen/HealthStackScreens'
import NoTravelClaimsFound from 'screens/HealthScreen/TravelPay/TravelPayClaims/NoTravelClaims'
import TravelPayClaimsDatePicker from 'screens/HealthScreen/TravelPay/TravelPayClaims/TravelPayClaimsDatePicker'
import TravelPayClaimsFilter, {
  SortOption,
  SortOptionType,
} from 'screens/HealthScreen/TravelPay/TravelPayClaims/TravelPayClaimsFilter'
import TravelPayClaimsList from 'screens/HealthScreen/TravelPay/TravelPayClaims/TravelPayClaimsList'
import { ScreenIDTypesConstants } from 'store/api'
import { useTheme } from 'utils/hooks'
import { filteredClaims, sortedClaims } from 'utils/travelPay'

type TravelPayClaimsProps = StackScreenProps<HealthStackParamList, 'TravelPayClaims'>

const emptyClaims: Array<TravelPayClaimData> = []

function TravelPayClaimsScreen({ navigation }: TravelPayClaimsProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()

  const scrollViewRef = useRef<ScrollView | null>(null)
  const scrollViewProps: VAScrollViewProps = {
    scrollViewRef: scrollViewRef,
  }
  const [filter, setFilter] = useState<Set<string>>(new Set())
  const [sortBy, setSortBy] = useState(SortOption.Recent)
  const [currentPage, setCurrentPage] = useState(1)

  const [timeFrame, setTimeFrame] = useState<TimeFrameType>(TimeFrameTypeConstants.PAST_THREE_MONTHS)

  const {
    data: claimsPayload,
    isLoading,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useTravelPayClaims(timeFrame)

  // Flatten all pages of data into a single array
  const claims = claimsPayload?.pages?.flatMap((page) => page?.data ?? emptyClaims) ?? emptyClaims
  const totalClaims = claimsPayload?.pages?.[0]?.meta?.totalRecordCount ?? 0
  const loading = isLoading || isFetchingNextPage

  // Filter and sort the claims based on the selections
  const sortedFilteredClaims = useMemo(() => {
    return claims.length === 0 ? claims : sortedClaims(filteredClaims(claims, filter), sortBy)
  }, [claims, filter, sortBy])

  const uniqueStatuses = useMemo(() => {
    return new Set(claims.map(({ attributes }) => attributes.claimStatus))
  }, [claims])

  const listTitle = () => {
    return t('travelPay.statusList.list.title', {
      count: sortedFilteredClaims.length,
      filter: filter.size === 0 || filter.size === uniqueStatuses.size ? 'All' : 'Filtered',
      sort: t(`travelPay.statusList.sortOption.${sortBy}`).toLowerCase(),
    })
  }

  const scrollToTop = () => {
    scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: false })
  }

  const onTimeFrameChanged = (value: TimeFrameType) => {
    setCurrentPage(1)
    setTimeFrame(value)
  }

  const onFilterChanged = (value: Set<string>) => {
    setFilter(value)
    setCurrentPage(1)
  }

  const onSortByChanged = (value: SortOptionType) => {
    setSortBy(value)
    setCurrentPage(1)
  }

  const onNextPage = (nextPage: number) => {
    // If we need more data and we have more pages available, fetch it
    const nextPageStart = nextPage * DEFAULT_PAGE_SIZE
    if (nextPageStart >= claims.length && hasNextPage && fetchNextPage) {
      fetchNextPage()
    }
    scrollToTop()
    setCurrentPage(nextPage)
  }

  const onPrevPage = (prevPage: number) => {
    scrollToTop()
    setCurrentPage(prevPage)
  }

  return (
    <FeatureLandingTemplate
      backLabel={t('health.title')}
      backLabelOnPress={navigation.goBack}
      title={t('travelPay.statusList.title')}
      testID="travelPayClaimsTestID"
      scrollViewProps={scrollViewProps}>
      {/* Error */}
      {error ? (
        <ErrorComponent
          onTryAgain={refetch}
          screenID={ScreenIDTypesConstants.TRAVEL_PAY_CLAIMS_SCREEN_ID}
          error={error}
        />
      ) : loading ? (
        <LoadingComponent text={t('travelPay.statusList.loading')} />
      ) : (
        <Box>
          <TravelPayClaimsDatePicker timeFrame={timeFrame} onTimeFrameChanged={onTimeFrameChanged} />

          {totalClaims === 0 ? (
            <NoTravelClaimsFound />
          ) : (
            <>
              <Box mx={theme.dimensions.gutter} mt={theme.dimensions.standardMarginBetween} accessible={true}>
                <TextView
                  mx={2}
                  mb={theme.dimensions.condensedMarginBetween}
                  accessibilityRole="header"
                  variant={'MobileBodyBold'}>
                  {listTitle()}
                </TextView>
              </Box>

              <TravelPayClaimsFilter
                claims={claims}
                totalClaims={totalClaims}
                filter={filter}
                onFilterChanged={onFilterChanged}
                sortBy={sortBy}
                onSortByChanged={onSortByChanged}
              />

              <TravelPayClaimsList
                claims={sortedFilteredClaims}
                currentPage={currentPage}
                onNext={onNextPage}
                onPrev={onPrevPage}
              />
            </>
          )}
        </Box>
      )}
    </FeatureLandingTemplate>
  )
}

export default TravelPayClaimsScreen
