import { ActionDef } from './index'
import { PrefApiObject } from '../api'

export type NotificationsStartRegisterDevicePayload = Record<string, unknown>

export type NotificationsSetDeviceTokenPayload = {
  deviceToken?: string
}

export type NotificationsStartGetPrefsPayload = Record<string, unknown>

export type NotificationsPrefsPayload = {
  preferences?: { [keyof: string]: boolean }
}

export type NotificationsStartSetPrefPayload = Record<string, unknown>

export interface NotificationsActions {
  NOTIFICATIONS_START_REGISTER_DEVICE: ActionDef<'NOTIFICATIONS_START_REGISTER_DEVICE', NotificationsStartRegisterDevicePayload>
  NOTIFICATIONS_END_REGISTER_DEVICE: ActionDef<'NOTIFICATIONS_END_REGISTER_DEVICE', NotificationsSetDeviceTokenPayload>
  NOTIFICATIONS_START_GET_PREFS: ActionDef<'NOTIFICATIONS_START_GET_PREFS', NotificationsStartGetPrefsPayload>
  NOTIFICATIONS_END_GET_PREFS: ActionDef<'NOTIFICATIONS_END_GET_PREFS', NotificationsPrefsPayload>
  NOTIFICATIONS_START_SET_PREFS: ActionDef<'NOTIFICATIONS_START_SET_PREFS', NotificationsStartSetPrefPayload>
  NOTIFICATIONS_END_SET_PREFS: ActionDef<'NOTIFICATIONS_END_SET_PREFS', PrefApiObject | undefined>
}
