import { combineReducers } from 'redux'

import { ReduxAction } from 'store/types'
import auth, { AuthState, initialAuthState } from './auth'
import directDeposit, { DirectDepositState, initialDirectDepositState } from './directDeposit'
import militaryService, { MilitaryServiceState, initialMilitaryServiceState } from './militaryService'
import tabBar, { TabBarState, initialTabBarState } from './tabBar'

export * from './auth'
export * from './tabBar'
export * from './directDeposit'
export * from './militaryService'

export interface StoreState {
  auth: AuthState
  tabBar: TabBarState
  directDeposit: DirectDepositState
  militaryService: MilitaryServiceState
}

export const InitialState: StoreState = {
  auth: initialAuthState,
  tabBar: initialTabBarState,
  directDeposit: initialDirectDepositState,
  militaryService: initialMilitaryServiceState,
}

const allReducers = combineReducers<StoreState, ReduxAction>({
  auth,
  tabBar,
  directDeposit,
  militaryService,
})

export default allReducers
