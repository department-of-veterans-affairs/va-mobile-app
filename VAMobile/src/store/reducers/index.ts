import { combineReducers } from 'redux'

import auth, { AuthState, initialAuthState } from './auth'
import directDeposit, { DirectDepositState, initialDirectDepositState } from './directDeposit'
import tabBar, { TabBarState, initialTabBarState } from './tabBar'

export * from './auth'
export * from './tabBar'
export * from './directDeposit'

export interface StoreState {
  auth: AuthState
  tabBar: TabBarState
  directDeposit: DirectDepositState
}

export const InitialState: StoreState = {
  auth: initialAuthState,
  tabBar: initialTabBarState,
  directDeposit: initialDirectDepositState,
}

const allReducers = combineReducers({
  auth,
  tabBar,
  directDeposit,
})

export default allReducers
