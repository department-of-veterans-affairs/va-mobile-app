import { by, element, expect, waitFor } from 'detox'

import { CommonE2eIdConstants, loginToDemoMode, openHealth, openTravelPayClaims, toggleRemoteConfigFlag } from './utils'

const TravePayClaimsE2eIds = {
  TRAVEL_PAY_CLAIMS_TEST_ID: 'travelPayClaimsTestID',
  TRAVEL_PAY_CLAIM_1_ID: 'claim_summary_f33ef640-000f-4ecf-82b8-1c50df13d178',
  TRAVEL_PAY_CLAIM_11_ID: 'claim_summary_4b99039f-208f-4c07-90b8-498f8466233e',
  TRAVEL_PAY_CLAIM_DETAILS_SCREEN_ID: 'TravelPayClaimDetailsScreen',
  TRAVEL_PAY_CLAIM_DETAILS_HEADER_TITLE_TEST_ID: 'travelPayClaimHeaderTitle',
}

beforeAll(async () => {
  await toggleRemoteConfigFlag(CommonE2eIdConstants.TRAVEL_PAY_CONFIG_FLAG_TEXT)
  await toggleRemoteConfigFlag(CommonE2eIdConstants.TRAVEL_PAY_STATUS_LIST_FLAG_TEXT)
  await toggleRemoteConfigFlag(CommonE2eIdConstants.TRAVEL_PAY_CLAIM_DETAILS_FLAG_TEXT)
  await loginToDemoMode()
  await openHealth()
  await openTravelPayClaims()
})

describe('Travel Pay Claims Screen', () => {
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
    await expect(element(by.id(TRAVEL_PAY_CLAIM_1_ID))).not.toExist()
    await expect(element(by.id(TRAVEL_PAY_CLAIM_11_ID))).toExist()

    // Go back to the first page
    await element(by.id('previous-page')).tap()
    await element(by.id(TRAVEL_PAY_CLAIMS_TEST_ID)).scrollTo('bottom')
    await waitFor(element(by.id('previous-page')))
      .toBeVisible()
      .withTimeout(4000)

    await expect(element(by.text('1 to 10 of 32'))).toExist()
    await expect(element(by.id(TRAVEL_PAY_CLAIM_1_ID))).toExist()
    await expect(element(by.id(TRAVEL_PAY_CLAIM_11_ID))).not.toExist()
  })

  it('opens claim details screen', async () => {
    const {
      TRAVEL_PAY_CLAIMS_TEST_ID,
      TRAVEL_PAY_CLAIM_1_ID,
      TRAVEL_PAY_CLAIM_DETAILS_SCREEN_ID,
      TRAVEL_PAY_CLAIM_DETAILS_HEADER_TITLE_TEST_ID,
    } = TravePayClaimsE2eIds

    await element(by.id(TRAVEL_PAY_CLAIMS_TEST_ID)).scrollTo('top')
    await waitFor(element(by.id(TRAVEL_PAY_CLAIM_1_ID)))
      .toBeVisible()
      .withTimeout(4000)

    await element(by.id(TRAVEL_PAY_CLAIM_1_ID)).tap()

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

    // Navigate back using the back button
    await element(by.text('Travel')).tap()

    // Verify we're back on the claims list screen
    await waitFor(element(by.id(TRAVEL_PAY_CLAIMS_TEST_ID)))
      .toExist()
      .withTimeout(4000)
  })
})
