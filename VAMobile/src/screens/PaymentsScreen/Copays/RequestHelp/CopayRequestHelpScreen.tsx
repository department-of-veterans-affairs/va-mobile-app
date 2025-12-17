import React from 'react'
import { Trans, useTranslation } from 'react-i18next'

import { useNavigationState } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'

import {
  AccordionCollapsible,
  Box,
  FeatureLandingTemplate,
  LinkWithAnalytics,
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

type CopayRequestHelpScreenProps = StackScreenProps<PaymentsStackParamList, 'CopayRequestHelp'>

const { LINK_URL_ASK_VA_GOV, LINK_URL_REQUEST_HELP_FORM_5655, LINK_URL_COPAY_HARDSHIP_INFO } = getEnv()

function CopayRequestHelpScreen({ navigation }: CopayRequestHelpScreenProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const navigateTo = useRouteNavigation()
  const { cardPadding, condensedMarginBetween } = theme.dimensions

  const prevScreen = useNavigationState((state) => state.routes[state.routes.length - 2]?.name)
  const backLabel = prevScreen === 'CopayDetails' ? t('copays.details.title') : t('copays.title')

  return (
    <FeatureLandingTemplate
      backLabel={backLabel}
      backLabelOnPress={navigation.goBack}
      title={t('copays.requestHelp.title')}
      testID="copayRequestHelpTestID"
      backLabelTestID="copayRequestHelpBackTestID">
      <>
        {/* 1) Questions about copay bills */}
        <AccordionCollapsible
          testID="accordion-copay-questions"
          header={
            <Box>
              <TextView variant="MobileBodyBold">{t('copays.requestHelp.questions.header')}</TextView>
            </Box>
          }
          expandedContent={
            <Box>
              <Trans
                i18nKey="copays.requestHelp.questions"
                components={{
                  p: <TextView mt={condensedMarginBetween} variant="MobileBody" />,
                  tel: <PhoneNumberComponent variant="standalone" ttyBypass={false} />,
                  tty: <PhoneNumberComponent variant="standalone" />,
                }}
              />
              <Box>
                <LinkWithAnalytics
                  type="custom"
                  onPress={() => {
                    logAnalyticsEvent(Events.vama_webview(LINK_URL_ASK_VA_GOV))
                    navigateTo('Webview', {
                      url: LINK_URL_ASK_VA_GOV,
                      displayTitle: vaGovWebviewTitle(t),
                      loadingMessage: t('loading.vaWebsite'),
                      useSSO: false,
                    })
                  }}
                  text={t('copays.requestHelp.questions.askVaLink')}
                  testID="copay-ask-va-link"
                />
              </Box>
            </Box>
          }
        />

        {/* 2) Request help for current bills */}
        <AccordionCollapsible
          testID="accordion-copay-current-bills"
          header={
            <Box>
              <TextView variant="MobileBodyBold">{t('copays.requestHelp.current.header')}</TextView>
            </Box>
          }
          expandedContent={
            <Box>
              <TextView variant="MobileBody" my={condensedMarginBetween}>
                {t('copays.requestHelp.current.intro')}
              </TextView>

              <Box mx={condensedMarginBetween}>
                <VABulletList
                  listOfText={
                    [
                      {
                        boldedTextPrefix: t('copays.requestHelp.current.item1.term'),
                        text: t('copays.requestHelp.current.item1.desc'),
                      },
                      {
                        boldedTextPrefix: t('copays.requestHelp.current.item2.term'),
                        text: t('copays.requestHelp.current.item2.desc'),
                      },
                      {
                        boldedTextPrefix: t('copays.requestHelp.current.item3.term'),
                        text: t('copays.requestHelp.current.item3.desc'),
                      },
                    ] as VABulletListText[]
                  }
                />
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
                  text={t('copays.requestHelp.current.link')}
                  testID="copay-current-bills-help-link"
                />
              </Box>
            </Box>
          }
        />

        {/* 3) Request help for future health care */}
        <AccordionCollapsible
          testID="accordion-copay-future-care"
          header={
            <Box>
              <TextView variant="MobileBodyBold">{t('copays.requestHelp.future.header')}</TextView>
            </Box>
          }
          expandedContent={
            <Box pb={cardPadding}>
              <TextView variant="MobileBody" my={condensedMarginBetween}>
                {t('copays.requestHelp.future.copy')}
              </TextView>

              <LinkWithAnalytics
                type="url"
                url={LINK_URL_COPAY_HARDSHIP_INFO}
                text={t('copays.requestHelp.future.link')}
                testID="copay-future-care-hardship-link"
              />
            </Box>
          }
        />
      </>
    </FeatureLandingTemplate>
  )
}

export default CopayRequestHelpScreen
