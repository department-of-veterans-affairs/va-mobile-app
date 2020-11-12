import { combineReducers } from 'redux'

import { ReduxAction } from 'store/types'
import auth, { AuthState, initialAuthState } from './auth'
import directDeposit, { DirectDepositState, initialDirectDepositState } from './directDeposit'
import militaryService, { MilitaryServiceState, initialMilitaryServiceState } from './militaryService'
import personalInformation, { PersonalInformationState, initialPersonalInformationState } from './personalInformation'

export * from './auth'
export * from './directDeposit'
export * from './militaryService'
export * from './personalInformation'

export interface StoreState {
  auth: AuthState
  directDeposit: DirectDepositState
  militaryService: MilitaryServiceState
  personalInformation: PersonalInformationState
}

export const InitialState: StoreState = {
  auth: initialAuthState,
  directDeposit: initialDirectDepositState,
  militaryService: initialMilitaryServiceState,
  personalInformation: initialPersonalInformationState,
}

const allReducers = combineReducers<StoreState, ReduxAction>({
  auth,
  directDeposit,
  militaryService,
  personalInformation,
})

export default allReducers
