import {AllActions} from 'store/types'

type ReducerFn<T> = (state: T, payload: any) => T



export const createReducer = <T>(initialState: T, reducerMap: { [key in AllActions]?: ReducerFn<T> | undefined }) => {
	// build a map first
	return (state = initialState, action: { type: AllActions; payload: any }): T => {
		const reducer = reducerMap[action.type]
		if (!reducer) {
			return state
		}
		return reducer(state, action.payload)
	}
}

export default createReducer
