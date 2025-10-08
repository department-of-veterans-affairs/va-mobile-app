import React from 'react'
import { Trans, useTranslation } from 'react-i18next'

import { useNavigationState } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'

import { AccordionCollapsible, Box, FeatureLandingTemplate, LinkWithAnalytics, TextView } from 'components'
import PhoneNumberComponent from 'components/PhoneNumberComponent'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { PaymentsStackParamList } from 'screens/PaymentsScreen/PaymentsStackScreens'
import { logAnalyticsEvent } from 'utils/analytics'
import getEnv from 'utils/env'
import { useRouteNavigation, useTheme } from 'utils/hooks'

const { LINK_URL_ASK_VA_GOV, LINK_URL_REQUEST_HELP_FORM_5655, LINK_URL_REQUEST_HELP_VA_DEBT } = getEnv()

type DebtRequestHelpScreenProps = StackScreenProps<PaymentsStackParamList, 'DebtRequestHelp'>

function DebtRequestHelpScreen({ navigation }: DebtRequestHelpScreenProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const navigateTo = useRouteNavigation()
  const { gutter, cardPadding, condensedMarginBetween, standardMarginBetween } = theme.dimensions

  const prevScreen = useNavigationState((state) => state.routes[state.routes.length - 2]?.name)
  const backLabel = prevScreen === 'DebtDetails' ? t('debts.overpayment') : t('debts')

  return (
    <FeatureLandingTemplate
      backLabel={backLabel}
      backLabelOnPress={navigation.goBack}
      title={t('debts.requestHelp.title')}
      testID="debtRequestHelpTestID"
      backLabelTestID="debtRequestHelpBackTestID">
      <>
        <AccordionCollapsible
          testID="accordion-va-debt-questions"
          header={
            <Box>
              <TextView variant="MobileBodyBold">{t('debts.requestHelp.questions.header')}</TextView>
            </Box>
          }
          expandedContent={
            <Box pb={cardPadding}>
              <Trans
                i18nKey="debts.requestHelp.questions"
                components={{
                  header: <TextView variant="MobileBodyBold" accessibilityRole="header" />,
                  p: <TextView my={condensedMarginBetween} variant="MobileBody" />,
                  tel: <PhoneNumberComponent variant="standalone" ttyBypass={true} />,
                  tty: <PhoneNumberComponent variant="standalone" />,
                }}
              />
            </Box>
          }
        />

        <AccordionCollapsible
          testID="accordion-request-repayment-plan"
          header={
            <Box>
              <TextView variant="MobileBodyBold">{t('debts.requestHelp.repayment.header')}</TextView>
            </Box>
          }
          expandedContent={
            <Box pb={cardPadding}>
              <TextView variant="MobileBody" my={condensedMarginBetween}>
                {t('debts.requestHelp.repayment.intro')}
              </TextView>

              <TextView variant="MobileBodyBold" mt={standardMarginBetween}>
                {t('debts.requestHelp.repayment.online')}
              </TextView>
              <Box>
                <LinkWithAnalytics
                  type="custom"
                  onPress={() => {
                    logAnalyticsEvent(Events.vama_webview(LINK_URL_ASK_VA_GOV))
                    navigateTo('Webview', {
                      url: LINK_URL_ASK_VA_GOV,
                      displayTitle: t('webview.vagov'),
                      loadingMessage: t('loading.vaWebsite'),
                      useSSO: false,
                    })
                  }}
                  text={t('debts.requestHelp.repayment.askVaLink')}
                  testID="repayment-ask-va-link"
                />
              </Box>

              <TextView variant="MobileBodyBold" mt={standardMarginBetween}>
                {t('debts.requestHelp.repayment.phone')}
              </TextView>
              <Trans
                i18nKey="debts.requestHelp.repayment.phoneHours"
                components={{
                  header: <TextView variant="MobileBodyBold" accessibilityRole="header" />,
                  p: <TextView my={condensedMarginBetween} variant="MobileBody" />,
                  tel: <PhoneNumberComponent variant="standalone" ttyBypass={true} />,
                  tty: <PhoneNumberComponent variant="standalone" />,
                }}
              />

              <TextView variant="MobileBodyBold" mt={standardMarginBetween}>
                {t('debts.requestHelp.repayment.mail')}
              </TextView>
              <Box mt={condensedMarginBetween}>
                <TextView variant="MobileBody">{t('debts.requestHelp.repayment.addr1')}</TextView>
                <TextView variant="MobileBody">{t('debts.requestHelp.repayment.addr2')}</TextView>
                <TextView variant="MobileBody">{t('debts.requestHelp.repayment.addr3')}</TextView>
              </Box>
            </Box>
          }
        />

        <AccordionCollapsible
          testID="accordion-request-debt-relief"
          header={
            <Box>
              <TextView variant="MobileBodyBold">{t('debts.requestHelp.relief.header')}</TextView>
            </Box>
          }
          expandedContent={
            <Box pb={cardPadding}>
              <TextView variant="MobileBody" my={condensedMarginBetween}>
                {t('debts.requestHelp.relief.copy')}
              </TextView>
              <LinkWithAnalytics
                type="custom"
                onPress={() => {
                  logAnalyticsEvent(Events.vama_webview(LINK_URL_REQUEST_HELP_FORM_5655))
                  navigateTo('Webview', {
                    url: LINK_URL_REQUEST_HELP_FORM_5655,
                    displayTitle: t('webview.vagov'),
                    loadingMessage: t('loading.vaWebsite'),
                    useSSO: false,
                  })
                }}
                text={t('debts.requestHelp.relief.link')}
                testID="debt-relief-start-link"
              />
            </Box>
          }
        />

        <Box mt={standardMarginBetween} px={gutter} pb={cardPadding}>
          <TextView variant="MobileBodyBold">{t('debts.requestHelp.footer.title')}</TextView>
          <Box mt={condensedMarginBetween}>
            <LinkWithAnalytics
              type="custom"
              onPress={() => {
                logAnalyticsEvent(Events.vama_webview(LINK_URL_REQUEST_HELP_VA_DEBT))
                navigateTo('Webview', {
                  url: LINK_URL_REQUEST_HELP_VA_DEBT,
                  displayTitle: t('webview.vagov'),
                  loadingMessage: t('loading.vaWebsite'),
                  useSSO: false,
                })
              }}
              text={t('debts.requestHelp.footer.link')}
              testID="request-help-options-link"
            />
          </Box>
        </Box>
      </>
    </FeatureLandingTemplate>
  )
}

export default DebtRequestHelpScreen
