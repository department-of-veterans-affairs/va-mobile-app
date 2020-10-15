import { Action } from 'redux'
import { ThunkAction } from 'redux-thunk'

import { AuthActions } from './auth'
import { DirectDepositActions } from './directDeposit'
import { StoreState } from 'store'
import { TabBarActions } from './tabBar'

export * from './auth'
export * from './tabBar'
export * from './directDeposit'

export type ActionBase<T extends string, P> = {
	type: T
	payload: P
}

export type AsyncReduxAction = ThunkAction<Promise<void>, StoreState, undefined, Action<unknown>>
export type StoreStateFn = () => StoreState

export type AType<TObj extends { type: string }> = TObj['type']

export type AllActions = AuthActions | TabBarActions | DirectDepositActions
