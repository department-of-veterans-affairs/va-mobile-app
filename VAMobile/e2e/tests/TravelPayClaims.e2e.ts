import { by, element, expect } from 'detox'

import { CommonE2eIdConstants, loginToDemoMode, openHealth, openTravelPayClaims, toggleRemoteConfigFlag } from './utils'

export const TravelPayClaimsE2eIdConstants = {
  TRAVEL_PAY_CLAIMS_TEST_ID: 'travelPayClaimsTestID',

  LIST_HEADER_TEXT: 'All travel claims (31), sorted by most recent',
  DATE_RANGE_PICKER_ID: 'getDateRangeTestID',
  FILTER_AND_SORT_BUTTON_ID: 'openFilterAndSortTestID',
  FILTER_AND_SORT_BUTTON_TEXT: 'Filter and sort',
  CLEAR_FILTERS_BUTTON_ID: 'clearFiltersButton',
  CLEAR_FILTERS_BUTTON_TEXT: 'Clear filters',
}

beforeAll(async () => {
  await toggleRemoteConfigFlag(CommonE2eIdConstants.TRAVEL_PAY_STATUS_LIST_FLAG_TEXT)
  await loginToDemoMode()
  await openHealth()
  await openTravelPayClaims()
})

describe('Travel Pay Claims Screen', () => {
  it('should navigate to the Travel Pay Claims screen and display title', async () => {
    await expect(element(by.id(TravelPayClaimsE2eIdConstants.TRAVEL_PAY_CLAIMS_TEST_ID))).toExist()
  })

  it('should display filter components and list header', async () => {
    // Header
    await expect(element(by.text(TravelPayClaimsE2eIdConstants.LIST_HEADER_TEXT))).toExist()

    // Filter and sort
    await expect(element(by.id(TravelPayClaimsE2eIdConstants.DATE_RANGE_PICKER_ID))).toExist()
    await expect(element(by.id(TravelPayClaimsE2eIdConstants.FILTER_AND_SORT_BUTTON_ID))).toExist()
    await expect(element(by.text(TravelPayClaimsE2eIdConstants.FILTER_AND_SORT_BUTTON_TEXT))).toExist()
    await expect(element(by.id(TravelPayClaimsE2eIdConstants.CLEAR_FILTERS_BUTTON_ID))).toExist()
    await expect(element(by.text(TravelPayClaimsE2eIdConstants.CLEAR_FILTERS_BUTTON_TEXT))).toExist()
  })
})
