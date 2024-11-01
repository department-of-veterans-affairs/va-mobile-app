import { useQueryClient } from '@tanstack/react-query'

import { useHandleTokenCallbackUrl } from 'api/auth'
import { Events } from 'constants/analytics'
import { logAnalyticsEvent, logNonFatalErrorToFirebase } from 'utils/analytics'
import { generateCodeVerifierAndChallenge } from 'utils/auth'
import { isErrorObject } from 'utils/common'
import { isIOS } from 'utils/platform'
import { startAuthSession } from 'utils/rnAuthSesson'

/**
 * Launches the native auth implementation and navigates to VA.gov login. For iOS,
 * promise lasts the duration of the WebView being open, whereas on Android it lasts
 * only for the launching of Custom Tab
 * @returns Promise<void>
 */
export const useStartAuth = (): (() => Promise<void>) => {
  const { mutate: handleTokenCallbackUrl } = useHandleTokenCallbackUrl()
  const queryClient = useQueryClient()
  const startAuth = async () => {
    const codeChallenge = await generateCodeVerifierAndChallenge()
    await logAnalyticsEvent(Events.vama_login_start(true, false))
    const iOS = isIOS()
    try {
      const callbackUrl = await startAuthSession(codeChallenge)
      const params = {
        url: callbackUrl,
        queryClient: queryClient,
      }
      if (iOS) {
        await handleTokenCallbackUrl(params)
      }
    } catch (e) {
      // For iOS, code "000" comes back from the RCT bridge if the user cancelled the log in
      // all other errors are code '001'
      if (isErrorObject(e)) {
        if (iOS && e.code === '000') {
          await logAnalyticsEvent(Events.vama_login_closed(true))
        } else {
          logNonFatalErrorToFirebase(e, `${iOS ? 'iOS' : 'Android'} Login Error`)
          await logAnalyticsEvent(Events.vama_login_fail(e, true))
        }
      }
    }
  }

  return startAuth
}
