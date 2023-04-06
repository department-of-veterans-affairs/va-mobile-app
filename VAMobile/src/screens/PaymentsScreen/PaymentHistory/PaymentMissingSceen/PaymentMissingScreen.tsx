import { StackScreenProps } from '@react-navigation/stack'
import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { Box, ClickToCallPhoneNumber, LargePanel, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { PaymentsStackParamList } from 'screens/PaymentsScreen/PaymentsStackScreens'
import { useTheme } from 'utils/hooks'

type PaymentMissingScreenProps = StackScreenProps<PaymentsStackParamList, 'PaymentMissing'>

const PaymentMissing: FC<PaymentMissingScreenProps> = () => {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()

  return (
    <LargePanel title={t('paymentsHelp.title')} rightButtonText={t('close')}>
      <Box mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom} mx={theme.dimensions.gutter}>
        <TextView variant="MobileBodyBold" accessibilityRole="header" paragraphSpacing={true}>
          {t('payments.ifIAmMissingPayemt')}
        </TextView>
        <TextView variant="MobileBody" paragraphSpacing={true} accessibilityLabel={t('payments.missingPayments.body.1.a11yLabel')}>
          {t('payments.missingPayments.body.1')}
        </TextView>
        <TextView variant="MobileBody" paragraphSpacing={true} accessibilityLabel={t('payments.missingPayments.body.2.a11yLabel')}>
          {t('payments.missingPayments.body.2')}
        </TextView>
        <ClickToCallPhoneNumber phone={t('8008271000')} displayedText={t('8008271000.displayText')} />
      </Box>
    </LargePanel>
  )
}

export default PaymentMissing
