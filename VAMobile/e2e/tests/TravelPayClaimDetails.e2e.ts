import { by, element, expect, waitFor } from 'detox'

import { CommonE2eIdConstants, loginToDemoMode, openHealth, openTravelPayClaims, toggleRemoteConfigFlag } from './utils'

const TravelPayClaimDetailsE2eIds = {
  TRAVEL_PAY_CLAIMS_TEST_ID: 'travelPayClaimsTestID',
  TRAVEL_PAY_CLAIMS_LIST_TEST_ID: 'travelPayClaimsListTestId',
  TRAVEL_PAY_CLAIM_DETAILS_SCREEN_ID: 'TravelPayClaimDetailsScreen',
  TRAVEL_PAY_CLAIM_DETAILS_HEADER_TITLE_TEST_ID: 'travelPayClaimHeaderTitle',
  TRAVEL_PAY_CLAIM_DETAILS_HEADER_NUMBER_TEST_ID: 'travelPayClaimHeaderNumber',
  TRAVEL_PAY_CLAIM_DETAILS_HEADER_STATUS_TEST_ID: 'travelPayClaimHeaderStatus',
  TRAVEL_PAY_CLAIM_DETAILS_STATUS_DEFINITION_TEST_ID: 'travelPayClaimStatusDefinitionTestID',
  TRAVEL_PAY_CLAIM_DETAILS_SUBMISSION_TIMELINE_TITLE_TEST_ID: 'travelPayClaimInformationSubmissionTimelineTestID',
  TRAVEL_PAY_CLAIM_DETAILS_SUBMITTED_ON_TEST_ID: 'travelPayClaimInformationSubmittedOnTestID',
  TRAVEL_PAY_CLAIM_DETAILS_UPDATED_ON_TEST_ID: 'travelPayClaimInformationUpdatedOnTestID',
  TRAVEL_PAY_CLAIM_DETAILS_APPOINTMENT_DATE_TEST_ID: 'travelPayClaimInformationAppointmentDateTestID',
  TRAVEL_PAY_CLAIM_DETAILS_AMOUNT_TITLE_TEST_ID: 'travelPayClaimAmountTitleTestID',
  TRAVEL_PAY_CLAIM_DETAILS_AMOUNT_SUBMITTED_TEST_ID: 'travelPayClaimAmountSubmittedTestID',
  TRAVEL_PAY_CLAIM_DETAILS_AMOUNT_REIMBURSEMENT_TEST_ID: 'travelPayClaimAmountReimbursementTestID',
  TRAVEL_PAY_AMOUNT_DIFFERENCE_TEST_ID: 'travelPayAmountDifferenceTestID',
  TRAVEL_PAY_AMOUNT_DIFFERENCE_TITLE_TEST_ID: 'travelPayAmountDifferenceTitleTestID',
  TRAVEL_PAY_AMOUNT_DIFFERENCE_DESCRIPTION_PART1_TEST_ID: 'travelPayAmountDifferenceDescriptionPart1TestID',
  TRAVEL_PAY_DEDUCTIBLE_INFO_LINK_TEST_ID: 'travelPayDeductibleInfoLinkTestID',
  TRAVEL_PAY_CLAIM_DETAILS_DOCUMENTS_SUBMITTED_TITLE_TEST_ID: 'travelPayClaimInformationDocumentsSubmittedTitleTestID',
  TRAVEL_PAY_CLAIM_DETAILS_HELP_ID: 'travelPayClaimDetailsHelpID',
  TRAVEL_PAY_HELP_TEST_ID: `helpTitleID`,
  RIGHT_CLOSE_BUTTON_ID: 'rightCloseTestID',
  // Claim IDs from mock data
  CLAIM_1_IN_MANUAL_REVIEW_ID: 'claim_summary_f33ef640-000f-4ecf-82b8-1c50df13d178',
  CLAIM_2_DENIED_ID: 'claim_summary_7519378a-e9ef-4a84-8673-591776c8f06b', // Denied claim
  CLAIM_3_PARTIAL_ID: 'claim_summary_352b37f2-3566-4642-98b2-6a2bc0e63757', // Partial payment
}

beforeAll(async () => {
  await toggleRemoteConfigFlag(CommonE2eIdConstants.TRAVEL_PAY_CONFIG_FLAG_TEXT)
  await toggleRemoteConfigFlag(CommonE2eIdConstants.TRAVEL_PAY_STATUS_LIST_FLAG_TEXT)
  await toggleRemoteConfigFlag(CommonE2eIdConstants.TRAVEL_PAY_CLAIM_DETAILS_FLAG_TEXT)
  await loginToDemoMode()
  await openHealth()
  await openTravelPayClaims()
})

// Helper function to ensure we're on claims list
const ensureOnClaimsList = async () => {
  try {
    // Try to find claims list directly
    await waitFor(element(by.id(TravelPayClaimDetailsE2eIds.TRAVEL_PAY_CLAIMS_TEST_ID)))
      .toExist()
      .withTimeout(3000)
    return // Already on claims list
  } catch {
    // Not on claims list, try to navigate back
    try {
      await waitFor(element(by.text('Travel claims')))
        .toExist()
        .withTimeout(2000)
      await element(by.text('Travel claims')).atIndex(0).tap()
      await waitFor(element(by.id(TravelPayClaimDetailsE2eIds.TRAVEL_PAY_CLAIMS_TEST_ID)))
        .toExist()
        .withTimeout(3000)
    } catch {
      // If we can't find Travel button, try navigating from root
      try {
        await waitFor(element(by.text('Health')))
          .toExist()
          .withTimeout(3000)
        await element(by.text('Health')).tap()
        await waitFor(element(by.text('Travel claims')))
          .toExist()
          .withTimeout(3000)
        await element(by.text('Travel claims')).atIndex(0).tap()
        await waitFor(element(by.id(TravelPayClaimDetailsE2eIds.TRAVEL_PAY_CLAIMS_TEST_ID)))
          .toExist()
          .withTimeout(3000)
      } catch (error) {
        console.log('Failed to navigate to claims list:', error)
        throw error
      }
    }
  }

  // After navigation, ensure claims list is scrolled to top
  try {
    await element(by.id(TravelPayClaimDetailsE2eIds.TRAVEL_PAY_CLAIMS_TEST_ID)).scrollTo('top')
  } catch {
    // Scrolling failed, continue
  }
}

// Helper function to scroll down and find an element
const scrollToFindElement = async (elementId: string, maxScrollAttempts = 5) => {
  for (let i = 0; i < maxScrollAttempts; i++) {
    try {
      await waitFor(element(by.id(elementId)))
        .toBeVisible()
        .withTimeout(2000)
      return true // Found it!
    } catch {
      // Element not visible, scroll down and try again
      await element(by.id(TravelPayClaimDetailsE2eIds.TRAVEL_PAY_CLAIMS_TEST_ID)).scroll(200, 'down')
      await new Promise((resolve) => setTimeout(resolve, 500))
    }
  }
  return false // Couldn't find it after scrolling
}

// Helper function to safely tap elements with visibility checks
const safeTap = async (elementId: string, scrollToFind = false) => {
  let elementFound = false

  // First, try to find the element without scrolling
  try {
    await waitFor(element(by.id(elementId)))
      .toBeVisible()
      .withTimeout(3000)
    elementFound = true
  } catch {
    elementFound = false
  }

  // If not found and scrollToFind is enabled, try scrolling to find it
  if (!elementFound && scrollToFind) {
    console.log(`Element ${elementId} not visible, trying to scroll to find it...`)

    // For partial payment claim, scroll down more aggressively
    if (elementId === TravelPayClaimDetailsE2eIds.CLAIM_3_PARTIAL_ID) {
      // Scroll to bottom first to ensure we can find the partial payment claim
      try {
        await element(by.id(TravelPayClaimDetailsE2eIds.TRAVEL_PAY_CLAIMS_TEST_ID)).scroll(300, 'down')
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Try to find it now
        await waitFor(element(by.id(elementId)))
          .toBeVisible()
          .withTimeout(4000)
        elementFound = true
      } catch {
        // If still not found, try step-by-step scrolling
        elementFound = await scrollToFindElement(elementId)
      }
    } else {
      // For other elements, try regular scrolling
      elementFound = await scrollToFindElement(elementId)
    }
  }

  if (!elementFound) {
    throw new Error(`Could not find element with ID: ${elementId}`)
  }

  // Add delay to ensure element is fully rendered and hittable
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Try to tap the element
  try {
    await element(by.id(elementId)).atIndex(0).tap()
  } catch (error) {
    console.log(`First tap attempt failed for ${elementId}, trying fallback...`)

    // Fallback: scroll slightly to make sure element is in center of screen
    await element(by.id(TravelPayClaimDetailsE2eIds.TRAVEL_PAY_CLAIMS_TEST_ID)).scroll(50, 'up')
    await new Promise((resolve) => setTimeout(resolve, 500))
    await element(by.id(TravelPayClaimDetailsE2eIds.TRAVEL_PAY_CLAIMS_TEST_ID)).scroll(50, 'down')
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Try tap again
    await element(by.id(elementId)).atIndex(0).tap()
  }
}

describe('Travel Pay Claim Details Screen', () => {
  beforeEach(async () => {
    await ensureOnClaimsList()

    // Scroll to top to ensure first claim is visible
    try {
      await element(by.id(TravelPayClaimDetailsE2eIds.TRAVEL_PAY_CLAIMS_TEST_ID)).scrollTo('top')
    } catch {
      // Scrolling failed, continue anyway
    }
  })

  describe('Navigation to Claim Details', () => {
    it('should navigate to claim details when claim is tapped', async () => {
      // Use safe tap with scroll enabled to find the partial payment claim
      await safeTap(TravelPayClaimDetailsE2eIds.CLAIM_3_PARTIAL_ID, true)

      // Wait for claim details screen to appear
      await waitFor(element(by.id(TravelPayClaimDetailsE2eIds.TRAVEL_PAY_CLAIM_DETAILS_SCREEN_ID)))
        .toExist()
        .withTimeout(8000)

      // Verify screen title with more flexible matching
      await waitFor(element(by.text('Details')))
        .toExist()
        .withTimeout(6000)
    })
  })

  describe('Claim Details Content', () => {
    it('should display claim header information', async () => {
      await waitFor(element(by.id(TravelPayClaimDetailsE2eIds.TRAVEL_PAY_CLAIM_DETAILS_HEADER_TITLE_TEST_ID))).toExist()

      await waitFor(
        element(by.id(TravelPayClaimDetailsE2eIds.TRAVEL_PAY_CLAIM_DETAILS_HEADER_NUMBER_TEST_ID)),
      ).toExist()

      await waitFor(
        element(by.id(TravelPayClaimDetailsE2eIds.TRAVEL_PAY_CLAIM_DETAILS_HEADER_STATUS_TEST_ID)),
      ).toExist()
    })

    it('should display status definition', async () => {
      await waitFor(
        element(by.id(TravelPayClaimDetailsE2eIds.TRAVEL_PAY_CLAIM_DETAILS_STATUS_DEFINITION_TEST_ID)),
      ).toExist()
    })

    it('should display amount section', async () => {
      // Should show Amount title
      await expect(element(by.text('Amount'))).toExist()

      // Should show submitted amount
      await waitFor(
        element(by.id(TravelPayClaimDetailsE2eIds.TRAVEL_PAY_CLAIM_DETAILS_AMOUNT_SUBMITTED_TEST_ID)),
      ).toExist()

      // Should show reimbursement amount
      await waitFor(
        element(by.id(TravelPayClaimDetailsE2eIds.TRAVEL_PAY_CLAIM_DETAILS_AMOUNT_REIMBURSEMENT_TEST_ID)),
      ).toExist()
    })

    it('should display claim information section', async () => {
      // Should show "Submission timeline" section
      await waitFor(
        element(by.id(TravelPayClaimDetailsE2eIds.TRAVEL_PAY_CLAIM_DETAILS_SUBMISSION_TIMELINE_TITLE_TEST_ID)),
      ).toExist()

      // Should show submitted and updated dates
      await waitFor(element(by.id(TravelPayClaimDetailsE2eIds.TRAVEL_PAY_CLAIM_DETAILS_SUBMITTED_ON_TEST_ID))).toExist()

      await waitFor(element(by.id(TravelPayClaimDetailsE2eIds.TRAVEL_PAY_CLAIM_DETAILS_UPDATED_ON_TEST_ID))).toExist()

      // Should show "Appointment information" section
      await waitFor(
        element(by.id(TravelPayClaimDetailsE2eIds.TRAVEL_PAY_CLAIM_DETAILS_APPOINTMENT_DATE_TEST_ID)),
      ).toExist()
    })
  })

  describe('Amount Difference Accordion', () => {
    it('should show amount difference accordion when amounts are different', async () => {
      // Should show the accordion
      await waitFor(element(by.id(TravelPayClaimDetailsE2eIds.TRAVEL_PAY_AMOUNT_DIFFERENCE_TEST_ID)))
        .toExist()
        .withTimeout(6000)

      // Should show the accordion title
      await expect(element(by.text('Why are my amounts different'))).toExist()
    })

    it('should expand accordion when tapped', async () => {
      // Tap the accordion to expand
      await element(by.id(TravelPayClaimDetailsE2eIds.TRAVEL_PAY_AMOUNT_DIFFERENCE_TEST_ID)).tap()

      // Should show expanded content
      await waitFor(
        element(by.id(TravelPayClaimDetailsE2eIds.TRAVEL_PAY_AMOUNT_DIFFERENCE_DESCRIPTION_PART1_TEST_ID)),
      ).toExist()

      // Scroll down to make the link visible
      await element(by.id(TravelPayClaimDetailsE2eIds.TRAVEL_PAY_CLAIM_DETAILS_SCREEN_ID)).scroll(250, 'down')
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Wait for the link to be visible
      await waitFor(element(by.id(TravelPayClaimDetailsE2eIds.TRAVEL_PAY_DEDUCTIBLE_INFO_LINK_TEST_ID)))
        .toBeVisible()
        .withTimeout(3000)

      await element(by.id(TravelPayClaimDetailsE2eIds.TRAVEL_PAY_DEDUCTIBLE_INFO_LINK_TEST_ID)).tap()

      await expect(element(by.text(CommonE2eIdConstants.LEAVING_APP_POPUP_TEXT))).toExist()
      await element(by.text(CommonE2eIdConstants.LEAVING_APP_CANCEL_TEXT)).tap()
    })
  })

  describe('Document Downloads', () => {
    it('should show decision letter download for denied/partial payments claims', async () => {
      await waitFor(element(by.text('Review your decision letter'))).toExist()
    })

    it('should show documents submitted section', async () => {
      await waitFor(
        element(by.id(TravelPayClaimDetailsE2eIds.TRAVEL_PAY_CLAIM_DETAILS_DOCUMENTS_SUBMITTED_TITLE_TEST_ID)),
      ).toExist()
    })
  })

  describe('Help Functionality', () => {
    it('should show help button in header', async () => {
      await expect(element(by.id(TravelPayClaimDetailsE2eIds.TRAVEL_PAY_CLAIM_DETAILS_HELP_ID))).toExist()
      await expect(element(by.text('Help'))).toExist()
    })

    it('should navigate to help screen when help button is tapped', async () => {
      await element(by.id(TravelPayClaimDetailsE2eIds.TRAVEL_PAY_CLAIM_DETAILS_HELP_ID)).tap()
      await expect(element(by.id(TravelPayClaimDetailsE2eIds.TRAVEL_PAY_HELP_TEST_ID))).toExist()
      await element(by.id(TravelPayClaimDetailsE2eIds.RIGHT_CLOSE_BUTTON_ID)).tap()
    })
  })

  describe('Back Navigation', () => {
    it('should navigate back to claims list when back button is tapped', async () => {
      await element(by.text('Travel claims')).atIndex(0).tap()

      // Should be back on claims list
      await waitFor(element(by.id(TravelPayClaimDetailsE2eIds.TRAVEL_PAY_CLAIMS_TEST_ID)))
        .toExist()
        .withTimeout(4000)
    })
  })

  describe('Claim Details content for claims other than denied/partial payment', () => {
    it('should not show decision letter download nor amount difference accordion', async () => {
      await safeTap(TravelPayClaimDetailsE2eIds.CLAIM_1_IN_MANUAL_REVIEW_ID, true)

      await waitFor(element(by.id(TravelPayClaimDetailsE2eIds.TRAVEL_PAY_CLAIM_DETAILS_SCREEN_ID)))
        .toExist()
        .withTimeout(2000)

      await waitFor(element(by.text('Review your decision letter'))).not.toExist()

      await waitFor(element(by.id(TravelPayClaimDetailsE2eIds.TRAVEL_PAY_AMOUNT_DIFFERENCE_TEST_ID))).not.toExist()
    })
  })
})
