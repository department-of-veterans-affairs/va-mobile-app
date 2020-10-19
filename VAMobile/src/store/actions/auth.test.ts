import _ from 'underscore'
import * as Keychain from 'react-native-keychain'
import AsyncStorage from '@react-native-community/async-storage'

import { when, context, realStore, fetch, TrackedStore } from 'testUtils'
import { logout, handleTokenCallbackUrl, initializeAuth, startWebLogin, cancelWebLogin, startBiometricsLogin, setBiometricsPreference } from './auth'
import { LOGIN_PROMPT_TYPE, AUTH_STORAGE_TYPE } from 'store/types'
import getEnv from '../../utils/env'
import { isAndroid } from '../../utils/platform'

import * as api from '../api'

jest.mock('../../utils/platform', () => ({
	isAndroid: jest.fn(() => false)
}))

jest.mock('../../utils/env', () => jest.fn(() => ({
	AUTH_ALLOW_NON_BIOMETRIC_SAVE: "false",
	AUTH_CLIENT_SECRET: "TEST_SECRET",
	AUTH_CLIENT_ID: "VAMobile",
	AUTH_REDIRECT_URL: "vamobile://login-success",
	AUTH_SCOPES: "openid",
	AUTH_ENDPOINT: "https://test.gov/oauth/authorize",
	AUTH_TOKEN_EXCHANGE_URL: "https://test.gov/oauth/token",
	AUTH_REVOKE_URL: "https://test.gov/oauth/revoke",
})))

const defaultEnvParams = {
	AUTH_ALLOW_NON_BIOMETRIC_SAVE: "false",
	AUTH_CLIENT_SECRET: "TEST_SECRET",
	AUTH_CLIENT_ID: "VAMobile",
	AUTH_REDIRECT_URL: "vamobile://login-success",
	AUTH_SCOPES: "openid",
	AUTH_ENDPOINT: "https://test.gov/oauth/authorize",
	AUTH_TOKEN_EXCHANGE_URL: "https://test.gov/oauth/token",
	AUTH_REVOKE_URL: "https://test.gov/oauth/revoke",
}

context('auth', () => {

	beforeEach(() => {
		let envMock = getEnv as jest.Mock
		envMock.mockReturnValue(defaultEnvParams)

		let isAndroidMock = isAndroid as jest.Mock
		isAndroidMock.mockReturnValue(false)

		when(api.get as jest.Mock).calledWith("/v0/user").mockResolvedValue({
			data: {
				attributes: {
					id: "124",
					profile: {
						firstName: "foo",
						lastName: "bar",
					}
				}
			}
		})
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
			let revokeResponse = () => {
				return Promise.resolve({})
			}
			fetch.mockResolvedValue(Promise.resolve({ status: 200, text: () => (Promise.resolve("")), json: revokeResponse }))

			const store = realStore()
			await store.dispatch(handleTokenCallbackUrl("asdfasdfasdf"))
			store.dispatch({
				type: 'AUTH_INITIALIZE',
				payload: { profile: {} },
			})
			expect(store.getState().auth.loggedIn).toBeTruthy()

			await store.dispatch(logout())
			let revokeUrl = "https://test.gov/oauth/revoke"
			expect(fetch).toHaveBeenCalledWith(revokeUrl, expect.anything())

			expect(Keychain.resetInternetCredentials).toHaveBeenCalled()
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
			expect(endAction?.payload.profile).toBeFalsy()
			expect(endAction?.payload.error).toBeTruthy()
		})

		it('should handle empty code', async () => {
			await store.dispatch(handleTokenCallbackUrl("vamobile://login-success?code=&state=2355adfs"))
			let actions = store.getActions()
			let startAction = _.find(actions, { type: 'AUTH_START_LOGIN' })
			expect(startAction).toBeTruthy()
			let endAction = _.find(actions, { type: 'AUTH_FINISH_LOGIN' })
			expect(endAction).toBeTruthy()
			expect(endAction?.payload.profile).toBeFalsy()
			expect(endAction?.payload.error).toBeTruthy()
			//console.log(realStore.)
		})

		it("should parse code and state correctly and login", async () => {
			let tokenResponse = () => {
				return Promise.resolve({
					access_token: "my accessToken",
					refresh_token: "asdfNewRefreshToken123",
					id_token:"123IDTOKEN"
				})
			}
			let prefMock = AsyncStorage.getItem as jest.Mock
			prefMock.mockResolvedValue(null)
			fetch.mockResolvedValue({ status: 200, json: tokenResponse })
			await store.dispatch(handleTokenCallbackUrl("vamobile://login-success?code=FOO34asfa&state=2355adfs"))
			let actions = store.getActions()
			let startAction = _.find(actions, { type: 'AUTH_START_LOGIN' })
			expect(startAction).toBeTruthy()
			let endAction = _.find(actions, { type: 'AUTH_FINISH_LOGIN' })
			expect(endAction).toBeTruthy()
			expect(endAction?.payload.profile).toBeTruthy()
			expect(endAction?.payload.authCredentials).toEqual(expect.objectContaining({
				access_token: "my accessToken",
				refresh_token: "asdfNewRefreshToken123",
				id_token:"123IDTOKEN"
			}))
			expect(endAction?.payload.error).toBeFalsy()
			// no biometrics available, don't save token
			expect(Keychain.setInternetCredentials).not.toHaveBeenCalled()

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

			it("should save the token with biometric protection", async () => {
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
				let expectedOpts = expect.objectContaining({
					accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_ANY,
					accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
					authenticationType: Keychain.AUTHENTICATION_TYPE.BIOMETRICS
				})
				expect(Keychain.setInternetCredentials).toHaveBeenCalledWith("vamobile", "user", "asdfNewRefreshToken123", expectedOpts)

			})

		})

		describe("when biometrics is not available", () => {

			it("should not save the refresh token", async () => {
				let kcMockSupported = (Keychain.getSupportedBiometryType as jest.Mock)
				kcMockSupported.mockResolvedValue(null)

				let prefMock = AsyncStorage.getItem as jest.Mock
				prefMock.mockResolvedValue(null)


				let tokenResponse = () => {
					return Promise.resolve({
						access_token: "my accessToken",
						refresh_token: "asdfNewRefreshToken123"
					})
				}
				fetch.mockResolvedValue({ status: 200, json: tokenResponse })
				await store.dispatch(handleTokenCallbackUrl("vamobile://login-success?code=FOO34asfa&state=2355adfs"))
				let authState = store.getState().auth

				// we shouldn't be logged in until the user decides how to store refreshToken
				expect(authState.loggedIn).toBeTruthy()
				expect(Keychain.setInternetCredentials).not.toHaveBeenCalled()

			})

			describe("AUTH_ALLOW_NON_BIOMETRIC_SAVE=true", () => {
				beforeEach(() => {
					let envMock = getEnv as jest.Mock
					envMock.mockReturnValue({
						...defaultEnvParams,
						AUTH_ALLOW_NON_BIOMETRIC_SAVE: "true",
					})
				})

				it("should save the refresh token even if biometrics not available", async () => {
					let kcMockSupported = (Keychain.getSupportedBiometryType as jest.Mock)
					kcMockSupported.mockResolvedValue(null)

					let prefMock = AsyncStorage.getItem as jest.Mock
					prefMock.mockResolvedValue(null)

					let tokenResponse = () => {
						return Promise.resolve({
							access_token: "my accessToken",
							refresh_token: "asdfNewRefreshToken123"
						})
					}
					fetch.mockResolvedValue({ status: 200, json: tokenResponse })
					await store.dispatch(handleTokenCallbackUrl("vamobile://login-success?code=FOO34asfa&state=2355adfs"))
					let authState = store.getState().auth

					// we shouldn't be logged in until the user decides how to store refreshToken
					expect(authState.loggedIn).toBeTruthy()
					expect(Keychain.setInternetCredentials).toHaveBeenCalled()

				})
			})
		})

	})

	describe("initializeAuth", () => {

		it('should handle no saved creds gracefully', async () => {
			let kcMock = (Keychain.getInternetCredentials as jest.Mock)
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
			let kcMock = (Keychain.getInternetCredentials as jest.Mock)
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
			let kcMock = (Keychain.getInternetCredentials as jest.Mock)
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
			expect(action?.payload.profile).toBeFalsy()
			// no errors for the initial load! only on refreshes afterward or logins
			expect(action?.payload.error).toBeFalsy()
			expect(fetch).toHaveBeenCalled()
			expect(Keychain.resetInternetCredentials).toHaveBeenCalled()
			let state = store.getState().auth
			expect(state.initializing).toBeFalsy()
			expect(state.loggedIn).toBeFalsy()
			expect(state.loginPromptType).toEqual(LOGIN_PROMPT_TYPE.LOGIN)
		})

		it("should log out and clear the token if refresh fails", async () => {
			let kcMock = (Keychain.getInternetCredentials as jest.Mock)
			kcMock.mockResolvedValue(Promise.resolve({ password: "REFRESH_TOKEN_213asdf" }))

			fetch.mockResolvedValue(Promise.resolve({ status: 400, text: () => Promise.resolve("bad token") }))

			const store = realStore()
			await store.dispatch(initializeAuth())
			let actions = store.getActions()
			let action = _.find(actions, { type: 'AUTH_INITIALIZE' })
			expect(action).toBeTruthy()
			expect(action?.payload.profile).toBeFalsy()
			// expect no errors for initial init, just assume bad saved creds
			// and present login
			expect(action?.payload.error).toBeFalsy()
			expect(Keychain.resetInternetCredentials).toHaveBeenCalled()
			let state = store.getState().auth
			expect(state.initializing).toBeFalsy()
			expect(state.loggedIn).toBeFalsy()
			expect(state.loginPromptType).toEqual(LOGIN_PROMPT_TYPE.LOGIN)
		})


		it("should initialize with biometric stored creds approrpiately", async () => {
			let kcMock = (Keychain.getInternetCredentials as jest.Mock)
			kcMock.mockResolvedValue({ password: "REFRESH_TOKEN_213asdf" })
			let prefMock = AsyncStorage.getItem as jest.Mock
			prefMock.mockResolvedValue(AUTH_STORAGE_TYPE.BIOMETRIC)
			let hic = Keychain.hasInternetCredentials as jest.Mock
			hic.mockResolvedValue(true)
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

		it("should handle getInternetCredentials throwing an exception", async () => {
			let kcMock = (Keychain.getInternetCredentials as jest.Mock)
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
			expect(Keychain.resetInternetCredentials).toHaveBeenCalled()
		})

	})

	describe("startBiometricsLogin", () => {

		it("should refresh the access token and log the user in", async () => {
			const store = realStore()
			let kcMock = (Keychain.getInternetCredentials as jest.Mock)
			let prefMock = AsyncStorage.getItem as jest.Mock
			prefMock.mockResolvedValue(AUTH_STORAGE_TYPE.BIOMETRIC)
			let hic = Keychain.hasInternetCredentials as jest.Mock
			hic.mockResolvedValue(true)
			let gsbt = Keychain.getSupportedBiometryType as jest.Mock
			gsbt.mockResolvedValue(Keychain.BIOMETRY_TYPE.TOUCH_ID)

			kcMock.mockResolvedValue(Promise.resolve({ password: "REFRESH_TOKEN_213asdf" }))
			let tokenResponse = () => {
				return Promise.resolve({
					access_token: "my accessToken",
					refresh_token: "asdfNewRefreshToken",
					id_token:"1234IDToken",
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
			expect(Keychain.setInternetCredentials).toHaveBeenCalledWith("vamobile", "user", "asdfNewRefreshToken", expect.anything())
			expect(AsyncStorage.setItem).toHaveBeenCalledWith("@store_creds_bio", "BIOMETRIC")
			
			let state = store.getState().auth
			expect(state.profile).toBeTruthy()
			expect(state.authCredentials).toEqual(expect.objectContaining({
				access_token: "my accessToken",
				refresh_token: "asdfNewRefreshToken",
				id_token:"1234IDToken",
			}))
			
		})

		describe("android", () => {
			beforeEach(() => {
				let isAndroidMock = isAndroid as jest.Mock
				isAndroidMock.mockReturnValue(true)
			})

			it("should handle cancel biometric scan correctly", async () => {
				let hic = Keychain.hasInternetCredentials as jest.Mock
				hic.mockResolvedValue(true)
				const store = realStore()
				let kcMock = (Keychain.getInternetCredentials as jest.Mock)
				let prefMock = AsyncStorage.getItem as jest.Mock
				prefMock.mockResolvedValue(AUTH_STORAGE_TYPE.BIOMETRIC)

				kcMock.mockRejectedValue({ message: "code: 13 msg: Cancel" })

				//.mockResolvedValue(Promise.resolve({ password: "REFRESH_TOKEN_213asdf" }))
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



		it("should handle bad stored values", async () => {
			const store = realStore()
			let kcMock = (Keychain.getInternetCredentials as jest.Mock)
			let prefMock = AsyncStorage.getItem as jest.Mock
			prefMock.mockResolvedValue(AUTH_STORAGE_TYPE.BIOMETRIC)
			let hic = Keychain.hasInternetCredentials as jest.Mock
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

		it("should not allow multiple requests at one time", async () => {
			const store = realStore()
			let kcMock = (Keychain.getInternetCredentials as jest.Mock)
			let prefMock = AsyncStorage.getItem as jest.Mock
			prefMock.mockResolvedValue(AUTH_STORAGE_TYPE.BIOMETRIC)
			let hic = Keychain.hasInternetCredentials as jest.Mock
			hic.mockResolvedValue(true)

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
			expect(Keychain.setInternetCredentials).toHaveBeenCalledWith("vamobile", "user", "asdfNewRefreshToken", expect.anything())
		})

	})

	describe("setBiometricsPreference", () => {
		let store: TrackedStore
		beforeEach(async () => {
			store = realStore()

			let kcMockSupported = (Keychain.getSupportedBiometryType as jest.Mock)
			kcMockSupported.mockResolvedValue(Keychain.BIOMETRY_TYPE.TOUCH_ID)

			let kcMock = (Keychain.getInternetCredentials as jest.Mock)
			let prefMock = AsyncStorage.getItem as jest.Mock
			prefMock.mockResolvedValue(AUTH_STORAGE_TYPE.BIOMETRIC)
			let hic = Keychain.hasInternetCredentials as jest.Mock
			hic.mockResolvedValue(true)
			kcMock.mockResolvedValue({ password: "REFRESH_TOKEN_213asdf" })
			let tokenResponse = () => {
				return Promise.resolve({
					access_token: "my accessToken",
					refresh_token: "asdfNewRefreshToken"
				})
			}
			fetch.mockResolvedValue({ status: 200, json: tokenResponse })
			await store.dispatch(initializeAuth())
			await store.dispatch(startBiometricsLogin())
			jest.restoreAllMocks()
		})

		it("should clear the keychain and preference when transitioning to false", async () => {
			let storeState = store.getState().auth
			expect(storeState.loggedIn).toBeTruthy()
			expect(storeState.canStoreWithBiometric).toBeTruthy()
			expect(storeState.shouldStoreWithBiometric).toBeTruthy()
			await store.dispatch(setBiometricsPreference(false))
			storeState = store.getState().auth
			expect(storeState.canStoreWithBiometric).toBeTruthy()
			expect(storeState.shouldStoreWithBiometric).toBeFalsy()
			expect(AsyncStorage.setItem).toHaveBeenCalledWith("@store_creds_bio", "NONE")
			expect(Keychain.resetInternetCredentials).toHaveBeenCalled()
		})

		it("should set the keychain and preference when transitioning to true", async () => {
			let storeState = store.getState().auth
			expect(storeState.loggedIn).toBeTruthy()
			expect(storeState.canStoreWithBiometric).toBeTruthy()
			expect(storeState.shouldStoreWithBiometric).toBeTruthy()
			await store.dispatch(setBiometricsPreference(true))
			storeState = store.getState().auth
			expect(storeState.canStoreWithBiometric).toBeTruthy()
			expect(storeState.shouldStoreWithBiometric).toBeTruthy()
			expect(Keychain.setInternetCredentials).toHaveBeenCalledWith("vamobile", "user", "asdfNewRefreshToken", expect.anything())
			expect(AsyncStorage.setItem).toHaveBeenCalledWith("@store_creds_bio", "BIOMETRIC")
		})
	})

})
