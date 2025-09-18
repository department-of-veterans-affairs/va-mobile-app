import React from 'react'
import { useTranslation } from 'react-i18next'

import { StackScreenProps } from '@react-navigation/stack'

import { FeatureLandingTemplate } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { PaymentsStackParamList } from 'screens/PaymentsScreen/PaymentsStackScreens'

type ChargeDetailsScreenProps = StackScreenProps<PaymentsStackParamList, 'ChargeDetails'>

function ChargeDetailsScreen({ navigation }: ChargeDetailsScreenProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)

  return (
    <FeatureLandingTemplate
      backLabel={t('copays.details.title')}
      backLabelOnPress={navigation.goBack}
      title={t('copays.chargeDetails.title')}
      testID="chargeDetailsTestID"
      backLabelTestID="chargeDetailsBackTestID"
    />
  )
}

export default ChargeDetailsScreen
