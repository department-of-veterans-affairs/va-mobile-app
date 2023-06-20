import { AuthState, cancelWebLogin, handleTokenCallbackUrl, sendLoginFailedAnalytics, sendLoginStartAnalytics } from 'store/slices/authSlice'
import { RootState } from 'store'
import { isErrorObject } from 'utils/common'
import { isIOS } from 'utils/platform'
import { logNonFatalErrorToFirebase } from 'utils/analytics'
import { startAuthSession } from 'utils/rnAuthSesson'
import { useAppDispatch } from '.'
import { useSelector } from 'react-redux'

export const useStartAuth = (): (() => Promise<void>) => {
  const dispatch = useAppDispatch()
  const { codeChallenge, authorizeStateParam } = useSelector<RootState, AuthState>((state) => state.auth)

  const startAuth = async () => {
    dispatch(sendLoginStartAnalytics())
    try {
      const callbackUrl = await startAuthSession(codeChallenge || '', authorizeStateParam || '')
      if (isIOS()) {
        dispatch(handleTokenCallbackUrl(callbackUrl))
      }
    } catch (e) {
      // code "000" comes back from the RCT bridge if the user cancelled the log in, all other errors are code '001'
      if (isErrorObject(e)) {
        if (e.code === '000') {
          dispatch(cancelWebLogin())
        } else {
          logNonFatalErrorToFirebase(e, 'iOS Login Error')
          dispatch(sendLoginFailedAnalytics(e))
        }
      }
    }
  }

  return startAuth
}
