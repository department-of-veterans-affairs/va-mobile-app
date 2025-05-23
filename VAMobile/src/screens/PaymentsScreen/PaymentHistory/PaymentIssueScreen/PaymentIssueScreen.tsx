import React from 'react'
import { useTranslation } from 'react-i18next'

import { StackScreenProps } from '@react-navigation/stack'

import { Box, ClickToCallPhoneNumber, LargePanel, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { PaymentsStackParamList } from 'screens/PaymentsScreen/PaymentsStackScreens'
import { displayedTextPhoneNumber } from 'utils/formattingUtils'
import { useTheme } from 'utils/hooks'

type PaymentIssueScreenProps = StackScreenProps<PaymentsStackParamList, 'PaymentIssue'>

function PaymentIssue({}: PaymentIssueScreenProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()

  return (
    <LargePanel
      title={t('paymentsHelp.title')}
      rightButtonText={t('close')}
      rightButtonTestID="paymentIssuesCloseID"
      testID="paymentsIssuesPanelID">
      <Box mb={theme.dimensions.contentMarginBottom} mx={theme.dimensions.gutter}>
        <TextView variant="MobileBodyBold" accessibilityRole="header">
          {t('payments.ifMyPaymentDoesNotLookRight')}
        </TextView>
        {/*eslint-disable-next-line react-native-a11y/has-accessibility-hint*/}
        <TextView variant="MobileBody" paragraphSpacing={true} accessibilityLabel={t('paymentIssues.body.a11yLabel')}>
          {t('paymentIssues.body')}
        </TextView>
        <ClickToCallPhoneNumber phone={t('8008271000')} displayedText={displayedTextPhoneNumber(t('8008271000'))} />
      </Box>
    </LargePanel>
  )
}

export default PaymentIssue
