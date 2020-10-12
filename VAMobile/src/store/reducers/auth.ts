import * as api from '../api'
import { AuthFinishLoginPayload, AuthInitializePayload, AuthShowWebLoginPayload, AuthStartLoginPayload, LOGIN_PROMPT_TYPE } from 'store/types'
import createReducer from './createReducer'

export type AuthState = {
	loading: boolean
	initializing: boolean
	error?: Error
	loggedIn: boolean
	loginPromptType?: LOGIN_PROMPT_TYPE
	webLoginUrl?: string
	profile?: api.UserDataProfile
}

export const initialAuthState: AuthState = {
	loading: false,
	initializing: true,
	loggedIn: false,
}

const initialState = initialAuthState

export default createReducer<AuthState>(initialState, {
	AUTH_INITIALIZE: (_state: AuthState, payload: AuthInitializePayload): AuthState => {
		const resultingProfileName: Array<string> = []
		if (payload.profile) {
			const { profile } = payload
			const listOfNameComponents = [profile.first_name, profile.middle_name, profile.last_name].filter(Boolean)

			listOfNameComponents.map((nameComponent) => {
				resultingProfileName.push(nameComponent.charAt(0).toUpperCase() + nameComponent.slice(1).toLowerCase())
			})

			payload.profile.full_name = resultingProfileName.join(' ').trim()
		}

		return {
			...initialState,
			...payload,
			initializing: false,
			loggedIn: !!payload.profile,
		}
	},
	AUTH_START_LOGIN: (_state: AuthState, payload: AuthStartLoginPayload): AuthState => {
		return {
			...initialState,
			...payload,
			initializing: false,
			loading: true,
		}
	},
	AUTH_FINISH_LOGIN: (state: AuthState, payload: AuthFinishLoginPayload): AuthState => {
		return {
			...state,
			...payload,
			webLoginUrl: undefined,
			loading: false,
			loggedIn: !!payload.profile,
		}
	},
	AUTH_SHOW_WEB_LOGIN: (state: AuthState, payload: AuthShowWebLoginPayload): AuthState => {
		return {
			...state,
			webLoginUrl: payload.authUrl,
		}
	},
})
