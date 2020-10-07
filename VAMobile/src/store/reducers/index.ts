import { combineReducers } from 'redux'

import auth, { AuthState, initialAuthState } from './auth'
import tabBar, { TabBarState, initialTabBarState } from './tabBar'
import profile, { ProfileState, initialProfileState } from './profile'

export * from './auth'
export * from './tabBar'
export * from './profile'

export interface StoreState {
	auth: AuthState
	tabBar: TabBarState
	profile: ProfileState
}

export const InitialState: StoreState = {
	auth: initialAuthState,
	tabBar: initialTabBarState,
    profile: initialProfileState
}

const allReducers = combineReducers({
	auth,
	tabBar,
	profile,
})

export default allReducers
