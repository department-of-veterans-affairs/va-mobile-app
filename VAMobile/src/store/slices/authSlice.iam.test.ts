import * as Keychain from 'react-native-keychain'
import AsyncStorage from '@react-native-async-storage/async-storage'
import _ from 'underscore'

import { TrackedStore, context, fetch, generateRandomString, realStore, when } from 'testUtils'
import { isAndroid } from '../../utils/platform'
import getEnv from '../../utils/env'
import * as api from '../api'
import {
  cancelWebLogin,
  checkFirstTimeLogin,
  dispatchInitializeAction,
  dispatchStoreAuthorizeParams,
  getAuthLoginPromptType,
  handleTokenCallbackUrl,
  initializeAuth,
  logout,
  setBiometricsPreference,
  setDisplayBiometricsPreferenceScreen,
  startBiometricsLogin,
  startWebLogin,
} from './authSlice'
import { AUTH_STORAGE_TYPE, LoginServiceTypeConstants, LOGIN_PROMPT_TYPE } from 'store/api/types'
import { featureEnabled } from 'utils/remoteConfig'

export const ActionTypes: {
  AUTH_START_LOGIN: string
  AUTH_FINISH_LOGIN: string
  AUTH_INITIALIZE: string
  AUTH_SET_DISPLAY_BIOMETRICS_PREFERENCE_SCREEN: string
} = {
  AUTH_START_LOGIN: 'auth/dispatchStartAuthLogin',
  AUTH_FINISH_LOGIN: 'auth/dispatchFinishAuthLogin',
  AUTH_INITIALIZE: 'auth/dispatchInitializeAction',
  AUTH_SET_DISPLAY_BIOMETRICS_PREFERENCE_SCREEN: 'auth/dispatchSetDisplayBiometricsPreferenceScreen',
}

jest.mock('utils/remoteConfig')

jest.mock('../../utils/platform', () => ({
  isAndroid: jest.fn(() => false),
  isIOS: jest.fn(),
}))

jest.mock('../../utils/env', () =>
  jest.fn(() => ({
    AUTH_IAM_CLIENT_SECRET: 'TEST_SECRET',
    AUTH_IAM_CLIENT_ID: 'VAMobile',
    AUTH_IAM_REDIRECT_URL: 'vamobile://login-success',
    AUTH_IAM_SCOPES: 'openid',
    AUTH_IAM_ENDPOINT: 'https://test.gov/oauth/authorize',
    AUTH_IAM_TOKEN_EXCHANGE_URL: 'https://test.gov/oauth/token',
    AUTH_IAM_REVOKE_URL: 'https://test.gov/oauth/revoke',
  })),
)

jest.mock('@react-native-firebase/analytics', () => {
  return () => ({
    logEvent: jest.fn(),
    setUserProperty: jest.fn(),
    setAnalyticsCollectionEnabled: jest.fn(),
  })
})

jest.mock('@react-native-firebase/perf', () => {
  return () => ({
    setPerformanceCollectionEnabled: jest.fn(),
  })
})

const getItemMock = AsyncStorage.getItem as jest.Mock
const mockFeatureEnabled = featureEnabled as jest.Mock

const defaultEnvParams = {
  AUTH_IAM_CLIENT_SECRET: 'TEST_SECRET',
  AUTH_IAM_CLIENT_ID: 'VAMobile',
  AUTH_IAM_REDIRECT_URL: 'vamobile://login-success',
  AUTH_IAM_SCOPES: 'openid',
  AUTH_IAM_ENDPOINT: 'https://test.gov/oauth/authorize',
  AUTH_IAM_TOKEN_EXCHANGE_URL: 'https://test.gov/oauth/token',
  AUTH_IAM_REVOKE_URL: 'https://test.gov/oauth/revoke',
}

const sampleIdToken = 'TEST_TOKEN';

context('authAction IAM', () => {
  let testAccessToken: string
  let testRefreshToken: string
  beforeEach(() => {
    testAccessToken = generateRandomString()
    testRefreshToken = generateRandomString()
    const envMock = getEnv as jest.Mock
    envMock.mockReturnValue(defaultEnvParams)
    when(mockFeatureEnabled).calledWith('SIS').mockReturnValue(false)
    when(getItemMock).calledWith('refreshTokenType').mockResolvedValue(LoginServiceTypeConstants.IAM)

    when(getItemMock).calledWith('refreshTokenType').mockResolvedValue(LoginServiceTypeConstants.IAM)
    when(getItemMock).calledWith('@store_creds_bio').mockResolvedValue(AUTH_STORAGE_TYPE.BIOMETRIC)

    const isAndroidMock = isAndroid as jest.Mock
    isAndroidMock.mockReturnValue(false)

    when(api.get as jest.Mock)
      .calledWith('/v1/user')
      .mockResolvedValue({
        data: {
          attributes: {
            id: '124',
          },
        },
      })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('startWebLogin', () => {
    it('should set authUrl to be launched', async () => {
      const store = realStore()
      expect(store.getState().auth.webLoginUrl).toBeFalsy()
      await store.dispatch(startWebLogin())
      expect(store.getState().auth.webLoginUrl).toBeTruthy()
    })
  })

  describe('cancelWebLogin', () => {
    it('should clear webLoginUrl', async () => {
      const store = realStore()
      expect(store.getState().auth.webLoginUrl).toBeFalsy()
      await store.dispatch(startWebLogin())
      expect(store.getState().auth.webLoginUrl).toBeTruthy()
      await store.dispatch(cancelWebLogin())
      expect(store.getState().auth.webLoginUrl).toBeFalsy()
    })
  })

  describe('logout', () => {
    it('should revoke the token and log the user out', async () => {
      const revokeResponse = () => {
        return Promise.resolve({})
      }
      fetch.mockResolvedValue(Promise.resolve({ status: 200, text: () => Promise.resolve(''), json: revokeResponse }))
      when(getItemMock).calledWith('@store_creds_bio').mockResolvedValue(AUTH_STORAGE_TYPE.BIOMETRIC)

      const store = realStore()
      await store.dispatch(handleTokenCallbackUrl('asdfasdfasdf'))
      store.dispatch(dispatchInitializeAction({ loggedIn: true, canStoreWithBiometric: false, shouldStoreWithBiometric: false, loginPromptType: LOGIN_PROMPT_TYPE.UNLOCK }))
      expect(store.getState().auth.loggedIn).toBeTruthy()

      await store.dispatch(logout())
      const revokeUrl = 'https://test.gov/oauth/revoke'
      expect(fetch).toHaveBeenCalledWith(revokeUrl, expect.anything())

      expect(Keychain.resetInternetCredentials).toHaveBeenCalled()
      expect(store.getState().auth.loggedIn).toBeFalsy()
      expect(store.getState().auth.loading).toBeFalsy()
    })

    it('should skip logout fetch if refresh token type does not match login type from SIS', async () => {
      // default is IAM, so setting refreshTokenType to SIS should invoke a mismatch
      when(getItemMock).calledWith('refreshTokenType').mockResolvedValue(LoginServiceTypeConstants.SIS)

      const store = realStore()
      await store.dispatch(handleTokenCallbackUrl('asdfasdfasdf'))
      store.dispatch(dispatchInitializeAction({ loggedIn: true, canStoreWithBiometric: false, shouldStoreWithBiometric: false, loginPromptType: LOGIN_PROMPT_TYPE.UNLOCK }))
      expect(store.getState().auth.loggedIn).toBeTruthy()

      await store.dispatch(logout())
      expect(fetch).not.toHaveBeenCalled()
      expect(Keychain.resetInternetCredentials).toHaveBeenCalled()
      expect(store.getState().auth.loggedIn).toBeFalsy()
      expect(store.getState().auth.loading).toBeFalsy()
    })
  })

  describe('handleTokenCallbackUrl', () => {
    let store: TrackedStore
    const DEV: boolean = global.__DEV__
    beforeEach(() => {
      store = realStore()
      store.dispatch(dispatchInitializeAction({ loggedIn: true, canStoreWithBiometric: false, shouldStoreWithBiometric: false, loginPromptType: LOGIN_PROMPT_TYPE.LOGIN }))

      // Temporarily set __DEV__ false to not hit our dev-only convenience refresh token
      global.__DEV__ = false
    })

    afterEach(() => {
      // Restore __DEV__ variable
      global.__DEV__ = DEV
    })

    it('should handle malformed urls', async () => {
      await store.dispatch(handleTokenCallbackUrl('asdfasdfasdf'))
      const actions = store.getActions()
      const startAction = _.find(actions, { type: ActionTypes.AUTH_START_LOGIN })
      expect(startAction).toBeTruthy()
      expect(startAction?.state.auth.loading).toBeTruthy()
      const endAction = _.find(actions, { type: ActionTypes.AUTH_FINISH_LOGIN })
      expect(endAction?.state.auth.loading).toBeFalsy()
      expect(endAction?.state.auth.loggedIn).toBeFalsy()
      expect(endAction).toBeTruthy()
      expect(endAction?.payload.error).toBeTruthy()
    })

    it('should handle empty code', async () => {
      await store.dispatch(handleTokenCallbackUrl('vamobile://login-success?code=&state=2355adfs'))
      const actions = store.getActions()
      const startAction = _.find(actions, { type: ActionTypes.AUTH_START_LOGIN })
      expect(startAction).toBeTruthy()
      const endAction = _.find(actions, { type: ActionTypes.AUTH_FINISH_LOGIN })
      expect(endAction).toBeTruthy()
      expect(endAction?.payload.error).toBeTruthy()
    })

    it('should parse code and state correctly and login', async () => {
      const tokenResponse = () => {
        return Promise.resolve({
          access_token: testAccessToken,
          refresh_token: testRefreshToken,
          id_token: sampleIdToken,
        })
      }
      const prefMock = AsyncStorage.getItem as jest.Mock
      prefMock.mockResolvedValue(null)
      fetch.mockResolvedValue({ status: 200, json: tokenResponse })
      store.dispatch(dispatchStoreAuthorizeParams({ codeVerifier: 'mylongcodeverifier', codeChallenge: 'mycodechallenge', authorizeStateParam: '2355adfs' }))
      await store.dispatch(handleTokenCallbackUrl('vamobile://login-success?code=FOO34asfa&state=2355adfs'))
      const actions = store.getActions()
      const startAction = _.find(actions, { type: ActionTypes.AUTH_START_LOGIN })
      expect(startAction).toBeTruthy()
      const endAction = _.find(actions, { type: ActionTypes.AUTH_FINISH_LOGIN })
      expect(endAction).toBeTruthy()
      expect(endAction?.payload.authCredentials).toEqual(
        expect.objectContaining({
          access_token: testAccessToken,
          refresh_token: testRefreshToken,
          id_token: sampleIdToken,
        }),
      )
      expect(endAction?.payload.error).toBeFalsy()
      // no biometrics available, don't save token
      expect(Keychain.setInternetCredentials).not.toHaveBeenCalled()

      const tokenUrl = 'https://test.gov/oauth/token'

      const tokenPayload = expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=authorization_code&code_verifier=mylongcodeverifier&code=FOO34asfa&client_id=VAMobile&client_secret=TEST_SECRET&redirect_uri=vamobile%3A%2F%2Flogin-success',
      })
      expect(fetch).toHaveBeenCalledWith(tokenUrl, tokenPayload)
    })

    describe('when biometrics is available and biometrics is preferred', () => {
      it('should save the token with biometric protection', async () => {
        const kcMockSupported = Keychain.getSupportedBiometryType as jest.Mock
        kcMockSupported.mockResolvedValue(Promise.resolve(Keychain.BIOMETRY_TYPE.TOUCH_ID))

        const prefMock = AsyncStorage.getItem as jest.Mock
        prefMock.mockResolvedValue(AUTH_STORAGE_TYPE.BIOMETRIC)

        const tokenResponse = () => {
          return Promise.resolve({
            access_token: testAccessToken,
            refresh_token: testRefreshToken,
          })
        }
        fetch.mockResolvedValue(Promise.resolve({ status: 200, json: tokenResponse }))
        await store.dispatch(handleTokenCallbackUrl('vamobile://login-success?code=FOO34asfa&state=2355adfs'))
        const authState = store.getState().auth

        // we shouldn't be logged in until the user decides how to store refreshToken
        expect(authState.loggedIn).toBeTruthy()
        const expectedOpts = expect.objectContaining({
          accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_ANY,
          accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
          authenticationType: Keychain.AUTHENTICATION_TYPE.BIOMETRICS,
        })
        expect(Keychain.setInternetCredentials).toHaveBeenCalledWith('vamobile', 'user', testRefreshToken, expectedOpts)
      })
    })

    describe('when biometrics is not available', () => {
      it('should not save the refresh token', async () => {
        const kcMockSupported = Keychain.getSupportedBiometryType as jest.Mock
        kcMockSupported.mockResolvedValue(null)

        const prefMock = AsyncStorage.getItem as jest.Mock
        prefMock.mockResolvedValue(null)

        const tokenResponse = () => {
          return Promise.resolve({
            access_token: testAccessToken,
            refresh_token: testRefreshToken,
          })
        }
        fetch.mockResolvedValue({ status: 200, json: tokenResponse })
        await store.dispatch(handleTokenCallbackUrl('vamobile://login-success?code=FOO34asfa&state=2355adfs'))
        const authState = store.getState().auth

        // we shouldn't be logged in until the user decides how to store refreshToken
        expect(authState.loggedIn).toBeTruthy()
        expect(Keychain.setInternetCredentials).not.toHaveBeenCalled()
      })

      describe('when in the development environment (__DEV__=true)', () => {
        beforeEach(() => {
          global.__DEV__ = true
        })
        it('should save the refresh token even if biometrics not available', async () => {
          const kcMockSupported = Keychain.getSupportedBiometryType as jest.Mock
          kcMockSupported.mockResolvedValue(null)

          const prefMock = AsyncStorage.getItem as jest.Mock
          prefMock.mockResolvedValue(null)

          const tokenResponse = () => {
            return Promise.resolve({
              access_token: testAccessToken,
              refresh_token: testRefreshToken,
            })
          }
          fetch.mockResolvedValue({ status: 200, json: tokenResponse })
          await store.dispatch(handleTokenCallbackUrl('vamobile://login-success?code=FOO34asfa&state=2355adfs'))
          const authState = store.getState().auth

          // we shouldn't be logged in until the user decides how to store refreshToken
          expect(authState.loggedIn).toBeTruthy()
          expect(Keychain.setInternetCredentials).toHaveBeenCalled()
        })
      })
    })
  })

  describe('initializeAuth', () => {
    it('should handle no saved creds gracefully', async () => {
      const kcMock = Keychain.getInternetCredentials as jest.Mock
      kcMock.mockResolvedValue(Promise.resolve(false))
      const store = realStore()
      await store.dispatch(initializeAuth())
      const actions = store.getActions()
      const action = _.find(actions, { type: ActionTypes.AUTH_INITIALIZE })
      expect(action).toBeTruthy()
      const state = store.getState().auth
      expect(state.initializing).toBeFalsy()
      expect(state.loggedIn).toBeFalsy()
      expect(state.loginPromptType).toEqual(LOGIN_PROMPT_TYPE.LOGIN)
    })

    it('should handle bad saved creds gracefully', async () => {
      const kcMock = Keychain.getInternetCredentials as jest.Mock
      kcMock.mockResolvedValue(Promise.resolve({ password: '' }))
      const store = realStore()
      await store.dispatch(initializeAuth())
      const actions = store.getActions()
      const action = _.find(actions, { type: ActionTypes.AUTH_INITIALIZE })
      expect(action).toBeTruthy()
      const state = store.getState().auth
      expect(state.initializing).toBeFalsy()
      expect(state.loggedIn).toBeFalsy()
      expect(state.loginPromptType).toEqual(LOGIN_PROMPT_TYPE.LOGIN)
    })

    it('should handle bad auth token response with 200', async () => {
      const kcMock = Keychain.getInternetCredentials as jest.Mock
      kcMock.mockResolvedValue(Promise.resolve({ password: generateRandomString() }))
      const tokenResponse = () => {
        return Promise.resolve({
          access_token: testAccessToken,
          //refresh_token: testRefreshToken <-- we need this normally
        })
      }
      fetch.mockResolvedValue(Promise.resolve({ status: 200, json: tokenResponse }))

      const store = realStore()
      await store.dispatch(initializeAuth())
      const actions = store.getActions()
      const action = _.find(actions, { type: ActionTypes.AUTH_INITIALIZE })
      expect(action).toBeTruthy()
      // no errors for the initial load! only on refreshes afterward or logins
      expect(action?.payload.error).toBeFalsy()
      expect(fetch).toHaveBeenCalled()
      expect(Keychain.resetInternetCredentials).toHaveBeenCalled()
      const state = store.getState().auth
      expect(state.initializing).toBeFalsy()
      expect(state.loggedIn).toBeFalsy()
      expect(state.loginPromptType).toEqual(LOGIN_PROMPT_TYPE.LOGIN)
    })

    it('should log out and clear the token if refresh fails', async () => {
      fetch.mockResolvedValue(Promise.resolve({ status: 400, text: () => Promise.resolve('bad token') }))

      const store = realStore()
      await store.dispatch(initializeAuth())
      const actions = store.getActions()
      const action = _.find(actions, { type: ActionTypes.AUTH_INITIALIZE })
      expect(action).toBeTruthy()
      // expect no errors for initial init, just assume bad saved creds
      // and present login
      expect(action?.payload.error).toBeFalsy()
      expect(Keychain.resetInternetCredentials).toHaveBeenCalled()
      const state = store.getState().auth
      expect(state.initializing).toBeFalsy()
      expect(state.loggedIn).toBeFalsy()
      expect(state.loginPromptType).toEqual(LOGIN_PROMPT_TYPE.LOGIN)
    })

    it('should initialize with biometric stored creds appropriately', async () => {
      const prefMock = AsyncStorage.getItem as jest.Mock
      prefMock.mockResolvedValue(AUTH_STORAGE_TYPE.BIOMETRIC)
      const hic = Keychain.hasInternetCredentials as jest.Mock
      hic.mockResolvedValue(true)
      const store = realStore()

      const promptType = await getAuthLoginPromptType()
      expect(promptType).toEqual(LOGIN_PROMPT_TYPE.UNLOCK)

      await store.dispatch(initializeAuth())
      const actions = store.getActions()
      const action = _.find(actions, { type: ActionTypes.AUTH_INITIALIZE })
      expect(action).toBeTruthy()
      const state = store.getState().auth
      expect(state.initializing).toBeFalsy()
      expect(state.loading).toBeFalsy()
    })

    it('should handle getInternetCredentials throwing an exception', async () => {
      const kcMock = Keychain.getInternetCredentials as jest.Mock
      kcMock.mockRejectedValue('Some Error')
      const prefMock = AsyncStorage.getItem as jest.Mock
      prefMock.mockResolvedValue(AUTH_STORAGE_TYPE.NONE)
      const store = realStore()
      await store.dispatch(initializeAuth())
      const actions = store.getActions()
      const action = _.find(actions, { type: ActionTypes.AUTH_INITIALIZE })
      expect(action).toBeTruthy()
      const state = store.getState().auth
      expect(state.initializing).toBeFalsy()
      expect(state.loginPromptType).toEqual(LOGIN_PROMPT_TYPE.LOGIN)
      expect(state.loading).toBeFalsy()
      // in exception case, clear the creds, let the usre log in again
      expect(Keychain.resetInternetCredentials).toHaveBeenCalled()
    })
  })

  describe('startBiometricsLogin', () => {
    it('should refresh the access token and log the user in', async () => {
      const store = realStore()
      const kcMock = Keychain.getInternetCredentials as jest.Mock
      const hic = Keychain.hasInternetCredentials as jest.Mock
      hic.mockResolvedValue(true)
      const gsbt = Keychain.getSupportedBiometryType as jest.Mock
      gsbt.mockResolvedValue(Keychain.BIOMETRY_TYPE.TOUCH_ID)

      kcMock.mockResolvedValue(Promise.resolve({ password: testRefreshToken }))
      const tokenResponse = () => {
        return Promise.resolve({
          access_token: testAccessToken,
          refresh_token: testRefreshToken,
          id_token: sampleIdToken,
        })
      }
      fetch.mockResolvedValue(Promise.resolve({ status: 200, json: tokenResponse }))
      await store.dispatch(initializeAuth())

      const actions = store.getActions()

      // this is one of the differences between init and bio init
      // we should transition to a loading spinner here with AUTH_START_LOGIN
      // the ther flow (straight init with no bio unlock) never transitions
      // to loading because all the work occurs before initialized is tru
      const startAction = _.find(actions, { type: ActionTypes.AUTH_START_LOGIN })
      expect(startAction).toBeTruthy()
      expect(fetch).toHaveBeenCalled()

      const tokenUrl = 'https://test.gov/oauth/token'
      const tokenPaylaod = expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `refresh_token=${testRefreshToken}&grant_type=refresh_token&client_id=VAMobile&client_secret=TEST_SECRET&redirect_uri=vamobile%3A%2F%2Flogin-success`,
      })

      expect(fetch).toHaveBeenCalledWith(tokenUrl, tokenPaylaod)
      expect(Keychain.setInternetCredentials).toHaveBeenCalledWith('vamobile', 'user', testRefreshToken, expect.anything())
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('@store_creds_bio', 'BIOMETRIC')

      const state = store.getState().auth
      expect(state.authCredentials).toEqual(
        expect.objectContaining({
          access_token: testAccessToken,
          refresh_token: testRefreshToken,
          id_token: sampleIdToken,
        }),
      )
    })

    it('should skip token refresh and log the user out if there is a mismatch between refresh token type and sign in service', async () => {
      const store = realStore()
      const kcMock = Keychain.getInternetCredentials as jest.Mock

      // refreshTokenType is SIS but SIS is disabled by feature toggle
      when(getItemMock).calledWith('refreshTokenType').mockResolvedValue(LoginServiceTypeConstants.SIS)
      const hic = Keychain.hasInternetCredentials as jest.Mock
      hic.mockResolvedValue(true)
      const gsbt = Keychain.getSupportedBiometryType as jest.Mock
      gsbt.mockResolvedValue(Keychain.BIOMETRY_TYPE.TOUCH_ID)
      kcMock.mockResolvedValue(Promise.resolve({ password: testRefreshToken }))

      await store.dispatch(initializeAuth())

      expect(fetch).not.toHaveBeenCalled()
      expect(Keychain.resetInternetCredentials).toHaveBeenCalled()
      expect(store.getState().auth.loggedIn).toBeFalsy()
    })

    describe('android', () => {
      beforeEach(() => {
        const isAndroidMock = isAndroid as jest.Mock
        isAndroidMock.mockReturnValue(true)
      })

      it('should handle cancel biometric scan correctly', async () => {
        const hic = Keychain.hasInternetCredentials as jest.Mock
        hic.mockResolvedValue(true)
        const store = realStore()
        const kcMock = Keychain.getInternetCredentials as jest.Mock
        const prefMock = AsyncStorage.getItem as jest.Mock
        prefMock.mockResolvedValue(AUTH_STORAGE_TYPE.BIOMETRIC)

        kcMock.mockRejectedValue({ message: 'code: 13 msg: Cancel' })

        await store.dispatch(initializeAuth())
        await store.dispatch(startBiometricsLogin())
        const state = store.getState().auth

        expect(fetch).not.toHaveBeenCalled()

        expect(Keychain.setInternetCredentials).not.toHaveBeenCalled()
        expect(Keychain.resetInternetCredentials).not.toHaveBeenCalled()
        expect(state.loggedIn).toBeFalsy()
        expect(state.loginPromptType).toEqual(LOGIN_PROMPT_TYPE.UNLOCK)
      })
    })

    it('should handle bad stored values', async () => {
      const store = realStore()
      const kcMock = Keychain.getInternetCredentials as jest.Mock
      const prefMock = AsyncStorage.getItem as jest.Mock
      prefMock.mockResolvedValue(AUTH_STORAGE_TYPE.BIOMETRIC)
      const hic = Keychain.hasInternetCredentials as jest.Mock
      hic.mockResolvedValue(true)

      kcMock.mockResolvedValue(false)
      await store.dispatch(initializeAuth())
      await store.dispatch(startBiometricsLogin())
      const state = store.getState().auth

      expect(fetch).not.toHaveBeenCalled()

      expect(Keychain.setInternetCredentials).not.toHaveBeenCalled()
      expect(Keychain.resetInternetCredentials).not.toHaveBeenCalled()
      expect(state.loggedIn).toBeFalsy()
      // should swithch to login, to reset bad creds
      expect(state.loginPromptType).toEqual(LOGIN_PROMPT_TYPE.LOGIN)
    })
  })

  describe('setBiometricsPreference', () => {
    let store: TrackedStore
    beforeEach(async () => {
      store = realStore()
      const kcMockSupported = Keychain.getSupportedBiometryType as jest.Mock
      kcMockSupported.mockResolvedValue(Keychain.BIOMETRY_TYPE.TOUCH_ID)

      const kcMock = Keychain.getInternetCredentials as jest.Mock
      kcMock.mockResolvedValue(Promise.resolve({ password: generateRandomString() }))
      const hic = Keychain.hasInternetCredentials as jest.Mock
      hic.mockResolvedValue(true)

      const tokenResponse = () => {
        return Promise.resolve({
          access_token: testAccessToken,
          refresh_token: testRefreshToken,
        })
      }
      fetch.mockResolvedValue({ status: 200, json: tokenResponse })
      await store.dispatch(initializeAuth())
      jest.restoreAllMocks()
    })

    it('should clear the keychain and preference when transitioning to false', async () => {
      let storeState = store.getState().auth
      expect(storeState.loggedIn).toBeTruthy()
      expect(storeState.canStoreWithBiometric).toBeTruthy()
      expect(storeState.shouldStoreWithBiometric).toBeTruthy()
      await store.dispatch(setBiometricsPreference(false))
      storeState = store.getState().auth
      expect(storeState.canStoreWithBiometric).toBeTruthy()
      expect(storeState.shouldStoreWithBiometric).toBeFalsy()
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('@store_creds_bio', 'NONE')
      expect(Keychain.resetInternetCredentials).toHaveBeenCalled()
    })

    it('should set the keychain and preference when transitioning to true', async () => {
      let storeState = store.getState().auth
      expect(storeState.loggedIn).toBeTruthy()
      expect(storeState.canStoreWithBiometric).toBeTruthy()
      expect(storeState.shouldStoreWithBiometric).toBeTruthy()
      await store.dispatch(setBiometricsPreference(true))
      storeState = store.getState().auth
      expect(storeState.canStoreWithBiometric).toBeTruthy()
      expect(storeState.shouldStoreWithBiometric).toBeTruthy()
      expect(Keychain.setInternetCredentials).toHaveBeenCalledWith('vamobile', 'user', testRefreshToken, expect.anything())
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('@store_creds_bio', 'BIOMETRIC')
    })
  })

  describe('firstTimeLogin', () => {
    it('should clear the stored credentials on the first login', async () => {
      const prefMock = AsyncStorage.getItem as jest.Mock
      prefMock.mockResolvedValue(null)
      const store = realStore()
      await store.dispatch(checkFirstTimeLogin())
      expect(Keychain.resetInternetCredentials).toHaveBeenCalled()
    })
  })

  describe('setDisplayBiometricsPreferenceScreen', () => {
    it('should dispatch the correct action', async () => {
      const store = realStore()
      await store.dispatch(setDisplayBiometricsPreferenceScreen(true))

      const actions = store.getActions()
      const action = _.find(actions, { type: ActionTypes.AUTH_SET_DISPLAY_BIOMETRICS_PREFERENCE_SCREEN })
      expect(action).toBeTruthy()
    })
  })
})
