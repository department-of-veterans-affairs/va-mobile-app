import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'

import { LinkInline } from 'api/types'
import LinkWithAnalytics from 'components/LinkWithAnalytics/LinkWithAnalytics'
import { getLinkUrl } from 'components/StructuredContentRenderer/utils'
import { NAMESPACE } from 'constants/namespaces'
import { useRouteNavigation } from 'utils/hooks'
import { vaGovWebviewTitle } from 'utils/webview'

/** True if the URL is the VA.gov profile direct deposit path (relative or absolute from va.gov). */
const isDirectDepositProfileUrl = (url: string): boolean => {
  const path = '/profile/direct-deposit'
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    try {
      const resolvedPath = new URL(url, 'https://www.va.gov').pathname
      return resolvedPath === path
    } catch {
      return url.includes('profile/direct-deposit')
    }
  }
  try {
    const parsed = new URL(url)
    const isVaGov = parsed.hostname === 'va.gov' || parsed.hostname.endsWith('.va.gov')
    return isVaGov && parsed.pathname === path
  } catch {
    return false
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
