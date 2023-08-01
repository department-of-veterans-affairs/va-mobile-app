import { StackScreenProps } from '@react-navigation/stack'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import React, { FC, useEffect } from 'react'

import { Box, FeatureLandingTemplate, TextArea, TextView, TextViewProps } from 'components'
import { DIRECT_DEPOSIT } from 'constants/common'
import { NAMESPACE } from 'constants/namespaces'
import { PaymentState, getPayment } from 'store/slices'
import { PaymentsAttributeData } from 'store/api'
import { PaymentsStackParamList } from '../../PaymentsStackScreens'
import { Pressable } from 'react-native'
import { RootState } from 'store'
import { formatDateUtc } from 'utils/formattingUtils'
import { testIdProps } from 'utils/accessibility'
import { useAppDispatch, useRouteNavigation, useTheme } from 'utils/hooks'

type PaymentDetailsScreenProps = StackScreenProps<PaymentsStackParamList, 'PaymentDetails'>

const PaymentDetailsScreen: FC<PaymentDetailsScreenProps> = ({ navigation, route }) => {
  const { paymentID } = route.params
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const navigateTo = useRouteNavigation()

  const placeHolder = t('noneNoted')
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
    <FeatureLandingTemplate backLabel={t('history.title')} backLabelOnPress={navigation.goBack} title={t('paymentDetails.title')}>
      <Box mb={contentMarginBottom}>
        <TextArea>
          <TextView variant="MobileBody" mb={standardMarginBetween}>
            {formatDateUtc(date, 'MMMM d, yyyy')}
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
          <Pressable
            onPress={navigateTo('PaymentIssue')}
            {...testIdProps(t('payments.ifMyPaymentDoesNotLookRight'))}
            testID="paymentInfoIncorrectTestID"
            accessibilityRole="link"
            accessible={true}>
            <TextView {...textViewProps}>{t('payments.ifMyPaymentDoesNotLookRight')}</TextView>
          </Pressable>
        </Box>
      </Box>
    </FeatureLandingTemplate>
  )
}

export default PaymentDetailsScreen
