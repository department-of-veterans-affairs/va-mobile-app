import { DemographicsPayload, PreferredNameUpdatePayload } from 'api/types/DemographicsData'

import { DemoStore } from './store'

export type DemographicsDemoStore = {
  '/v0/user/demographics': DemographicsPayload
}

/**
 * Updates the a user's preferred name in the demo store
 *
 * @param store - The demo store
 * @param payload - Payload for updating a user's preferred name
 */
export const updatePreferredName = (store: DemoStore, payload: PreferredNameUpdatePayload) => {
  store['/v0/user/demographics'].data.attributes.preferredName = payload.text
}

export type DemographicsDemoApiReturnTypes = void
