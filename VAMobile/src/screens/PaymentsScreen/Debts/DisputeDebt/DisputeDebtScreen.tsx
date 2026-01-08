import React from 'react'
import { Trans, useTranslation } from 'react-i18next'

import { StackScreenProps } from '@react-navigation/stack'

import { Box, FeatureLandingTemplate, LinkWithAnalytics, TextArea, TextView } from 'components'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { PaymentsStackParamList } from 'screens/PaymentsScreen/PaymentsStackScreens'
import { logAnalyticsEvent } from 'utils/analytics'
import getEnv from 'utils/env'
import { useRouteNavigation, useTheme } from 'utils/hooks'

type DisputeDebtScreenProps = StackScreenProps<PaymentsStackParamList, 'DisputeDebt'>

const { LINK_URL_DISPUTE_DEBT } = getEnv()

function DisputeDebtScreen({ navigation }: DisputeDebtScreenProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const navigateTo = useRouteNavigation()
  const { contentMarginBottom, condensedMarginBetween } = theme.dimensions

  return (
    <FeatureLandingTemplate
      backLabelOnPress={navigation.goBack}
      title={t('debts.disputeDebt.title')}
      testID="disputeDebtTestID"
      backLabelTestID="disputeDebtBackTestID">
      <Box mb={contentMarginBottom}>
        <TextArea>
          <Trans
            i18nKey="debts.disputeDebt.copy"
            components={{
              p: <TextView mb={condensedMarginBetween} variant="MobileBody" />,
              bold: <TextView variant="MobileBodyBold" />,
            }}
          />

          <Box mt={condensedMarginBetween}>
            <LinkWithAnalytics
              type="custom"
              onPress={() => {
                logAnalyticsEvent(Events.vama_webview(LINK_URL_DISPUTE_DEBT))
                navigateTo('Webview', {
                  url: LINK_URL_DISPUTE_DEBT,
                  displayTitle: t('webview.vagov'),
                  loadingMessage: t('loading.vaWebsite'),
                  useSSO: false,
                })
              }}
              text={t('debts.disputeDebt.link')}
              testID="start-debt-dispute-link"
            />
          </Box>
        </TextArea>
      </Box>
    </FeatureLandingTemplate>
  )
}

export default DisputeDebtScreen
