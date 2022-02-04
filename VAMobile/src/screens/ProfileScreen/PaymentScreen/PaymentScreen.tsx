import { DateTime } from 'luxon'
import { Pressable } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack'
import { isEmpty } from 'underscore'
import { useSelector } from 'react-redux'
import React, { FC, ReactNode, useEffect, useState } from 'react'

import { Box, LoadingComponent, TextView, TextViewProps, VAModalPicker, VAModalPickerProps, VAScrollView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { PaymentState, getPayments } from 'store/slices'
import { PaymentsByDate } from 'store/api'
import { ProfileStackParamList } from '../ProfileStackScreens'
import { RootState } from 'store'
import { deepCopyObject } from 'utils/common'
import { getGroupedPayments } from 'utils/payments'
import { testIdProps } from 'utils/accessibility'
import { useAppDispatch, useRouteNavigation, useTheme, useTranslation } from 'utils/hooks'

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

  useEffect(() => {
    dispatch(getPayments('2021', 1))
  }, [dispatch])

  type yearsDatePickerOption = {
    label: string
    value: string
    a11yLabel: string
  }

  const getPickerOptions = (): Array<yearsDatePickerOption> => {
    const todaysDate = DateTime.local()
    const currentYear = todaysDate.get('year').toString()

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
    ]
  }

  const setValuesOnPickerSelect = (selectValue: string): void => {
    const curSelectedRange = pickerOptions.find((el) => el.value === selectValue)
    if (curSelectedRange) {
      setYearPickerOption(curSelectedRange)
    }
  }

  const onPaymentPress = (paymentID: string): void => {
    navigateTo('PaymentDetails', { paymentID })()
  }

  const pickerOptions = getPickerOptions()
  const [yearPickerOption, setYearPickerOption] = useState(pickerOptions[1])

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
    const noPayments = !currentPagePayments || isEmpty(currentPagePayments)

    if (noPayments) {
      return (
        <Box mt={theme.dimensions.standardMarginBetween}>
          <></>
        </Box>
      )
    }
    return getGroupedPayments(newCurrentPagePayments, theme, { t, tc }, onPaymentPress, true, currentPagePagination)
  }

  if (loading) {
    return <LoadingComponent text={t('payments.loading')} />
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
    </VAScrollView>
  )
}

export default PaymentScreen
