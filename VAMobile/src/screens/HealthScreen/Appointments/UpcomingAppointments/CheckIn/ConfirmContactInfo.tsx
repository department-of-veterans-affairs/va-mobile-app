import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { FullScreenSubtask } from 'components'
import { HealthStackParamList } from 'screens/HealthScreen/HealthStackScreens'
import { NAMESPACE } from 'constants/namespaces'

type ConfirmContactInfoProps = StackScreenProps<HealthStackParamList, 'ConfirmContactInfo'>

const ConfirmContactInfo: FC<ConfirmContactInfoProps> = ({ navigation }) => {
  const { t } = useTranslation(NAMESPACE.COMMON)

  return <FullScreenSubtask leftButtonText={t('cancel')} onLeftButtonPress={navigation.goBack} title={t('checkIn.confirmContactInfo')} />
}

export default ConfirmContactInfo
