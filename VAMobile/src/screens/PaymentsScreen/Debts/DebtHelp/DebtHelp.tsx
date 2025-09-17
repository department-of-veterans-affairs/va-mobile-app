import React from 'react'
import { useTranslation } from 'react-i18next'

import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'

import { LargePanel } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { PaymentsStackParamList } from 'screens/PaymentsScreen/PaymentsStackScreens'

type DebtHelpProps = StackScreenProps<PaymentsStackParamList, 'DebtHelp'>

function DebtHelp({}: DebtHelpProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)

  return <LargePanel title={t('debts.help.title')} rightButtonText={t('close')} />
}

export default DebtHelp
