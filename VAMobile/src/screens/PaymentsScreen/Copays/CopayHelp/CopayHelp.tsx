import React from 'react'
import { useTranslation } from 'react-i18next'

import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'

import { LargePanel } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { PaymentsStackParamList } from 'screens/PaymentsScreen/PaymentsStackScreens'

type CopayHelpProps = StackScreenProps<PaymentsStackParamList, 'CopayHelp'>

function CopayHelp({}: CopayHelpProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)

  return <LargePanel title={t('copays.help.title')} rightButtonText={t('close')} />
}

export default CopayHelp
