import { by, element, expect, waitFor } from 'detox'

import { EN_DASH } from 'utils/formattingUtils'

import {
  CommonE2eIdConstants,
  loginToDemoMode,
  openBenefits,
  openClaims,
  openHealth,
  openPayments,
  openTravelPayClaims,
  toggleRemoteConfigFlag,
} from './utils'

const TravePayClaimsE2eIds = {
  TRAVEL_PAY_CLAIMS_TEST_ID: 'travelPayClaimsTestID',
  TRAVEL_PAY_CLAIM_DETAILS_SCREEN_ID: 'TravelPayClaimDetailsScreen',
  TRAVEL_PAY_CLAIM_DETAILS_HEADER_TITLE_TEST_ID: 'travelPayClaimHeaderTitle',
  BACK_BUTTON: 'travelPayClaimsBackButton',
  MOST_RECENT_CLAIM_1_ID: 'claim_summary_6a5302bb-f6ee-4cf9-89b7-7b2775f056bd',
  MOST_RECENT_CLAIM_11_ID: 'claim_summary_a54d75aa-82c2-4896-964b-59cbd8f2e7ea',

  SHOW_FILTERS_BUTTON_ID: 'travelClaimsFilterModalButtonTestId',
  ALL_RESULTS_TEXT: /All travel claims \(\d+\), sorted by most recent/,
  FILTERED_RESULTS_TEXT: /Filtered travel claims \(\d+\), sorted by most recent/,
  CHECKBOX_ALL: 'checkbox_label_all',
  CHECKBOX_IN_MANUAL_REVIEW_ID: 'checkbox_label_In manual review',

  FILTER_MODAL_CANCEL_BUTTON_ID: 'filterButtonCancelTestID',
  FILTER_MODAL_APPLY_BUTTON_ID: 'filterButtonApplyTestID',

  DATE_PICKER_ID: 'getDateRangeTestID',
  DATE_PICKER_HEADER_TEXT: 'Select a date range',
  DATE_PICKER_DONE_BUTTON_ID: 'confirmDateRangeTestId',
}

beforeAll(async () => {
  await toggleRemoteConfigFlag(CommonE2eIdConstants.TRAVEL_PAY_CONFIG_FLAG_TEXT)
  await loginToDemoMode()
})

describe('Travel Pay Claims Screen', () => {
  it('navigates from the different entry points', async () => {
    // Visit through Benefits tab
    await openBenefits()
    await openClaims()
    await openTravelPayClaims({ useNativeLink: false })
    await waitFor(element(by.id(TravePayClaimsE2eIds.BACK_BUTTON)))
      .toExist()
      .withTimeout(4000)
    await element(by.id(TravePayClaimsE2eIds.BACK_BUTTON)).tap()

    // Visit through Payments tab
    await openPayments()
    await openTravelPayClaims({ useNativeLink: true })
    await waitFor(element(by.id(TravePayClaimsE2eIds.BACK_BUTTON)))
      .toExist()
      .withTimeout(4000)
    await element(by.id(TravePayClaimsE2eIds.BACK_BUTTON)).tap()

    // Visit through Health tab
    await openHealth()
    await openTravelPayClaims({ useNativeLink: true })
    await waitFor(element(by.id(TravePayClaimsE2eIds.BACK_BUTTON)))
      .toExist()
      .withTimeout(4000)
  })

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
    await expect(element(by.text('1 to 10 of 32'))).toExist()

    // Can't go to previous page because we're on the first
    await element(by.id('previous-page')).tap()
    await expect(element(by.text('1 to 10 of 32'))).toExist()

    // Go to the second page
    await element(by.id('next-page')).tap()
    await waitFor(element(by.id(TRAVEL_PAY_CLAIMS_TEST_ID)))
      .toBeVisible()
      .withTimeout(4000)
    await element(by.id(TRAVEL_PAY_CLAIMS_TEST_ID)).scrollTo('bottom')
    await waitFor(element(by.id('previous-page')))
      .toBeVisible()
      .withTimeout(4000)

    await expect(element(by.text('11 to 20 of 32'))).toExist()
    await expect(element(by.id(MOST_RECENT_CLAIM_1_ID))).not.toExist()
    await expect(element(by.id(MOST_RECENT_CLAIM_11_ID))).toExist()

    // Go back to the first page
    await element(by.id('previous-page')).tap()
    await element(by.id(TRAVEL_PAY_CLAIMS_TEST_ID)).scrollTo('bottom')
    await waitFor(element(by.id('previous-page')))
      .toBeVisible()
      .withTimeout(4000)

    await expect(element(by.text('1 to 10 of 32'))).toExist()
    await expect(element(by.id(MOST_RECENT_CLAIM_1_ID))).toExist()
    await expect(element(by.id(MOST_RECENT_CLAIM_11_ID))).not.toExist()
  })

  it('opens claim details screen', async () => {
    const {
      TRAVEL_PAY_CLAIM_DETAILS_SCREEN_ID,
      TRAVEL_PAY_CLAIM_DETAILS_HEADER_TITLE_TEST_ID,
      MOST_RECENT_CLAIM_1_ID,
      MOST_RECENT_CLAIM_11_ID,
      TRAVEL_PAY_CLAIMS_TEST_ID,
    } = TravePayClaimsE2eIds
    await expect(element(by.text('1 to 10 of 32'))).toExist()
    await expect(element(by.id(MOST_RECENT_CLAIM_1_ID))).toExist()
    await expect(element(by.id(MOST_RECENT_CLAIM_11_ID))).not.toExist()

    await element(by.id(TRAVEL_PAY_CLAIMS_TEST_ID)).scrollTo('top')
    await waitFor(element(by.id(MOST_RECENT_CLAIM_1_ID)))
      .toBeVisible()
      .withTimeout(4000)

    await element(by.id(MOST_RECENT_CLAIM_1_ID)).tap()

    // Wait for the native claim details screen to appear
    await waitFor(element(by.id(TRAVEL_PAY_CLAIM_DETAILS_SCREEN_ID)))
      .toExist()
      .withTimeout(4000) // Increased timeout for CI/CD

    // Verify the screen title (confirms we're on the right screen)
    await waitFor(element(by.text('Details')))
      .toExist()
      .withTimeout(6000) // Increased timeout for CI/CD

    // Verify we can see claim data
    await waitFor(element(by.id(TRAVEL_PAY_CLAIM_DETAILS_HEADER_TITLE_TEST_ID)))
      .toExist()
      .withTimeout(6000) // Increased timeout for CI/CD

    // Navigate back using the back button (use atIndex(0) to select the first "Travel claims" element)
    await element(by.text('Travel claims')).atIndex(0).tap()

    // Verify we're back on the claims list screen
    await waitFor(element(by.id(TRAVEL_PAY_CLAIMS_TEST_ID)))
      .toExist()
      .withTimeout(4000)
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

    // Change the date selection and verify label is correct
    await element(by.id(DATE_PICKER_ID)).tap()
    await waitFor(element(by.text(DATE_PICKER_HEADER_TEXT)))
      .toExist()
      .withTimeout(4000)
    const currentYear = new Date().getFullYear()
    await element(by.text(`All of ${currentYear}`)).tap()
    await element(by.id(DATE_PICKER_DONE_BUTTON_ID)).tap()

    // Wait for modal to dismiss to make sure we're testing the correct text
    await waitFor(element(by.id(DATE_PICKER_HEADER_TEXT)))
      .not.toExist()
      .withTimeout(4000)

    await waitFor(element(by.text(`All of ${currentYear}`)))
      .toExist()
      .withTimeout(4000)

    // Changing the date picker resets the filter, so we should see all text again
    await expect(element(by.text(ALL_RESULTS_TEXT))).toExist()
  })

  it('navigates to the appointments page from the travel claims No Claims link', async () => {
    const { TRAVEL_PAY_CLAIMS_TEST_ID, DATE_PICKER_ID, DATE_PICKER_HEADER_TEXT, DATE_PICKER_DONE_BUTTON_ID } =
      TravePayClaimsE2eIds

    await element(by.id(TRAVEL_PAY_CLAIMS_TEST_ID)).scrollTo('top')

    await element(by.id(DATE_PICKER_ID)).tap()
    await waitFor(element(by.text(DATE_PICKER_HEADER_TEXT)))
      .toExist()
      .withTimeout(4000)

    // Select the date range that yields no results: 8 to 5 months ago
    const now = new Date()
    const eightMonthsAgo = new Date(now)
    eightMonthsAgo.setMonth(new Date().getMonth() - 8)
    const sixMonthsAgo = new Date(now)
    sixMonthsAgo.setMonth(new Date().getMonth() - 6)

    const monthStart = eightMonthsAgo.toLocaleString('en-US', { month: 'short' })
    const yearStart = eightMonthsAgo.getFullYear()
    const monthEnd = sixMonthsAgo.toLocaleString('en-US', { month: 'short' })
    const yearEnd = sixMonthsAgo.getFullYear()

    const dateRangeText = `${monthStart} ${yearStart} ${EN_DASH} ${monthEnd} ${yearEnd}`
    await waitFor(element(by.label(dateRangeText)))
      .toBeVisible()
      .withTimeout(4000)
    await element(by.label(dateRangeText)).tap()
    await element(by.id(DATE_PICKER_DONE_BUTTON_ID)).tap()

    // Wait for modal to dismiss to make sure we're testing the correct text
    await waitFor(element(by.id(DATE_PICKER_HEADER_TEXT)))
      .not.toExist()
      .withTimeout(4000)

    // Should be on No claims state of the screen with the go to appointments
    await expect(element(by.text(`You don't have any travel claims`))).toExist()
    await expect(element(by.id('goToPastAppointmentsLinkID'))).toExist()

    // Tapping link should take you to the past appointments screen
    await element(by.id('goToPastAppointmentsLinkID')).tap()
    // Indicates we're on the Past Appointments page)
    await waitFor(element(by.text('Select a past date range')))
      .toExist()
      .withTimeout(6000)
  })
})
