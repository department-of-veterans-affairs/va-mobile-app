import React from 'react'
import { Trans, useTranslation } from 'react-i18next'

import { useNavigationState } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'

import {
  Box,
  FeatureLandingTemplate,
  LinkWithAnalytics,
  TextArea,
  TextView,
  VABulletList,
  VABulletListText,
} from 'components'
import PhoneNumberComponent from 'components/PhoneNumberComponent'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { PaymentsStackParamList } from 'screens/PaymentsScreen/PaymentsStackScreens'
import { logAnalyticsEvent } from 'utils/analytics'
import getEnv from 'utils/env'
import { useRouteNavigation, useTheme } from 'utils/hooks'
import { vaGovWebviewTitle } from 'utils/webview'

type DebtRequestHelpScreenProps = StackScreenProps<PaymentsStackParamList, 'DebtRequestHelp'>

const { LINK_URL_REQUEST_HELP_FORM_5655, LINK_URL_REQUEST_HELP_VA_DEBT } = getEnv()

function DebtRequestHelpScreen({ navigation }: DebtRequestHelpScreenProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const navigateTo = useRouteNavigation()
  const { gutter, contentMarginBottom, condensedMarginBetween, standardMarginBetween } = theme.dimensions

  const prevScreen = useNavigationState((state) => state.routes[state.routes.length - 2]?.name)
  const backLabel = prevScreen === 'DebtDetails' ? t('debts.overpayment') : t('debts')

  const items: VABulletListText[] = [
    {
      boldedTextPrefix: t('debts.requestHelp.financialHelp.item1.term'),
      text: t('debts.requestHelp.financialHelp.item1.desc'),
    },
    {
      boldedTextPrefix: t('debts.requestHelp.financialHelp.item2.term'),
      text: t('debts.requestHelp.financialHelp.item2.desc'),
    },
    {
      boldedTextPrefix: t('debts.requestHelp.financialHelp.item3.term'),
      text: t('debts.requestHelp.financialHelp.item3.desc'),
    },
  ]

  return (
    <FeatureLandingTemplate
      backLabel={backLabel}
      backLabelOnPress={navigation.goBack}
      title={t('debts.requestHelp.title')}
      testID="debtRequestHelpTestID"
      backLabelTestID="debtRequestHelpBackTestID">
      <>
        <Box>
          <TextArea>
            <TextView variant="MobileBody">{t('debts.requestHelp.financialHelp.intro')}</TextView>

            <Box mt={standardMarginBetween}>
              <VABulletList paragraphSpacing listOfText={items} />
            </Box>

            <Box>
              <LinkWithAnalytics
                type="custom"
                onPress={() => {
                  logAnalyticsEvent(Events.vama_webview(LINK_URL_REQUEST_HELP_FORM_5655))
                  navigateTo('Webview', {
                    url: LINK_URL_REQUEST_HELP_FORM_5655,
                    displayTitle: vaGovWebviewTitle(t),
                    loadingMessage: t('loading.vaWebsite'),
                    useSSO: false,
                  })
                }}
                text={t('debts.requestHelp.relief.link')}
                testID="debt-relief-start-link"
              />
            </Box>
          </TextArea>
        </Box>

        <Box my={theme.dimensions.standardMarginBetween} mx={gutter} alignItems="center">
          <LinkWithAnalytics
            type="url"
            url={LINK_URL_REQUEST_HELP_VA_DEBT}
            text={t('debts.requestHelp.footer.link')}
            testID="request-help-options-link"
          />
        </Box>

        <Box mb={contentMarginBottom}>
          <TextArea>
            <TextView variant="MobileBodyBold" accessibilityRole="header">
              {t('debts.requestHelp.questions.header')}
            </TextView>

            <Box mt={condensedMarginBetween}>
              <Trans
                i18nKey="debts.requestHelp.questions"
                components={{
                  p: <TextView my={condensedMarginBetween} variant="MobileBody" />,
                  tel: <PhoneNumberComponent variant="standalone" ttyBypass={true} />,
                  tty: <PhoneNumberComponent variant="standalone" />,
                }}
              />
            </Box>
          </TextArea>
        </Box>
      </>
    </FeatureLandingTemplate>
  )
}

export default DebtRequestHelpScreen
