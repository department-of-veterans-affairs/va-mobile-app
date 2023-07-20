import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { AlertBox, ClickToCallPhoneNumber, TextView, VAScrollView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { useTheme } from 'utils/hooks'

const NoPaymentsScreen: FC = () => {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()

  return (
    <VAScrollView>
      <AlertBox border="informational">
        <TextView variant="MobileBodyBold" accessibilityLabel={t('payments.noPayments.title.a11yLabel')}>
          {t('payments.noPayments.title')}
        </TextView>
        <TextView variant="MobileBody" mt={theme.dimensions.standardMarginBetween} paragraphSpacing={true} accessibilityLabel={t('payments.noPayments.body.1.a11yLabel')}>
          {t('payments.noPayments.body.1')}
        </TextView>
        <TextView variant="MobileBody" paragraphSpacing={true} accessibilityLabel={t('payments.missingOrNoPayments.body.1.a11yLabel')}>
          {t('payments.missingOrNoPayments.body.1')}
        </TextView>
        <TextView variant="MobileBody" paragraphSpacing={true} accessibilityLabel={t('payments.noPayments.body.2.a11yLabel')}>
          {t('payments.noPayments.body.2')}
        </TextView>
        <ClickToCallPhoneNumber phone={t('8008271000')} displayedText={t('8008271000.displayText')} />
      </AlertBox>
    </VAScrollView>
  )
}

export default NoPaymentsScreen
