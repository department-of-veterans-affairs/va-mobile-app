import { RootState } from 'store'
import { initialAccessibilityState } from 'store/slices/accessibilitySlice'
import { initialAnalyticsState } from 'store/slices/analyticsSlice'
import { initialAuthState } from 'store/slices/authSlice'
import { initialDemoState } from 'store/slices/demoSlice'
import { initialErrorsState } from 'store/slices/errorSlice'
import { initialNotificationsState } from 'store/slices/notificationSlice'
import { initialSettingsState } from 'store/slices/settingsSlice'
import { initialSnackBarState } from 'store/slices/snackBarSlice'

export * from './accessibilitySlice'
export * from './analyticsSlice'
export * from './authSlice'
export * from './errorSlice'
export * from './notificationSlice'
export * from './snackBarSlice'
export * from './settingsSlice'

export const InitialState: RootState = {
  auth: initialAuthState,
  errors: initialErrorsState,
  accessibility: initialAccessibilityState,
  notifications: initialNotificationsState,
  demo: initialDemoState,
  analytics: initialAnalyticsState,
  snackBar: initialSnackBarState,
  settings: initialSettingsState,
}
