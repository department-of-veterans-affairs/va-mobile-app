import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { AlertBox, Box, ClickToCallPhoneNumber, TextView, VAScrollView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { useTheme } from 'utils/hooks'

const NoPaymentsScreen: FC = () => {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const standardMarginBetween = theme.dimensions.standardMarginBetween

  return (
    <VAScrollView>
      <Box mt={standardMarginBetween}>
        <AlertBox border="informational">
          <TextView variant="MobileBodyBold" paragraphSpacing={true} accessibilityLabel={t('payments.noPayments.title.a11yLabel')}>
            {t('payments.noPayments.title')}
          </TextView>
          <TextView variant="MobileBody" paragraphSpacing={true} accessibilityLabel={t('payments.noPayments.body.1.a11yLabel')}>
            {t('payments.noPayments.body.1')}
          </TextView>
          <TextView variant="MobileBody" paragraphSpacing={true} accessibilityLabel={t('payments.noPayments.body.2.a11yLabel')}>
            {t('payments.noPayments.body.2')}
          </TextView>
          <TextView variant="MobileBody" paragraphSpacing={true} accessibilityLabel={t('payments.noPayments.body.3.a11yLabel')}>
            {t('payments.noPayments.body.3')}
          </TextView>
          <ClickToCallPhoneNumber phone={t('8008271000')} displayedText={t('8008271000.displayText')} />
        </AlertBox>
      </Box>
    </VAScrollView>
  )
}

export default NoPaymentsScreen
