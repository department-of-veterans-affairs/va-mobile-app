import { RootState } from 'store'
import accessabilityReducer, { initialAccessibilityState } from 'store/slices/accessibilitySlice'
import analyticsReducer, { initialAnalyticsState } from 'store/slices/analyticsSlice'
import appointmentsReducer, { initialAppointmentsState } from 'store/slices/appointmentsSlice'
import authReducer, { initialAuthState } from 'store/slices/authSlice'
import authorizedServicesReducer, { initialAuthorizedServicesState } from 'store/slices/authorizedServicesSlice'
import claimsAndAppealsReducer, { initialClaimsAndAppealsState } from 'store/slices/claimsAndAppealsSlice'
import demoReducer, { initialDemoState } from 'store/slices/demoSlice'
import directDepositReducer, { initialDirectDepositState } from 'store/slices/directDepositSlice'
import disabilityRatingReducer, { initialDisabilityRatingState } from 'store/slices/disabilityRatingSlice'
import errorReducer, { initialErrorsState } from 'store/slices/errorSlice'
import lettersReducer, { initialLettersState } from 'store/slices/lettersSlice'
import militaryServiceReducer, { initialMilitaryServiceState } from 'store/slices/militaryServiceSlice'
import notificationReducer, { initialNotificationsState } from 'store/slices/notificationSlice'
import patientReducer, { initialPatientState } from 'store/slices/patientSlice'
import personalInformationReducer, { initialPersonalInformationState } from 'store/slices/personalInformationSlice'
import secureMessagingReducer, { initialSecureMessagingState } from 'store/slices/secureMessagingSlice'
import snackbarReducer, { initialSnackBarState } from 'store/slices/snackBarSlice'
import vaccineReducer, { initialVaccineState } from 'store/slices/vaccineSlice'

export * from './accessibilitySlice'
export * from './analyticsSlice'
export * from './appointmentsSlice'
export * from './authSlice'
export * from './authorizedServicesSlice'
export * from './claimsAndAppealsSlice'
export * from './directDepositSlice'
export * from './disabilityRatingSlice'
export * from './errorSlice'
export * from './lettersSlice'
export * from './militaryServiceSlice'
export * from './notificationSlice'
export * from './patientSlice'
export * from './personalInformationSlice'
export * from './secureMessagingSlice'
export * from './snackBarSlice'
export * from './vaccineSlice'

export const InitialState: RootState = {
  auth: initialAuthState,
  directDeposit: initialDirectDepositState,
  militaryService: initialMilitaryServiceState,
  personalInformation: initialPersonalInformationState,
  letters: initialLettersState,
  appointments: initialAppointmentsState,
  claimsAndAppeals: initialClaimsAndAppealsState,
  authorizedServices: initialAuthorizedServicesState,
  error: initialErrorsState,
  accessibility: initialAccessibilityState,
  notifications: initialNotificationsState,
  secureMessaging: initialSecureMessagingState,
  demo: initialDemoState,
  analytics: initialAnalyticsState,
  disabilityRating: initialDisabilityRatingState,
  vaccine: initialVaccineState,
  patient: initialPatientState,
  snackBar: initialSnackBarState,
}

export const allReducers = {
  auth: authReducer,
  accessibility: accessabilityReducer,
  demo: demoReducer,
  personalInformation: personalInformationReducer,
  authorizedServices: authorizedServicesReducer,
  error: errorReducer,
  analytics: analyticsReducer,
  appointments: appointmentsReducer,
  claimsAndAppeals: claimsAndAppealsReducer,
  directDeposit: directDepositReducer,
  disabilityRating: disabilityRatingReducer,
  letters: lettersReducer,
  militaryService: militaryServiceReducer,
  notifications: notificationReducer,
  patient: patientReducer,
  secureMessaging: secureMessagingReducer,
  snackBar: snackbarReducer,
  vaccine: vaccineReducer,
}
