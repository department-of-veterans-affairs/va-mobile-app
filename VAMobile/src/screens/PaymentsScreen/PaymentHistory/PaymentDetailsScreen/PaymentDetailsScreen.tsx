import React from 'react'
import { useTranslation } from 'react-i18next'

import { useFocusEffect } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'

import { Box, FeatureLandingTemplate, LinkWithAnalytics, TextArea, TextView } from 'components'
import { DIRECT_DEPOSIT } from 'constants/common'
import { NAMESPACE } from 'constants/namespaces'
import { formatDateUtc } from 'utils/formattingUtils'
import { useRouteNavigation, useTheme } from 'utils/hooks'
import { registerReviewEvent } from 'utils/inAppReviews'

import { PaymentsStackParamList } from '../../PaymentsStackScreens'

type PaymentDetailsScreenProps = StackScreenProps<PaymentsStackParamList, 'PaymentDetails'>

function PaymentDetailsScreen({ navigation, route }: PaymentDetailsScreenProps) {
  const { payment } = route.params
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const navigateTo = useRouteNavigation()

  useFocusEffect(
    React.useCallback(() => {
      registerReviewEvent()
    }, []),
  )

  const placeHolder = t('noneNoted')
  const { standardMarginBetween, contentMarginTop, contentMarginBottom, gutter } = theme.dimensions
  const { date, paymentType, paymentMethod, bank, account, amount } = payment?.attributes

  const verifyHasAccountNumber = (accountNumber: string | null): boolean => {
    if (!accountNumber) {
      return false
    }
    return /\d/.test(accountNumber)
  }

  const isDirectDeposit = paymentMethod === DIRECT_DEPOSIT
  const hasAcccountInfo = verifyHasAccountNumber(account)

  return (
    <FeatureLandingTemplate
      backLabel={t('history.title')}
      backLabelOnPress={navigation.goBack}
      title={t('paymentDetails.title')}
      backLabelTestID="paymentDetailsBackID">
      <Box mb={contentMarginBottom}>
        <TextArea>
          <TextView variant="MobileBody" mb={standardMarginBetween}>
            {formatDateUtc(date, 'MMMM d, yyyy')}
          </TextView>
          <Box accessibilityRole="header" accessible={true} mb={standardMarginBetween}>
            <TextView variant="MobileBodyBold">{paymentType}</TextView>
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
          <LinkWithAnalytics
            type="custom"
            text={t('payments.ifMyPaymentDoesNotLookRight')}
            onPress={() => {
              navigateTo('PaymentIssue')
            }}
            testID="paymentInfoIncorrectTestID"
          />
        </Box>
      </Box>
    </FeatureLandingTemplate>
  )
}

export default PaymentDetailsScreen
