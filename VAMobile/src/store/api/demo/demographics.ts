import { DemoStore } from './store'
import { DemographicsPayload, GenderIdentityUpdatePayload, PreferredNameUpdatePayload } from 'api/types/DemographicsData'

export type DemographicsDemoStore = {
  '/v0/user/demographics': DemographicsPayload
}

/**
 * Updates the a user's gender identity in the demo store
 *
 * @param store - The demo store
 * @param payload - Payload for updating a user's gender identity
 */
export const updateGenderIdentity = (store: DemoStore, payload: GenderIdentityUpdatePayload) => {
  store['/v0/user/demographics'].data.attributes.genderIdentity = payload.code
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
