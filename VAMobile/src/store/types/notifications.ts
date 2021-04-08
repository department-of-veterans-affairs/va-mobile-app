import { ActionDef } from './index'

export type NotificationsStartRegisterDevicePayload = Record<string, unknown>

export type NotificationsSetDeviceTokenPayload = {
  deviceToken?: string
}

export interface NotificationsActions {
  NOTIFICATIONS_START_REGISTER_DEVICE: ActionDef<'NOTIFICATIONS_START_REGISTER_DEVICE', NotificationsStartRegisterDevicePayload>
  NOTIFICATIONS_END_REGISTER_DEVICE: ActionDef<'NOTIFICATIONS_END_REGISTER_DEVICE', NotificationsSetDeviceTokenPayload>
}
