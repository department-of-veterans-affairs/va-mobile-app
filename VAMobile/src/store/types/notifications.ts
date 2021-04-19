import { ActionDef } from './index'
import { PushPreference } from '../api'

/** Redux payload for NOTIFICATIONS_START_REGISTER_DEVICE */
export type NotificationsStartRegisterDevicePayload = Record<string, unknown>

/** Redux payload for NOTIFICATIONS_END_REGISTER_DEVICE */
export type NotificationsSetDeviceTokenPayload = {
  deviceToken?: string
}

/** Redux payload for NOTIFICATIONS_START_GET_PREFS */
export type NotificationsStartGetPrefsPayload = Record<string, unknown>

/** Redux payload for NOTIFICATIONS_END_GET_PREFS */
export type NotificationsPrefsPayload = {
  preferences?: PushPreference[]
  systemNotificationsOn: boolean
}

/** Redux payload for NOTIFICATIONS_START_SET_PREFS */
export type NotificationsStartSetPrefPayload = Record<string, unknown>

export type NotificationSetPrefPayload = {
  pref?: PushPreference
}
/**
 * Push Notification Actions
 */
export interface NotificationsActions {
  NOTIFICATIONS_START_REGISTER_DEVICE: ActionDef<'NOTIFICATIONS_START_REGISTER_DEVICE', NotificationsStartRegisterDevicePayload>
  NOTIFICATIONS_END_REGISTER_DEVICE: ActionDef<'NOTIFICATIONS_END_REGISTER_DEVICE', NotificationsSetDeviceTokenPayload>
  NOTIFICATIONS_START_GET_PREFS: ActionDef<'NOTIFICATIONS_START_GET_PREFS', NotificationsStartGetPrefsPayload>
  NOTIFICATIONS_END_GET_PREFS: ActionDef<'NOTIFICATIONS_END_GET_PREFS', NotificationsPrefsPayload>
  NOTIFICATIONS_START_SET_PREFS: ActionDef<'NOTIFICATIONS_START_SET_PREFS', NotificationsStartSetPrefPayload>
  NOTIFICATIONS_END_SET_PREFS: ActionDef<'NOTIFICATIONS_END_SET_PREFS', NotificationSetPrefPayload>
}
