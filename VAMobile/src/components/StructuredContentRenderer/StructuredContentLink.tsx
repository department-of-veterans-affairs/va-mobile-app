import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'

import { LinkInline } from 'api/types'
import LinkWithAnalytics from 'components/LinkWithAnalytics/LinkWithAnalytics'
import { getLinkUrl } from 'components/StructuredContentRenderer/utils'
import { NAMESPACE } from 'constants/namespaces'
import { useRouteNavigation } from 'utils/hooks'
import { vaGovWebviewTitle } from 'utils/webview'

/**
 * Checks whether a URL points to the VA.gov direct deposit profile page so the
 * app can intercept it and navigate to the native Direct Deposit screen instead.
 * Accepts both relative paths (e.g. "/profile/direct-deposit") and absolute
 * VA.gov URLs from any environment (e.g. "https://staging.va.gov/profile/direct-deposit").
 * Non-VA.gov absolute URLs are rejected to avoid false positives.
 */
const isDirectDepositProfileUrl = (url: string): boolean => {
  try {
    const { hostname, pathname } = new URL(url, 'https://www.va.gov')
    const isVaGov = hostname === 'va.gov' || hostname.endsWith('.va.gov')
    return isVaGov && pathname === '/profile/direct-deposit'
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
 * screen for profile direct deposit URL, otherwise external browser via LinkWithAnalytics type="url".
 */
const StructuredContentLink: FC<StructuredContentLinkProps> = ({ content }) => {
  const url = getLinkUrl(content.href)
  const text = content.mobileText ?? content.text
  const { isWebview } = content

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
    }
  }

  const external = !isWebview && !isDirectDepositProfileUrl(url)
  if (external) {
    return <LinkWithAnalytics type="url" url={url} text={text} />
  }

  return <LinkWithAnalytics type="custom" text={text} a11yLabel={text} onPress={onPress} />
}

export default StructuredContentLink
