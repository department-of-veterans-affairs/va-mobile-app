import { combineReducers } from 'redux'

import { ReduxAction } from 'store/types'
import accessibility, { AccessibilityState, initialAccessibilityState } from './accessibility'
import appointments, { AppointmentsState, initialAppointmentsState } from './appointments'
import auth, { AuthState, initialAuthState } from './auth'
import authorizedServices, { AuthorizedServicesState, initialAuthorizedServicesState } from './authorizedServices'
import claimsAndAppeals, { ClaimsAndAppealsState, initialClaimsAndAppealsState } from './claimsAndAppeals'
import directDeposit, { DirectDepositState, initialDirectDepositState } from './directDeposit'
import errors, { ErrorsState, initialErrorsState } from './errors'
import letters, { LettersState, initialLettersState } from './letters'
import militaryService, { MilitaryServiceState, initialMilitaryServiceState } from './militaryService'
import personalInformation, { PersonalInformationState, initialPersonalInformationState } from './personalInformation'

export * from './auth'
export * from './directDeposit'
export * from './militaryService'
export * from './personalInformation'
export * from './letters'
export * from './appointments'
export * from './claimsAndAppeals'
export * from './authorizedServices'
export * from './errors'
export * from './accessibility'

export interface StoreState {
  auth: AuthState
  directDeposit: DirectDepositState
  militaryService: MilitaryServiceState
  personalInformation: PersonalInformationState
  letters: LettersState
  appointments: AppointmentsState
  claimsAndAppeals: ClaimsAndAppealsState
  authorizedServices: AuthorizedServicesState
  errors: ErrorsState
  accessibility: AccessibilityState
}

export const InitialState: StoreState = {
  auth: initialAuthState,
  directDeposit: initialDirectDepositState,
  militaryService: initialMilitaryServiceState,
  personalInformation: initialPersonalInformationState,
  letters: initialLettersState,
  appointments: initialAppointmentsState,
  claimsAndAppeals: initialClaimsAndAppealsState,
  authorizedServices: initialAuthorizedServicesState,
  errors: initialErrorsState,
  accessibility: initialAccessibilityState,
}

const allReducers = combineReducers<StoreState, ReduxAction>({
  auth,
  directDeposit,
  militaryService,
  personalInformation,
  letters,
  appointments,
  claimsAndAppeals,
  authorizedServices,
  errors,
  accessibility,
})

export default allReducers
