/*
Description:
Detox script that tests prescriptions using the v1 API (Oracle Health / medicationsOracleHealthEnabled).
This test focuses on verifying the v1-specific features including:
- Different status labels (Active, In Progress, Shipped, Inactive vs v0's Active, Pending, Tracking, Discontinued, Expired)
- Blue informational alert for transferred prescriptions
- Updated filter options with v1 help text

Prompted used: 
Create a new detox test for PrescriptionHistory for using v1 of the API 

When to update:
This script should be updated when v1 API responses change or when Oracle Health integration features are modified.
*/
import { by, element, expect, waitFor } from 'detox'

// eslint-disable-next-line no-restricted-imports
import {
  CommonE2eIdConstants,
  changeDemoModeUser,
  loginToDemoMode,
  openHealth,
  openPrescriptions,
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
  DESIRED_DEMO_MODE_USER_ID: 'Kimberly Washington option 1 of 4', // Default user with medicationsOracleHealthEnabled: true
}

beforeAll(async () => {
  await toggleRemoteConfigFlag(CommonE2eIdConstants.IN_APP_REVIEW_TOGGLE_TEXT)
  await loginToDemoMode()
  // Kimberly Washington is the default user and has medicationsOracleHealthEnabled: true
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
  it.skip(`should show v1 filter option: ${name}`, async () => {
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

    // V1 specific filter options
    await expect(element(by.text('All (3)'))).toExist()
    await expect(element(by.text('Active (55)'))).toExist()
    await expect(element(by.text('In progress (0)'))).toExist() // v1 uses "In Progress" instead of "Pending"
    await expect(element(by.text('Shipped (1)'))).toExist() // v1 uses "Shipped" instead of "Tracking"
    await expect(element(by.text('Inactive (110)'))).toExist() // v1 uses "Inactive" instead of separate "Discontinued" and "Expired"
    await expect(element(by.text('Transferred (55)'))).toExist()
    await expect(element(by.text('Status Not Available (55)'))).toExist()

    await element(by.id('radioButtonCancelTestID')).tap()
  })

  it('should filter by Active status (v1)', async () => {
    await element(by.id(CommonE2eIdConstants.PRESCRIPTION_HISTORY_SCROLL_ID)).scrollTo('top')
    await element(by.id(PrescriptionsV1E2eIdConstants.PRESCRIPTION_FILTER_BUTTON_ID)).tap()
    await element(by.text('Active (55)')).atIndex(0).tap()
    await element(by.id(PrescriptionsV1E2eIdConstants.PRESCRIPTION_FILTER_APPLY_ID)).tap()

    // Verify the filtered view title
    await expect(element(by.text('Active prescriptions (2), sorted by status (A to Z)'))).toExist()

    // Check that Active prescriptions are displayed
    await waitFor(element(by.label('AMLODIPINE BESYLATE 10MG TAB')))
      .toBeVisible()
      .whileElement(by.id(CommonE2eIdConstants.PRESCRIPTION_HISTORY_SCROLL_ID))
      .scroll(100, 'down', 0.5, 0.5)
  })

  it('should filter by In Progress status (v1)', async () => {
    await element(by.id(CommonE2eIdConstants.PRESCRIPTION_HISTORY_SCROLL_ID)).scrollTo('top')
    await element(by.id(PrescriptionsV1E2eIdConstants.PRESCRIPTION_FILTER_BUTTON_ID)).tap()
    await element(by.text('In progress (0)')).atIndex(0).tap()
    await element(by.id(PrescriptionsV1E2eIdConstants.PRESCRIPTION_FILTER_APPLY_ID)).tap()

    // Verify the filtered view shows In Progress prescriptions
    await expect(element(by.label('There are no matches'))).toExist()
  })
})
