import { AuthFinishLoginPayload, AuthHideStorageTypePayload, AuthShowStorageTypePayload, AuthShowWebLoginPayload, AuthStartLoginPayload, LOGIN_PROMPT_TYPE } from 'store/types'
import createReducer from './createReducer'

export type AuthState = {
	loading: boolean
	initializing: boolean
	error?: Error
	loggedIn: boolean
	loginPromptType?: LOGIN_PROMPT_TYPE
	webLoginUrl?: string
	showUnlockButton: boolean
	selectStorageTypeOptions?: {
		shown: boolean
		refreshToken: string
		accessToken: string
	}
}

const initialState: AuthState = {
	loading: false,
	initializing: true,
	loggedIn: false,
	showUnlockButton: false,
	selectStorageTypeOptions: undefined,
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
			selectStorageTypeOptions: undefined,
		}
	},
	AUTH_SHOW_WEB_LOGIN: (state: AuthState, payload: AuthShowWebLoginPayload): AuthState => {
		return {
			...state,
			webLoginUrl: payload.authUrl,
		}
	},
	AUTH_SHOW_STORAGE_TYPE_MODAL: (state: AuthState, payload: AuthShowStorageTypePayload): AuthState => {
		return {
			...state,
			selectStorageTypeOptions: {
				shown: true,
				...payload,
			},
		}
	},
	AUTH_HIDE_STORAGE_TYPE_MODAL: (state: AuthState, _payload: AuthHideStorageTypePayload): AuthState => {
		if (!state.selectStorageTypeOptions) {
			return state
		}
		return {
			...state,
			selectStorageTypeOptions: {
				...state.selectStorageTypeOptions,
				shown: false,
			},
		}
	},
})
