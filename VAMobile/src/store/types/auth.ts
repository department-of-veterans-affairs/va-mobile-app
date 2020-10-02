import { AType, ActionBase } from './index'

export enum AUTH_STORAGE_TYPE {
	BIOMETRIC = 'BIOMETRIC',
	NONE = 'NONE',
}

export enum LOGIN_PROMPT_TYPE {
	LOGIN = 'LOGIN', // user is not logged in at all
	UNLOCK = 'UNLOCK', // user has saved creds but needs to unlock to login
}

// AUTH_INITIALIZE
export type AuthInitializePayload = {
	loginPromptType: LOGIN_PROMPT_TYPE
	loggedIn: boolean
}
export type AuthInitializeAction = ActionBase<'AUTH_INITIALIZE', AuthInitializePayload>

// AUTH_START_LOGIN
export type AuthStartLoginPayload = {}
export type AuthStartLoginAction = ActionBase<'AUTH_START_LOGIN', AuthStartLoginPayload>

// AUTH_FINISH_LOGIN
export type AuthFinishLoginPayload = {
	loggedIn: boolean
	error?: Error
}
export type AuthFinishLoginAction = ActionBase<'AUTH_FINISH_LOGIN', AuthFinishLoginPayload>

// AUTH_SHOW_WEB_LOGIN
export type AuthShowWebLoginPayload = {
	authUrl?: string
}
export type AuthShowWebLoginAction = ActionBase<'AUTH_SHOW_WEB_LOGIN', AuthShowWebLoginPayload>

// AUTH_SHOW_AUTH_STORAGE_TYPE_MODAL
export type AuthShowStorageTypePayload = {
	refreshToken: string
	accessToken: string
}
export type AuthShowStorageTypeModalAction = ActionBase<'AUTH_SHOW_STORAGE_TYPE_MODAL', AuthShowStorageTypePayload>

// AUTH_SHOW_AUTH_STORAGE_TYPE_MODAL
export type AuthHideStorageTypePayload = {}
export type AuthHideStorageTypeModalAction = ActionBase<'AUTH_HIDE_STORAGE_TYPE_MODAL', AuthHideStorageTypePayload>

// ALL ACTIONS
export type AuthActions =
	| AType<AuthShowWebLoginAction>
	| AType<AuthStartLoginAction>
	| AType<AuthFinishLoginAction>
	| AType<AuthShowStorageTypeModalAction>
	| AType<AuthHideStorageTypeModalAction>
	| AType<AuthInitializeAction>
