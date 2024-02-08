import { useTranslation } from 'react-i18next'
import React from 'react'

import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'

import { FullScreenSubtask } from 'components'
import { HealthStackParamList } from 'screens/HealthScreen/HealthStackScreens'
import { NAMESPACE } from 'constants/namespaces'

type ConfirmContactInfoProps = StackScreenProps<HealthStackParamList, 'ConfirmContactInfo'>

function ConfirmContactInfo({ navigation }: ConfirmContactInfoProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)

  return <FullScreenSubtask leftButtonText={t('cancel')} onLeftButtonPress={navigation.goBack} title={t('checkIn.confirmContactInfo')} />
}

export default ConfirmContactInfo
