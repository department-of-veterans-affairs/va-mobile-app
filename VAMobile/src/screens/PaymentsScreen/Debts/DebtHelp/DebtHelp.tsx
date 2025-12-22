import React from 'react'
import { useTranslation } from 'react-i18next'

import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'

import { Box, ClickToCallPhoneNumber, LargePanel, LinkWithAnalytics, TextView, VABulletList } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { PaymentsStackParamList } from 'screens/PaymentsScreen/PaymentsStackScreens'
import { displayedTextPhoneNumber } from 'utils/formattingUtils'
import { useRouteNavigation, useTheme } from 'utils/hooks'
import { Events } from 'constants/analytics'
import { logAnalyticsEvent } from 'utils/analytics'
import getEnv from 'utils/env'
import { a11yLabelVA } from 'utils/a11yLabel'

export type debtHelpType = 'questionsAboutDebt' | 'whyEducationDebt' | 'whyDisabilityPensionDebt'

type DebtHelpProps = StackScreenProps<PaymentsStackParamList, 'DebtHelp'>

const { LINK_URL_ASK_VA_GOV } = getEnv()

function DebtHelp({ route, navigation }: DebtHelpProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const navigateTo = useRouteNavigation()
  const theme = useTheme()
  const { helpType, titleKey } = route.params
  const { gutter, condensedMarginBetween } = theme.dimensions

  const panelTitle = t(titleKey ?? 'debts.help.title')

  // Necessary to ensure the WebView opens properly for LINK_URL_ASK_VA_GOV
  const goBackThenOpenAskVA = () => {
    logAnalyticsEvent(Events.vama_webview(LINK_URL_ASK_VA_GOV))

    navigation.goBack()

    setTimeout(() => {
      navigateTo('Webview', {
        url: LINK_URL_ASK_VA_GOV,
        displayTitle: t('webview.vagov'),
        loadingMessage: t('loading.vaWebsite'),
        useSSO: false,
      })
    }, 0)
  }

  return (
    <LargePanel title={panelTitle} rightButtonText={t('close')}>
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
            <TextView my={theme.dimensions.condensedMarginBetween} variant="MobileBody" paragraphSpacing={false}>
              {t('debts.help.orContactAskVA')}
            </TextView>
            <LinkWithAnalytics
              type="custom"
              onPress={goBackThenOpenAskVA}
              text={t('debts.help.askVA')}
              a11yLabel={a11yLabelVA(t('debts.help.askVA'))}
              a11yHint={t('debts.help.askVAA11yHint')}
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
