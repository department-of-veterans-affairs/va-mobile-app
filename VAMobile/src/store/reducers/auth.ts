import { AuthFinishLoginPayload, AuthShowWebLoginPayload, AuthStartLoginPayload, LOGIN_PROMPT_TYPE } from 'store/types'
import createReducer from './createReducer'

export type AuthState = {
	loading: boolean
	initializing: boolean
	error?: Error
	loggedIn: boolean
	loginPromptType?: LOGIN_PROMPT_TYPE
	webLoginUrl?: string
}

const initialState: AuthState = {
	loading: false,
	initializing: true,
	loggedIn: false,
}

export default createReducer<AuthState>(initialState, {
	AUTH_INITIALIZE: (_state: AuthState, payload: AuthStartLoginPayload): AuthState => {
		return {
			...initialState,
			...payload,
			initializing: false,
		}
	},
	AUTH_START_LOGIN: (_state: AuthState, payload: AuthStartLoginPayload): AuthState => {
		return {
			...initialState,
			...payload,
			loading: true,
		}
	},
	AUTH_FINISH_LOGIN: (state: AuthState, payload: AuthFinishLoginPayload): AuthState => {
		return {
			...state,
			...payload,
			webLoginUrl: undefined,
			loading: false,
		}
	},
	AUTH_SHOW_WEB_LOGIN: (state: AuthState, payload: AuthShowWebLoginPayload): AuthState => {
		return {
			...state,
			webLoginUrl: payload.authUrl,
		}
	},
})
