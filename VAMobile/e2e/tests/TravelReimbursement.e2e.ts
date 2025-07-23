import { by, element, expect } from 'detox'

import { loginToDemoMode, openHealth, openTravelReimbursement } from './utils'

export const TravelReimbursementE2eIdConstants = {
  TRAVEL_REIMBURSEMENT_TITLE: 'Travel Reimbursement',
}

beforeAll(async () => {
  await loginToDemoMode()
  await openHealth()
  await openTravelReimbursement()
})

describe('Travel Reimbursement Screen', () => {
  it('should navigate to Travel Reimbursement screen and display title', async () => {
    await expect(element(by.label(TravelReimbursementE2eIdConstants.TRAVEL_REIMBURSEMENT_TITLE))).toExist()
  })
})
