import { DateTime } from 'luxon'
import { Pressable } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack'
import { isEmpty } from 'underscore'
import { useSelector } from 'react-redux'
import React, { FC, ReactNode, useCallback, useEffect, useState } from 'react'

import { Box, ErrorComponent, LoadingComponent, Pagination, PaginationProps, TextView, TextViewProps, VAModalPicker, VAModalPickerProps, VAScrollView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { PaymentState, getPayments } from 'store/slices'
import { PaymentsByDate, ScreenIDTypesConstants } from 'store/api'
import { ProfileStackParamList } from '../ProfileStackScreens'
import { RootState } from 'store'
import { deepCopyObject } from 'utils/common'
import { getGroupedPayments } from 'utils/payments'
import { testIdProps } from 'utils/accessibility'
import { useAppDispatch, useError, useRouteNavigation, useTheme, useTranslation } from 'utils/hooks'
import NoPaymentsScreen from './NoPayments/NoPaymentsScreen'

type PaymentScreenProps = StackScreenProps<ProfileStackParamList, 'Payments'>

const PaymentScreen: FC<PaymentScreenProps> = () => {
  const t = useTranslation(NAMESPACE.PROFILE)
  const tc = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const navigateTo = useRouteNavigation()
  const { standardMarginBetween, gutter, contentMarginTop } = theme.dimensions
  const { currentPagePayments, currentPagePagination, loading } = useSelector<RootState, PaymentState>((state) => state.payments)
  const newCurrentPagePayments = deepCopyObject<PaymentsByDate>(currentPagePayments)
  const noPayments = false // this will change when backend integration
  const todaysDate = DateTime.local()
  const currentYear = todaysDate.get('year').toString()

  type yearsDatePickerOption = {
    label: string
    value: string
    a11yLabel: string
  }

  const getPickerOptions = (): Array<yearsDatePickerOption> => {
    return [
      {
        label: currentYear,
        value: currentYear,
        a11yLabel: currentYear,
      },
      {
        label: '2021',
        value: '2021',
        a11yLabel: '2021',
      },
      {
        label: '2020',
        value: '2020',
        a11yLabel: '2020',
      },
    ]
  }

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

  const pickerOptions = getPickerOptions()
  const [yearPickerOption, setYearPickerOption] = useState(pickerOptions[0])

  const textViewProps: TextViewProps = {
    variant: 'MobileBody',
    textDecoration: 'underline',
    textDecorationColor: 'link',
    color: 'link',
    accessibilityRole: 'link',
    ...testIdProps(t('payments.ifIAmMissingPayemt')),
  }

  const pickerProps: VAModalPickerProps = {
    labelKey: 'profile:payments.pickerLabel',
    selectedValue: yearPickerOption.value,
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
    return getGroupedPayments(newCurrentPagePayments, theme, { t, tc }, onPaymentPress, true, currentPagePagination)
  }

  const fetchPayments = useCallback(
    (requestedPage = 1, year: string = yearPickerOption.value) => {
      // request the next page
      dispatch(getPayments(year, requestedPage))
    },
    [dispatch, yearPickerOption.value],
  )

  // Render pagination for payments
  const renderPagination = (): ReactNode => {
    const page = currentPagePagination?.currentPage || 1
    const paginationProps: PaginationProps = {
      onNext: () => {
        fetchPayments(page + 1)
      },
      onPrev: () => {
        fetchPayments(page - 1)
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
    fetchPayments()
  }, [dispatch, fetchPayments])

  if (useError(ScreenIDTypesConstants.PAYMENTS_SCREEN_ID)) {
    return <ErrorComponent screenID={ScreenIDTypesConstants.PAYMENTS_SCREEN_ID} />
  }

  if (loading) {
    return <LoadingComponent text={t('payments.loading')} />
  }

  if (noPayments) {
    return <NoPaymentsScreen />
  }

  return (
    <VAScrollView>
      <Box {...testIdProps('', false, 'payments-page')}>
        <Box mx={gutter} mb={standardMarginBetween} mt={contentMarginTop}>
          <Pressable onPress={navigateTo('PaymentMissing')} {...testIdProps(t('payments.ifIAmMissingPayemt'))} accessibilityRole="link" accessible={true}>
            <TextView {...textViewProps}>{t('payments.ifIAmMissingPayemt')}</TextView>
          </Pressable>
        </Box>
        <Box mx={gutter} mb={standardMarginBetween}>
          <VAModalPicker {...pickerProps} />
        </Box>
      </Box>
      {getPaymentsData()}
      {renderPagination()}
    </VAScrollView>
  )
}

export default PaymentScreen
