import { AType, ActionBase } from './index'

/**
 *  Redux payload for {@link ProfileAction} action
 */
export type ProfilePayload = {
	name: string
	mostRecentBranch: string
}

/**
 * Redux action to signify that the profile information is being retrieved
 */
export type ProfileAction = ActionBase<'GET_PROFILE_DATA', ProfilePayload>

/**
 *  All profile actions
 */
export type ProfileActions = AType<ProfileAction>
