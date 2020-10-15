import * as Keychain from 'react-native-keychain'
import { Action } from 'redux'
import AsyncStorage from '@react-native-community/async-storage'
import CookieManager from '@react-native-community/cookies'
import qs from 'querystringify'

import * as api from 'store/api'
import {
	AUTH_STORAGE_TYPE,
	AsyncReduxAction,
	AuthFinishLoginAction,
	AuthInitializeAction,
	AuthInitializePayload,
	AuthShowWebLoginAction,
	AuthStartLoginAction,
	AuthUpdateStoreWithBioAction,
	LOGIN_PROMPT_TYPE,
} from 'store/types'
import { StoreState } from 'store/reducers'
import { ThunkDispatch } from 'redux-thunk'
import { isAndroid } from 'utils/platform'
import getEnv from 'utils/env'

const { AUTH_CLIENT_ID, AUTH_CLIENT_SECRET, AUTH_ENDPOINT, AUTH_REDIRECT_URL, AUTH_REVOKE_URL, AUTH_SCOPES, AUTH_TOKEN_EXCHANGE_URL } = getEnv()

let inMemoryRefreshToken: string | undefined
type TDispatch = ThunkDispatch<StoreState, undefined, Action<unknown>>

const dispatchInitializeAction = (payload: AuthInitializePayload): AuthInitializeAction => {
	// TODO: remove this assignment once profile service passes along this data
	if (payload.profile) {
		payload.profile.most_recent_branch = 'United States Air Force'
	}

	return {
		type: 'AUTH_INITIALIZE',
		payload,
	}
}
const BIOMETRICS_STORE_PREF_KEY = '@store_creds_bio'
const KEYCHAIN_STORAGE_KEY = 'vamobile'

const clearStoredAuthCreds = async (): Promise<void> => {
	await Keychain.resetInternetCredentials(KEYCHAIN_STORAGE_KEY)
	inMemoryRefreshToken = undefined
}

const deviceSupportsBiometrics = async (): Promise<boolean> => {
	return !!(await Keychain.getSupportedBiometryType())
}

const isBiometricsPreferred = async (): Promise<boolean> => {
	try {
		const value = await AsyncStorage.getItem(BIOMETRICS_STORE_PREF_KEY)
		console.debug(`shouldStoreWithBiometrics: BIOMETRICS_STORE_PREF_KEY=${value}`)
		if (value) {
			const shouldStore = value === AUTH_STORAGE_TYPE.BIOMETRIC
			console.debug('shouldStoreWithBiometrics: shouldStore with biometrics: ' + shouldStore)
			return shouldStore
		} else {
			console.debug('shouldStoreWithBiometrics: BIOMETRICS_STORE_PREF_KEY: no stored preference for auth found')
		}
	} catch (e) {
		// if we get an exception here assume there is no preference
		// and go with the default case, log the error and continue
		console.error(e)
	}
	// first time login this will be undefined
	// assume we should save with biometrics as default
	return true
}

const dispatchUpdateStoreBio = (shouldStoreWithBiometric: boolean): AuthUpdateStoreWithBioAction => {
	return {
		type: 'AUTH_UPDATE_STORE_BIO',
		payload: { shouldStoreWithBiometric },
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

const finishInitialize = async (dispatch: TDispatch, loginPromptType: LOGIN_PROMPT_TYPE, profile?: api.UserDataProfile): Promise<void> => {
	// if undefined we assume save with biometrics (first time through)
	// only set shouldSave to false when user specifically sets that in user settings
	const biometricsPreferred = await isBiometricsPreferred()
	const canSaveWithBiometrics = await deviceSupportsBiometrics()
	const payload = {
		loginPromptType,
		profile,
		canStoreWithBiometric: canSaveWithBiometrics,
		shouldStoreWithBiometric: biometricsPreferred,
	}
	dispatch(dispatchInitializeAction(payload))
}

type RawAuthResponse = {
	access_token?: string
	refresh_token?: string
	accessTokenExpirationDate?: string
	token_type?: string
	id_token?: string
}

const saveRefreshToken = async (refreshToken: string, saveWithBiometrics?: boolean): Promise<void> => {
	console.log(getEnv())
	inMemoryRefreshToken = refreshToken
	const canSaveWithBiometrics = await deviceSupportsBiometrics()
	// if withBiometrics is not defined we check to see what prefs are already stored and whether
	// it's even possible to do so
	if (saveWithBiometrics === undefined) {
		const biomeetricsPreferred = await isBiometricsPreferred()
		saveWithBiometrics = canSaveWithBiometrics && biomeetricsPreferred
	}
	console.debug(`saveRefreshToken: canSaveWithBio:${canSaveWithBiometrics}, saveWithBiometrics:${saveWithBiometrics}`)

	// no matter what reset first, otherwise might hit an exception if changing access types from previously saved
	await Keychain.resetInternetCredentials(KEYCHAIN_STORAGE_KEY)
	if (canSaveWithBiometrics && saveWithBiometrics) {
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
			await Keychain.setInternetCredentials(KEYCHAIN_STORAGE_KEY, 'user', refreshToken, options)
			await AsyncStorage.setItem(BIOMETRICS_STORE_PREF_KEY, AUTH_STORAGE_TYPE.BIOMETRIC)
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
			await Keychain.setInternetCredentials(KEYCHAIN_STORAGE_KEY, 'user', refreshToken, options)
			await AsyncStorage.setItem(BIOMETRICS_STORE_PREF_KEY, AUTH_STORAGE_TYPE.NONE)
		} catch (err) {
			console.error(err)
		}
	} else {
		await Keychain.resetInternetCredentials(KEYCHAIN_STORAGE_KEY)
		// NO SAVING THE TOKEN KEEP IN MEMORY ONLY!
		await AsyncStorage.setItem(BIOMETRICS_STORE_PREF_KEY, AUTH_STORAGE_TYPE.NONE)
		console.debug('saveRefreshToken: not saving refresh token')
	}
}

type StringMap = { [key: string]: string | undefined }
const parseCallbackUrlParams = (url: string): { code: string; state?: string } => {
	const urlParts = url.split('?')
	const query = urlParts[1]
	const queryParts = query?.split('&') || []

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

const processAuthResponse = async (response: Response): Promise<string> => {
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
	const hasSavedPwd = await Keychain.hasInternetCredentials(KEYCHAIN_STORAGE_KEY)
	if (!hasSavedPwd) {
		console.debug('getAuthLoginPromptType: no stored credentials')
		return LOGIN_PROMPT_TYPE.LOGIN
	}
	// we have a credential saved, check if it's saved with biometrics now
	const value = await AsyncStorage.getItem(BIOMETRICS_STORE_PREF_KEY)
	console.debug(`getAuthLoginPromptType: ${value}`)
	if (value === AUTH_STORAGE_TYPE.BIOMETRIC) {
		return LOGIN_PROMPT_TYPE.UNLOCK
	}
	return LOGIN_PROMPT_TYPE.LOGIN
}

const attempIntializeAuthWithRefreshToken = async (dispatch: TDispatch, refreshToken: string): Promise<void> => {
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
		await processAuthResponse(response)
		const profile = await getProfileInfo()

		await finishInitialize(dispatch, LOGIN_PROMPT_TYPE.LOGIN, profile)
	} catch (err) {
		console.error(err)
		// if some error occurs, we need to force them to re-login
		// even if they had a refreshToken saved, since these tokens are one time use
		// if we fail, we just need to get a new one (re-login) and start over
		//T ODO we can check to see if we get a specific error for this scenario (refresh token no longer valid) so we may avoid
		// re-login in certain error situations
		await finishInitialize(dispatch, LOGIN_PROMPT_TYPE.LOGIN, undefined)
	}
}

/**
 * Update the user preferences to store the refresh token with biometrics
 * @param value - the preference
 */
export const setBiometricsPreference = (value: boolean): AsyncReduxAction => {
	return async (dispatch): Promise<void> => {
		// resave the token with the new preference
		await saveRefreshToken(inMemoryRefreshToken || '', value)
		dispatch(dispatchUpdateStoreBio(value))
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
			await finishInitialize(dispatch, LOGIN_PROMPT_TYPE.LOGIN, undefined)
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
			const result = await Keychain.getInternetCredentials(KEYCHAIN_STORAGE_KEY)
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
			await finishInitialize(dispatch, LOGIN_PROMPT_TYPE.LOGIN, undefined)
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
			await finishInitialize(dispatch, LOGIN_PROMPT_TYPE.UNLOCK, undefined)
			return
		} else {
			// if not set to unlock, try to pull credentials immediately
			// if it fails, just means there was nothing there or it was corrupted
			// and we will clear it and show login again
			try {
				const result = await Keychain.getInternetCredentials(KEYCHAIN_STORAGE_KEY)
				refreshToken = result ? result.password : undefined
			} catch (err) {
				console.debug('initializeAuth: Failed to get generic password from keychain')
				console.log(err)
				await clearStoredAuthCreds()
			}
		}
		if (!refreshToken) {
			await finishInitialize(dispatch, LOGIN_PROMPT_TYPE.LOGIN, undefined)
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
			await processAuthResponse(response)
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
