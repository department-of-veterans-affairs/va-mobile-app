import { by, element, expect, waitFor } from 'detox'

import { CommonE2eIdConstants, loginToDemoMode, openHealth, openTravelPayClaims, toggleRemoteConfigFlag } from './utils'

const TravePayClaimsE2eIds = {
  TRAVEL_PAY_CLAIMS_TEST_ID: 'travelPayClaimsTestID',
  MOST_RECENT_CLAIM_1_ID: 'claim_summary_6a5302bb-f6ee-4cf9-89b7-7b2775f056bd',
  MOST_RECENT_CLAIM_11_ID: 'claim_summary_a3e6fb0d-5d30-48d7-9b4b-129b44d46088',

  SHOW_FILTERS_BUTTON_ID: 'travelClaimsFilterModalButtonTestId',
  ALL_RESULTS_TEXT: /All travel claims \(\d+\), sorted by most recent/,
  FILTERED_RESULTS_TEXT: /Filtered travel claims \(\d+\), sorted by most recent/,
  CHECKBOX_ALL: 'checkbox_label_all',
  CHECKBOX_IN_MANUAL_REVIEW_ID: 'checkbox_label_In manual review',

  FILTER_MODAL_CANCEL_BUTTON_ID: 'filterButtonCancelTestID',
  FILTER_MODAL_APPLY_BUTTON_ID: 'filterButtonApplyTestID',
  CLEAR_FILTERS_BUTTON_ID: 'clearFiltersButton',

  DATE_PICKER_ID: 'getDateRangeTestID',
  DATE_PICKER_HEADER_TEXT: 'Select a date range',
  DATE_PICKER_DONE_BUTTON_ID: 'confirmDateRangeTestId',
}

beforeAll(async () => {
  await toggleRemoteConfigFlag(CommonE2eIdConstants.TRAVEL_PAY_STATUS_LIST_FLAG_TEXT)
  await loginToDemoMode()
  await openHealth()
  await openTravelPayClaims()
})

describe('Travel Pay Claims Screen', () => {
  it('navigates to the Travel Pay Claims screen and display title', async () => {
    await expect(element(by.id(TravePayClaimsE2eIds.TRAVEL_PAY_CLAIMS_TEST_ID))).toExist()
  })

  it('shows the list of claims and can change pages', async () => {
    const { MOST_RECENT_CLAIM_1_ID, MOST_RECENT_CLAIM_11_ID, TRAVEL_PAY_CLAIMS_TEST_ID } = TravePayClaimsE2eIds

    // Check first claim
    await expect(element(by.id(MOST_RECENT_CLAIM_1_ID))).toExist()

    // Check current page display at the bottom
    await element(by.id(TRAVEL_PAY_CLAIMS_TEST_ID)).scrollTo('bottom')
    await waitFor(element(by.id('previous-page')))
      .toBeVisible()
      .withTimeout(4000)
    await expect(element(by.id('next-page'))).toExist()
    await expect(element(by.text('1 to 10 of 31'))).toExist()

    // Can't go to previous page because we're on the first
    await element(by.id('previous-page')).tap()
    await expect(element(by.text('1 to 10 of 31'))).toExist()

    // Go to the second page
    await element(by.id('next-page')).tap()
    await waitFor(element(by.id(TRAVEL_PAY_CLAIMS_TEST_ID)))
      .toBeVisible()
      .withTimeout(4000)
    await element(by.id(TRAVEL_PAY_CLAIMS_TEST_ID)).scrollTo('bottom')
    await waitFor(element(by.id('previous-page')))
      .toBeVisible()
      .withTimeout(4000)

    await expect(element(by.text('11 to 20 of 31'))).toExist()
    await expect(element(by.id(MOST_RECENT_CLAIM_1_ID))).not.toExist()
    await expect(element(by.id(MOST_RECENT_CLAIM_11_ID))).toExist()

    // Go back to the first page
    await element(by.id('previous-page')).tap()
    await element(by.id(TRAVEL_PAY_CLAIMS_TEST_ID)).scrollTo('bottom')
    await waitFor(element(by.id('previous-page')))
      .toBeVisible()
      .withTimeout(4000)

    await expect(element(by.text('1 to 10 of 31'))).toExist()
    await expect(element(by.id(MOST_RECENT_CLAIM_1_ID))).toExist()
    await expect(element(by.id(MOST_RECENT_CLAIM_11_ID))).not.toExist()
  })

  it('opens a webview to view claim details on web', async () => {
    const { MOST_RECENT_CLAIM_1_ID, TRAVEL_PAY_CLAIMS_TEST_ID } = TravePayClaimsE2eIds

    await element(by.id(TRAVEL_PAY_CLAIMS_TEST_ID)).scrollTo('top')
    await waitFor(element(by.id(MOST_RECENT_CLAIM_1_ID)))
      .toBeVisible()
      .withTimeout(4000)

    await element(by.id(MOST_RECENT_CLAIM_1_ID)).tap()
    await waitFor(element(by.text('Travel Claim Details')))
      .toExist()
      .withTimeout(4000)

    await element(by.id('webviewBack')).tap()
  })

  it('uses filtering, sorting, and the date picker', async () => {
    const {
      ALL_RESULTS_TEXT,
      FILTERED_RESULTS_TEXT,
      CHECKBOX_IN_MANUAL_REVIEW_ID,
      FILTER_MODAL_CANCEL_BUTTON_ID,
      FILTER_MODAL_APPLY_BUTTON_ID,
      SHOW_FILTERS_BUTTON_ID,
      TRAVEL_PAY_CLAIMS_TEST_ID,
      CLEAR_FILTERS_BUTTON_ID,
      DATE_PICKER_DONE_BUTTON_ID,
      DATE_PICKER_HEADER_TEXT,
      DATE_PICKER_ID,
    } = TravePayClaimsE2eIds

    await element(by.id(TRAVEL_PAY_CLAIMS_TEST_ID)).scrollTo('top')
    await expect(element(by.text(ALL_RESULTS_TEXT))).toExist()

    // Cancel closes the modal without applying anything
    await element(by.id(SHOW_FILTERS_BUTTON_ID)).tap()
    await waitFor(element(by.id(FILTER_MODAL_CANCEL_BUTTON_ID)))
      .toExist()
      .withTimeout(4000)
    await element(by.id(FILTER_MODAL_CANCEL_BUTTON_ID)).tap()
    await expect(element(by.text(ALL_RESULTS_TEXT))).toExist()

    // Apply a filter
    await element(by.id(SHOW_FILTERS_BUTTON_ID)).tap()
    await waitFor(element(by.id(CHECKBOX_IN_MANUAL_REVIEW_ID)))
      .toExist()
      .withTimeout(4000)
    await element(by.id(CHECKBOX_IN_MANUAL_REVIEW_ID)).tap()
    await element(by.id(FILTER_MODAL_APPLY_BUTTON_ID)).tap()
    await waitFor(element(by.text(FILTERED_RESULTS_TEXT)))
      .toExist()
      .withTimeout(4000)

    // Clearing the filters should show "All" again
    await waitFor(element(by.id(CLEAR_FILTERS_BUTTON_ID))).toExist()
    await element(by.id(CLEAR_FILTERS_BUTTON_ID)).tap()
    await expect(element(by.text(ALL_RESULTS_TEXT))).toExist()

    // Use the date range selector
    await element(by.id(DATE_PICKER_ID)).tap()
    await waitFor(element(by.text(DATE_PICKER_HEADER_TEXT)))
      .toExist()
      .withTimeout(4000)
    await element(by.id(DATE_PICKER_DONE_BUTTON_ID)).tap()
  })
})
