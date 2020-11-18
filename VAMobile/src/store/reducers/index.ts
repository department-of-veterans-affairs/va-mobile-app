import { combineReducers } from 'redux'

import { ReduxAction } from 'store/types'
import appointments, { AppointmentsState, initialAppointmentsState } from './appointments'
import auth, { AuthState, initialAuthState } from './auth'
import directDeposit, { DirectDepositState, initialDirectDepositState } from './directDeposit'
import letters, { LettersState, initialLettersState } from './letters'
import militaryService, { MilitaryServiceState, initialMilitaryServiceState } from './militaryService'
import personalInformation, { PersonalInformationState, initialPersonalInformationState } from './personalInformation'

export * from './auth'
export * from './directDeposit'
export * from './militaryService'
export * from './personalInformation'
export * from './letters'
export * from './appointments'

export interface StoreState {
  auth: AuthState
  directDeposit: DirectDepositState
  militaryService: MilitaryServiceState
  personalInformation: PersonalInformationState
  letters: LettersState
  appointments: AppointmentsState
}

export const InitialState: StoreState = {
  auth: initialAuthState,
  directDeposit: initialDirectDepositState,
  militaryService: initialMilitaryServiceState,
  personalInformation: initialPersonalInformationState,
  letters: initialLettersState,
  appointments: initialAppointmentsState,
}

const allReducers = combineReducers<StoreState, ReduxAction>({
  auth,
  directDeposit,
  militaryService,
  personalInformation,
  letters,
  appointments,
})

export default allReducers
