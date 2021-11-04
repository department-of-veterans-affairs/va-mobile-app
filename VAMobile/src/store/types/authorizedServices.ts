import { ActionDef } from './index'
import { VAServices } from '../api'

/**
 * Redux payload for AUTHORIZED_SERVICES_UPDATE action
 */
export type AuthorizedServicesUpdatePayload = {
  authorizedServices?: Array<VAServices>
  error?: Error
}

/**
 * Redux payload for AUTHORIZED_SERVICES_CLEAR action
 */
export type AuthorizedServicesClearPayload = Record<string, unknown>

export interface AuthorizedServicesActions {
  /** Redux action to update authorizedServices to determine if a user can use a service */
  AUTHORIZED_SERVICES_UPDATE: ActionDef<'AUTHORIZED_SERVICES_UPDATE', AuthorizedServicesUpdatePayload>
  /** Redux action to clear authorizedServices after logout */
  AUTHORIZED_SERVICES_CLEAR: ActionDef<'AUTHORIZED_SERVICES_CLEAR', AuthorizedServicesUpdatePayload>
}
