import { Pressable } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack'
import { isEmpty, map } from 'underscore'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import React, { FC, ReactNode, useCallback, useEffect, useState } from 'react'

import { Box, ErrorComponent, FeatureLandingTemplate, LoadingComponent, Pagination, PaginationProps, TextView, TextViewProps, VAModalPicker, VAModalPickerProps } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { PaymentState, getPayments } from 'store/slices'
import { PaymentsByDate, ScreenIDTypesConstants } from 'store/api/types'
import { PaymentsStackParamList } from '../PaymentsStackScreens'
import { RootState } from 'store'
import { VATheme } from 'styles/theme'
import { deepCopyObject } from 'utils/common'
import { getGroupedPayments } from 'utils/payments'
import { testIdProps } from 'utils/accessibility'
import { useAppDispatch, useError, useRouteNavigation } from 'utils/hooks'
import { useTheme } from 'utils/hooks'
import NoPaymentsScreen from './NoPayments/NoPaymentsScreen'

type PaymentHistoryScreenProps = StackScreenProps<PaymentsStackParamList, 'PaymentHistory'>

const PaymentHistoryScreen: FC<PaymentHistoryScreenProps> = ({ navigation }) => {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const navigateTo = useRouteNavigation()
  const { currentPagePayments, currentPagePagination, loading, availableYears } = useSelector<RootState, PaymentState>((state) => state.payments)
  const newCurrentPagePayments = deepCopyObject<PaymentsByDate>(currentPagePayments)
  const noPayments = availableYears.length === 0

  const [yearPickerOption, setYearPickerOption] = useState<yearsDatePickerOption>()
  const [pickerOptions, setpickerOptions] = useState<Array<yearsDatePickerOption>>([])

  type yearsDatePickerOption = {
    label: string
    value: string
    a11yLabel: string
  }

  const getPickerOptions = useCallback((): Array<yearsDatePickerOption> => {
    return map(availableYears, (item) => {
      const year = item.toString()
      return {
        label: year,
        value: year,
        a11yLabel: year,
      }
    })
  }, [availableYears])

  const setValuesOnPickerSelect = (selectValue: string): void => {
    const curSelectedRange = pickerOptions.find((el) => el.value === selectValue)
    if (curSelectedRange) {
      setYearPickerOption(curSelectedRange)
      fetchPayments(1, curSelectedRange.value)
    }
  }

  const onPaymentPress = (paymentID: string): void => {
    navigateTo('PaymentDetails', { paymentID })()
  }

  const textViewProps: TextViewProps = {
    variant: 'MobileBody',
    textDecoration: 'underline',
    textDecorationColor: 'link',
    color: 'link',
    accessibilityRole: 'link',
    ...testIdProps(t('payments.ifIAmMissingPayemt')),
  }

  const pickerProps: VAModalPickerProps = {
    labelKey: 'common:payments.pickerLabel',
    selectedValue: yearPickerOption?.value || '',
    onSelectionChange: setValuesOnPickerSelect,
    pickerOptions,
  }

  const getPaymentsData = (): ReactNode => {
    const noCurrentPayments = !currentPagePayments || isEmpty(currentPagePayments)

    if (noCurrentPayments) {
      return (
        <Box mt={theme.dimensions.standardMarginBetween}>
          <></>
        </Box>
      )
    }
    return getGroupedPayments(newCurrentPagePayments, theme, { t }, onPaymentPress, true, currentPagePagination)
  }

  const fetchPayments = (requestedPage?: number, year?: string) => {
    // request the next page
    dispatch(getPayments(year, requestedPage, ScreenIDTypesConstants.PAYMENTS_SCREEN_ID))
  }

  // Render pagination for payments
  const renderPagination = (): ReactNode => {
    const page = currentPagePagination?.currentPage || 1
    const year = yearPickerOption?.value
    const paginationProps: PaginationProps = {
      onNext: () => {
        fetchPayments(page + 1, year)
      },
      onPrev: () => {
        fetchPayments(page - 1, year)
      },
      totalEntries: currentPagePagination?.totalEntries || 0,
      pageSize: currentPagePagination?.perPage || 0,
      page,
    }

    return (
      <Box flex={1} mt={theme.dimensions.paginationTopPadding} mb={theme.dimensions.contentMarginBottom} mx={theme.dimensions.gutter}>
        <Pagination {...paginationProps} />
      </Box>
    )
  }

  useEffect(() => {
    // if payments exists grab the latest year first page. Prevents from refetching the latest year first page if it does exists.
    const year = !noPayments ? availableYears[0] : undefined
    fetchPayments(1, year)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setpickerOptions(getPickerOptions())
  }, [availableYears, getPickerOptions])

  useEffect(() => {
    setYearPickerOption(pickerOptions[0])
  }, [pickerOptions])

  if (useError(ScreenIDTypesConstants.PAYMENTS_SCREEN_ID)) {
    return (
      <FeatureLandingTemplate backLabel={t('payments.title')} backLabelOnPress={navigation.goBack} title={t('history.title')}>
        <ErrorComponent screenID={ScreenIDTypesConstants.PAYMENTS_SCREEN_ID} />
      </FeatureLandingTemplate>
    )
  }

  if (loading) {
    return (
      <FeatureLandingTemplate backLabel={t('payments.title')} backLabelOnPress={navigation.goBack} title={t('history.title')}>
        <LoadingComponent text={t('payments.loading')} />
      </FeatureLandingTemplate>
    )
  }

  if (noPayments) {
    return (
      <FeatureLandingTemplate backLabel={t('payments.title')} backLabelOnPress={navigation.goBack} title={t('history.title')}>
        <NoPaymentsScreen />
      </FeatureLandingTemplate>
    )
  }

  return (
    <FeatureLandingTemplate backLabel={t('payments.title')} backLabelOnPress={navigation.goBack} title={t('history.title')}>
      <Box {...testIdProps('', false, 'payments-page')}>
        <Box mx={theme.dimensions.gutter} mb={theme.dimensions.standardMarginBetween} mt={theme.dimensions.contentMarginTop}>
          <Pressable onPress={navigateTo('PaymentMissing')} {...testIdProps(t('payments.ifIAmMissingPayemt'))} accessibilityRole="link" accessible={true}>
            <TextView {...textViewProps}>{t('payments.ifIAmMissingPayemt')}</TextView>
          </Pressable>
        </Box>
        <Box mx={theme.dimensions.gutter} mb={theme.dimensions.standardMarginBetween}>
          <VAModalPicker {...pickerProps} key={yearPickerOption?.value} />
        </Box>
      </Box>
      {getPaymentsData()}
      {renderPagination()}
    </FeatureLandingTemplate>
  )
}

export default PaymentHistoryScreen
