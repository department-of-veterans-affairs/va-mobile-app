import { ActionDef } from './index'
import { VAServices } from '../api'

/**
 * Redux payload for AUTHORIZED_SERVICES_UPDATE action
 */
export type AuthorizedServicesUpdatePayload = {
  authorizedServices?: Array<VAServices>
  error?: Error
}

export interface AuthorizedServicesActions {
  /** Redux action to update authorizedServices to determine if a user can use a service */
  AUTHORIZED_SERVICES_UPDATE: ActionDef<'AUTHORIZED_SERVICES_UPDATE', AuthorizedServicesUpdatePayload>
}
