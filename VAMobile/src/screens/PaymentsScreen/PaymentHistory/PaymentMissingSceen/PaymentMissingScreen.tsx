import { StackScreenProps } from '@react-navigation/stack'
import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { Box, ClickToCallPhoneNumber, LargePanel, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { PaymentsStackParamList } from 'screens/PaymentsScreen/PaymentsStackScreens'
import { a11yLabelVA } from 'utils/a11yLabel'
import { displayedTextPhoneNumber } from 'utils/formattingUtils'
import { useTheme } from 'utils/hooks'

type PaymentMissingScreenProps = StackScreenProps<PaymentsStackParamList, 'PaymentMissing'>

const PaymentMissing: FC<PaymentMissingScreenProps> = () => {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()

  return (
    <LargePanel title={t('paymentsHelp.title')} rightButtonText={t('close')}>
      <Box mb={theme.dimensions.contentMarginBottom} mx={theme.dimensions.gutter}>
        <TextView variant="MobileBodyBold" accessibilityRole="header">
          {t('payments.ifIAmMissingPayemt')}
        </TextView>
        <TextView variant="MobileBody" paragraphSpacing={true} accessibilityLabel={a11yLabelVA(t('payments.missingOrNoPayments.body.1'))}>
          {t('payments.missingOrNoPayments.body.1')}
        </TextView>
        <TextView variant="MobileBody" paragraphSpacing={true} accessibilityLabel={t('payments.missingPayments.body.2.a11yLabel')}>
          {t('payments.missingPayments.body.2')}
        </TextView>
        <ClickToCallPhoneNumber phone={t('8008271000')} displayedText={displayedTextPhoneNumber(t('8008271000'))} />
      </Box>
    </LargePanel>
  )
}

export default PaymentMissing
