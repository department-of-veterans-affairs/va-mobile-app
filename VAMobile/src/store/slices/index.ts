import { RootState } from 'store'
import { initialAccessibilityState } from 'store/slices/accessibilitySlice'
import { initialAnalyticsState } from 'store/slices/analyticsSlice'
import { initialAppointmentsState } from 'store/slices/appointmentsSlice'
import { initialAuthState } from 'store/slices/authSlice'
import { initialClaimsAndAppealsState } from 'store/slices/claimsAndAppealsSlice'
import { initialDemoState } from 'store/slices/demoSlice'
import { initialErrorsState } from 'store/slices/errorSlice'
import { initialLettersState } from 'store/slices/lettersSlice'
import { initialNotificationsState } from 'store/slices/notificationSlice'
import { initialSettingsState } from 'store/slices/settingsSlice'
import { initialSnackBarState } from 'store/slices/snackBarSlice'

export * from './accessibilitySlice'
export * from './analyticsSlice'
export * from './appointmentsSlice'
export * from './authSlice'
export * from './claimsAndAppealsSlice'
export * from './errorSlice'
export * from './lettersSlice'
export * from './notificationSlice'
export * from './snackBarSlice'
export * from './settingsSlice'

export const InitialState: RootState = {
  auth: initialAuthState,
  letters: initialLettersState,
  appointments: initialAppointmentsState,
  claimsAndAppeals: initialClaimsAndAppealsState,
  errors: initialErrorsState,
  accessibility: initialAccessibilityState,
  notifications: initialNotificationsState,
  demo: initialDemoState,
  analytics: initialAnalyticsState,
  snackBar: initialSnackBarState,
  settings: initialSettingsState,
}
