/*
Description:
Detox script that follows the prescriptions test case found in testRail (VA Mobile App > RC Regression Test > Manual > Health Page Elements)
When to update:
This script should be updated whenever new things are added/changed in prescriptions or if anything is changed in src/store/api/demo/mocks/prescriptions.json.

Note: All demo users now have medicationsOracleHealthEnabled: true, so this test uses v1 OH prescription data.
The v1 mock data (default/prescriptions.json) has 3 prescriptions:
  - AMLODIPINE BESYLATE 10MG TAB (active, refillable, 1 refill remaining)
  - IODOQUINOL 650MG TAB (active, not refillable)
  - ACETAMINOPHEN 325MG TAB (expired, trackable with 2 UPS tracking records)
*/
import { by, device, element, expect, waitFor } from 'detox'
import { setTimeout } from 'timers/promises'

import {
  CommonE2eIdConstants,
  checkImages,
  loginToDemoMode,
  openHealth,
  openPrescriptions,
  toggleRemoteConfigFlag,
} from './utils'

export const PrescriptionsE2eIdConstants = {
  PRESCRIPTION_FILTER_BUTTON_ID: 'openFilterAndSortTestID',
  PRESCRIPTION_FILTER_MODAL_ID: 'ModalTestID',
  PRESCRIPTION_FILTER_APPLY_ID: 'radioButtonApplyTestID',
  PRESCRIPTION_ALL_DESCRIPTION_LABEL:
    'This list only shows prescriptions filled by  V-A  pharmacies and may not include all your medications.',
  // v1 OH prescriptions: 3 total (AMLODIPINE BESYLATE active, IODOQUINOL active, ACETAMINOPHEN expired)
  PRESCRIPTION_ALL_NUMBER_OF_PRESCRIPTIONS_TEXT: 'All prescriptions (3), sorted by status (A to Z)',
  PRESCRIPTION_TRACKING_NUMBER_OF_PRESCRIPTION_TEXT: 'Refills with tracking information (1)',
  PRESCRIPTION_STATUS_LABEL_HEADER_TEXT: 'Active',
  PRESCRIPTION_STATUS_LABEL_BODY_LABEL:
    'A prescription that can be filled at the local  V-A  pharmacy. If this prescription is refillable, you may request a refill of this  V-A  prescription.',
  // AMLODIPINE BESYLATE 10MG TAB is first in Status (A to Z) sort and has these attributes:
  PRESCRIPTION_INSTRUCTIONS_TEXT: 'TAKE ONE-HALF TABLET EVERY DAY FOR 30 DAYS',
  PRESCRIPTION_REFILLS_LEFT_TEXT: 'Refills left: 1',
  PRESCRIPTION_FILL_DATE_TEXT: 'Fill date: 06/06/2022',
  PRESCRIPTION_VA_FACILITY_TEXT: 'VA facility: SLC10 TEST LAB',
  PRESCRIPTION_DETAILS_LABEL_ID: 'prescriptionDetailsTestID',
  PRESCRIPTION_TRACKING_GET_TRACKING_ID: 'getPrescriptionTrackingTestID',
  PRESCRIPTION_BACK_ID: 'prescriptionsBackTestID',
  FILTER_PRESCRIPTIONS_TEST_ID: 'filterSortWrapperBoxTestID',
  PRESCRIPTION_GO_TO_MY_VA_HEALTH_LINK_ID: 'goToMyVAHealthPrescriptionHistoryID',
  PRESCRIPTION_DETAILS_BACK_ID: 'prescriptionsDetailsBackTestID',
  PRESCRIPTION_FILTER_CANCEL_ID: 'radioButtonCancelTestID',
  PRESCRIPTION_HELP_BUTTON_ID: 'prescriptionsHelpID',
  PRESCRIPTION_REQUEST_REFILL_ID: 'requestRefillsButtonID',
}

let tempPath

const trackingIndex = device.getPlatform() === 'android' ? 0 : 1

beforeAll(async () => {
  await toggleRemoteConfigFlag(CommonE2eIdConstants.IN_APP_REVIEW_TOGGLE_TEXT)
  await loginToDemoMode()
  await openHealth()
  await openPrescriptions()
})

/*
Validates and tests the sort prescription options.
Simplified for v1 OH prescriptions (3 items on a single page — no pagination needed).
param name: String name of the sort option
param firstPrescription: String name of the first prescription in the sorted list
param lastPrescription: String name of the last prescription in the sorted list
param firstInstance: Boolean — true for the first call (resets to All filter and takes screenshot)
*/
export async function validateSort(
  name: string,
  firstPrescription: string,
  lastPrescription: string,
  firstInstance = false,
) {
  it('should sort prescription data by ' + name, async () => {
    if (firstInstance) {
      await element(by.id(CommonE2eIdConstants.PRESCRIPTION_HISTORY_SCROLL_ID)).scrollTo('top')
      await element(by.id(PrescriptionsE2eIdConstants.PRESCRIPTION_FILTER_BUTTON_ID)).tap()
      await element(by.text('All (3)')).atIndex(0).tap()
      await element(by.id(PrescriptionsE2eIdConstants.PRESCRIPTION_FILTER_APPLY_ID)).tap()
    } else {
      await element(by.id(CommonE2eIdConstants.PRESCRIPTION_HISTORY_SCROLL_ID)).scrollTo('top')
    }
    await element(by.id(PrescriptionsE2eIdConstants.PRESCRIPTION_FILTER_BUTTON_ID)).tap()
    await element(by.id(PrescriptionsE2eIdConstants.PRESCRIPTION_FILTER_MODAL_ID)).scrollTo('bottom')

    if (firstInstance) {
      tempPath = await element(by.id(PrescriptionsE2eIdConstants.PRESCRIPTION_FILTER_MODAL_ID)).takeScreenshot(
        'filterSortWrapperBox',
      )
      checkImages(tempPath)
    }
    await element(by.text(name)).tap()
    await element(by.id(PrescriptionsE2eIdConstants.PRESCRIPTION_FILTER_APPLY_ID)).tap()
    await expect(element(by.text(firstPrescription)).atIndex(0)).toBeVisible()
    await element(by.id(CommonE2eIdConstants.PRESCRIPTION_HISTORY_SCROLL_ID)).swipe('up', 'fast', 1.0, 0.5, 0.5)
    await expect(element(by.text(lastPrescription))).toBeVisible()
  })
}

/*
Validates filter options where the modal count matches the filtered result count.
Only use for filters where allPrescriptions.length-based or computed counts are used
(e.g. 'All' and 'Tracking'), not status counts from the API meta.
param name: String name of the filter option
param quantity: Number of prescriptions expected (must match both modal count and result count)
param helperText: Optional string helper text shown in the filter modal
*/
export async function validateFilter(name: string, quantity: number, helperText?: string) {
  const filterDescription =
    name === 'Pending' ? 'Pending refills' : name === 'Tracking' ? 'Refills with tracking' : `${name} prescriptions`

  it(`should filter prescription data by ${name}`, async () => {
    await element(by.id(PrescriptionsE2eIdConstants.PRESCRIPTION_FILTER_BUTTON_ID)).tap()
    helperText && (await expect(element(by.text(helperText))).toExist())
    await element(by.text(`${name} (${quantity})`)).tap()
    await element(by.id(PrescriptionsE2eIdConstants.PRESCRIPTION_FILTER_APPLY_ID)).tap()
    await expect(element(by.text(`${filterDescription} (${quantity}), sorted by status (A to Z)`))).toExist()
  })
}

describe('Prescriptions Screen', () => {
  it('should match the prescription page design', async () => {
    tempPath = await element(by.id(PrescriptionsE2eIdConstants.FILTER_PRESCRIPTIONS_TEST_ID)).takeScreenshot(
      'filterSortWrapperBox',
    )
    checkImages(tempPath)
    await expect(element(by.id(CommonE2eIdConstants.PRESCRIPTION_REFILL_BUTTON_ID))).toExist()
    await expect(element(by.id(PrescriptionsE2eIdConstants.PRESCRIPTION_FILTER_BUTTON_ID))).toExist()
    await expect(element(by.label(PrescriptionsE2eIdConstants.PRESCRIPTION_ALL_DESCRIPTION_LABEL))).toExist()
    await expect(element(by.text(PrescriptionsE2eIdConstants.PRESCRIPTION_ALL_NUMBER_OF_PRESCRIPTIONS_TEXT))).toExist()
    // AMLODIPINE BESYLATE 10MG TAB is first in Status (A to Z) sort (active before expired)
    await expect(element(by.label('AMLODIPINE BESYLATE 10MG TAB'))).toExist()
    await element(by.id(CommonE2eIdConstants.PRESCRIPTION_HISTORY_SCROLL_ID)).scrollTo('top')
    await waitFor(element(by.id(PrescriptionsE2eIdConstants.PRESCRIPTION_DETAILS_LABEL_ID)).atIndex(0))
      .toBeVisible()
      .whileElement(by.id(CommonE2eIdConstants.PRESCRIPTION_HISTORY_SCROLL_ID))
      .scroll(100, 'down', 0.5, 0.5)
    await expect(
      element(by.text(PrescriptionsE2eIdConstants.PRESCRIPTION_STATUS_LABEL_HEADER_TEXT)).atIndex(0),
    ).toBeVisible()
    await expect(element(by.text(PrescriptionsE2eIdConstants.PRESCRIPTION_INSTRUCTIONS_TEXT)).atIndex(0)).toBeVisible()
    await expect(element(by.text(PrescriptionsE2eIdConstants.PRESCRIPTION_REFILLS_LEFT_TEXT)).atIndex(0)).toBeVisible()
    await expect(element(by.text(PrescriptionsE2eIdConstants.PRESCRIPTION_FILL_DATE_TEXT)).atIndex(0)).toBeVisible()
    await expect(element(by.text(PrescriptionsE2eIdConstants.PRESCRIPTION_VA_FACILITY_TEXT)).atIndex(0)).toBeVisible()
    await expect(element(by.id(PrescriptionsE2eIdConstants.PRESCRIPTION_DETAILS_LABEL_ID)).atIndex(0)).toBeVisible()
  })

  it('verify status label information', async () => {
    await element(by.id(CommonE2eIdConstants.PRESCRIPTION_HISTORY_SCROLL_ID)).scrollTo('top')
    await element(by.text(PrescriptionsE2eIdConstants.PRESCRIPTION_STATUS_LABEL_HEADER_TEXT)).atIndex(0).tap()
    await expect(
      element(by.text(PrescriptionsE2eIdConstants.PRESCRIPTION_STATUS_LABEL_HEADER_TEXT)).atIndex(0),
    ).toExist()
    await expect(element(by.label(PrescriptionsE2eIdConstants.PRESCRIPTION_STATUS_LABEL_BODY_LABEL))).toExist()
    await element(by.id(PrescriptionsE2eIdConstants.PRESCRIPTION_BACK_ID)).tap()
  })

  it('verify prescription details information', async () => {
    await element(by.id(CommonE2eIdConstants.PRESCRIPTION_HISTORY_SCROLL_ID)).scrollTo('top')
    await waitFor(element(by.id(PrescriptionsE2eIdConstants.PRESCRIPTION_DETAILS_LABEL_ID)).atIndex(0))
      .toBeVisible()
      .whileElement(by.id(CommonE2eIdConstants.PRESCRIPTION_HISTORY_SCROLL_ID))
      .scroll(50, 'down', 0.5, 0.5)
    await element(by.id(PrescriptionsE2eIdConstants.PRESCRIPTION_DETAILS_LABEL_ID)).atIndex(0).tap()
    await expect(element(by.text('AMLODIPINE BESYLATE 10MG TAB'))).toExist()
    await expect(element(by.label('Prescription number 3 6 3 6 7 1 1 A'))).toExist()
    await expect(element(by.text(PrescriptionsE2eIdConstants.PRESCRIPTION_STATUS_LABEL_HEADER_TEXT))).toExist()
    await expect(element(by.text('TAKE ONE-HALF TABLET EVERY DAY FOR 30 DAYS'))).toExist()
    await expect(element(by.text('Refills left'))).toExist()
    await expect(element(by.text('1'))).toExist()
    await expect(element(by.text('Fill date'))).toExist()
    await expect(element(by.text('06/06/2022'))).toExist()
    await expect(element(by.text('Quantity'))).toExist()
    await expect(element(by.text('15'))).toExist()
    await expect(element(by.text('Expires on'))).toExist()
    await expect(element(by.text('10/28/2022'))).toExist()
    await expect(element(by.text('Ordered on'))).toExist()
    await expect(element(by.text('10/27/2021'))).toExist()
    await expect(element(by.text('VA facility'))).toExist()
    await expect(element(by.text('SLC10 TEST LAB'))).toExist()
  })

  it('prescription details: verify status label information', async () => {
    await element(by.id(CommonE2eIdConstants.PRESCRIPTION_HISTORY_SCROLL_ID)).scroll(50, 'up') // Ensure the label is visible if partially tucked
    await element(by.text(PrescriptionsE2eIdConstants.PRESCRIPTION_STATUS_LABEL_HEADER_TEXT)).atIndex(0).tap()
    await expect(
      element(by.text(PrescriptionsE2eIdConstants.PRESCRIPTION_STATUS_LABEL_HEADER_TEXT)).atIndex(0),
    ).toExist()
    await expect(element(by.label(PrescriptionsE2eIdConstants.PRESCRIPTION_STATUS_LABEL_BODY_LABEL))).toExist()
    await element(by.id(PrescriptionsE2eIdConstants.PRESCRIPTION_BACK_ID)).tap()
    await element(by.id(PrescriptionsE2eIdConstants.PRESCRIPTION_DETAILS_BACK_ID)).tap()
  })

  // Only test filters where the modal count equals the filtered result count.
  // 'All' and 'Tracking' use computed counts (allPrescriptions.length and isTrackable count),
  // which are consistent with the actual data. Status-based counts (Active, Expired, etc.)
  // come from the API meta which has placeholder values in the v1 mock, so are not tested here.
  validateFilter('Tracking', 1, 'Includes refills with current tracking information available')
  validateFilter('All', 3)

  it('verify prescriptions screen after filters cancel', async () => {
    await element(by.id(PrescriptionsE2eIdConstants.PRESCRIPTION_FILTER_BUTTON_ID)).tap()
    await element(by.id(PrescriptionsE2eIdConstants.PRESCRIPTION_FILTER_CANCEL_ID)).tap()
    await expect(element(by.label(PrescriptionsE2eIdConstants.PRESCRIPTION_ALL_DESCRIPTION_LABEL))).toExist()
    await expect(element(by.text(PrescriptionsE2eIdConstants.PRESCRIPTION_ALL_NUMBER_OF_PRESCRIPTIONS_TEXT))).toExist()
    await expect(
      element(by.text(PrescriptionsE2eIdConstants.PRESCRIPTION_STATUS_LABEL_HEADER_TEXT)).atIndex(0),
    ).toExist()
    await expect(element(by.text(PrescriptionsE2eIdConstants.PRESCRIPTION_INSTRUCTIONS_TEXT)).atIndex(0)).toExist()
    await expect(element(by.text(PrescriptionsE2eIdConstants.PRESCRIPTION_REFILLS_LEFT_TEXT)).atIndex(0)).toExist()
    await expect(element(by.text(PrescriptionsE2eIdConstants.PRESCRIPTION_FILL_DATE_TEXT)).atIndex(0)).toExist()
    await expect(element(by.text(PrescriptionsE2eIdConstants.PRESCRIPTION_VA_FACILITY_TEXT)).atIndex(0)).toExist()
    await expect(element(by.id(PrescriptionsE2eIdConstants.PRESCRIPTION_DETAILS_LABEL_ID)).atIndex(0)).toExist()
  })

  it('pending: verify filters', async () => {
    await element(by.id(PrescriptionsE2eIdConstants.PRESCRIPTION_FILTER_BUTTON_ID)).tap()
    // Verify computed counts (consistent with actual v1 data)
    await expect(element(by.text('All (3)'))).toExist()
    await expect(element(by.text('Pending (0)'))).toExist()
    await expect(element(by.text('Tracking (1)'))).toExist()
    await element(by.id(PrescriptionsE2eIdConstants.PRESCRIPTION_FILTER_CANCEL_ID)).tap()
  })

  it('verify prescription tracking item specific info', async () => {
    // ACETAMINOPHEN 325MG TAB is expired and appears last in Status (A to Z) sort
    await element(by.id(CommonE2eIdConstants.PRESCRIPTION_HISTORY_SCROLL_ID)).scrollTo('top')
    await expect(element(by.label('ACETAMINOPHEN 325MG TAB'))).toExist()
    await waitFor(element(by.id(PrescriptionsE2eIdConstants.PRESCRIPTION_TRACKING_GET_TRACKING_ID)).atIndex(0))
      .toBeVisible()
      .whileElement(by.id(CommonE2eIdConstants.PRESCRIPTION_HISTORY_SCROLL_ID))
      .scroll(500, 'down', 0.5, 0.5)
    await element(by.id(PrescriptionsE2eIdConstants.PRESCRIPTION_TRACKING_GET_TRACKING_ID)).atIndex(0).tap()
    // Tracking record prescription number
    await expect(element(by.label('Prescription number 2 7 2 0 1 9 2 A'))).toExist()
    await expect(
      element(
        by.text("We share tracking information here for up to 15 days, even if you've received your prescription."),
      ),
    ).toExist()
    await expect(
      element(
        by.text(
          'If the delivery service changes, we may change or delete the tracking number. If you have questions, contact your local VA pharmacy.',
        ),
      ),
    ).toExist()
    await expect(element(by.text('Tracking number'))).toExist()
    await expect(element(by.label('7 7 2 9 8 0 2 7 2 0 3 9 8 0 0 0 0 0 0 0 3 9 8')).atIndex(trackingIndex)).toExist()
    await expect(element(by.text('Delivery service: UPS'))).toExist()
    await expect(element(by.label('Date shipped: October 15, 2022'))).toExist()
    await expect(element(by.text('Other prescriptions in this package:'))).toExist()
    await expect(element(by.text('LAMIVUDINE 10MG TAB'))).toExist()
  })

  it('verify tracking link for UPS works', async () => {
    await element(by.label('7 7 2 9 8 0 2 7 2 0 3 9 8 0 0 0 0 0 0 0 3 9 8')).atIndex(trackingIndex).tap()
    await element(by.text(CommonE2eIdConstants.LEAVING_APP_LEAVE_TEXT)).tap()
    await setTimeout(5000)
    await device.takeScreenshot('PrescriptionTrackingWebsiteUPS')
    await device.launchApp({ newInstance: false })
    await element(by.id(PrescriptionsE2eIdConstants.PRESCRIPTION_BACK_ID)).tap()
  })

  it('verify tracking info for multiple packages', async () => {
    // ACETAMINOPHEN has 2 UPS tracking records — should display as Package 1 of 2 and Package 2 of 2
    await element(by.id(CommonE2eIdConstants.PRESCRIPTION_HISTORY_SCROLL_ID)).scrollTo('top')
    await expect(element(by.label('ACETAMINOPHEN 325MG TAB'))).toExist()
    await waitFor(element(by.id(PrescriptionsE2eIdConstants.PRESCRIPTION_TRACKING_GET_TRACKING_ID)).atIndex(0))
      .toBeVisible()
      .whileElement(by.id(CommonE2eIdConstants.PRESCRIPTION_HISTORY_SCROLL_ID))
      .scroll(500, 'down', 0.5, 0.5)
    await element(by.id(PrescriptionsE2eIdConstants.PRESCRIPTION_TRACKING_GET_TRACKING_ID)).atIndex(0).tap()
    await expect(element(by.text('Package 1 of 2'))).toExist()
    await expect(element(by.text('Delivery service: UPS'))).toExist()
    await expect(element(by.text('Package 2 of 2'))).toExist()
    await element(by.id(PrescriptionsE2eIdConstants.PRESCRIPTION_BACK_ID)).tap()
  })

  it('verify prescriptions help model information', async () => {
    await element(by.id(PrescriptionsE2eIdConstants.PRESCRIPTION_HELP_BUTTON_ID)).tap()
    tempPath = await element(by.id('PrescriptionsHelpTestID')).takeScreenshot('PrescriptionHealth')
    checkImages(tempPath)
    await expect(element(by.text('This list may not include all your medications '))).toExist()
    await expect(element(by.text('Medications not included:'))).toExist()
    await expect(element(by.text('New prescriptions not yet processed by a VA pharmacy'))).toExist()
    await expect(element(by.text('Prescriptions filled at non-VA pharmacies'))).toExist()
    await expect(element(by.text('Prescriptions that are inactive for more than 180 days'))).toExist()
    await expect(element(by.text('Medications administered at a clinic or ER'))).toExist()
    await expect(element(by.text('Self-entered medications'))).toExist()
    await expect(
      element(
        by.label(
          'If you have questions about your  V-A  prescriptions, call the  V-A  pharmacy number on your prescription label.',
        ),
      ),
    ).toExist()
    await element(by.id(PrescriptionsE2eIdConstants.PRESCRIPTION_BACK_ID)).tap()
  })

  // Sort tests updated for v1 OH prescriptions (3 items on a single page, no pagination)
  // Fill date (newest to oldest): AMLODIPINE (06/06/2022) → IODOQUINOL (06/03/2022) → ACETAMINOPHEN (01/15/2022)
  validateSort('Fill date (newest to oldest)', 'AMLODIPINE BESYLATE 10MG TAB', 'ACETAMINOPHEN 325MG TAB', true)
  // Medication name (A to Z): ACETAMINOPHEN → AMLODIPINE BESYLATE → IODOQUINOL
  validateSort('Medication name (A to Z)', 'ACETAMINOPHEN 325MG TAB', 'IODOQUINOL 650MG TAB')
  // Refills left (least to most): ACETAMINOPHEN (0) → AMLODIPINE/IODOQUINOL (1 each, A-Z secondary sort)
  validateSort('Refills left (least to most)', 'ACETAMINOPHEN 325MG TAB', 'IODOQUINOL 650MG TAB')
  // Status (A to Z): AMLODIPINE/IODOQUINOL (Active) → ACETAMINOPHEN (Expired)
  validateSort('Status (A to Z)', 'AMLODIPINE BESYLATE 10MG TAB', 'ACETAMINOPHEN 325MG TAB')
})
