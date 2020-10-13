import * as Keychain from 'react-native-keychain'
import { Dispatch } from 'redux'
import AsyncStorage from '@react-native-community/async-storage'
import CookieManager from '@react-native-community/cookies'
import qs from 'querystringify'

import * as api from 'store/api'
import { AUTH_STORAGE_TYPE, AsyncReduxAction, AuthFinishLoginAction, AuthInitializeAction, AuthShowWebLoginAction, AuthStartLoginAction, LOGIN_PROMPT_TYPE } from 'store/types'
import { isAndroid } from 'utils/platform'
import getEnv from 'utils/env'

const { AUTH_CLIENT_ID, AUTH_CLIENT_SECRET, AUTH_ENDPOINT, AUTH_REDIRECT_URL, AUTH_REVOKE_URL, AUTH_SCOPES, AUTH_TOKEN_EXCHANGE_URL } = getEnv()

const dispatchInitialize = (loginPromptType: LOGIN_PROMPT_TYPE, profile?: api.UserDataProfile): AuthInitializeAction => {
	// TODO: remove this assignment once profile service passes along this data
	if (profile) {
		profile.most_recent_branch = 'United States Air Force'
		profile.bank_account_number = '1234561234'
		profile.bank_account_type = 'Savings'
	}

	return {
		type: 'AUTH_INITIALIZE',
		payload: { loginPromptType, profile },
	}
}

const dispatchStartAuthLogin = (): AuthStartLoginAction => {
	return {
		type: 'AUTH_START_LOGIN',
		payload: {},
	}
}

const dispatchFinishAuthLogin = (profile?: api.UserDataProfile, error?: Error): AuthFinishLoginAction => {
	return {
		type: 'AUTH_FINISH_LOGIN',
		payload: { profile, error },
	}
}

const dispatchShowWebLogin = (authUrl?: string): AuthShowWebLoginAction => {
	return {
		type: 'AUTH_SHOW_WEB_LOGIN',
		payload: { authUrl },
	}
}

type RawAuthResponse = {
	access_token?: string
	refresh_token?: string
	accessTokenExpirationDate?: string
	token_type?: string
	id_token?: string
}

const BIO_STORE_PREF_KEY = '@store_creds_bio'

const clearStoredAuthCreds = async (): Promise<void> => {
	await Keychain.resetGenericPassword()
	await AsyncStorage.removeItem(BIO_STORE_PREF_KEY)
}

const saveRefreshToken = async (refreshToken: string): Promise<void> => {
	let storeWithBiometrics: boolean | undefined
	try {
		const value = await AsyncStorage.getItem(BIO_STORE_PREF_KEY)
		console.debug(`saveRefreshToken: token=${value}`)
		if (value) {
			console.debug('saveRefreshToken: BIO_STORE_PREF_KEY: stored value: ' + value)
			// value previously stored
			storeWithBiometrics = value === AUTH_STORAGE_TYPE.BIOMETRIC
			console.debug('saveRefreshToken: using biometrics: ' + storeWithBiometrics)
		} else {
			console.debug('saveRefreshToken: BIO_STORE_PREF_KEY: no stored preference for auth found')
		}
	} catch (e) {
		console.error(e)
	}

	if (storeWithBiometrics === undefined) {
		storeWithBiometrics = !!(await Keychain.getSupportedBiometryType())
	}

	if (storeWithBiometrics) {
		// user opted to store with biometrics
		const options: Keychain.Options = {
			accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
			accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_ANY,
			authenticationType: Keychain.AUTHENTICATION_TYPE.BIOMETRICS,
			securityLevel: Keychain.SECURITY_LEVEL.SECURE_SOFTWARE,
		}
		console.debug('saveRefreshToken:', options)
		console.debug('saveRefreshToken: saving refresh token to keychain')
		try {
			await Keychain.setGenericPassword('user', refreshToken, options)
			await AsyncStorage.setItem(BIO_STORE_PREF_KEY, AUTH_STORAGE_TYPE.BIOMETRIC)
		} catch (err) {
			console.error(err)
		}
	} else if (getEnv().AUTH_ALLOW_NON_BIOMETRIC_SAVE === 'true') {
		console.debug('saveRefreshToken: saving non biometric proteted')
		const options: Keychain.Options = {
			accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
			accessControl: Keychain.ACCESS_CONTROL.DEVICE_PASSCODE,
			securityLevel: Keychain.SECURITY_LEVEL.SECURE_SOFTWARE,
		}
		console.debug('saveRefreshToken:', options)
		console.debug('saveRefreshToken: saving refresh token to keychain')
		try {
			await Keychain.setGenericPassword('user', refreshToken, options)
			await AsyncStorage.setItem(BIO_STORE_PREF_KEY, AUTH_STORAGE_TYPE.NONE)
		} catch (err) {
			console.error(err)
		}
	} else {
		// NO SAVING THE TOKEN KEEP IN MEMORY ONLY!
		console.debug('saveRefreshToken: not saving refresh token')
	}
}

type StringMap = { [key: string]: string | undefined }
const parseCallbackUrlParams = (url: string): { code: string; state?: string } => {
	const urlParts = url.split('?')
	const query = urlParts[1]
	const queryParts = query.split('&')

	const obj: StringMap = {
		code: undefined,
		status: undefined,
	}

	queryParts.forEach((qpRaw) => {
		const [key, val] = qpRaw.split('=')
		obj[key] = val
	})

	if (!obj.code) {
		throw new Error('invalid callack params')
	}
	return {
		code: obj.code,
		state: obj.state,
	}
}
const getProfileInfo = async (): Promise<api.UserDataProfile | undefined> => {
	console.debug('getProfileInfo: testing user data')
	const user = await api.get<api.UserData>('/v0/user')
	console.debug('getProfileInfo: ', user)
	return user?.data.attributes.profile
}

const processAuthResponse = async (dispatch: Dispatch, response: Response): Promise<string> => {
	try {
		if (response.status < 200 || response.status > 399) {
			console.debug('processAuthResponse: non-200 response', response.status)
			console.debug('processAuthResponse:', await response.text())
			throw Error(`${response.status}`)
		}
		const authResponse = (await response.json()) as RawAuthResponse
		console.debug('processAuthResponse: Callback handler Success response:', authResponse)
		if (authResponse.refresh_token && authResponse.access_token) {
			await saveRefreshToken(authResponse.refresh_token)
			api.setAccessToken(authResponse.access_token)
			return authResponse.access_token
		}
		throw new Error('No Refresh or Access Token')
	} catch (e) {
		console.error(e)
		console.debug('processAuthResponse: clearing keychain')
		await clearStoredAuthCreds()
		throw e
	}
}

const getAuthLoginPromptType = async (): Promise<LOGIN_PROMPT_TYPE> => {
	const value = await AsyncStorage.getItem(BIO_STORE_PREF_KEY)
	console.debug(`getAuthLoginPromptType: ${value}`)
	if (value === AUTH_STORAGE_TYPE.BIOMETRIC) {
		return LOGIN_PROMPT_TYPE.UNLOCK
	}
	return LOGIN_PROMPT_TYPE.LOGIN
}

const attempIntializeAuthWithRefreshToken = async (dispatch: Dispatch, refreshToken: string): Promise<void> => {
	try {
		await CookieManager.clearAll()
		const response = await fetch(AUTH_TOKEN_EXCHANGE_URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: qs.stringify({
				grant_type: 'refresh_token',
				client_id: AUTH_CLIENT_ID,
				client_secret: AUTH_CLIENT_SECRET,
				redirect_uri: AUTH_REDIRECT_URL,
				refresh_token: refreshToken,
			}),
		})
		await processAuthResponse(dispatch, response)
		const profile = await getProfileInfo()

		dispatch(dispatchInitialize(LOGIN_PROMPT_TYPE.LOGIN, profile))
	} catch (err) {
		console.error(err)
		// if some error occurs, we need to force them to re-login
		// even if they had a refreshToken saved, since these tokens are one time use
		// if we fail, we just need to get a new one (re-login) and start over
		//T ODO we can check to see if we get a specific error for this scenario (refresh token no longer valid) so we may avoid
		// re-login in certain error situations
		dispatch(dispatchInitialize(LOGIN_PROMPT_TYPE.LOGIN, undefined))
	}
}

/**
 * Redux action to logout and clear authentication session
 *
 * @returns AsyncReduxAction
 */
export const logout = (): AsyncReduxAction => {
	return async (dispatch): Promise<void> => {
		console.debug('logout: logging out')
		try {
			await CookieManager.clearAll()
			const response = await fetch(AUTH_REVOKE_URL, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${api.getAccessToken()}`,
					'Content-Type': 'application/x-www-form-urlencoded',
				},
				body: qs.stringify({
					token: api.getAccessToken(),
					client_id: AUTH_CLIENT_ID,
					client_secret: AUTH_CLIENT_SECRET,
					redirect_uri: AUTH_REDIRECT_URL,
				}),
			})
			console.debug('logout:', response.status)
			console.debug('logout:', await response.text())
		} finally {
			await clearStoredAuthCreds()
			api.setAccessToken(undefined)
			// we're truly loging out here, so in order to log back in
			// the prompt type needs to be "login" instead of unlock
			dispatch(dispatchInitialize(LOGIN_PROMPT_TYPE.LOGIN, undefined))
		}
	}
}

/**
 * Redux action to initiate biometric unlock of a saved refresh token
 *
 * @returns AsyncReduxAction
 */
export const startBiometricsLogin = (): AsyncReduxAction => {
	return async (dispatch, getState): Promise<void> => {
		console.debug('startBiometricsLogin: starting')

		let refreshToken: string | undefined
		try {
			const result = await Keychain.getGenericPassword()
			refreshToken = result ? result.password : undefined
		} catch (err) {
			if (isAndroid()) {
				if (err?.message?.indexOf('Cancel') > -1) {
					// cancel
					console.debug('startBiometricsLogin: User canceled biometric login')
					return
				}
			}
			console.debug('startBiometricsLogin: Failed to get generic password from keychain')
			console.log(err)
		}
		console.debug('startBiometricsLogin: finsihed - refreshToken: ' + !!refreshToken)
		if (!refreshToken) {
			dispatch(dispatchInitialize(LOGIN_PROMPT_TYPE.LOGIN, undefined))
			return
		}
		if (getState().auth.loading) {
			console.debug('startBiometricsLogin: other operation already logging in, ignoring')
			// aready logging in, duplicate effor
			return
		}
		dispatch(dispatchStartAuthLogin())
		await attempIntializeAuthWithRefreshToken(dispatch, refreshToken)
	}
}

/**
 * Redux action to initiate auth and attempt to refresh access token
 * with a saved refresh_token if one exists and is not protected by biometric lock
 *
 * @returns AsyncReduxAction
 */
export const initializeAuth = (): AsyncReduxAction => {
	return async (dispatch): Promise<void> => {
		let refreshToken: string | undefined
		const pType = await getAuthLoginPromptType()
		if (pType === LOGIN_PROMPT_TYPE.UNLOCK) {
			dispatch(dispatchInitialize(LOGIN_PROMPT_TYPE.UNLOCK, undefined))
			return
		} else {
			try {
				const result = await Keychain.getGenericPassword()
				refreshToken = result ? result.password : undefined
			} catch (err) {
				console.debug('initializeAuth: Failed to get generic password from keychain')
				console.log(err)
				await clearStoredAuthCreds()
			}
		}
		if (!refreshToken) {
			dispatch(dispatchInitialize(LOGIN_PROMPT_TYPE.LOGIN, undefined))
			return
		}
		await attempIntializeAuthWithRefreshToken(dispatch, refreshToken)
	}
}

/**
 * Redux action to processes the login-success callback url with code and state params
 * to convert to a refresh and access token
 *
 * @param url - the full callback url with the code and state query params
 *
 * @returns AsyncReduxAction
 */
export const handleTokenCallbackUrl = (url: string): AsyncReduxAction => {
	return async (dispatch /*getState*/): Promise<void> => {
		try {
			dispatch(dispatchStartAuthLogin())

			console.debug('handleTokenCallbackUrl: HANDLING CALLBACK', url)
			const { code } = parseCallbackUrlParams(url)

			console.debug('handleTokenCallbackUrl: POST to', AUTH_TOKEN_EXCHANGE_URL)
			await CookieManager.clearAll()
			const response = await fetch(AUTH_TOKEN_EXCHANGE_URL, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
				body: qs.stringify({
					grant_type: 'authorization_code',
					client_id: AUTH_CLIENT_ID,
					client_secret: AUTH_CLIENT_SECRET,
					// TODO: Replace this with a random string
					code_verifier: 'mylongcodeverifier',
					code: code,
					// TODO: replace this state with something dynamically generated
					state: '12345',
					redirect_uri: AUTH_REDIRECT_URL,
				}),
			})
			await processAuthResponse(dispatch, response)
			const profile = await getProfileInfo()
			dispatch(dispatchFinishAuthLogin(profile))
		} catch (err) {
			dispatch(dispatchFinishAuthLogin(undefined, err))
		}
	}
}

/**
 * Redux Action to close / cancel the web login flow (hides the webview)
 *
 * @returns AsyncReduxAction
 */
export const cancelWebLogin = (): AsyncReduxAction => {
	return async (dispatch): Promise<void> => {
		dispatch(dispatchShowWebLogin())
	}
}

/**
 * Redux action to initiate the web login flow by
 * setting the url to display on the login screen
 *
 * @returns AsyncReduxAction
 */
export const startWebLogin = (): AsyncReduxAction => {
	return async (dispatch): Promise<void> => {
		await CookieManager.clearAll()
		// TODO: modify code challenge and state based on
		// what will be used in LoginSuccess.js for the token exchange.
		// The code challenge is a SHA256 hash of the code verifier string.
		const params = qs.stringify({
			client_id: AUTH_CLIENT_ID,
			redirect_uri: AUTH_REDIRECT_URL,
			scope: AUTH_SCOPES,
			response_type: 'code',
			response_mode: 'query',
			code_challenge_method: 'S256',
			code_challenge: 'tDKCgVeM7b8X2Mw7ahEeSPPFxr7TGPc25IV5ex0PvHI',
			state: '12345',
		})
		const url = `${AUTH_ENDPOINT}?${params}`
		dispatch(dispatchShowWebLogin(url))
		//Linking.openURL(url)
	}
}
