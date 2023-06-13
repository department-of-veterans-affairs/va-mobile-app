import { useSelector } from 'react-redux'
import React, { FC, useEffect } from 'react'

import { AuthParamsLoadingStateTypeConstants } from 'store/api/types/auth'
import { AuthState, cancelWebLogin, handleTokenCallbackUrl, sendLoginFailedAnalytics, sendLoginStartAnalytics, setPKCEParams } from 'store/slices/authSlice'
import { RootState } from 'store'
import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import { WebviewStackParams } from '../../WebviewScreen/WebviewScreen'
import { isErrorObject } from 'utils/common'
import { logNonFatalErrorToFirebase } from 'utils/analytics'
import { startAuthSession } from 'utils/rnAuthSesson'
import { useAppDispatch } from 'utils/hooks'

type WebviewLoginProps = StackScreenProps<WebviewStackParams, 'Webview'>
const WebviewLogin: FC<WebviewLoginProps> = ({ navigation }) => {
  const dispatch = useAppDispatch()
  const { codeChallenge, authorizeStateParam, authParamsLoadingState } = useSelector<RootState, AuthState>((state) => state.auth)

  useEffect(() => {
    if (authParamsLoadingState === AuthParamsLoadingStateTypeConstants.INIT) {
      dispatch(setPKCEParams())
    }
  }, [authParamsLoadingState, dispatch])

  useEffect(() => {
    const startAuth = async () => {
      dispatch(sendLoginStartAnalytics())
      try {
        const callbackUrl = await startAuthSession(codeChallenge || '', authorizeStateParam || '')
        dispatch(handleTokenCallbackUrl(callbackUrl))
      } catch (e) {
        // code "000" comes back from the RCT bridge if the user cancelled the log in, all other errors are code '001'
        if (isErrorObject(e)) {
          if (e.code === '000') {
            dispatch(cancelWebLogin())
            navigation.goBack()
          } else {
            logNonFatalErrorToFirebase(e, 'iOS Login Error')
            dispatch(sendLoginFailedAnalytics(e))
          }
        }
      }
    }
    if (authParamsLoadingState === AuthParamsLoadingStateTypeConstants.READY) {
      startAuth()
    }
  }, [authParamsLoadingState, codeChallenge, authorizeStateParam, dispatch, navigation])

  return <></>
}

export default WebviewLogin
