import React from 'react'
import { useTranslation } from 'react-i18next'

import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'

import { Box, ClickToCallPhoneNumber, LargePanel, LinkWithAnalytics, TextView } from 'components'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { PaymentsStackParamList } from 'screens/PaymentsScreen/PaymentsStackScreens'
import { a11yLabelVA } from 'utils/a11yLabel'
import { logAnalyticsEvent } from 'utils/analytics'
import getEnv from 'utils/env'
import { displayedTextPhoneNumber } from 'utils/formattingUtils'
import { useRouteNavigation, useTheme } from 'utils/hooks'
import { vaGovWebviewTitle } from 'utils/webview'

type CopayHelpProps = StackScreenProps<PaymentsStackParamList, 'CopayHelp'>

function CopayHelp({}: CopayHelpProps) {
  const { LINK_URL_ASK_VA_GOV } = getEnv()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const navigateTo = useRouteNavigation()

  return (
    <LargePanel title={t('copays.help.title')} rightButtonText={t('close')}>
      <Box mb={theme.dimensions.contentMarginBottom} mx={theme.dimensions.gutter}>
        <TextView
          variant="MobileBodyBold"
          accessibilityRole="header"
          accessibilityLabel={t('copays.help.header.a11yLabel')}
          accessibilityHint={t('copays.help.header.a11yHint')}>
          {t('copays.help.header')}
        </TextView>
        <TextView my={theme.dimensions.condensedMarginBetween} variant="MobileBody" paragraphSpacing={false}>
          {t('copays.help.content')}
        </TextView>
        <ClickToCallPhoneNumber phone={t('8664001238')} displayedText={displayedTextPhoneNumber(t('8664001238'))} />
        <TextView variant="MobileBody" paragraphSpacing={false}>
          {t('copays.help.orContactAskVA')}
        </TextView>
        <LinkWithAnalytics
          type="custom"
          onPress={() => {
            navigateTo('Copays')
            logAnalyticsEvent(Events.vama_webview(LINK_URL_ASK_VA_GOV))
            navigateTo('Webview', {
              url: LINK_URL_ASK_VA_GOV,
              displayTitle: vaGovWebviewTitle(t),
              loadingMessage: t('loading.vaWebsite'),
              useSSO: true,
            })
          }}
          text={t('copays.help.askVA')}
          a11yLabel={a11yLabelVA(t('copays.help.askVA'))}
          a11yHint={t('copays.help.askVAA11yHint')}
          testID='copayHelpAskVA'
        />
      </Box>
    </LargePanel>
  )
}

export default CopayHelp
