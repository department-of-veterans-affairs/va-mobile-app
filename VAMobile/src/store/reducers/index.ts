import { combineReducers } from 'redux'
import auth, { AuthState } from './auth'
import counter, { CounterState } from './counter'
export * from './auth'
export * from './counter'

export interface StoreState {
	auth: AuthState
	counter: CounterState
}

const allReducers = combineReducers({
	auth,
	counter,
})

export default allReducers
