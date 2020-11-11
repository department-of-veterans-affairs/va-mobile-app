import { combineReducers } from 'redux'

import { ReduxAction } from 'store/types'
import auth, { AuthState, initialAuthState } from './auth'
import directDeposit, { DirectDepositState, initialDirectDepositState } from './directDeposit'
import letters, { LettersState, initialLettersState } from './letters'
import militaryService, { MilitaryServiceState, initialMilitaryServiceState } from './militaryService'
import personalInformation, { PersonalInformationState, initialPersonalInformationState } from './personalInformation'
import tabBar, { TabBarState, initialTabBarState } from './tabBar'

export * from './auth'
export * from './tabBar'
export * from './directDeposit'
export * from './militaryService'
export * from './personalInformation'
export * from './letters'

export interface StoreState {
  auth: AuthState
  tabBar: TabBarState
  directDeposit: DirectDepositState
  militaryService: MilitaryServiceState
  personalInformation: PersonalInformationState
  letters: LettersState
}

export const InitialState: StoreState = {
  auth: initialAuthState,
  tabBar: initialTabBarState,
  directDeposit: initialDirectDepositState,
  militaryService: initialMilitaryServiceState,
  personalInformation: initialPersonalInformationState,
  letters: initialLettersState,
}

const allReducers = combineReducers<StoreState, ReduxAction>({
  auth,
  tabBar,
  directDeposit,
  militaryService,
  personalInformation,
  letters,
})

export default allReducers
