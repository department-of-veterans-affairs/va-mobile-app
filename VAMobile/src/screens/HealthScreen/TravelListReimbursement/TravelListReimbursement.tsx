import React from 'react'
import { useTranslation } from 'react-i18next'

import { StackScreenProps } from '@react-navigation/stack'

import { FeatureLandingTemplate } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { HealthStackParamList } from 'screens/HealthScreen/HealthStackScreens'

type TravelListReimbursementProps = StackScreenProps<HealthStackParamList, 'TravelListReimbursement'>

export function TravelListReimbursement({ navigation }: TravelListReimbursementProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)

  return (
    <FeatureLandingTemplate
      backLabel={t('health.title')}
      backLabelOnPress={navigation.goBack}
      title={t('travelPay.statusList.reimbursement.title')}
      testID="travelListReimbursementTestID"
    />
  )
}

export default TravelListReimbursement
