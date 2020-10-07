import { ProfileAction } from 'store/types'

/**
 * Redux action to get the profile data of the signed in user
 *
 * @returns ProfileAction
 */
export const getProfileData = (): ProfileAction => {
	return {
		type: 'GET_PROFILE_DATA',
		payload: {
			name: 'Jerry M Brooks',
			mostRecentBranch: 'United States Air Force',
		},
	}
}
