import React, { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native'

import { StackScreenProps } from '@react-navigation/stack'

import { useTravelPayClaims } from 'api/travelPay'
import { TravelPayClaimData } from 'api/types'
import { ErrorComponent, FeatureLandingTemplate } from 'components'
import { VAScrollViewProps } from 'components/VAScrollView'
import { DEFAULT_PAGE_SIZE } from 'constants/common'
import { NAMESPACE } from 'constants/namespaces'
import { TimeFrameType, TimeFrameTypeConstants } from 'constants/timeframes'
import { HealthStackParamList } from 'screens/HealthScreen/HealthStackScreens'
import TravelPayClaimsList from 'screens/HealthScreen/TravelPay/TravelPayClaims/TravelPayClaimsList'
import { ScreenIDTypesConstants } from 'store/api'

type TravelPayClaimsProps = StackScreenProps<HealthStackParamList, 'TravelPayClaims'>

const emptyClaims: Array<TravelPayClaimData> = []

function TravelPayClaimsScreen({ navigation }: TravelPayClaimsProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
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

  // Get total record count from the first page's metadata
  const totalRecordCount = claimsPayload?.pages?.[0]?.meta?.totalRecordCount

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
        <TravelPayClaimsList
          claims={claims}
          isLoading={isLoading || isFetchingNextPage}
          setTimeFrame={setTimeFrame}
          totalRecordCount={totalRecordCount}
          onNext={(nextPage) => {
            const nextPageStart = nextPage * DEFAULT_PAGE_SIZE

            // If we need more data and we have more pages available, fetch it
            if (nextPageStart >= claims.length && hasNextPage && fetchNextPage) {
              fetchNextPage()
            }
            scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: false })
          }}
          onPrev={() => {
            scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: false })
          }}
        />
      )}
    </FeatureLandingTemplate>
  )
}

export default TravelPayClaimsScreen
