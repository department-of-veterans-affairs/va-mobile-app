import * as Keychain from 'react-native-keychain'
import { Dispatch } from 'redux'
import CookieManager from '@react-native-community/cookies'
import qs from 'querystringify'

import { AUTH_CLIENT_ID, AUTH_CLIENT_SECRET, AUTH_ENDPOINT, AUTH_REDIRECT_URL, AUTH_REVOKE_URL, AUTH_SCOPES, AUTH_TOKEN_EXCHANGE_URL } from '@env'

import { AsyncReduxAction, AuthFinishInitAction, AuthShowWebLoginAction, AuthStartInitAction } from 'store/types'
import { getAccessToken as getStoreAccessToken, setAccessToken } from 'store/api'

const dispatchStartAuthInit = (): AuthStartInitAction => {
	return {
		type: 'AUTH_START_INIT',
		payload: {},
	}
}

const dispatchShowWebLogin = (authUrl?: string): AuthShowWebLoginAction => {
	return {
		type: 'AUTH_SHOW_WEB_LOGIN',
		payload: { authUrl },
	}
}

const dispatchFinishAuthInit = (accessToken?: string, error?: Error): AuthFinishInitAction => {
	setAccessToken(accessToken)
	return {
		type: 'AUTH_FINISH_INIT',
		payload: { loggedIn: !!accessToken, error },
	}
}

type RawAuthResponse = {
	access_token?: string
	refresh_token?: string
	accessTokenExpirationDate?: string
	token_type?: string
	id_token?: string
}

const saveRefreshToken = async (refreshToken: string): Promise<void> => {
	// TODO first time through, need to ask user what type of access to use
	// TODO prompt user how they want the access to work
	// for now, no biometrics required, but change to accessControl to enable that
	console.debug('saving refresh token to keychain')
	await Keychain.setGenericPassword('user', refreshToken, {
		accessControl: Keychain.ACCESS_CONTROL.USER_PRESENCE,
	})
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
			console.warn('non-200 response', response.status)
			console.log(await response.text())
			throw Error(`${response.status}`)
		}
		const authResponse = (await response.json()) as RawAuthResponse
		console.log('Callback handler Success response:', authResponse)
		if (authResponse.refresh_token && authResponse.access_token) {
			await saveRefreshToken(authResponse.refresh_token)
			dispatch(dispatchFinishAuthInit(authResponse.access_token))
			return authResponse.access_token
		}
		throw new Error('No Refresh or Access Token')
	} catch (e) {
		console.log(e)
		console.debug('clearing keychain')
		await Keychain.resetGenericPassword()
		throw e
	}
}

export const logout = (): AsyncReduxAction => {
	return async (dispatch): Promise<void> => {
		console.log('logging out')
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
			console.log(response.status)
			console.log(await response.text())
		} finally {
			await Keychain.resetGenericPassword()
			dispatch(dispatchFinishAuthInit(undefined))
		}
	}
}

export const attemptAuthWithSavedCredentials = (): AsyncReduxAction => {
	return async (dispatch): Promise<void> => {
		dispatch(dispatchStartAuthInit())
		try {
			const result = await Keychain.getGenericPassword()
			if (!result) {
				console.debug('no generic password saved')
				dispatch(dispatchFinishAuthInit())
				return
			}
			const refreshToken = result.password
			if (!refreshToken) {
				console.debug('no generic password refresh token saved')
				dispatch(dispatchFinishAuthInit())
				return
			}

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

			dispatch(dispatchFinishAuthInit(accessToken))
		} catch (err) {
			console.log(err)
			dispatch(dispatchFinishAuthInit())
		}
	}
}

export const handleTokenCallbackUrl = (url: string): AsyncReduxAction => {
	return async (dispatch /*getState*/): Promise<void> => {
		try {
			dispatch(dispatchStartAuthInit())

			console.log('HANDLING CALLBACK', url)
			const { code } = parseCallbackUrlParams(url)

			console.log('POST to', AUTH_TOKEN_EXCHANGE_URL)
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
			dispatch(dispatchFinishAuthInit(undefined, err))
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
