import React from 'react'
import { useTranslation } from 'react-i18next'

import { AlertWithHaptics, ClickToCallPhoneNumber, TextView, VAScrollView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { a11yLabelVA } from 'utils/a11yLabel'
import { displayedTextPhoneNumber } from 'utils/formattingUtils'
import { useTheme } from 'utils/hooks'

function NoPaymentsScreen() {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()

  return (
    <VAScrollView>
      <AlertWithHaptics
        variant="info"
        header={t('payments.noPayments.title')}
        headerA11yLabel={a11yLabelVA(t('payments.noPayments.title'))}
        description={t('payments.noPayments.body.1')}
        descriptionA11yLabel={a11yLabelVA(t('payments.noPayments.body.1'))}>
        <TextView
          variant="MobileBody"
          paragraphSpacing={true}
          accessibilityLabel={a11yLabelVA(t('payments.missingOrNoPayments.body.1'))}
          mt={theme.dimensions.contentMarginTop}>
          {t('payments.missingOrNoPayments.body.1')}
        </TextView>
        <TextView
          variant="MobileBody"
          paragraphSpacing={true}
          accessibilityLabel={t('payments.noPayments.body.2.a11yLabel')}>
          {t('payments.noPayments.body.2')}
        </TextView>
        <ClickToCallPhoneNumber phone={t('8008271000')} displayedText={displayedTextPhoneNumber(t('8008271000'))} />
      </AlertWithHaptics>
    </VAScrollView>
  )
}

export default NoPaymentsScreen
