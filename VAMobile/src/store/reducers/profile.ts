import { ProfilePayload } from 'store/types'
import createReducer from './createReducer'

export type ProfileState = {
	profileData: ProfilePayload
}

export const initialProfileState: ProfileState = {
	profileData: {
		name: '',
		mostRecentBranch: '',
	},
}

export default createReducer(initialProfileState, {
	GET_PROFILE_DATA: (_state: ProfileState, payload: ProfilePayload): ProfileState => {
		return {
			...initialProfileState,
			profileData: payload,
		}
	},
})
