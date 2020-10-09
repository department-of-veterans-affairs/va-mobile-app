import * as api from '../api'
import { AType, ActionBase } from './index'
/**
 * Options for which way to store the refresh token
 */
export enum AUTH_STORAGE_TYPE {
	/** Store refresh token with biometric locking */
	BIOMETRIC = 'BIOMETRIC',
	/** Store refresh token without any locking */
	NONE = 'NONE',
}

/**
 * Options for how to display the login screen propt
 */
export enum LOGIN_PROMPT_TYPE {
	/** user is not logged in at all and login button should be shonw */
	LOGIN = 'LOGIN',
	/** user has saved creds but needs to unlock to login, unlock button should be shown */
	UNLOCK = 'UNLOCK',
}

/**
 * Redux payload for {@link AuthInitializeAction} action
 */
export type AuthInitializePayload = {
	loginPromptType: LOGIN_PROMPT_TYPE
	profile?: api.UserDataProfile
}
/**
 * Redux action to initialize authentication
 */
export type AuthInitializeAction = ActionBase<'AUTH_INITIALIZE', AuthInitializePayload>

/**
 * Redux payload for {@link AuthStartLoginAction} action
 */
export type AuthStartLoginPayload = {}
/**
 * Redux action to signify access token request started
 */
export type AuthStartLoginAction = ActionBase<'AUTH_START_LOGIN', AuthStartLoginPayload>

/**
 * Redux payload for {@link AuthFinishLoginAction} action
 */
export type AuthFinishLoginPayload = {
	profile?: api.UserDataProfile
	error?: Error
}
/**
 * Redux action to signify access token request finished
 */
export type AuthFinishLoginAction = ActionBase<'AUTH_FINISH_LOGIN', AuthFinishLoginPayload>

/**
 * Redux payload for {@link AuthShowWebLoginAction} action
 */
export type AuthShowWebLoginPayload = {
	authUrl?: string
}
/**
 * Redux action to initiate web login
 */
export type AuthShowWebLoginAction = ActionBase<'AUTH_SHOW_WEB_LOGIN', AuthShowWebLoginPayload>

/**
 * Redux payload for {@link AuthShowStorageTypeModalAction} action
 */
export type AuthShowStorageTypePayload = {
	refreshToken: string
	accessToken: string
}

// ALL ACTIONS
export type AuthActions = AType<AuthShowWebLoginAction> | AType<AuthStartLoginAction> | AType<AuthFinishLoginAction> | AType<AuthInitializeAction>
