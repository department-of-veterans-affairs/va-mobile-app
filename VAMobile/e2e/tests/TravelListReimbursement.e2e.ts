import { by, element, expect } from 'detox'

import {
  CommonE2eIdConstants,
  loginToDemoMode,
  openHealth,
  openTravelReimbursement,
  toggleRemoteConfigFlag,
} from './utils'

export const TravelReimbursementE2eIdConstants = {
  TRAVEL_REIMBURSEMENT_TEST_ID: 'travelListReimbursementTestID',
}

beforeAll(async () => {
  await toggleRemoteConfigFlag(CommonE2eIdConstants.TRAVEL_PAY_STATUS_LIST_FLAG_TEXT)
  await loginToDemoMode()
  await openHealth()
  await openTravelReimbursement()
})

describe('Travel Reimbursement Screen', () => {
  it('should navigate to Travel List Reimbursement screen and display title', async () => {
    await expect(element(by.id(TravelReimbursementE2eIdConstants.TRAVEL_REIMBURSEMENT_TEST_ID))).toExist()
  })
})
