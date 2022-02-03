import { ViewStyle } from 'react-native'
import React, { FC } from 'react'

import { Box, ClickToCallPhoneNumber, TextArea, TextView, VAScrollView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { testIdProps } from 'utils/accessibility'
import { useTheme, useTranslation } from 'utils/hooks'

const PaymentMissing: FC = () => {
  const t = useTranslation(NAMESPACE.PROFILE)
  const theme = useTheme()

  const scrollStyles: ViewStyle = {
    flexGrow: 1,
    justifyContent: 'center',
  }

  return (
    <Box mt={theme.dimensions.messageIconLeftMargin}>
      <VAScrollView contentContainerStyle={scrollStyles} {...testIdProps('Payments: Missing-payments-page')}>
        <TextArea>
          <TextView variant="MobileBodyBold" color={'primaryTitle'} accessibilityRole="header">
            {t('payments.missingPayments.title')}
          </TextView>
          <TextView variant="MobileBody" py={theme.dimensions.noLettersPaddingY}>
            {t('payments.missingPayments.body')}
          </TextView>
          <ClickToCallPhoneNumber phone={t('payments.noPayments.helpNumber')} displayedText={t('payments.noPayments.helpNumber')} />
        </TextArea>
      </VAScrollView>
    </Box>
  )
}

export default PaymentMissing
