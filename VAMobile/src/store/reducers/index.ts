import { combineReducers } from 'redux'
import auth, { AuthState } from './auth'
import tabBar, { TabBarState } from './tabBar'

export * from './auth'

export interface StoreState {
	auth: AuthState
	tabBar: TabBarState
}

const allReducers = combineReducers({
	auth,
	tabBar,
})

export default allReducers
