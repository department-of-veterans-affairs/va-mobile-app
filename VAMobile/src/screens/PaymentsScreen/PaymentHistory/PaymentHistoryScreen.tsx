import React, { ReactNode, useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable } from 'react-native'

import { StackScreenProps } from '@react-navigation/stack'

import { map } from 'underscore'

import { usePayments } from 'api/payments'
import { PaymentsData } from 'api/types'
import {
  Box,
  ErrorComponent,
  FeatureLandingTemplate,
  LoadingComponent,
  Pagination,
  PaginationProps,
  TextView,
  TextViewProps,
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
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const navigateTo = useRouteNavigation()
  const { standardMarginBetween, gutter } = theme.dimensions
  const [page, setPage] = useState(1)
  const [yearPickerOption, setYearPickerOption] = useState<yearsDatePickerOption>()
  const [pickerOptions, setpickerOptions] = useState<Array<yearsDatePickerOption>>([])
  const paymentsInDowntime = useDowntime(DowntimeFeatureTypeConstants.payments)
  const {
    data: payments,
    isLoading: loading,
    error: hasError,
    refetch: refetchPayments,
  } = usePayments(yearPickerOption?.label, page, { enabled: !paymentsInDowntime })
  const noPayments = payments?.meta.availableYears?.length === 0

  type yearsDatePickerOption = {
    label: string
    value: string
    a11yLabel: string
  }

  const getPickerOptions = useCallback((): Array<yearsDatePickerOption> => {
    if (payments?.meta.availableYears) {
      return map(payments.meta.availableYears, (item) => {
        const year = item.toString()
        return {
          label: year,
          value: year,
          a11yLabel: year,
        }
      })
    }
    return []
  }, [payments])

  useEffect(() => {
    if (pickerOptions.length === 0 && getPickerOptions().length > 0) {
      setpickerOptions(getPickerOptions())
    }
  }, [payments?.meta.availableYears, getPickerOptions, pickerOptions])

  useEffect(() => {
    setYearPickerOption(pickerOptions[0])
  }, [pickerOptions])

  const setValuesOnPickerSelect = (selectValue: string): void => {
    const curSelectedRange = pickerOptions.find((el) => el.value === selectValue)
    if (curSelectedRange) {
      setYearPickerOption(curSelectedRange)
      setPage(1)
    }
  }

  const onPaymentPress = (payment: PaymentsData): void => {
    navigateTo('PaymentDetails', { payment })
  }

  const textViewProps: TextViewProps = {
    variant: 'MobileBody',
    textDecoration: 'underline',
    textDecorationColor: 'link',
    color: 'link',
    accessibilityRole: 'link',
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

  if (hasError || paymentsInDowntime) {
    return (
      <FeatureLandingTemplate
        backLabel={t('payments.title')}
        backLabelOnPress={navigation.goBack}
        title={t('history.title')}>
        <ErrorComponent
          screenID={ScreenIDTypesConstants.PAYMENTS_SCREEN_ID}
          error={hasError}
          onTryAgain={refetchPayments}
        />
      </FeatureLandingTemplate>
    )
  }

  if (loading) {
    return (
      <FeatureLandingTemplate
        backLabel={t('payments.title')}
        backLabelOnPress={navigation.goBack}
        title={t('history.title')}>
        <LoadingComponent text={t('payments.loading')} />
      </FeatureLandingTemplate>
    )
  }

  if (noPayments) {
    return (
      <FeatureLandingTemplate
        backLabel={t('payments.title')}
        backLabelOnPress={navigation.goBack}
        title={t('history.title')}>
        <NoPaymentsScreen />
      </FeatureLandingTemplate>
    )
  }

  return (
    <FeatureLandingTemplate
      backLabel={t('payments.title')}
      backLabelOnPress={navigation.goBack}
      title={t('history.title')}
      testID="paymentHistoryTestID">
      <Box mx={gutter} mb={standardMarginBetween}>
        <Pressable
          onPress={() => navigateTo('PaymentMissing')}
          accessibilityRole="link"
          accessible={true}
          testID="missingPaymentsTestID">
          <TextView {...textViewProps}>{t('payments.ifIAmMissingPayemt')}</TextView>
        </Pressable>
      </Box>
      <Box mx={gutter} mb={standardMarginBetween}>
        <VAModalPicker {...pickerProps} key={yearPickerOption?.value} />
      </Box>
      {getPaymentsData()}
      {renderPagination()}
    </FeatureLandingTemplate>
  )
}

export default PaymentHistoryScreen
