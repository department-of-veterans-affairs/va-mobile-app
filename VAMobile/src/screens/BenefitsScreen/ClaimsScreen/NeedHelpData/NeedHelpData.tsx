import React from 'react'
import { useTranslation } from 'react-i18next'

import { useSnackbar } from '@department-of-veterans-affairs/mobile-component-library'

import { Box, ClickToCallPhoneNumber, LinkWithAnalytics, TextArea, TextView } from 'components'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { a11yLabelVA } from 'utils/a11yLabel'
import { logAnalyticsEvent } from 'utils/analytics'
import getEnv from 'utils/env'
import { displayedTextPhoneNumber } from 'utils/formattingUtils'
import { useRouteNavigation, useTheme } from 'utils/hooks'
import { showOfflineSnackbar, useAppIsOnline } from 'utils/hooks/offline'

const { LINK_URL_CLAIM_APPEAL_STATUS } = getEnv()

type NeedHelpDataProps = {
  appealId?: string
}

function NeedHelpData({ appealId }: NeedHelpDataProps) {
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const navigateTo = useRouteNavigation()
  const isConnected = useAppIsOnline()
  const snackbar = useSnackbar()

  function renderAppealData() {
    if (!appealId) {
      return <></>
    }

    return (
      <Box mt={theme.dimensions.standardMarginBetween}>
        {/*eslint-disable-next-line react-native-a11y/has-accessibility-hint*/}
        <TextView variant="MobileBody" accessibilityLabel={a11yLabelVA(t('appealDetails.viewMoreDetails'))}>
          {t('appealDetails.viewMoreDetails')}
        </TextView>
        <Box mt={theme.dimensions.standardMarginBetween}>
          <LinkWithAnalytics
            type="custom"
            onPress={() => {
              if (!isConnected) {
                showOfflineSnackbar(snackbar, t)
                return
              }

              logAnalyticsEvent(Events.vama_webview(LINK_URL_CLAIM_APPEAL_STATUS, appealId))
              navigateTo('Webview', {
                url: LINK_URL_CLAIM_APPEAL_STATUS + appealId,
                displayTitle: t('webview.vagov'),
                loadingMessage: t('webview.claims.loading'),
                useSSO: true,
              })
            }}
            text={t('goToVAGov')}
            a11yLabel={a11yLabelVA(t('goToVAGov'))}
            a11yHint={t('appealDetails.goToVAGovA11yHint')}
            testID="goToVAGovID"
          />
        </Box>
      </Box>
    )
  }

  return (
    <TextArea>
      <TextView variant="MobileBodyBold" accessibilityRole="header" accessible={true}>
        {t('claimDetails.needHelp')}
      </TextView>
      {/*eslint-disable-next-line react-native-a11y/has-accessibility-hint*/}
      <TextView
        variant="MobileBody"
        mb={theme.dimensions.standardMarginBetween}
        accessible={true}
        accessibilityLabel={t('claimDetails.callVA.a11yLabel')}>
        {t('claimDetails.callVA')}
      </TextView>
      <ClickToCallPhoneNumber phone={displayedTextPhoneNumber(t('8008271000'))} />
      {renderAppealData()}
    </TextArea>
  )
}

export default NeedHelpData
