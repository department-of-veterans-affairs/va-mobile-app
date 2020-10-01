import { AType, ActionBase } from './index'

// AUTH_START_INIT
export type AuthStartInitPayload = {}
export type AuthStartInitAction = ActionBase<'AUTH_START_INIT', AuthStartInitPayload>

// AUTH_FINISH_INIT
export type AuthFinishInitPayload = {
	loggedIn: boolean
	error?: Error
}
export type AuthFinishInitAction = ActionBase<'AUTH_FINISH_INIT', AuthFinishInitPayload>

// AUTH_SHOW_WEB_LOGIN
export type AuthShowWebLoginPayload = {
	authUrl?: string
}
export type AuthShowWebLoginAction = ActionBase<'AUTH_SHOW_WEB_LOGIN', AuthShowWebLoginPayload>

// ALL ACTIONS
export type AuthActions = AType<AuthShowWebLoginAction> | AType<AuthStartInitAction> | AType<AuthFinishInitAction>
