import { StackScreenProps } from '@react-navigation/stack'
import { useSelector } from 'react-redux'
import React, { FC, useEffect } from 'react'

import { Box, TextArea, TextView, TextViewProps, VAScrollView } from 'components'
import { DIRECT_DEPOSIT } from 'constants/common'
import { NAMESPACE } from 'constants/namespaces'
import { PaymentState, getPayment } from 'store/slices'
import { PaymentsAttributeData } from 'store/api'
import { Pressable } from 'react-native'
import { ProfileStackParamList } from '../../ProfileStackScreens'
import { RootState } from 'store'
import { getFormattedDate } from 'utils/formattingUtils'
import { testIdProps } from 'utils/accessibility'
import { useAppDispatch, useRouteNavigation, useTheme, useTranslation } from 'utils/hooks'

type PaymentDetailsScreenProps = StackScreenProps<ProfileStackParamList, 'PaymentDetails'>

const PaymentDetailsScreen: FC<PaymentDetailsScreenProps> = ({ route }) => {
  const { paymentID } = route.params
  const t = useTranslation(NAMESPACE.PROFILE)
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const navigateTo = useRouteNavigation()

  const placeHolder = t('common:noneNoted')
  const { standardMarginBetween, contentMarginTop, contentMarginBottom, gutter } = theme.dimensions
  const { payment } = useSelector<RootState, PaymentState>((state) => state.payments)
  const { date, paymentType, paymentMethod, bank, account, amount } = payment?.attributes || ({} as PaymentsAttributeData)

  useEffect(() => {
    dispatch(getPayment(paymentID))
  }, [dispatch, paymentID])

  if (!payment) {
    return <></>
  }

  const verifyHasAccountNumber = (accountNumber: string | null): boolean => {
    if (!accountNumber) {
      return false
    }
    return /\d/.test(accountNumber)
  }

  const textViewProps: TextViewProps = {
    variant: 'MobileBody',
    textDecoration: 'underline',
    textDecorationColor: 'link',
    color: 'link',
    accessibilityRole: 'link',
    ...testIdProps(t('payments.ifIAmMissingPayemt')),
  }

  const isDirectDeposit = paymentMethod === DIRECT_DEPOSIT
  const hasAcccountInfo = verifyHasAccountNumber(account)

  return (
    <VAScrollView {...testIdProps('payments-details-page')}>
      <Box mt={contentMarginTop} mb={contentMarginBottom}>
        <TextArea>
          <TextView color="primary" variant="MobileBody" mb={standardMarginBetween}>
            {getFormattedDate(date, 'MMMM d, yyyy')}
          </TextView>
          <Box accessibilityRole="header" accessible={true} mb={standardMarginBetween}>
            <TextView variant="BitterBoldHeading">{paymentType}</TextView>
          </Box>
          <TextView variant="MobileBodyBold" selectable={true}>
            {t('paymentDetails.amount')}
          </TextView>
          <TextView variant="MobileBody" selectable={true} mb={standardMarginBetween}>
            {amount}
          </TextView>
          <TextView variant="MobileBodyBold" selectable={true}>
            {t('paymentDetails.method')}
          </TextView>
          <TextView variant="MobileBody" selectable={true}>
            {paymentMethod}
          </TextView>
          {isDirectDeposit && (
            <>
              <TextView variant="MobileBodyBold" mt={standardMarginBetween}>
                {t('paymentDetails.bank')}
              </TextView>
              <TextView variant="MobileBody" selectable={true} mb={standardMarginBetween}>
                {bank || placeHolder}
              </TextView>
              <TextView variant="MobileBodyBold">{t('paymentDetails.account')}</TextView>
              <TextView variant="MobileBody" selectable={true}>
                {hasAcccountInfo ? account : placeHolder}
              </TextView>
            </>
          )}
        </TextArea>
        <Box mx={gutter} mt={contentMarginTop}>
          <Pressable onPress={navigateTo('PaymentIssue')} {...testIdProps(t('payments.ifMyPaymentDoesNotLookRight'))} accessibilityRole="link" accessible={true}>
            <TextView {...textViewProps}>{t('payments.ifMyPaymentDoesNotLookRight')}</TextView>
          </Pressable>
        </Box>
      </Box>
    </VAScrollView>
  )
}

export default PaymentDetailsScreen
