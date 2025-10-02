import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native'

import { StackScreenProps } from '@react-navigation/stack'

import { IconProps } from '@department-of-veterans-affairs/mobile-component-library'

import { useMedicalCopays } from 'api/medicalCopays'
import { MedicalCopayRecord } from 'api/types'
import { Box, FeatureLandingTemplate, LoadingComponent, Pagination, PaginationProps, TextView } from 'components'
import EmptyStateMessage from 'components/EmptyStateMessage'
import { VAScrollViewProps } from 'components/VAScrollView'
import { DEFAULT_PAGE_SIZE } from 'constants/common'
import { NAMESPACE } from 'constants/namespaces'
import CopayCard from 'screens/PaymentsScreen/Copays/CopayCard/CopayCard'
import CopayErrorStates from 'screens/PaymentsScreen/Copays/CopayErrorStates/CopayErrorStates'
import { PaymentsStackParamList } from 'screens/PaymentsScreen/PaymentsStackScreens'
import { sortStatementsByDate, uniqBy } from 'utils/copays'
import { useRouteNavigation, useTheme } from 'utils/hooks'

type CopaysScreenProps = StackScreenProps<PaymentsStackParamList, 'Copays'>

function CopaysScreen({ navigation }: CopaysScreenProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const navigateTo = useRouteNavigation()

  const { data: copaysData, isFetching: loadingCopays, error: copaysError } = useMedicalCopays()

  const copays = copaysData?.data ?? []
  const isEmpty = copays.length === 0

  const scrollViewRef = useRef<ScrollView | null>(null)
  const scrollViewProps: VAScrollViewProps = {
    scrollViewRef: scrollViewRef,
  }
  const [page, setPage] = useState(1)
  const { perPage, totalEntries } = {
    perPage: DEFAULT_PAGE_SIZE,
    totalEntries: copaysData?.data.length || 0,
  }
  const [copaysToShow, setCopaysToShow] = useState<MedicalCopayRecord[]>([])
  const sortedCopays = sortStatementsByDate(copays ?? [])
  const copaysByUniqueFacility = uniqBy(sortedCopays, (c) => c.pSFacilityNum)

  useEffect(() => {
    const copaysList = copaysByUniqueFacility?.slice((page - 1) * perPage, page * perPage)
    setCopaysToShow(copaysList || [])
  }, [copaysData, page, perPage])

  const helpIconProps: IconProps = {
    name: 'HelpOutline',
    fill: theme.colors.icon.active,
  }

  const headerButton = {
    label: t('help'),
    icon: helpIconProps,
    onPress: () => {
      navigateTo('CopayHelp')
    },
    testID: 'copayHelpID',
  }

  function renderPagination() {
    const paginationProps: PaginationProps = {
      onNext: () => {
        setPage(page + 1)
        scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: false })
      },
      onPrev: () => {
        setPage(page - 1)
        scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: false })
      },
      totalEntries: totalEntries,
      pageSize: perPage,
      page,
    }

    return (
      <Box
        flex={1}
        mt={theme.dimensions.paginationTopPadding}
        mb={theme.dimensions.contentMarginBottom}
        mx={theme.dimensions.gutter}>
        <Pagination {...paginationProps} />
      </Box>
    )
  }

  const renderContent = () => {
    return (
      <Box mx={theme.dimensions.gutter}>
        <TextView variant="MobileBodyBold">{t('copays.subtitle')}</TextView>
        <TextView mb={theme.dimensions.standardMarginBetween} variant="MobileBody">
          {t('copays.subtitle.description')}
        </TextView>
        {copaysToShow.map((copay, idx) => (
          <CopayCard key={idx} copay={copay} index={idx} totalCopays={copays.length} />
        ))}
      </Box>
    )
  }

  return (
    <FeatureLandingTemplate
      headerButton={headerButton}
      backLabel={t('payments.title')}
      backLabelOnPress={navigation.goBack}
      scrollViewProps={scrollViewProps}
      title={t('copays.title')}
      testID="copaysTestID"
      backLabelTestID="copaysBackTestID">
      {loadingCopays ? (
        <LoadingComponent text={t('copays.loading')} />
      ) : copaysError ? (
        <CopayErrorStates copaysError={copaysError} />
      ) : isEmpty ? (
        <EmptyStateMessage title={t('copays.none.header')} body={t('copays.none.message')} phone={t('8664001238')} />
      ) : (
        <>
          {renderContent()}
          {renderPagination()}
        </>
      )}
    </FeatureLandingTemplate>
  )
}

export default CopaysScreen
