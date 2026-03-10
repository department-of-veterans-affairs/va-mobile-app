import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'

import { LinkInline } from 'api/types'
import LinkWithAnalytics from 'components/LinkWithAnalytics/LinkWithAnalytics'
import { getLinkUrl } from 'components/StructuredContentRenderer/utils'
import { NAMESPACE } from 'constants/namespaces'
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
  const { t } = useTranslation(NAMESPACE.COMMON)

  const onPress = () => {
    if (isWebview) {
      navigateTo('Webview', {
        url,
        displayTitle: vaGovWebviewTitle(t),
        loadingMessage: t('webview.claims.loading'),
      })
    } else if (isDirectDepositProfileUrl(url)) {
      navigateTo('DirectDeposit')
    } else {
      launchExternalLink(url)
    }
  }

  const showLaunchIcon = !isWebview && !isDirectDepositProfileUrl(url)

  return (
    <LinkWithAnalytics
      type="custom"
      text={text}
      a11yLabel={text}
      onPress={onPress}
      icon={showLaunchIcon ? { name: 'Launch' } : 'no icon'}
    />
  )
}

export default StructuredContentLink
