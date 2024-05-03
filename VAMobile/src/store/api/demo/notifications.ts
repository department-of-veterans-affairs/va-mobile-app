import { GetPushPrefsResponse } from '../types'

/**
 * Type denoting the demo data store
 */
export type NotificationDemoStore = {
  '/v0/push/prefs': GetPushPrefsResponse
}

/**
 * Type to define the mock returns to keep type safety
 */
export type NotificationDemoApiReturnTypes = GetPushPrefsResponse
