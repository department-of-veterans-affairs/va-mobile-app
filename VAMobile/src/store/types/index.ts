import { Action } from 'redux'
import { ThunkAction } from 'redux-thunk'

import { AuthActions } from './auth'
import { CounterActions } from './counter'
import { StoreState } from 'store'

export * from './auth'
export * from './counter'

export type ActionBase<T extends string, P> = {
	type: T
	payload: P
}

export type AsyncReduxAction = ThunkAction<Promise<void>, StoreState, undefined, Action<unknown>>
export type StoreStateFn = () => StoreState

export type AType<TObj extends { type: string }> = TObj['type']

export type AllActions = AuthActions | CounterActions
