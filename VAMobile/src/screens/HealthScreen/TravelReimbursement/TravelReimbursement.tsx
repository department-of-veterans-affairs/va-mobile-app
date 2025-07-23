import React from 'react'
import { useTranslation } from 'react-i18next'

import { StackScreenProps } from '@react-navigation/stack'

import { FeatureLandingTemplate } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { HealthStackParamList } from 'screens/HealthScreen/HealthStackScreens'

type TravelReimbursementProps = StackScreenProps<HealthStackParamList, 'TravelReimbursement'>

export function TravelReimbursement({ navigation }: TravelReimbursementProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)

  return (
    <FeatureLandingTemplate
      backLabel={t('health.title')}
      backLabelOnPress={navigation.goBack}
      title={t('travel.reimbursement')}
      testID="travelReimbursementTestID"
    />
  )
}

export default TravelReimbursement
