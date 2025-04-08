import React from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { ClickToCallPhoneNumber, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { useTheme } from 'utils/hooks'

function TravelPayHelp() {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()

  return (
    <View testID="travelPayHelp">
      <TextView testID="helpTitleID" variant="MobileBodyBold" mt={theme.dimensions.condensedMarginBetween}>
        {t('travelPay.helpTitle')}
      </TextView>
      <TextView testID="helpTextID" variant="MobileBody" mt={theme.dimensions.condensedMarginBetween}>
        {t('travelPay.helpText')}
      </TextView>
      <ClickToCallPhoneNumber phone={t('travelPay.phone')} center={false} a11yLabel={'travelPay.phone.a11yHint'} />
    </View>
  )
}

export default TravelPayHelp
