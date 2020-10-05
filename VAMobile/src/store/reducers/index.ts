import { combineReducers } from 'redux'
import auth, { AuthState } from './auth'
import tabBarVisible, { TabBarState } from './tabBar'

export * from './auth'

export interface StoreState {
	auth: AuthState
	tabBarVisible: TabBarState
}

const allReducers = combineReducers({
	auth,
	tabBarVisible,
})

export default allReducers
