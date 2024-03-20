import { useHandleTokenCallbackUrl } from 'api/auth'
import { Events } from 'constants/analytics'
import { logAnalyticsEvent, logNonFatalErrorToFirebase } from 'utils/analytics'
import { isErrorObject } from 'utils/common'
import { pkceAuthorizeParams } from 'utils/oauth'
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
  const startAuth = async () => {
    await logAnalyticsEvent(Events.vama_login_start(true, false))
    const iOS = isIOS()
    try {
      const { codeChallenge } = await pkceAuthorizeParams()
      const callbackUrl = await startAuthSession(codeChallenge || '')
      if (iOS) {
        await handleTokenCallbackUrl(callbackUrl)
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
