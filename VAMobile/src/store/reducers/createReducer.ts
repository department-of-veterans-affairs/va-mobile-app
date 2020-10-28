import { ReduxAction, AllActionDefs } from 'store/types'

type MappedReducer<S, T extends { [key: string]: any }> = {
	[P in keyof T]?: (state: S, payload: T[P]["payload"]) => S
}

export const createReducer = <T>(initialState: T, reducerMap: MappedReducer<T, AllActionDefs>) => {
	// build a map first
	return (state = initialState, action: ReduxAction): T => {

		const reducer = reducerMap[action.type]
		if (!reducer) {
			return state
		}
		//@ts-ignore
		return reducer(state, action.payload)
	}
}

export default createReducer
