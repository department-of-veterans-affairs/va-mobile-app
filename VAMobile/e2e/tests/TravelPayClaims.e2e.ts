import { by, element, expect, waitFor } from 'detox'

import { CommonE2eIdConstants, loginToDemoMode, openHealth, openTravelPayClaims, toggleRemoteConfigFlag } from './utils'

const TravePayClaimsE2eIds = {
  TRAVEL_PAY_CLAIMS_TEST_ID: 'travelPayClaimsTestID',
  MOST_RECENT_CLAIM_1_ID: 'claim_summary_6a5302bb-f6ee-4cf9-89b7-7b2775f056bd',
  MOST_RECENT_CLAIM_11_ID: 'claim_summary_a3e6fb0d-5d30-48d7-9b4b-129b44d46088',

  APPEALED_CLAIM_ID: 'claim_summary_a3e6fb0d-5d30-48d7-9b4b-129b44d46088',
  IN_MANUAL_REVIEW_CLAIM_ID: 'claim_summary_6a5302bb-f6ee-4cf9-89b7-7b2775f056bd',
  CLAIM_SUBMITTED_CLAIM_ID: 'claim_summary_f33ef640-000f-4ecf-82b8-1c50df13d178',

  SHOW_FILTERS_BUTTON_ID: 'travelClaimsFilterModalButtonTestId',

  ALL_RESULTS_TEXT: 'All travel claims (31), sorted by most recent',

  CHECKBOX_APPEALED_ID: 'checkbox_label_Appealed',
  CHECKBOX_IN_MANUAL_REVIEW_ID: 'checkbox_label_In manual review',

  MODAL_CONTAINER_ID: 'travelPayClaimsFilterModalContainer',
  FILTER_MODAL_CANCEL_BUTTON_ID: 'filterButtonCancelTestID',
  FILTER_MODAL_APPLY_BUTTON_ID: 'filterButtonApplyTestID',
  CLEAR_FILTERS_BUTTON_ID: 'clearFiltersButton',
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

  it('filters and sorts the list of claims', async () => {
    const {
      ALL_RESULTS_TEXT,
      APPEALED_CLAIM_ID,
      CLAIM_SUBMITTED_CLAIM_ID,
      CLEAR_FILTERS_BUTTON_ID,
      CHECKBOX_APPEALED_ID,
      CHECKBOX_IN_MANUAL_REVIEW_ID,
      FILTER_MODAL_APPLY_BUTTON_ID,
      FILTER_MODAL_CANCEL_BUTTON_ID,
      IN_MANUAL_REVIEW_CLAIM_ID,
      MODAL_CONTAINER_ID,
      SHOW_FILTERS_BUTTON_ID,
      TRAVEL_PAY_CLAIMS_TEST_ID,
    } = TravePayClaimsE2eIds

    await element(by.id(TRAVEL_PAY_CLAIMS_TEST_ID)).scrollTo('top')
    await expect(element(by.text(ALL_RESULTS_TEXT))).toExist()

    // Check "Appealed", but cancel so it doesn't take effect and so nothing
    // should be filtered out
    await element(by.id(SHOW_FILTERS_BUTTON_ID)).tap()
    await waitFor(element(by.id(MODAL_CONTAINER_ID)))
      .toExist()
      .withTimeout(4000)
    await element(by.id(CHECKBOX_APPEALED_ID)).tap()
    await element(by.id(FILTER_MODAL_CANCEL_BUTTON_ID)).tap()

    await waitFor(element(by.id(IN_MANUAL_REVIEW_CLAIM_ID)))
      .toBeVisible()
      .withTimeout(4000)
    await waitFor(element(by.id(CLAIM_SUBMITTED_CLAIM_ID)))
      .toBeVisible()
      .withTimeout(4000)
    await element(by.id(TRAVEL_PAY_CLAIMS_TEST_ID)).scrollTo('bottom')
    await element(by.id('next-page')).tap()
    await waitFor(element(by.id(APPEALED_CLAIM_ID)))
      .toExist()
      .withTimeout(4000)

    // Filter by Appealed and In manual review
    await element(by.id(SHOW_FILTERS_BUTTON_ID)).tap()
    await waitFor(element(by.id(MODAL_CONTAINER_ID)))
      .toExist()
      .withTimeout(4000)
    await element(by.id(CHECKBOX_APPEALED_ID)).tap()
    await element(by.id(CHECKBOX_IN_MANUAL_REVIEW_ID)).tap()
    await element(by.id(FILTER_MODAL_APPLY_BUTTON_ID)).tap()

    await waitFor(element(by.id(APPEALED_CLAIM_ID)))
      .toExist()
      .withTimeout(4000)
    await expect(element(by.id(IN_MANUAL_REVIEW_CLAIM_ID))).toExist()
    await expect(element(by.id(CLAIM_SUBMITTED_CLAIM_ID))).not.toExist()

    // Press In Manual Review filter again to turn it off
    await element(by.id(SHOW_FILTERS_BUTTON_ID)).tap()
    await waitFor(element(by.id(MODAL_CONTAINER_ID)))
      .toExist()
      .withTimeout(4000)
    await element(by.id(CHECKBOX_IN_MANUAL_REVIEW_ID)).tap()
    await element(by.id(FILTER_MODAL_APPLY_BUTTON_ID)).tap()

    await waitFor(element(by.id(APPEALED_CLAIM_ID)))
      .toExist()
      .withTimeout(4000)
    await expect(element(by.id(IN_MANUAL_REVIEW_CLAIM_ID))).not.toExist()

    // Clear the filters, all the claims should be there again
    await element(by.id(CLEAR_FILTERS_BUTTON_ID)).tap()
    await waitFor(element(by.id(IN_MANUAL_REVIEW_CLAIM_ID)))
      .toExist()
      .withTimeout(4000)
    await expect(element(by.id(CLAIM_SUBMITTED_CLAIM_ID))).toExist()
    await element(by.id(TRAVEL_PAY_CLAIMS_TEST_ID)).scrollTo('bottom')
    await element(by.id('next-page')).tap()
    await waitFor(element(by.id(APPEALED_CLAIM_ID)))
      .toExist()
      .withTimeout(4000)
  })
})
