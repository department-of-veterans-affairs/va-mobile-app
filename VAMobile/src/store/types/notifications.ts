import { ActionDef } from './index'

export type NotificationsStartRegisterDevicePayload = Record<string, unknown>

export type NotificationsSetDeviceTokenPayload = {
  deviceToken?: string
}

export type NotificationsStartGetPrefsPayload = Record<string, unknown>

export type NotificationsPrefsPayload = {
  preferences?: { [keyof: string]: boolean }
}

export interface NotificationsActions {
  NOTIFICATIONS_START_REGISTER_DEVICE: ActionDef<'NOTIFICATIONS_START_REGISTER_DEVICE', NotificationsStartRegisterDevicePayload>
  NOTIFICATIONS_END_REGISTER_DEVICE: ActionDef<'NOTIFICATIONS_END_REGISTER_DEVICE', NotificationsSetDeviceTokenPayload>
  NOTIFICATIONS_START_GET_PREFS: ActionDef<'NOTIFICATIONS_START_GET_PREFS', NotificationsStartGetPrefsPayload>
  NOTIFICATIONS_END_GET_PREFS: ActionDef<'NOTIFICATIONS_END_GET_PREFS', NotificationsPrefsPayload>
}
