import _ from 'underscore'
import * as Keychain from 'react-native-keychain'
import AsyncStorage from '@react-native-community/async-storage'

import { context, realStore, fetch, TrackedStore } from 'testUtils'
import { logout, handleTokenCallbackUrl, initializeAuth, startWebLogin, cancelWebLogin, startBiometricsLogin } from './auth'
import { LOGIN_PROMPT_TYPE, AUTH_STORAGE_TYPE } from 'store/types'
import { isAndroid } from 'utils/platform'

jest.mock('../../utils/platform', () => ({
	isAndroid: jest.fn()
}))

context('auth', () => {

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
			let revokeResponse = () => {
				return Promise.resolve({})
			}
			fetch.mockResolvedValue(Promise.resolve({ status: 200, text: () => (Promise.resolve("")), json: revokeResponse }))

			const store = realStore()
			await store.dispatch(handleTokenCallbackUrl("asdfasdfasdf"))
			store.dispatch({
				type: 'AUTH_INITIALIZE',
				payload: { loggedIn: true },
			})
			expect(store.getState().auth.loggedIn).toBeTruthy()

			await store.dispatch(logout())
			let revokeUrl = "https://test.gov/oauth/revoke"
			expect(fetch).toHaveBeenCalledWith(revokeUrl, expect.anything())

			expect(Keychain.resetGenericPassword).toHaveBeenCalled()
			expect(AsyncStorage.removeItem).toHaveBeenCalled()
			expect(store.getState().auth.loggedIn).toBeFalsy()
			expect(store.getState().auth.loading).toBeFalsy()
		})
	})

	describe('handleTokenCallbackUrl', () => {
		let store: TrackedStore
		beforeEach(() => {
			store = realStore()
			store.dispatch({
				type: 'AUTH_INITIALIZE',
				payload: { loginPromptType: LOGIN_PROMPT_TYPE.LOGIN, loggedIn: true },
			})
		})

		it('should handle malformed urls', async () => {
			await store.dispatch(handleTokenCallbackUrl("asdfasdfasdf"))
			let actions = store.getActions()
			let startAction = _.find(actions, { type: 'AUTH_START_LOGIN' })
			expect(startAction).toBeTruthy()
			expect(startAction?.state.auth.loading).toBeTruthy()
			let endAction = _.find(actions, { type: 'AUTH_FINISH_LOGIN' })
			expect(endAction?.state.auth.loading).toBeFalsy()
			expect(endAction?.state.auth.loggedIn).toBeFalsy()
			expect(endAction).toBeTruthy()
			expect(endAction?.payload.loggedIn).toBeFalsy()
			expect(endAction?.payload.error).toBeTruthy()
		})

		it('should handle empty code', async () => {
			await store.dispatch(handleTokenCallbackUrl("vamobile://login-success?code=&state=2355adfs"))
			let actions = store.getActions()
			let startAction = _.find(actions, { type: 'AUTH_START_LOGIN' })
			expect(startAction).toBeTruthy()
			let endAction = _.find(actions, { type: 'AUTH_FINISH_LOGIN' })
			expect(endAction).toBeTruthy()
			expect(endAction?.payload.loggedIn).toBeFalsy()
			expect(endAction?.payload.error).toBeTruthy()
			//console.log(realStore.)
		})

		it("should parse code and state correctly and login", async () => {
			let tokenResponse = () => {
				return Promise.resolve({
					access_token: "my accessToken",
					refresh_token: "asdfNewRefreshToken123"
				})
			}
			let prefMock = AsyncStorage.getItem as jest.Mock
			prefMock.mockResolvedValue(null)
			fetch.mockResolvedValue(Promise.resolve({ status: 200, json: tokenResponse }))
			await store.dispatch(handleTokenCallbackUrl("vamobile://login-success?code=FOO34asfa&state=2355adfs"))
			let actions = store.getActions()
			let startAction = _.find(actions, { type: 'AUTH_START_LOGIN' })
			expect(startAction).toBeTruthy()
			let endAction = _.find(actions, { type: 'AUTH_FINISH_LOGIN' })
			expect(endAction).toBeTruthy()
			expect(endAction?.payload.loggedIn).toBeTruthy()
			expect(endAction?.payload.error).toBeFalsy()
			// no biometrics available, don't save token
			expect(Keychain.setGenericPassword).not.toHaveBeenCalled()
			
			let tokenUrl = 'https://test.gov/oauth/token'

			let tokenPaylaod = expect.objectContaining({
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
				body: 'grant_type=authorization_code&client_id=VAMobile&client_secret=TEST_SECRET&code_verifier=mylongcodeverifier&code=FOO34asfa&state=12345&redirect_uri=vamobile%3A%2F%2Flogin-success'
			})
			expect(fetch).toHaveBeenCalledWith(tokenUrl, tokenPaylaod)
		})


		describe("when biometrics is available", () => {

			it("should prompt the user to select whether they want ot store with bio or not", async () => {
				let kcMockSupported = (Keychain.getSupportedBiometryType as jest.Mock)
				kcMockSupported.mockResolvedValue(Promise.resolve(Keychain.BIOMETRY_TYPE.TOUCH_ID))

				let prefMock = AsyncStorage.getItem as jest.Mock
				prefMock.mockResolvedValue(null)


				let tokenResponse = () => {
					return Promise.resolve({
						access_token: "my accessToken",
						refresh_token: "asdfNewRefreshToken123"
					})
				}
				fetch.mockResolvedValue(Promise.resolve({ status: 200, json: tokenResponse }))
				await store.dispatch(handleTokenCallbackUrl("vamobile://login-success?code=FOO34asfa&state=2355adfs"))
				let authState = store.getState().auth

				// we shouldn't be logged in until the user decides how to store refreshToken
				expect(authState.loggedIn).toBeTruthy()

			})

		})

	})

	describe("initializeAuth", () => {

		it('should handle no saved creds gracefully', async () => {
			let kcMock = (Keychain.getGenericPassword as jest.Mock)
			kcMock.mockResolvedValue(Promise.resolve(false))
			const store = realStore()
			await store.dispatch(initializeAuth())
			let actions = store.getActions()
			let action = _.find(actions, { type: 'AUTH_INITIALIZE' })
			expect(action).toBeTruthy()
			let state = store.getState().auth
			expect(state.initializing).toBeFalsy()
			expect(state.loggedIn).toBeFalsy()
			expect(state.loginPromptType).toEqual(LOGIN_PROMPT_TYPE.LOGIN)
		})

		it('should handle bad saved creds gracefully', async () => {
			let kcMock = (Keychain.getGenericPassword as jest.Mock)
			kcMock.mockResolvedValue(Promise.resolve({ password: "" }))
			const store = realStore()
			await store.dispatch(initializeAuth())
			let actions = store.getActions()
			let action = _.find(actions, { type: 'AUTH_INITIALIZE' })
			expect(action).toBeTruthy()
			let state = store.getState().auth
			expect(state.initializing).toBeFalsy()
			expect(state.loggedIn).toBeFalsy()
			expect(state.loginPromptType).toEqual(LOGIN_PROMPT_TYPE.LOGIN)
		})
		
		it("should handle bad auth token response with 200", async () => {
			let kcMock = (Keychain.getGenericPassword as jest.Mock)
			kcMock.mockResolvedValue(Promise.resolve({ password: "REFRESH_TOKEN_213asdf" }))
			let tokenResponse = () => {
				return Promise.resolve({
					access_token: "my accessToken",
					//refresh_token: "asdfNewRefreshToken" <-- we need this normally
				})
			}
			fetch.mockResolvedValue(Promise.resolve({ status: 200, json: tokenResponse }))

			const store = realStore()
			await store.dispatch(initializeAuth())
			let actions = store.getActions()
			let action = _.find(actions, { type: 'AUTH_INITIALIZE' })
			expect(action).toBeTruthy()
			expect(action?.payload.loggedIn).toBeFalsy()
			// no errors for the initial load! only on refreshes afterward or logins
			expect(action?.payload.error).toBeFalsy()
			expect(fetch).toHaveBeenCalled()
			expect(Keychain.resetGenericPassword).toHaveBeenCalled()
			expect(AsyncStorage.removeItem).toHaveBeenCalled()
			let state = store.getState().auth
			expect(state.initializing).toBeFalsy()
			expect(state.loggedIn).toBeFalsy()
			expect(state.loginPromptType).toEqual(LOGIN_PROMPT_TYPE.LOGIN)
		})

		it("should log out and clear the token if refresh fails", async () => {
			let kcMock = (Keychain.getGenericPassword as jest.Mock)
			kcMock.mockResolvedValue(Promise.resolve({ password: "REFRESH_TOKEN_213asdf" }))

			fetch.mockResolvedValue(Promise.resolve({ status: 400, text: () => Promise.resolve("bad token") }))

			const store = realStore()
			await store.dispatch(initializeAuth())
			let actions = store.getActions()
			let action = _.find(actions, { type: 'AUTH_INITIALIZE' })
			expect(action).toBeTruthy()
			expect(action?.payload.loggedIn).toBeFalsy()
			// expect no errors for initial init, just assume bad saved creds
			// and present login
			expect(action?.payload.error).toBeFalsy()
			expect(Keychain.resetGenericPassword).toHaveBeenCalled()
			expect(AsyncStorage.removeItem).toHaveBeenCalled()
			let state = store.getState().auth
			expect(state.initializing).toBeFalsy()
			expect(state.loggedIn).toBeFalsy()
			expect(state.loginPromptType).toEqual(LOGIN_PROMPT_TYPE.LOGIN)
		})


		it("should initialize with biometric stored creds approrpiately", async () => {
			let kcMock = (Keychain.getGenericPassword as jest.Mock)
			kcMock.mockResolvedValue({ password: "REFRESH_TOKEN_213asdf" })
			let prefMock = AsyncStorage.getItem as jest.Mock
			prefMock.mockResolvedValue(AUTH_STORAGE_TYPE.BIOMETRIC)
			const store = realStore()
			await store.dispatch(initializeAuth())
			let actions = store.getActions()
			let action = _.find(actions, { type: 'AUTH_INITIALIZE' })
			expect(action).toBeTruthy()
			const state = store.getState().auth
			expect(state.initializing).toBeFalsy()
			expect(state.loginPromptType).toEqual(LOGIN_PROMPT_TYPE.UNLOCK)
			expect(state.loading).toBeFalsy()

		})

		it("should handle getGenericPassword throwing an exception", async () => {
			let kcMock = (Keychain.getGenericPassword as jest.Mock)
			kcMock.mockRejectedValue("Some Error")//.mockResolvedValue({ password: "REFRESH_TOKEN_213asdf" })
			let prefMock = AsyncStorage.getItem as jest.Mock
			prefMock.mockResolvedValue(AUTH_STORAGE_TYPE.NONE)
			const store = realStore()
			await store.dispatch(initializeAuth())
			let actions = store.getActions()
			let action = _.find(actions, { type: 'AUTH_INITIALIZE' })
			expect(action).toBeTruthy()
			const state = store.getState().auth
			expect(state.initializing).toBeFalsy()
			expect(state.loginPromptType).toEqual(LOGIN_PROMPT_TYPE.LOGIN)
			expect(state.loading).toBeFalsy()
			// in exception case, clear the creds, let the usre log in again
			expect(Keychain.resetGenericPassword).toHaveBeenCalled()
			expect(AsyncStorage.removeItem).toHaveBeenCalled()
		})

	})

	describe("startBiometricsLogin", () => {

		it("should refresh the access token and log the user in", async () => {
			const store = realStore()
			let kcMock = (Keychain.getGenericPassword as jest.Mock)
			let prefMock = AsyncStorage.getItem as jest.Mock
			prefMock.mockResolvedValue(AUTH_STORAGE_TYPE.BIOMETRIC)

			kcMock.mockResolvedValue(Promise.resolve({ password: "REFRESH_TOKEN_213asdf" }))
			let tokenResponse = () => {
				return Promise.resolve({
					access_token: "my accessToken",
					refresh_token: "asdfNewRefreshToken"
				})
			}
			fetch.mockResolvedValue(Promise.resolve({ status: 200, json: tokenResponse }))
			await store.dispatch(initializeAuth())
			expect(fetch).not.toHaveBeenCalled()
			await store.dispatch(startBiometricsLogin())

			let actions = store.getActions()

			// this is one of the differences between init and bio init
			// we should transition to a loading spinner here with AUTH_START_LOGIN
			// the ther flow (straight init with no bio unlock) never transitions
			// to loading because all the work occurs before initialized is tru
			let startAction = _.find(actions, { type: 'AUTH_START_LOGIN' })
			expect(startAction).toBeTruthy()
			expect(fetch).toHaveBeenCalled()

			let tokenUrl = 'https://test.gov/oauth/token'
			let tokenPaylaod = expect.objectContaining({
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
				body: 'grant_type=refresh_token&client_id=VAMobile&client_secret=TEST_SECRET&redirect_uri=vamobile%3A%2F%2Flogin-success&refresh_token=REFRESH_TOKEN_213asdf'
			})
			expect(fetch).toHaveBeenCalledWith(tokenUrl, tokenPaylaod)
			expect(Keychain.setGenericPassword).toHaveBeenCalledWith("user", "asdfNewRefreshToken", expect.anything())
		})

		it("should handle cancel biometric scan correctly for android", async () => {
			let isAndroidMock = isAndroid as jest.Mock
			isAndroidMock.mockReturnValue(true)
			const store = realStore()
			let kcMock = (Keychain.getGenericPassword as jest.Mock)
			let prefMock = AsyncStorage.getItem as jest.Mock
			prefMock.mockResolvedValue(AUTH_STORAGE_TYPE.BIOMETRIC)

			kcMock.mockRejectedValue({ message: "code: 13 msg: Cancel" })

			//.mockResolvedValue(Promise.resolve({ password: "REFRESH_TOKEN_213asdf" }))
			await store.dispatch(initializeAuth())
			await store.dispatch(startBiometricsLogin())
			const state = store.getState().auth

			expect(fetch).not.toHaveBeenCalled()

			expect(Keychain.setGenericPassword).not.toHaveBeenCalled()
			expect(Keychain.resetGenericPassword).not.toHaveBeenCalled()
			expect(AsyncStorage.removeItem).not.toHaveBeenCalled()
			expect(state.loggedIn).toBeFalsy()
			expect(state.loginPromptType).toEqual(LOGIN_PROMPT_TYPE.UNLOCK)

		})

		it("should handle bad stored values", async () => {
			let isAndroidMock = isAndroid as jest.Mock
			isAndroidMock.mockReturnValue(true)
			const store = realStore()
			let kcMock = (Keychain.getGenericPassword as jest.Mock)
			let prefMock = AsyncStorage.getItem as jest.Mock
			prefMock.mockResolvedValue(AUTH_STORAGE_TYPE.BIOMETRIC)

			kcMock.mockResolvedValue(Promise.resolve(false))
			await store.dispatch(initializeAuth())
			await store.dispatch(startBiometricsLogin())
			const state = store.getState().auth

			expect(fetch).not.toHaveBeenCalled()

			expect(Keychain.setGenericPassword).not.toHaveBeenCalled()
			expect(Keychain.resetGenericPassword).not.toHaveBeenCalled()
			expect(AsyncStorage.removeItem).not.toHaveBeenCalled()
			expect(state.loggedIn).toBeFalsy()
			// should swithch to login, to reset bad creds
			expect(state.loginPromptType).toEqual(LOGIN_PROMPT_TYPE.LOGIN)

		})

		it("should not allow multiple  requests at one time", async () => {
			const store = realStore()
			let kcMock = (Keychain.getGenericPassword as jest.Mock)
			let prefMock = AsyncStorage.getItem as jest.Mock
			prefMock.mockResolvedValue(AUTH_STORAGE_TYPE.BIOMETRIC)

			kcMock.mockResolvedValue(Promise.resolve({ password: "REFRESH_TOKEN_213asdf" }))
			let tokenResponse = () => {
				return Promise.resolve({
					access_token: "my accessToken",
					refresh_token: "asdfNewRefreshToken"
				})
			}
			fetch.mockResolvedValue(Promise.resolve({ status: 200, json: tokenResponse }))
			await store.dispatch(initializeAuth())
			expect(fetch).not.toHaveBeenCalled()

			// attempt it twice in a row (wait for the first one only because that's the only one that will "work")
			let p1 = store.dispatch(startBiometricsLogin())
			let p2 = store.dispatch(startBiometricsLogin())

			await Promise.all([p1, p2])

			let actions = store.getActions()

			// this is one of the differences between init and bio init
			// we should transition to a loading spinner here with AUTH_START_LOGIN
			// the ther flow (straight init with no bio unlock) never transitions
			// to loading because all the work occurs before initialized is tru
			let startAction = _.find(actions, { type: 'AUTH_START_LOGIN' })
			expect(startAction).toBeTruthy()
			expect(fetch).toHaveBeenCalled()

			expect(fetch).toHaveBeenCalledTimes(1)
			expect(Keychain.setGenericPassword).toHaveBeenCalledWith("user", "asdfNewRefreshToken", expect.anything())
		})

	})

})
