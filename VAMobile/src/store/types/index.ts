import { ThunkAction } from 'redux-thunk'

import { AccessibilityActions } from './accessibility'
import { AnalyticsActions } from './analytics'
import { AppointmentsActions } from './appointments'
import { AuthActions } from './auth'
import { AuthorizedServicesActions } from './authorizedServices'
import { ClaimsAndAppealsActions } from './claimsAndAppeals'
import { DemoActions } from './demo'
import { DirectDepositActions } from './directDeposit'
import { DisabilityRatingActions } from './disabilityRating'
import { ErrorsActions } from './errors'
import { ImmunizationActions } from './immunization'
import { LettersActions } from './letters'
import { MilitaryServiceActions } from './militaryService'
import { PersonalInformationActions } from './personalInformation'
import { SecureMessagingActions } from './secureMessaging'
import { StoreState } from 'store'

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
export * from './secureMessaging'
export * from './demo'
export * from './analytics'
export * from './disabilityRating'
export * from './immunization'

type ActObjs<T extends keyof AllActionDefs> = AllActionDefs[T]
type ActObjsPayload<T extends keyof AllActionDefs> = AllActionDefs[T]['payload']

export interface ActionDef<T extends string, P extends ActObjsPayload<AllActionTypes>> {
  type: T
  payload: P
}

export type EmptyPayload = unknown

export type StoreStateFn = () => StoreState

export type AllActionDefs = AuthActions &
  DirectDepositActions &
  MilitaryServiceActions &
  PersonalInformationActions &
  LettersActions &
  AppointmentsActions &
  ClaimsAndAppealsActions &
  AuthorizedServicesActions &
  ErrorsActions &
  AccessibilityActions &
  SecureMessagingActions &
  DemoActions &
  AnalyticsActions &
  DisabilityRatingActions &
  ImmunizationActions

type AllActionTypes = keyof AllActionDefs

export type ReduxAction = ActObjs<AllActionTypes>

export type AsyncReduxAction = ThunkAction<Promise<void>, StoreState, undefined, ReduxAction>
