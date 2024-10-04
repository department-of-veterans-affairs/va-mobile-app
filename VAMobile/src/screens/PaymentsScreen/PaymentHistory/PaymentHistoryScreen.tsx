import React, { ReactNode, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { StackScreenProps } from '@react-navigation/stack'

import { useAuthorizedServices } from 'api/authorizedServices/getAuthorizedServices'
import { usePayments } from 'api/payments'
import { PaymentsData } from 'api/types'
import {
  Box,
  ErrorComponent,
  FeatureLandingTemplate,
  LinkWithAnalytics,
  LoadingComponent,
  Pagination,
  PaginationProps,
  PickerItem,
  VAModalPicker,
  VAModalPickerProps,
} from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { DowntimeFeatureTypeConstants, ScreenIDTypesConstants } from 'store/api/types'
import { useDowntime, useRouteNavigation, useTheme } from 'utils/hooks'
import { getGroupedPayments } from 'utils/payments'

import { PaymentsStackParamList } from '../PaymentsStackScreens'
import NoPaymentsScreen from './NoPayments/NoPaymentsScreen'

type PaymentHistoryScreenProps = StackScreenProps<PaymentsStackParamList, 'PaymentHistory'>

function PaymentHistoryScreen({ navigation }: PaymentHistoryScreenProps) {
  const { data: userAuthorizedServices } = useAuthorizedServices()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const navigateTo = useRouteNavigation()
  const { standardMarginBetween, gutter } = theme.dimensions
  const [page, setPage] = useState(1)
  const [yearPickerOption, setYearPickerOption] = useState<PickerItem>()
  const [pickerOptions, setPickerOptions] = useState<Array<PickerItem>>([])
  const [selectedYear, setSelectedYear] = useState<string>()
  const paymentsInDowntime = useDowntime(DowntimeFeatureTypeConstants.payments)
  const accessToPaymentHistory = userAuthorizedServices?.paymentHistory
  const {
    data: payments,
    isFetching: loading,
    error: hasError,
    refetch: refetchPayments,
  } = usePayments(selectedYear, page)
  const noPayments = payments?.meta.availableYears?.length === 0

  useEffect(() => {
    if (!pickerOptions.length && payments?.meta.availableYears?.length) {
      const years = payments.meta.availableYears.map((yearNumber) => {
        const year = yearNumber.toString()
        return {
          label: year,
          value: year,
        }
      })
      setPickerOptions(years)
      setYearPickerOption(years[0])
    }
  }, [payments?.meta.availableYears, pickerOptions])

  const setValuesOnPickerSelect = (selectValue: string): void => {
    const curSelectedRange = pickerOptions.find((el) => el.value === selectValue)
    if (curSelectedRange) {
      setYearPickerOption(curSelectedRange)
      setPage(1)
      setSelectedYear(curSelectedRange.value)
    }
  }

  const onPaymentPress = (payment: PaymentsData): void => {
    navigateTo('PaymentDetails', { payment })
  }

  const pickerProps: VAModalPickerProps = {
    labelKey: 'payments.pickerLabel',
    selectedValue: yearPickerOption?.value || '',
    onSelectionChange: setValuesOnPickerSelect,
    pickerOptions,
    testID: 'selectAYearTestID',
  }

  const getPaymentsData = (): ReactNode => {
    if (payments?.data.length === 0 || !payments?.paymentsByDate || !payments.meta.pagination) {
      return (
        <Box mt={theme.dimensions.standardMarginBetween}>
          <></>
        </Box>
      )
    }
    return getGroupedPayments(payments.paymentsByDate, theme, { t }, onPaymentPress, true, payments.meta.pagination)
  }

  // Render pagination for payments
  const renderPagination = (): ReactNode => {
    const paginationProps: PaginationProps = {
      onNext: () => {
        setPage(page + 1)
      },
      onPrev: () => {
        setPage(page - 1)
      },
      totalEntries: payments?.meta.pagination?.totalEntries || 0,
      pageSize: payments?.meta.pagination?.perPage || 0,
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

  const hasErrorOrDowntime = hasError || paymentsInDowntime

  return (
    <FeatureLandingTemplate
      backLabel={t('payments.title')}
      backLabelOnPress={navigation.goBack}
      title={t('history.title')}
      testID="paymentHistoryTestID">
      {loading ? (
        <LoadingComponent text={t('payments.loading')} />
      ) : hasErrorOrDowntime ? (
        <ErrorComponent
          screenID={ScreenIDTypesConstants.PAYMENTS_SCREEN_ID}
          error={hasError}
          onTryAgain={refetchPayments}
        />
      ) : noPayments || !accessToPaymentHistory ? (
        <NoPaymentsScreen />
      ) : (
        <>
          <Box mx={gutter} mb={standardMarginBetween}>
            <LinkWithAnalytics
              type="custom"
              text={t('payments.ifIAmMissingPayemt')}
              onPress={() => navigateTo('PaymentMissing')}
              testID="missingPaymentsTestID"
            />
          </Box>
          <Box mx={gutter} mb={standardMarginBetween}>
            <VAModalPicker {...pickerProps} key={yearPickerOption?.value} />
          </Box>
          {getPaymentsData()}
          {renderPagination()}
        </>
      )}
    </FeatureLandingTemplate>
  )
}

export default PaymentHistoryScreen
