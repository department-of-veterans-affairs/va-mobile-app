import React from 'react'
import { useTranslation } from 'react-i18next'

import { StackScreenProps } from '@react-navigation/stack'

import { Box, ClickToCallPhoneNumber, LargePanel, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { PaymentsStackParamList } from 'screens/PaymentsScreen/PaymentsStackScreens'
import { a11yLabelVA } from 'utils/a11yLabel'
import { displayedTextPhoneNumber } from 'utils/formattingUtils'
import { useTheme } from 'utils/hooks'

type PaymentMissingScreenProps = StackScreenProps<PaymentsStackParamList, 'PaymentMissing'>

function PaymentMissing({}: PaymentMissingScreenProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()

  return (
    <LargePanel
      title={t('paymentsHelp.title')}
      rightButtonText={t('close')}
      rightButtonTestID="paymentsMissingCloseID"
      testID="paymentsMissingPanelID">
      <Box mb={theme.dimensions.contentMarginBottom} mx={theme.dimensions.gutter}>
        <TextView variant="MobileBodyBold" accessibilityRole="header">
          {t('payments.ifIAmMissingPayemt')}
        </TextView>
        {/*eslint-disable-next-line react-native-a11y/has-accessibility-hint*/}
        <TextView
          variant="MobileBody"
          paragraphSpacing={true}
          accessibilityLabel={a11yLabelVA(t('payments.missingOrNoPayments.body.1'))}>
          {t('payments.missingOrNoPayments.body.1')}
        </TextView>
        {/*eslint-disable-next-line react-native-a11y/has-accessibility-hint*/}
        <TextView
          variant="MobileBody"
          paragraphSpacing={true}
          accessibilityLabel={t('payments.missingPayments.body.2.a11yLabel')}>
          {t('payments.missingPayments.body.2')}
        </TextView>
        <ClickToCallPhoneNumber phone={t('8008271000')} displayedText={displayedTextPhoneNumber(t('8008271000'))} />
      </Box>
    </LargePanel>
  )
}

export default PaymentMissing
