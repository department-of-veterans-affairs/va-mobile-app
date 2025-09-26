import { by, element, expect, waitFor } from 'detox'

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
  TRAVEL_PAY_CLAIM_1_ID: 'claim_summary_f33ef640-000f-4ecf-82b8-1c50df13d178',
  TRAVEL_PAY_CLAIM_11_ID: 'claim_summary_4b99039f-208f-4c07-90b8-498f8466233e',
}

beforeAll(async () => {
  await toggleRemoteConfigFlag(CommonE2eIdConstants.TRAVEL_PAY_STATUS_LIST_FLAG_TEXT)
  await loginToDemoMode()
})

describe('Travel Pay Claims Screen', () => {
  it('navigates from the different entry points', async () => {
    // Visit through Benefits tab
    await openBenefits()
    await openClaims()
    await openTravelPayClaims()

    // Visit through Payments tab
    await openPayments()
    await openTravelPayClaims()

    // Visit through Health tab
    await openHealth()
    await openTravelPayClaims()
  })

  it('navigates to the Travel Pay Claims screen and display title', async () => {
    await expect(element(by.id(TravePayClaimsE2eIds.TRAVEL_PAY_CLAIMS_TEST_ID))).toExist()
  })

  it('shows the list of claims and can change pages', async () => {
    const { TRAVEL_PAY_CLAIM_1_ID, TRAVEL_PAY_CLAIM_11_ID, TRAVEL_PAY_CLAIMS_TEST_ID } = TravePayClaimsE2eIds

    // Check first claim
    await expect(element(by.id(TRAVEL_PAY_CLAIM_1_ID))).toExist()

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
    await expect(element(by.id(TRAVEL_PAY_CLAIM_1_ID))).not.toExist()
    await expect(element(by.id(TRAVEL_PAY_CLAIM_11_ID))).toExist()

    // Go back to the first page
    await element(by.id('previous-page')).tap()
    await element(by.id(TRAVEL_PAY_CLAIMS_TEST_ID)).scrollTo('bottom')
    await waitFor(element(by.id('previous-page')))
      .toBeVisible()
      .withTimeout(4000)

    await expect(element(by.text('1 to 10 of 31'))).toExist()
    await expect(element(by.id(TRAVEL_PAY_CLAIM_1_ID))).toExist()
    await expect(element(by.id(TRAVEL_PAY_CLAIM_11_ID))).not.toExist()
  })

  it('opens a webview to view claim details on web', async () => {
    const { TRAVEL_PAY_CLAIMS_TEST_ID, TRAVEL_PAY_CLAIM_1_ID } = TravePayClaimsE2eIds

    await element(by.id(TRAVEL_PAY_CLAIMS_TEST_ID)).scrollTo('top')
    await waitFor(element(by.id(TRAVEL_PAY_CLAIM_1_ID)))
      .toBeVisible()
      .withTimeout(4000)

    await element(by.id(TRAVEL_PAY_CLAIM_1_ID)).tap()
    await waitFor(element(by.text('Travel Claim Details')))
      .toExist()
      .withTimeout(4000)
    await element(by.id('webviewBack')).tap()
  })
})
