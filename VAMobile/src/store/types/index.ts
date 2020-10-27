import { ThunkAction } from 'redux-thunk'

import { AuthActions } from './auth'
import { DirectDepositActions } from './directDeposit'
import { MilitaryServiceActions } from './militaryService'
import { PersonalInformationActions } from './personalInformation'
import { StoreState } from 'store'
import { TabBarActions } from './tabBar'

export * from './auth'
export * from './tabBar'
export * from './directDeposit'
export * from './militaryService'
export * from './personalInformation'

type ActObjs<T extends keyof AllActionDefs> = AllActionDefs[T]
type ActObjsPayload<T extends keyof AllActionDefs> = AllActionDefs[T]['payload']

export interface ActionDef<T extends string, P extends ActObjsPayload<AllActionTypes>> {
  type: T
  payload: P
}

export type EmptyPayload = unknown

export type StoreStateFn = () => StoreState

export type AllActionDefs = AuthActions & TabBarActions & DirectDepositActions & MilitaryServiceActions & PersonalInformationActions

type AllActionTypes = keyof AllActionDefs

export type ReduxAction = ActObjs<AllActionTypes>

export type AsyncReduxAction = ThunkAction<Promise<void>, StoreState, undefined, ReduxAction>
