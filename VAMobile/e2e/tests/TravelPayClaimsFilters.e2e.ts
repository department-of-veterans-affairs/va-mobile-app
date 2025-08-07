import { by, element, expect } from 'detox'

import { CommonE2eIdConstants, loginToDemoMode, openHealth, openTravelPayClaims, toggleRemoteConfigFlag } from './utils'

const TravelPayClaimsFiltersE2eIdConstants = {
  DATE_RANGE_PICKER_ID: 'getDateRangeTestID',
  FILTER_AND_SORT_BUTTON_ID: 'openFilterAndSortTestID',
  CLEAR_FILTERS_BUTTON_ID: 'clearFiltersButton',
  TRAVEL_CLAIMS_LIST_TITLE_TEXT: 'All travel claims (15), sorted by most recent',
  FILTER_AND_SORT_BUTTON_TEXT: 'Filter and sort',
  CLEAR_FILTERS_BUTTON_TEXT: 'Clear Filters',
}

describe('TravelPayClaimsFilters', () => {
  beforeAll(async () => {
    await toggleRemoteConfigFlag(CommonE2eIdConstants.TRAVEL_PAY_STATUS_LIST_FLAG_TEXT)
    await loginToDemoMode()
    await openHealth()
    await openTravelPayClaims()
  })

  it('should display all filter components', async () => {
    await expect(element(by.id(TravelPayClaimsFiltersE2eIdConstants.DATE_RANGE_PICKER_ID))).toExist()
    await expect(element(by.id(TravelPayClaimsFiltersE2eIdConstants.FILTER_AND_SORT_BUTTON_ID))).toExist()
    await expect(element(by.id(TravelPayClaimsFiltersE2eIdConstants.CLEAR_FILTERS_BUTTON_ID))).toExist()
  })

  it('should display correct text content', async () => {
    await expect(element(by.text(TravelPayClaimsFiltersE2eIdConstants.TRAVEL_CLAIMS_LIST_TITLE_TEXT))).toExist()
    await expect(element(by.text(TravelPayClaimsFiltersE2eIdConstants.FILTER_AND_SORT_BUTTON_TEXT))).toExist()
    await expect(element(by.text(TravelPayClaimsFiltersE2eIdConstants.CLEAR_FILTERS_BUTTON_TEXT))).toExist()
  })
})
