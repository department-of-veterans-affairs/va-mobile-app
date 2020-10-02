import _ from 'underscore'
import * as Keychain from 'react-native-keychain'

import { context, realStore, fetch, TrackedStore } from 'testUtils'
import { logout, handleTokenCallbackUrl, initializeAuth, startWebLogin, cancelWebLogin } from './auth'
import { LOGIN_PROMPT_TYPE } from 'store/types'

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
			expect(store.getState().auth.loggedIn).toBeFalsy()
			expect(store.getState().auth.loading).toBeFalsy()
		})
	})

	describe('handleTokenCallbackUrl', () => {
		let store:TrackedStore
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
			fetch.mockResolvedValue(Promise.resolve({ status: 200, json: tokenResponse }))
			await store.dispatch(handleTokenCallbackUrl("vamobile://login-success?code=FOO34asfa&state=2355adfs"))
			let actions = store.getActions()
			let startAction = _.find(actions, { type: 'AUTH_START_LOGIN' })
			expect(startAction).toBeTruthy()
			let endAction = _.find(actions, { type: 'AUTH_FINISH_LOGIN' })
			expect(endAction).toBeTruthy()
			expect(endAction?.payload.loggedIn).toBeTruthy()
			expect(endAction?.payload.error).toBeFalsy()
			expect(Keychain.setGenericPassword).toHaveBeenCalledWith("user", "asdfNewRefreshToken123", expect.anything())

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

		it("should refresh token and save the new one", async () => {
			let kcMock = (Keychain.getGenericPassword as jest.Mock)
			kcMock.mockResolvedValue(Promise.resolve({ password: "REFRESH_TOKEN_213asdf" }))
			let tokenResponse = () => {
				return Promise.resolve({
					access_token: "my accessToken",
					refresh_token: "asdfNewRefreshToken"
				})
			}
			fetch.mockResolvedValue(Promise.resolve({ status: 200, json: tokenResponse }))
			const store = realStore()
			await store.dispatch(initializeAuth())
			let actions = store.getActions()
			let action = _.find(actions, { type: 'AUTH_FINISH_LOGIN' })
			expect(action).toBeTruthy()
			expect(action?.payload.loggedIn).toBeTruthy()
			expect(action?.payload.error).toBeFalsy()
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
			let state = store.getState().auth
			expect(state.initializing).toBeFalsy()
			expect(state.loggedIn).toBeFalsy()
			expect(state.loginPromptType).toEqual(LOGIN_PROMPT_TYPE.LOGIN)
		})

	})
})
