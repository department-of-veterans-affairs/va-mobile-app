import React from 'react'
import { useTranslation } from 'react-i18next'

import { ClickToCallPhoneNumber, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { useTheme } from 'utils/hooks'

function TravelPayHelp() {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()

  return (
    <>
      <TextView variant="MobileBodyBold" mt={theme.dimensions.standardMarginBetween}>
        {t('travelPay.helpTitle')}
      </TextView>
      <TextView variant="MobileBody" mt={theme.dimensions.standardMarginBetween}>
        {t('travelPay.helpText')}
      </TextView>
      <ClickToCallPhoneNumber phone={t('travelPay.phone')} center={false} a11yLabel={'travelPay.phone.a11yHint'} />
    </>
  )
}

export default TravelPayHelp
