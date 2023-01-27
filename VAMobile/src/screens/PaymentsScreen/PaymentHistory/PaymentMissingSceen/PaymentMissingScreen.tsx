import { StackScreenProps } from '@react-navigation/stack'
import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { Box, ClickToCallPhoneNumber, LargePanel, TextArea, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { PaymentsStackParamList } from 'screens/PaymentsScreen/PaymentsStackScreens'
import { useTheme } from 'utils/hooks'

type PaymentMissingScreenProps = StackScreenProps<PaymentsStackParamList, 'PaymentMissing'>

const PaymentMissing: FC<PaymentMissingScreenProps> = () => {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const { contentMarginTop } = theme.dimensions

  return (
    <LargePanel title={t('paymentsHelp.title')} rightButtonText={t('close')}>
      <Box mt={contentMarginTop}>
        <TextArea>
          <TextView variant="MobileBodyBold" accessibilityRole="header">
            {t('payments.ifIAmMissingPayemt')}
          </TextView>
          <TextView variant="MobileBody" py={6}>
            {t('payments.missingPayments.body')}
          </TextView>
          <ClickToCallPhoneNumber phone={t('8008271000')} displayedText={t('8008271000.displayText')} />
        </TextArea>
      </Box>
    </LargePanel>
  )
}

export default PaymentMissing
