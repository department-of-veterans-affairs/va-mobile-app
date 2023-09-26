import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { AlertBox, ClickToCallPhoneNumber, TextView, VAScrollView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { a11yLabelVA } from 'utils/a11yLabel'
import { displayedTextPhoneNumber } from 'utils/formattingUtils'
import { useTheme } from 'utils/hooks'

const NoPaymentsScreen: FC = () => {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()

  return (
    <VAScrollView>
      <AlertBox border="informational">
        <TextView variant="MobileBodyBold" accessibilityLabel={a11yLabelVA(t('payments.noPayments.title'))}>
          {t('payments.noPayments.title')}
        </TextView>
        <TextView variant="MobileBody" mt={theme.dimensions.standardMarginBetween} paragraphSpacing={true} accessibilityLabel={a11yLabelVA(t('payments.noPayments.body.1'))}>
          {t('payments.noPayments.body.1')}
        </TextView>
        <TextView variant="MobileBody" paragraphSpacing={true} accessibilityLabel={a11yLabelVA(t('payments.missingOrNoPayments.body.1'))}>
          {t('payments.missingOrNoPayments.body.1')}
        </TextView>
        <TextView variant="MobileBody" paragraphSpacing={true} accessibilityLabel={t('payments.noPayments.body.2.a11yLabel')}>
          {t('payments.noPayments.body.2')}
        </TextView>
        <ClickToCallPhoneNumber phone={t('8008271000')} displayedText={displayedTextPhoneNumber(t('8008271000'))} />
      </AlertBox>
    </VAScrollView>
  )
}

export default NoPaymentsScreen
