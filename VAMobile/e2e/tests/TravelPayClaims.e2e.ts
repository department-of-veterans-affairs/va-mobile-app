import { by, element, expect } from 'detox'

import { CommonE2eIdConstants, loginToDemoMode, openHealth, openTravelPayClaims, toggleRemoteConfigFlag } from './utils'

export const TravelPayClaimsE2eIdConstants = {
  TRAVEL_PAY_CLAIMS_TEST_ID: 'travelPayClaimsTestID',
}

beforeAll(async () => {
  await toggleRemoteConfigFlag(CommonE2eIdConstants.TRAVEL_PAY_STATUS_LIST_FLAG_TEXT)
  await loginToDemoMode()
  await openHealth()
  await openTravelPayClaims()
})

describe('Travel Pay Claims Screen', () => {
  it('should navigate to Travel Pay Claims screen and display title', async () => {
    await expect(element(by.id(TravelPayClaimsE2eIdConstants.TRAVEL_PAY_CLAIMS_TEST_ID))).toExist()
  })
})
