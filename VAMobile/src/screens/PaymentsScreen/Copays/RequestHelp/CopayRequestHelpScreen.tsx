import React from 'react'
import { useTranslation } from 'react-i18next'

import { useNavigationState } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'

import { FeatureLandingTemplate } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { PaymentsStackParamList } from 'screens/PaymentsScreen/PaymentsStackScreens'

type CopayRequestHelpScreenProps = StackScreenProps<PaymentsStackParamList, 'CopayRequestHelp'>

function CopayRequestHelpScreen({ navigation }: CopayRequestHelpScreenProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const prevScreen = useNavigationState((state) => state.routes[state.routes.length - 2]?.name)
  const backLabel = prevScreen === 'CopayDetails' ? t('copays.details.title') : t('copays.title')

  return (
    <FeatureLandingTemplate
      backLabel={backLabel}
      backLabelOnPress={navigation.goBack}
      title={t('debts.requestHelp.title')}
      testID="copayRequestHelpTestID"
      backLabelTestID="copayRequestHelpBackTestID"
    />
  )
}

export default CopayRequestHelpScreen
