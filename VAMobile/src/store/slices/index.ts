import { RootState } from 'store'
import { initialAccessibilityState } from 'store/slices/accessibilitySlice'
import { initialAnalyticsState } from 'store/slices/analyticsSlice'
import { initialAuthState } from 'store/slices/authSlice'
import { initialDemoState } from 'store/slices/demoSlice'
import { initialErrorsState } from 'store/slices/errorSlice'
import { initialSettingsState } from 'store/slices/settingsSlice'

export * from './accessibilitySlice'
export * from './analyticsSlice'
export * from './authSlice'
export * from './errorSlice'
export * from './settingsSlice'

export const InitialState: RootState = {
  auth: initialAuthState,
  errors: initialErrorsState,
  accessibility: initialAccessibilityState,
  demo: initialDemoState,
  analytics: initialAnalyticsState,
  settings: initialSettingsState,
}
