import React from 'react'
import { Trans, useTranslation } from 'react-i18next'

import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'

import { Box, ClickToCallPhoneNumber, LargePanel, TextView, VABulletList } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { PaymentsStackParamList } from 'screens/PaymentsScreen/PaymentsStackScreens'
import { displayedTextPhoneNumber } from 'utils/formattingUtils'
import { useTheme } from 'utils/hooks'

export type debtHelpType = 'questionsAboutDebt' | 'whyEducationDebt' | 'whyDisabilityPensionDebt'

type DebtHelpProps = StackScreenProps<PaymentsStackParamList, 'DebtHelp'>

function DebtHelp({ route }: DebtHelpProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const { helpType } = route.params
  const { gutter, condensedMarginBetween } = theme.dimensions

  return (
    <LargePanel title={t('debts.help.title')} rightButtonText={t('close')}>
      <Box mx={gutter}>
        {helpType === 'questionsAboutDebt' && (
          <>
            <TextView variant="MobileBodyBold" accessibilityRole="header">
              {t('debts.help.questions.header')}
            </TextView>
            <TextView my={condensedMarginBetween} variant="MobileBody">
              {t('debts.help.questions.body.1')}
            </TextView>
            <ClickToCallPhoneNumber phone={t('8008270648')} displayedText={displayedTextPhoneNumber(t('8008270648'))} />
            <TextView my={condensedMarginBetween} variant="MobileBody">
              {t('debts.help.questions.body.2')}
            </TextView>
            <ClickToCallPhoneNumber
              phone={t('16127136415')}
              displayedText={displayedTextPhoneNumber(t('16127136415'))}
              ttyBypass={true}
            />
          </>
        )}
        {helpType === 'whyDisabilityPensionDebt' && (
          <>
            <TextView variant="MobileBodyBold" accessibilityRole="header">
              {t('debts.help.why.header')}
            </TextView>
            <TextView my={condensedMarginBetween} variant="MobileBody">
              {t('debts.help.why.disabilityPension.body')}
            </TextView>
            <Box mx={theme.dimensions.gutter}>
              <VABulletList
                listOfText={[
                  { text: t('debts.help.why.disabilityPension.bullet.1') },
                  { text: t('debts.help.why.disabilityPension.bullet.2') },
                  { text: t('debts.help.why.disabilityPension.bullet.3') },
                ]}
              />
            </Box>
          </>
        )}
        {helpType === 'whyEducationDebt' && (
          <>
            <TextView variant="MobileBodyBold" accessibilityRole="header">
              {t('debts.help.why.header')}
            </TextView>
            <TextView my={condensedMarginBetween} variant="MobileBody">
              {t('debts.help.why.education.body')}
            </TextView>
            <Box mx={theme.dimensions.gutter}>
              <VABulletList
                listOfText={[
                  { text: t('debts.help.why.education.bullet.1') },
                  { text: t('debts.help.why.education.bullet.2') },
                  { text: t('debts.help.why.education.bullet.3') },
                ]}
              />
            </Box>
          </>
        )}
      </Box>
    </LargePanel>
  )
}

export default DebtHelp
