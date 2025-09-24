import React, { useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native'

import { StackScreenProps } from '@react-navigation/stack'

import { useTravelPayClaims } from 'api/travelPay'
import { TravelPayClaimData } from 'api/types'
import { Box, ErrorComponent, FeatureLandingTemplate, TextView } from 'components'
import { VAScrollViewProps } from 'components/VAScrollView'
import { DEFAULT_PAGE_SIZE } from 'constants/common'
import { NAMESPACE } from 'constants/namespaces'
import { TimeFrameType, TimeFrameTypeConstants } from 'constants/timeframes'
import { HealthStackParamList } from 'screens/HealthScreen/HealthStackScreens'
import TravelPayClaimsDatePicker from 'screens/HealthScreen/TravelPay/TravelPayClaims/TravelPayClaimsDatePicker'
import TravelPayClaimsFilter, { SortOption } from 'screens/HealthScreen/TravelPay/TravelPayClaims/TravelPayClaimsFilter'
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
          <TravelPayClaimsDatePicker
            onTimeFrameChanged={(value: TimeFrameType) => {
              setCurrentPage(1)
              setTimeFrame(value)
            }}
            setTimeFrame={setTimeFrame}
          />

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
            claims={sortedFilteredClaims}
            isLoading={isLoading || isFetchingNextPage}
            currentPage={currentPage}
            onNext={(nextPage) => {
              // If we need more data and we have more pages available, fetch it
              const nextPageStart = nextPage * DEFAULT_PAGE_SIZE
              if (nextPageStart >= claims.length && hasNextPage && fetchNextPage) {
                fetchNextPage()
              }
              scrollToTop()
              setCurrentPage(nextPage)
            }}
            onPrev={(prevPage) => {
              scrollToTop()
              setCurrentPage(prevPage)
            }}
          />
        </Box>
      )}
    </FeatureLandingTemplate>
  )
}

export default TravelPayClaimsScreen
