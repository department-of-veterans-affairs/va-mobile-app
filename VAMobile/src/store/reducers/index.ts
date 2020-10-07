import { combineReducers } from 'redux'
import auth, { AuthState, initialAuthState } from './auth'
import tabBar, { TabBarState, initialTabBarState } from './tabBar'

export * from './auth'
export * from './tabBar'

export interface StoreState {
	auth: AuthState
	tabBar: TabBarState
}

export const InitialState: StoreState = {
	auth: initialAuthState,
	tabBar: initialTabBarState,
}

const allReducers = combineReducers({
	auth,
	tabBar,
})

export default allReducers
