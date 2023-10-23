import { RootState } from 'store'

import { initialAccessibilityState } from 'store/slices/accessibilitySlice'
import { initialAnalyticsState } from 'store/slices/analyticsSlice'
import { initialAppointmentsState } from 'store/slices/appointmentsSlice'
import { initialAuthState } from 'store/slices/authSlice'
import { initialClaimsAndAppealsState } from 'store/slices/claimsAndAppealsSlice'
import { initialDecisionLettersState } from './decisionLettersSlice'
import { initialDemoState } from 'store/slices/demoSlice'
import { initialDirectDepositState } from 'store/slices/directDepositSlice'
import { initialDisabilityRatingState } from 'store/slices/disabilityRatingSlice'
import { initialErrorsState } from 'store/slices/errorSlice'
import { initialLettersState } from 'store/slices/lettersSlice'
import { initialMilitaryServiceState } from 'store/slices/militaryServiceSlice'
import { initialNotificationsState } from 'store/slices/notificationSlice'
import { initialPaymentsState } from 'store/slices/paymentsSlice'
import { initialPrescriptionState } from './prescriptionSlice'
import { initialSecureMessagingState } from 'store/slices/secureMessagingSlice'
import { initialSettingsState } from 'store/slices/settingsSlice'
import { initialSnackBarState } from 'store/slices/snackBarSlice'
import { initialVaccineState } from 'store/slices/vaccineSlice'

export * from './accessibilitySlice'
export * from './analyticsSlice'
export * from './appointmentsSlice'
export * from './authSlice'
export * from './claimsAndAppealsSlice'
export * from './directDepositSlice'
export * from './disabilityRatingSlice'
export * from './errorSlice'
export * from './lettersSlice'
export * from './militaryServiceSlice'
export * from './notificationSlice'
export * from './secureMessagingSlice'
export * from './snackBarSlice'
export * from './vaccineSlice'
export * from './paymentsSlice'
export * from './prescriptionSlice'
export * from './settingsSlice'

export const InitialState: RootState = {
  auth: initialAuthState,
  directDeposit: initialDirectDepositState,
  militaryService: initialMilitaryServiceState,
  decisionLetters: initialDecisionLettersState,
  letters: initialLettersState,
  appointments: initialAppointmentsState,
  claimsAndAppeals: initialClaimsAndAppealsState,
  errors: initialErrorsState,
  accessibility: initialAccessibilityState,
  notifications: initialNotificationsState,
  secureMessaging: initialSecureMessagingState,
  demo: initialDemoState,
  analytics: initialAnalyticsState,
  disabilityRating: initialDisabilityRatingState,
  vaccine: initialVaccineState,
  snackBar: initialSnackBarState,
  payments: initialPaymentsState,
  prescriptions: initialPrescriptionState,
  settings: initialSettingsState,
}
