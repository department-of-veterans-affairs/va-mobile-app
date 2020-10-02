import { combineReducers } from 'redux'
import auth, { AuthState } from './auth'
import counter, { CounterState } from './counter'
import tabBarVisible, { TabBarState } from './tabBar'

export * from './auth'
export * from './counter'

export interface StoreState {
	auth: AuthState
	counter: CounterState
	tabBarVisible: TabBarState
}

const allReducers = combineReducers({
	auth,
	counter,
	tabBarVisible,
})

export default allReducers
