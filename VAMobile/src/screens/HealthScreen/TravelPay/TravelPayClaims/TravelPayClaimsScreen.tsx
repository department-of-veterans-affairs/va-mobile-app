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
import { TravelClaimsScreenEntry } from 'constants/travelPay'
import { BenefitsStackParamList } from 'screens/BenefitsScreen/BenefitsStackScreens'
import { HealthStackParamList } from 'screens/HealthScreen/HealthStackScreens'
import TravelPayClaimsList from 'screens/HealthScreen/TravelPay/TravelPayClaims/TravelPayClaimsList'
import { PaymentsStackParamList } from 'screens/PaymentsScreen/PaymentsStackScreens'
import { ScreenIDTypesConstants } from 'store/api'

type TravelPayClaimsProps = StackScreenProps<
  HealthStackParamList | BenefitsStackParamList | PaymentsStackParamList,
  'TravelPayClaims'
>

const backLabelForNavigation = {
  [TravelClaimsScreenEntry.Health]: 'health.title',
  [TravelClaimsScreenEntry.Claims]: 'claims.title',
  [TravelClaimsScreenEntry.Payments]: 'payments.title',
  [TravelClaimsScreenEntry.AppointmentDetail]: 'appointments.appointment',
}

const emptyClaims: Array<TravelPayClaimData> = []

function TravelPayClaimsScreen({ navigation, route }: TravelPayClaimsProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const backLabelKey = backLabelForNavigation[route.params?.from ?? TravelClaimsScreenEntry.Health]

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
  const totalRecordCount = claimsPayload?.pages?.[0]?.meta?.totalRecordCount ?? 0

  const scrollViewRef = useRef<ScrollView | null>(null)
  const scrollViewProps: VAScrollViewProps = {
    scrollViewRef: scrollViewRef,
  }

  const scrollToTop = () => {
    scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: false })
  }

  return (
    <FeatureLandingTemplate
      backLabel={t(backLabelKey)}
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
            scrollToTop()
          }}
          onPrev={scrollToTop}
        />
      )}
    </FeatureLandingTemplate>
  )
}

export default TravelPayClaimsScreen
