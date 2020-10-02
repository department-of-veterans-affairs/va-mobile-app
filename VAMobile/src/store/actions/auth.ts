import * as Keychain from 'react-native-keychain'
import { Dispatch } from 'redux'
import AsyncStorage from '@react-native-community/async-storage'
import CookieManager from '@react-native-community/cookies'
import qs from 'querystringify'

import { AUTH_CLIENT_ID, AUTH_CLIENT_SECRET, AUTH_ENDPOINT, AUTH_REDIRECT_URL, AUTH_REVOKE_URL, AUTH_SCOPES, AUTH_TOKEN_EXCHANGE_URL } from '@env'

import {
	AUTH_STORAGE_TYPE,
	AsyncReduxAction,
	AuthFinishLoginAction,
	AuthHideStorageTypeModalAction,
	AuthInitializeAction,
	AuthShowStorageTypeModalAction,
	AuthShowWebLoginAction,
	AuthStartLoginAction,
	LOGIN_PROMPT_TYPE,
} from 'store/types'
import { IS_ANDROID } from 'utils/accessibility'
import { getAccessToken as getStoreAccessToken, setAccessToken } from 'store/api'

const dispatchInitialize = (loginPromptType: LOGIN_PROMPT_TYPE, loggedIn: boolean): AuthInitializeAction => {
	return {
		type: 'AUTH_INITIALIZE',
		payload: { loginPromptType, loggedIn },
	}
}

const dispatchStartAuthLogin = (): AuthStartLoginAction => {
	return {
		type: 'AUTH_START_LOGIN',
		payload: {},
	}
}

const dispatchFinishAuthLogin = (accessToken?: string, error?: Error): AuthFinishLoginAction => {
	setAccessToken(accessToken)
	return {
		type: 'AUTH_FINISH_LOGIN',
		payload: { loggedIn: !!accessToken, error },
	}
}

const dispatchShowAuthStorageTypeModal = (refreshToken: string, accessToken: string): AuthShowStorageTypeModalAction => {
	return {
		type: 'AUTH_SHOW_STORAGE_TYPE_MODAL',
		payload: {
			refreshToken,
			accessToken,
		},
	}
}

const dispatcHideSetAuthStorageTypeModal = (): AuthHideStorageTypeModalAction => {
	return {
		type: 'AUTH_HIDE_STORAGE_TYPE_MODAL',
		payload: {},
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

const saveRefreshToken = async (dispatch: Dispatch, refreshToken: string, accessToken: string): Promise<void> => {
	let storeWithBiometrics: boolean | undefined
	try {
		const value = await AsyncStorage.getItem(BIO_STORE_PREF_KEY)
		console.debug(`saveRefreshToken: token=${value}`)
		if (value !== null) {
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
		const hasBiometric = !!(await Keychain.getSupportedBiometryType())
		if (hasBiometric && IS_ANDROID) {
			console.log('')
			// if we can't do hardware storage, don't try biometrcis
			//hasBiometric = Keychain.SECURITY_LEVEL.SECURE_HARDWARE === (await Keychain.getSecurityLevel())
		}
		if (!hasBiometric) {
			storeWithBiometrics = false
			// we dno't even support bio, so proceed without it
		} else {
			// we don't know, need to ask the user how they want to save creds (first login)
			dispatch(dispatchShowAuthStorageTypeModal(refreshToken, accessToken))
			return
		}
	}

	let accessControl: Keychain.ACCESS_CONTROL
	let authenticationType: Keychain.AUTHENTICATION_TYPE | undefined
	if (storeWithBiometrics) {
		// user opted to store with biometrics
		accessControl = Keychain.ACCESS_CONTROL.BIOMETRY_ANY
		authenticationType = Keychain.AUTHENTICATION_TYPE.BIOMETRICS
	} else {
		// allow device passcode if it doesn't appear to support bio
		accessControl = Keychain.ACCESS_CONTROL.DEVICE_PASSCODE
		authenticationType = undefined
	}

	const options: Keychain.Options = {
		accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
		accessControl,
		authenticationType,
		securityLevel: Keychain.SECURITY_LEVEL.SECURE_SOFTWARE,
	}
	console.debug('saveRefreshToken:', options)
	console.debug('saveRefreshToken: saving refresh token to keychain')
	try {
		await Keychain.setGenericPassword('user', refreshToken, options)
	} catch (err) {
		console.error(err)
	}

	dispatch(dispatchFinishAuthLogin(accessToken))
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
			await saveRefreshToken(dispatch, authResponse.refresh_token, authResponse.access_token)
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
		const accessToken = await processAuthResponse(dispatch, response)
		dispatch(dispatchInitialize(LOGIN_PROMPT_TYPE.LOGIN, !!accessToken))
		//dispatch(dispatchFinishAuthLogin(accessToken))
	} catch (err) {
		console.error(err)
		// if some error occurs, we need to force them to re-login
		// even if they had a refreshToken saved, since these tokens are one time use
		// if we fail, we just need to get a new one (re-login) and start over
		//T ODO we can check to see if we get a specific error for this scenario (refresh token no longer valid) so we may avoid
		// re-login in certain error situations
		dispatch(dispatchInitialize(LOGIN_PROMPT_TYPE.LOGIN, false))
	}
}

export const selectAuthStorageLevel = (type: AUTH_STORAGE_TYPE): AsyncReduxAction => {
	return async (dispatch, getState) => {
		dispatch(dispatcHideSetAuthStorageTypeModal())
		const authState = getState().auth
		if (!authState.selectStorageTypeOptions) {
			console.debug("selectAuthStorageLevel: authState.selectStorageTypeOptions not defined, can't complete action'")
			return
		}
		await AsyncStorage.setItem(BIO_STORE_PREF_KEY, type)
		const { refreshToken, accessToken } = authState.selectStorageTypeOptions
		await saveRefreshToken(dispatch, refreshToken, accessToken)
	}
}

export const logout = (): AsyncReduxAction => {
	return async (dispatch): Promise<void> => {
		console.debug('logout: logging out')
		try {
			await CookieManager.clearAll()
			const response = await fetch(AUTH_REVOKE_URL, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${getStoreAccessToken()}`,
					'Content-Type': 'application/x-www-form-urlencoded',
				},
				body: qs.stringify({
					token: getStoreAccessToken(),
					client_id: AUTH_CLIENT_ID,
					client_secret: AUTH_CLIENT_SECRET,
					redirect_uri: AUTH_REDIRECT_URL,
				}),
			})
			console.debug('logout:', response.status)
			console.debug('logout:', await response.text())
		} finally {
			await clearStoredAuthCreds()
			// we're truly loging out here, so in order to log back in
			// the prompt type needs to be "login" instead of unlock
			dispatch(dispatchInitialize(LOGIN_PROMPT_TYPE.LOGIN, false))
		}
	}
}

export const startBiometricsLogin = (): AsyncReduxAction => {
	return async (dispatch, getState) => {
		console.debug('startBiometricsLogin: starting')

		let refreshToken: string | undefined
		try {
			const result = await Keychain.getGenericPassword()
			refreshToken = result ? result.password : undefined
		} catch (err) {
			if (IS_ANDROID) {
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
			dispatch(dispatchInitialize(LOGIN_PROMPT_TYPE.LOGIN, false))
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

export const initializeAuth = (): AsyncReduxAction => {
	return async (dispatch): Promise<void> => {
		let refreshToken: string | undefined
		const pType = await getAuthLoginPromptType()
		if (pType === LOGIN_PROMPT_TYPE.UNLOCK) {
			dispatch(dispatchInitialize(LOGIN_PROMPT_TYPE.UNLOCK, false))
			return
		} else {
			try {
				const result = await Keychain.getGenericPassword()
				refreshToken = result ? result.password : undefined
			} catch (err) {
				console.debug('initializeAuth: Failed to get generic password from keychain')
				console.log(err)
			}
		}
		if (!refreshToken) {
			dispatch(dispatchInitialize(LOGIN_PROMPT_TYPE.LOGIN, false))
			return
		}
		await attempIntializeAuthWithRefreshToken(dispatch, refreshToken)
	}
}

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
		} catch (err) {
			dispatch(dispatchFinishAuthLogin(undefined, err))
		}
	}
}

export const cancelWebLogin = (): AsyncReduxAction => {
	return async (dispatch): Promise<void> => {
		dispatch(dispatchShowWebLogin())
	}
}

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
