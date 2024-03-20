import { RootState } from 'store'
import { initialAccessibilityState } from 'store/slices/accessibilitySlice'
import { initialAnalyticsState } from 'store/slices/analyticsSlice'
import { initialAppointmentsState } from 'store/slices/appointmentsSlice'
import { initialClaimsAndAppealsState } from 'store/slices/claimsAndAppealsSlice'
import { initialDemoState } from 'store/slices/demoSlice'
import { initialErrorsState } from 'store/slices/errorSlice'
import { initialLettersState } from 'store/slices/lettersSlice'
import { initialNotificationsState } from 'store/slices/notificationSlice'
import { initialSecureMessagingState } from 'store/slices/secureMessagingSlice'
import { initialSettingsState } from 'store/slices/settingsSlice'
import { initialSnackBarState } from 'store/slices/snackBarSlice'

import { initialPrescriptionState } from './prescriptionSlice'

export * from './accessibilitySlice'
export * from './analyticsSlice'
export * from './appointmentsSlice'
export * from './claimsAndAppealsSlice'
export * from './errorSlice'
export * from './lettersSlice'
export * from './notificationSlice'
export * from './secureMessagingSlice'
export * from './snackBarSlice'
export * from './prescriptionSlice'
export * from './settingsSlice'

export const InitialState: RootState = {
  letters: initialLettersState,
  appointments: initialAppointmentsState,
  claimsAndAppeals: initialClaimsAndAppealsState,
  errors: initialErrorsState,
  accessibility: initialAccessibilityState,
  notifications: initialNotificationsState,
  secureMessaging: initialSecureMessagingState,
  demo: initialDemoState,
  analytics: initialAnalyticsState,
  snackBar: initialSnackBarState,
  prescriptions: initialPrescriptionState,
  settings: initialSettingsState,
}
