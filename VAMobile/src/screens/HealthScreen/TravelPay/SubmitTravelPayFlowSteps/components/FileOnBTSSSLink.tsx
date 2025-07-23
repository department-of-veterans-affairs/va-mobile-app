import React from 'react'

import { LinkWithAnalytics } from 'components'
import { Events } from 'constants/analytics'
import { logAnalyticsEvent } from 'utils/analytics'
import getEnv from 'utils/env'

const { LINK_URL_GO_TO_BTSSS } = getEnv()

type FileOnBTSSSLinkProps = {
  text: string
  testID?: string
}

export default function FileOnBTSSSLink({ text, testID }: FileOnBTSSSLinkProps) {
  return (
    <LinkWithAnalytics
      type="url"
      text={text}
      testID={testID}
      url={LINK_URL_GO_TO_BTSSS}
      analyticsOnPress={() => {
        logAnalyticsEvent(Events.vama_webview(LINK_URL_GO_TO_BTSSS))
      }}
    />
  )
}
