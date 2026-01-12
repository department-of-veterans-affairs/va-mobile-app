import { useSelector } from 'react-redux'

import { RootState } from 'store'
import {
  AuthState,
  cancelWebLogin,
  handleTokenCallbackUrl,
  sendLoginFailedAnalytics,
  sendLoginStartAnalytics,
} from 'store/slices/authSlice'
import { logNonFatalErrorToFirebase } from 'utils/analytics'
import { isErrorObject } from 'utils/common'
import { useAppDispatch } from 'utils/hooks'
import { isIOS } from 'utils/platform'
import { startAuthSession } from 'utils/rnAuthSesson'

/**
 * Launches the native auth implementation and navigates to VA.gov login. For iOS,
 * promise lasts the duration of the WebView being open, whereas on Android it lasts
 * only for the launching of Custom Tab
 * @returns Promise<void>
 */
export const useStartAuth = (): (() => Promise<void>) => {
  const dispatch = useAppDispatch()
  const { codeChallenge, authorizeStateParam } = useSelector<RootState, AuthState>((state) => state.auth)

  const startAuth = async () => {
    dispatch(sendLoginStartAnalytics(false))
    const iOS = isIOS()
    console.debug('useStartAuth: STARTING AUTH', {
      codeChallenge: codeChallenge ? 'PRESENT' : 'MISSING',
      state: authorizeStateParam || 'MISSING',
    })
    try {
      const callbackUrl = await startAuthSession(codeChallenge || '', authorizeStateParam || '')
      if (iOS) {
        dispatch(handleTokenCallbackUrl(callbackUrl))
      }
    } catch (e) {
      // For iOS, code "000" comes back from the RCT bridge if the user cancelled the log in
      // all other errors are code '001'
      if (isErrorObject(e)) {
        if (iOS && e.code === '000') {
          dispatch(cancelWebLogin())
        } else {
          logNonFatalErrorToFirebase(e, `${iOS ? 'iOS' : 'Android'} Login Error`)
          dispatch(sendLoginFailedAnalytics(e))
        }
      }
    }
  }

  return startAuth
}
