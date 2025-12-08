import React from 'react'
import { useTranslation } from 'react-i18next'

import { StackScreenProps } from '@react-navigation/stack'

import { Box, LargePanel, VABulletList, VABulletListText } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { PaymentsStackParamList } from 'screens/PaymentsScreen/PaymentsStackScreens'
import { useTheme } from 'utils/hooks'

type TermDefinitionsProps = StackScreenProps<PaymentsStackParamList, 'TermDefinitions'>

function TermDefinitions({}: TermDefinitionsProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const { gutter, standardMarginBetween } = theme.dimensions

  const termsList: VABulletListText[] = [
    {
      boldedTextPrefix: t('debts.terms.fileNumber.term'),
      text: t('debts.terms.fileNumber.desc'),
    },
    {
      boldedTextPrefix: t('debts.terms.payeeNumber.term'),
      text: t('debts.terms.payeeNumber.desc'),
    },
    {
      boldedTextPrefix: t('debts.terms.personEntitled.term'),
      text: t('debts.terms.personEntitled.desc'),
    },
    {
      boldedTextPrefix: t('debts.terms.deductionCode.term'),
      text: t('debts.terms.deductionCode.desc'),
    },
  ]

  return (
    <LargePanel title={t('debts.terms.title')} rightButtonText={t('close')}>
      <Box mx={gutter} mt={standardMarginBetween}>
        <VABulletList listOfText={termsList} paragraphSpacing />
      </Box>
    </LargePanel>
  )
}

export default TermDefinitions
