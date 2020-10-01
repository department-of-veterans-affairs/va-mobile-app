import { CounterUpdatePayload } from 'store/types'
import createReducer from './createReducer'

export type CounterState = {
	counter: number
}

const initialState: CounterState = {
	counter: 0,
}

export default createReducer<CounterState>(initialState, {
	COUNTER_UPDATE: (_state: CounterState, payload: CounterUpdatePayload): CounterState => {
		return {
			...initialState,
			counter: payload,
		}
	},
})
