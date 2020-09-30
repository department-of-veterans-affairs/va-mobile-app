import { AuthFinishInitPayload, AuthShowWebLoginPayload, AuthStartInitPayload } from 'store/types'
import createReducer from './createReducer'

export type AuthState = {
	loading: boolean
	initializing: boolean
	error?: Error
	loggedIn: boolean
	webLoginUrl?: string
}

const initialState: AuthState = {
	loading: false,
	initializing: true,
	loggedIn: false,
}

export default createReducer<AuthState>(initialState, {
	AUTH_SHOW_WEB_LOGIN: (state: AuthState, payload: AuthShowWebLoginPayload): AuthState => {
		return {
			...state,
			webLoginUrl: payload.authUrl,
		}
	},
	AUTH_START_INIT: (_state: AuthState, _payload: AuthStartInitPayload): AuthState => {
		return {
			...initialState,
			loading: true,
		}
	},
	AUTH_FINISH_INIT: (state: AuthState, payload: AuthFinishInitPayload): AuthState => {
		return {
			...state,
			...payload,
			initializing: false, // first finish should set this to false
			webLoginUrl: undefined,
			loading: false,
		}
	},
})
