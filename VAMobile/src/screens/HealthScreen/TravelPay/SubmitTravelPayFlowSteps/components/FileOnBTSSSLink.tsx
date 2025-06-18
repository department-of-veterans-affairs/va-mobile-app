import React from 'react'
import { useTranslation } from 'react-i18next'

import { LinkWithAnalytics } from 'components'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { logAnalyticsEvent } from 'utils/analytics'
import getEnv from 'utils/env'
import { useRouteNavigation } from 'utils/hooks'

const { LINK_URL_TRAVEL_PAY_FILE_CLAIM_BTSSS } = getEnv()

type FileOnBTSSSLinkProps = {
  text: string
  onBeforeOpenWebview?: () => void
  testID?: string
}

export default function FileOnBTSSSLink({ onBeforeOpenWebview, text, testID }: FileOnBTSSSLinkProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const navigateTo = useRouteNavigation()

  return (
    <LinkWithAnalytics
      type="custom"
      text={text}
      testID={testID}
      onPress={() => {
        onBeforeOpenWebview?.()
        logAnalyticsEvent(Events.vama_webview(LINK_URL_TRAVEL_PAY_FILE_CLAIM_BTSSS))
        navigateTo('Webview', {
          url: LINK_URL_TRAVEL_PAY_FILE_CLAIM_BTSSS,
          displayTitle: t('travelPay.webview.fileForTravelPay.title'),
          loadingMessage: t('loading.vaWebsite'),
          useSSO: true,
        })
      }}
    />
  )
}
