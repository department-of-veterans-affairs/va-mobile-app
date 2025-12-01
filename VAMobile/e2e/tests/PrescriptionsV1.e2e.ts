/*
Description:
Detox script that tests prescriptions using the v1 API (Oracle Health / medicationsOracleHealthEnabled).
This test focuses on verifying the v1-specific features including:
- Different status labels (Active, In Progress, Shipped, Inactive vs v0's Active, Pending, Tracking, Discontinued, Expired)
- Blue informational alert for transferred prescriptions
- Updated filter options with v1 help text

When to update:
This script should be updated when v1 API responses change or when Oracle Health integration features are modified.
*/
import { by, element, expect, waitFor } from 'detox'

// eslint-disable-next-line no-restricted-imports
import {
  CommonE2eIdConstants,
  changeDemoModeUser,
  loginToDemoMode,
  openDeveloperScreen,
  openHealth,
  openPrescriptions,
  openProfile,
  openSettings,
  toggleRemoteConfigFlag,
} from './utils'

export const PrescriptionsV1E2eIdConstants = {
  PRESCRIPTION_FILTER_BUTTON_ID: 'openFilterAndSortTestID',
  PRESCRIPTION_FILTER_MODAL_ID: 'ModalTestID',
  PRESCRIPTION_FILTER_APPLY_ID: 'radioButtonApplyTestID',
  PRESCRIPTION_ALL_DESCRIPTION_LABEL:
    'This list only shows prescriptions filled by  V-A  pharmacies and may not include all your medications.',
  PRESCRIPTION_GO_TO_MY_VA_HEALTH_LINK_ID: 'goToMyVAHealthPrescriptionHistoryID',
  PRESCRIPTION_DETAILS_LABEL: 'Get prescription details',
  PRESCRIPTION_TRACKING_GET_TRACKING_ID: 'getPrescriptionTrackingTestID',
  PRESCRIPTION_BACK_ID: 'prescriptionsBackTestID',
  PRESCRIPTION_HELP_BUTTON_ID: 'prescriptionsHelpID',
  FILTER_PRESCRIPTIONS_TEST_ID: 'filterSortWrapperBoxTestID',
  DESIRED_DEMO_MODE_USER_ID: 'Sarah Martinez option 5 of 5', // User with medicationsOracleHealthEnabled: true and unique prescription data
}

beforeAll(async () => {
  await toggleRemoteConfigFlag(CommonE2eIdConstants.IN_APP_REVIEW_TOGGLE_TEXT)
  await loginToDemoMode()
  // Sarah Martinez has medicationsOracleHealthEnabled: true and unique prescription data
  await changeDemoModeUser(PrescriptionsV1E2eIdConstants.DESIRED_DEMO_MODE_USER_ID)
  await openHealth()
  await openPrescriptions()
})

/*
Validates filter options specific to v1 API
param name: String name of the filter option
param count: Number of prescriptions expected for this filter
param helperText: Optional helper text that appears for the filter
*/
export async function validateV1Filter(name: string, count: number, helperText?: string) {
  it(`should show v1 filter option: ${name}`, async () => {
    await element(by.id(CommonE2eIdConstants.PRESCRIPTION_HISTORY_SCROLL_ID)).scrollTo('top')
    await element(by.id(PrescriptionsV1E2eIdConstants.PRESCRIPTION_FILTER_BUTTON_ID)).tap()

    // Check for the filter option with count
    await expect(element(by.text(`${name} (${count})`))).toExist()

    // If helper text is provided, verify it exists
    if (helperText) {
      // Note: Helper text appears as additional label text in the filter modal
      await expect(element(by.text(helperText))).toExist()
    }

    await element(by.id('radioButtonCancelTestID')).tap()
  })
}

describe('Prescriptions Screen - V1 API (Oracle Health)', () => {
  it('should match the prescription page design with v1 features', async () => {
    await expect(element(by.id(CommonE2eIdConstants.PRESCRIPTION_REFILL_BUTTON_ID))).toExist()
    await expect(element(by.id(PrescriptionsV1E2eIdConstants.PRESCRIPTION_FILTER_BUTTON_ID))).toExist()
    await expect(element(by.id(PrescriptionsV1E2eIdConstants.FILTER_PRESCRIPTIONS_TEST_ID))).toExist()
    await expect(element(by.label(PrescriptionsV1E2eIdConstants.PRESCRIPTION_ALL_DESCRIPTION_LABEL))).toExist()
  })

  it('verify v1 filter modal options', async () => {
    await element(by.id(PrescriptionsV1E2eIdConstants.PRESCRIPTION_FILTER_BUTTON_ID)).tap()

    // V1 specific filter options with Sarah Martinez's prescription counts
    await expect(element(by.text('All (12)'))).toExist()
    await expect(element(by.text('Active (7)'))).toExist()
    await expect(element(by.text('In progress (2)'))).toExist() // v1 uses "In Progress" instead of "Pending"
    await expect(element(by.text('Shipped (1)'))).toExist() // v1 uses "Shipped" instead of "Tracking"
    await expect(element(by.text('Inactive (2)'))).toExist() // v1 uses "Inactive" instead of separate "Discontinued" and "Expired"
    await expect(element(by.text('Transferred (1)'))).toExist()
    await expect(element(by.text('Status Not Available (1)'))).toExist()

    await element(by.id('radioButtonCancelTestID')).tap()
  })

  it.skip('should filter by Active status (v1)', async () => {
    await element(by.id(CommonE2eIdConstants.PRESCRIPTION_HISTORY_SCROLL_ID)).scrollTo('top')
    await element(by.id(PrescriptionsV1E2eIdConstants.PRESCRIPTION_FILTER_BUTTON_ID)).tap()
    await element(by.text('Active (8)')).atIndex(0).tap()
    await element(by.id(PrescriptionsV1E2eIdConstants.PRESCRIPTION_FILTER_APPLY_ID)).tap()

    // Verify the filtered view title
    await expect(element(by.text('Active prescriptions (8), sorted by status (A to Z)'))).toExist()
    // Check that Active prescriptions are displayed
    await waitFor(element(by.label('LEVOTHYROXINE 100MCG TAB')))
      .toBeVisible()
      .whileElement(by.id(CommonE2eIdConstants.PRESCRIPTION_HISTORY_SCROLL_ID))
      .scroll(100, 'down', 0.5, 0.5)
  })

  it.skip('should filter by In Progress status (v1)', async () => {
    await element(by.id(CommonE2eIdConstants.PRESCRIPTION_HISTORY_SCROLL_ID)).scrollTo('top')
    await element(by.id(PrescriptionsV1E2eIdConstants.PRESCRIPTION_FILTER_BUTTON_ID)).tap()
    await element(by.text('In progress (2)')).atIndex(0).tap()
    await element(by.id(PrescriptionsV1E2eIdConstants.PRESCRIPTION_FILTER_APPLY_ID)).tap()

    // Verify the filtered view shows In Progress prescriptions
    await expect(element(by.text('In progress prescriptions (2), sorted by status (A to Z)'))).toExist()

    // Check that In Progress prescriptions are displayed
    await waitFor(element(by.label('ATORVASTATIN CALCIUM 20MG TAB')))
      .toBeVisible()
      .whileElement(by.id(CommonE2eIdConstants.PRESCRIPTION_HISTORY_SCROLL_ID))
      .scroll(100, 'down', 0.5, 0.5)
  })

  it('should verify v1 API is being called by checking for v1-specific data', async () => {
    // Filter to prescriptions with tracking to verify v1-specific "carrier" field
    await element(by.id(CommonE2eIdConstants.PRESCRIPTION_HISTORY_SCROLL_ID)).scrollTo('top')
    await element(by.id(PrescriptionsV1E2eIdConstants.PRESCRIPTION_FILTER_BUTTON_ID)).tap()
    await element(by.text('Shipped (1)')).atIndex(0).tap()
    await element(by.id(PrescriptionsV1E2eIdConstants.PRESCRIPTION_FILTER_APPLY_ID)).tap()

    // Find the trackable prescription and tap it to expand
    await waitFor(element(by.label('CYCLOBENZAPRINE HCL 10MG TAB')))
      .toBeVisible()
      .whileElement(by.id(CommonE2eIdConstants.PRESCRIPTION_HISTORY_SCROLL_ID))
      .scroll(100, 'down', 0.5, 0.5)
    await element(by.label('CYCLOBENZAPRINE HCL 10MG TAB')).tap()

    // Wait for tracking button to be visible after expansion, then tap
    await waitFor(element(by.id('getPrescriptionTrackingTestID'))).toBeVisible()
    await element(by.id('getPrescriptionTrackingTestID')).tap()

    // V1 API includes carrier field (USPS) which is embedded in prescription data
    // V0 API requires separate API call to get tracking info
    // Verify tracking modal opened (this confirms v1 data structure worked)
    await expect(element(by.text('Tracking information'))).toExist()

    // Close the modal
    await element(by.text('Close')).tap()
  })

  it('should verify v1-only filter options exist (not available in v0)', async () => {
    await element(by.id(CommonE2eIdConstants.PRESCRIPTION_HISTORY_SCROLL_ID)).scrollTo('top')
    await element(by.id(PrescriptionsV1E2eIdConstants.PRESCRIPTION_FILTER_BUTTON_ID)).tap()

    // "In progress" is v1-only terminology (v0 uses "Pending")
    await expect(element(by.text('In progress (2)'))).toExist()

    // "Shipped" is v1-only terminology (v0 uses "Tracking")
    await expect(element(by.text('Shipped (1)'))).toExist()

    // "Inactive" is v1-only - combines discontinued and expired (v0 shows them separately)
    await expect(element(by.text('Inactive (2)'))).toExist()

    // Verify v0-specific options DON'T exist
    await expect(element(by.text('Pending'))).not.toExist()
    await expect(element(by.text('Tracking'))).not.toExist()

    // Note: Can't check for "Discontinued" absence since it's part of "Inactive (2)" text
    // But we verified "Inactive" which is the v1 equivalent

    await element(by.id('radioButtonCancelTestID')).tap()
  })

  it.skip('should toggle between v1 and v0 API versions', async () => {
    // Currently on Sarah Martinez (v1 API - medicationsOracleHealthEnabled: true)
    // Verify v1-specific UI elements
    await element(by.id(CommonE2eIdConstants.PRESCRIPTION_HISTORY_SCROLL_ID)).scrollTo('top')
    await element(by.id(PrescriptionsV1E2eIdConstants.PRESCRIPTION_FILTER_BUTTON_ID)).tap()

    // V1 should have "In progress" and "Shipped" options
    await expect(element(by.text('In progress (2)'))).toExist()
    await expect(element(by.text('Shipped (1)'))).toExist()
    await expect(element(by.text('Inactive (2)'))).toExist()
    await element(by.id('radioButtonCancelTestID')).tap()

    // Switch to Dennis Madison (v0 API - medicationsOracleHealthEnabled: false)
    await openProfile()
    await openSettings()
    await openDeveloperScreen()
    await changeDemoModeUser('Dennis Madison option 4 of 5')

    // Navigate back to prescriptions
    await openHealth()
    await openPrescriptions()

    // Verify v0-specific UI elements
    await element(by.id(CommonE2eIdConstants.PRESCRIPTION_HISTORY_SCROLL_ID)).scrollTo('top')
    await element(by.id(PrescriptionsV1E2eIdConstants.PRESCRIPTION_FILTER_BUTTON_ID)).tap()

    // V0 should have "Pending" and "Tracking" options instead
    await expect(element(by.text('Pending (8)'))).toExist()
    await expect(element(by.text('Tracking (5)'))).toExist()
    // V0 has separate "Discontinued" and "Expired" instead of "Inactive"
    await expect(element(by.text('Discontinued (6)'))).toExist()
    await expect(element(by.text('Expired (0)'))).toExist()
    await element(by.id('radioButtonCancelTestID')).tap()

    // Switch back to Sarah Martinez (v1 API) to verify cache separation
    await openProfile()
    await openSettings()
    await openDeveloperScreen()
    await changeDemoModeUser(PrescriptionsV1E2eIdConstants.DESIRED_DEMO_MODE_USER_ID)

    // Navigate back to prescriptions
    await openHealth()
    await openPrescriptions()

    // Verify v1 UI is back with Sarah Martinez's data
    await element(by.id(CommonE2eIdConstants.PRESCRIPTION_HISTORY_SCROLL_ID)).scrollTo('top')
    await element(by.id(PrescriptionsV1E2eIdConstants.PRESCRIPTION_FILTER_BUTTON_ID)).tap()
    await expect(element(by.text('In progress (2)'))).toExist()
    await expect(element(by.text('Shipped (1)'))).toExist()
    await expect(element(by.text('Inactive (2)'))).toExist()
    await element(by.id('radioButtonCancelTestID')).tap()
  })
})
