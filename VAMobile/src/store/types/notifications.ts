import { ActionDef } from './index'

export type NotificationsUpdatePayload = {
  deviceToken?: string
}

export interface NotificationsActions {
  NOTIFICATION_STATE_UPDATE: ActionDef<'NOTIFICATION_STATE_UPDATE', NotificationsUpdatePayload>
}
