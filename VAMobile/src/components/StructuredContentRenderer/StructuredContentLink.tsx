import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'

import { useNavigation } from '@react-navigation/native'

import { LinkInline } from 'api/types'
import LinkWithAnalytics from 'components/LinkWithAnalytics/LinkWithAnalytics'
import { getDefinedAnalyticsProps } from 'components/LinkWithAnalytics/utils'
import { getLinkUrl } from 'components/StructuredContentRenderer/utils'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { logAnalyticsEvent } from 'utils/analytics'
import { useExternalLink, useRouteNavigation } from 'utils/hooks'
import { vaGovWebviewTitle } from 'utils/webview'

/** True if the URL is the VA.gov profile direct deposit path (any env). */
const isDirectDepositProfileUrl = (url: string): boolean => {
  try {
    const path = new URL(url, 'https://www.va.gov').pathname
    return path === '/profile/direct-deposit'
  } catch {
    return url.includes('profile/direct-deposit')
  }
}

type StructuredContentLinkProps = {
  content: LinkInline
}

/**
 * Renders a link from structured content (e.g. evidence request overrides) with
 * ticket-specific behavior: in-app webview when isWebview, in-app Direct Deposit
 * screen for profile direct deposit URL, otherwise external browser.
 */
const StructuredContentLink: FC<StructuredContentLinkProps> = ({ content }) => {
  const url = getLinkUrl(content.href)
  const text = content.mobileText ?? content.text
  const { isWebview } = content

  const launchExternalLink = useExternalLink()
  const navigateTo = useRouteNavigation()
  const navigation = useNavigation()
  const { t } = useTranslation(NAMESPACE.COMMON)

  const definedAnalyticsProps = getDefinedAnalyticsProps({
    type: 'url',
    url,
    text,
    a11yLabel: text,
  })

  const onPress = () => {
    logAnalyticsEvent(Events.vama_link_click({ url, ...definedAnalyticsProps }))
    if (isWebview) {
      navigateTo('Webview', {
        url,
        displayTitle: vaGovWebviewTitle(t),
        loadingMessage: t('webview.claims.loading'),
      })
    } else if (isDirectDepositProfileUrl(url)) {
      const rootNav = navigation.getParent()?.getParent()
      if (rootNav) {
        ;(rootNav as unknown as { navigate: (name: string, params?: object) => void }).navigate('DirectDeposit')
      } else {
        launchExternalLink(url, definedAnalyticsProps)
      }
    } else {
      launchExternalLink(url, definedAnalyticsProps)
    }
  }

  return <LinkWithAnalytics type="custom" text={text} a11yLabel={text} onPress={onPress} icon={{ name: 'Launch' }} />
}

export default StructuredContentLink
