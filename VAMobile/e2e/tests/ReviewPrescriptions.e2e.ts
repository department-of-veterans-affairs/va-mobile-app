/*
Description:
Detox script that follows the prescriptions test case found in testRail (VA Mobile App > RC Regression Test > Manual > Health Page Elements)
When to update:
This script should be updated whenever new things are added/changed in prescriptions or if anything is changed in src/store/api/demo/mocks/prescriptions.json.
*/
import { by, device, element, expect, waitFor } from 'detox'

import { CommonE2eIdConstants, loginToDemoMode, openHealth, openPrescriptions, toggleRemoteConfigFlag } from './utils'

export const ReviewPrescriptionsE2eIdConstants = {
  PRESCRIPTION_HISTORY_SCROLL_TARGET: 'METFORMIN HCL 500MG TAB',
  PRESCRIPTION_FILTER_BUTTON_ID: 'openFilterAndSortTestID',
  PRESCRIPTION_FILTER_MODAL_ID: 'ModalTestID',
  PRESCRIPTION_FILTER_APPLY_ID: 'radioButtonApplyTestID',
  PRESCRIPTION_ALL_DESCRIPTION_LABEL:
    'This list only shows prescriptions filled by  V-A  pharmacies and may not include all your medications.',
  PRESCRIPTION_ALL_NUMBER_OF_PRESCRIPTIONS_TEXT: 'All prescriptions (5), sorted by status (A to Z)',
  PRESCRIPTION_STATUS_LABEL_HEADER_TEXT: 'Active',
  PRESCRIPTION_STATUS_LABEL_BODY_LABEL:
    'A prescription that can be filled at the local  V-A  pharmacy. If this prescription is refillable, you may request a refill of this  V-A  prescription.',
  PRESCRIPTION_INSTRUCTIONS_TEXT: 'TAKE ONE TABLET DAILY',
  PRESCRIPTION_REFILLS_LEFT_TEXT: 'Refills left: 5',
  PRESCRIPTION_FILL_DATE_TEXT: 'Fill date: Date not available',
  PRESCRIPTION_VA_FACILITY_TEXT: 'VA facility: Test VA Medical Center',
  PRESCRIPTION_DETAILS_LABEL: 'Get prescription details',
  PRESCRIPTION_TRACKING_GET_TRACKING_ID: 'getPrescriptionTrackingTestID',
  PRESCRIPTION_REFILL_REQUEST_DESCRIPTION_1_TEXT:
    "We share tracking information here for up to 15 days, even if you've received your prescription.",
  PRESCRIPTION_REFILL_REQUEST_DESCRIPTION_2_LABEL:
    'If the delivery service changes, we may change or delete the tracking number. If you have questions, contact your local  V-A  pharmacy.',
  PRESCRIPTION_BACK_ID: 'prescriptionsBackTestID',
  PRESCRIPTION_HELP_BUTTON_ID: 'prescriptionsHelpID',
  PRESCRIPTION_SORTED_NAME_FIRST: 'ACETAMINOPHEN 325MG TAB',
  PRESCRIPTION_SORTED_NAME_LAST: 'METFORMIN HCL 500MG TAB',
  PRESCRIPTION_TRACKING_NUMBER: '77298027203980000000398'.split('').join(' '),
}

const trackingIndex = device.getPlatform() === 'android' ? 0 : 1

const describeWithSetup = (name: string, fn: jest.EmptyFunction) => {
  describe(name, () => {
    beforeAll(async () => {
      await loginToDemoMode()
      await openHealth()
      await openPrescriptions()
    })
    afterAll(async () => {
      await device.launchApp({ newInstance: true, permissions: { notifications: 'YES' } })
    })
    fn()
  })
}

beforeAll(async () => {
  await toggleRemoteConfigFlag(CommonE2eIdConstants.IN_APP_REVIEW_TOGGLE_TEXT)
})

describeWithSetup('Review prescriptions list', () => {
  it('should match the prescription page design', async () => {
    await expect(element(by.id(CommonE2eIdConstants.PRESCRIPTION_REFILL_BUTTON_ID))).toExist()
    await expect(element(by.id(ReviewPrescriptionsE2eIdConstants.PRESCRIPTION_FILTER_BUTTON_ID))).toExist()
    await expect(element(by.label(ReviewPrescriptionsE2eIdConstants.PRESCRIPTION_ALL_DESCRIPTION_LABEL))).toExist()
    await expect(
      element(by.text(ReviewPrescriptionsE2eIdConstants.PRESCRIPTION_ALL_NUMBER_OF_PRESCRIPTIONS_TEXT)),
    ).toExist()

    // Scroll until the 'Get prescription details' link for AMLODIPINE BESYLATE 10MG TAB is accessible
    await waitFor(element(by.label(ReviewPrescriptionsE2eIdConstants.PRESCRIPTION_HISTORY_SCROLL_TARGET)))
      .toBeVisible()
      .whileElement(by.id(CommonE2eIdConstants.PRESCRIPTION_HISTORY_SCROLL_ID))
      .scroll(100, 'down', 0.5, 0.5)
    await expect(
      element(by.text(ReviewPrescriptionsE2eIdConstants.PRESCRIPTION_STATUS_LABEL_HEADER_TEXT)).atIndex(0),
    ).toBeVisible()
    await expect(
      element(by.text(ReviewPrescriptionsE2eIdConstants.PRESCRIPTION_INSTRUCTIONS_TEXT)).atIndex(0),
    ).toBeVisible()
    await expect(
      element(by.text(ReviewPrescriptionsE2eIdConstants.PRESCRIPTION_REFILLS_LEFT_TEXT)).atIndex(0),
    ).toBeVisible()
    await expect(
      element(by.text(ReviewPrescriptionsE2eIdConstants.PRESCRIPTION_FILL_DATE_TEXT)).atIndex(0),
    ).toBeVisible()
    await expect(
      element(by.text(ReviewPrescriptionsE2eIdConstants.PRESCRIPTION_VA_FACILITY_TEXT)).atIndex(0),
    ).toBeVisible()
    await expect(
      element(by.label(ReviewPrescriptionsE2eIdConstants.PRESCRIPTION_DETAILS_LABEL)).atIndex(0),
    ).toBeVisible()
  })

  it('should display status definition after status label is tapped', async () => {
    await element(by.text(ReviewPrescriptionsE2eIdConstants.PRESCRIPTION_STATUS_LABEL_HEADER_TEXT)).atIndex(0).tap()
    await expect(
      element(by.text(ReviewPrescriptionsE2eIdConstants.PRESCRIPTION_STATUS_LABEL_HEADER_TEXT)).atIndex(0),
    ).toBeVisible()
    await expect(
      element(by.label(ReviewPrescriptionsE2eIdConstants.PRESCRIPTION_STATUS_LABEL_BODY_LABEL)),
    ).toBeVisible()
    await element(by.id(ReviewPrescriptionsE2eIdConstants.PRESCRIPTION_BACK_ID)).tap()
  })

  it('should verify prescriptions help modal information', async () => {
    await element(by.id(ReviewPrescriptionsE2eIdConstants.PRESCRIPTION_HELP_BUTTON_ID)).tap()
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
    await element(by.id(ReviewPrescriptionsE2eIdConstants.PRESCRIPTION_BACK_ID)).tap()
  })

  it('should display the filter and sort menu', async () => {
    await element(by.id(ReviewPrescriptionsE2eIdConstants.PRESCRIPTION_FILTER_BUTTON_ID)).tap()
    await expect(element(by.text('All (5)'))).toExist()
    await expect(element(by.text('Active (55)'))).toExist()
    await expect(element(by.text('Discontinued (55)'))).toExist()
    await expect(element(by.text('Expired (55)'))).toExist()
    await expect(element(by.text('Pending (0)'))).toExist()
    await expect(element(by.text('Tracking (1)'))).toExist()
    await expect(element(by.text('Transferred (55)'))).toExist()
    await expect(element(by.text('Status Not Available (55)'))).toExist()

    await element(by.id(ReviewPrescriptionsE2eIdConstants.PRESCRIPTION_FILTER_MODAL_ID)).scrollTo('bottom')

    await expect(element(by.text('Fill date (newest to oldest)'))).toExist()
    await expect(element(by.text('Medication name (A to Z)'))).toExist()
    await expect(element(by.text('Refills left (least to most)'))).toExist()
    await expect(element(by.text('Status (A to Z)'))).toExist()
  })

  it('should sort the prescriptions by medication name', async () => {
    await element(by.text('Medication name (A to Z)')).tap()
    await element(by.id(ReviewPrescriptionsE2eIdConstants.PRESCRIPTION_FILTER_APPLY_ID)).tap()

    await expect(element(by.text(ReviewPrescriptionsE2eIdConstants.PRESCRIPTION_SORTED_NAME_FIRST))).toBeVisible()
    await element(by.id(CommonE2eIdConstants.PRESCRIPTION_HISTORY_SCROLL_ID)).scrollTo('bottom', 0.5, 0.5)
    await expect(element(by.text(ReviewPrescriptionsE2eIdConstants.PRESCRIPTION_SORTED_NAME_LAST))).toBeVisible()
  })
})

describeWithSetup('Review prescription details', () => {
  it('should verify prescription details information', async () => {
    await waitFor(element(by.label(ReviewPrescriptionsE2eIdConstants.PRESCRIPTION_HISTORY_SCROLL_TARGET)))
      .toBeVisible()
      .whileElement(by.id(CommonE2eIdConstants.PRESCRIPTION_HISTORY_SCROLL_ID))
      .scroll(50, 'down', 0.5, 0.5)

    await element(by.label(ReviewPrescriptionsE2eIdConstants.PRESCRIPTION_DETAILS_LABEL)).atIndex(0).tap()
    await expect(element(by.text('AMLODIPINE BESYLATE 10MG TAB'))).toExist()
    await expect(element(by.label('Prescription number 1 2 3 4 5 6 7'))).toExist()
    await expect(element(by.text(ReviewPrescriptionsE2eIdConstants.PRESCRIPTION_STATUS_LABEL_HEADER_TEXT))).toExist()
    await expect(element(by.text(ReviewPrescriptionsE2eIdConstants.PRESCRIPTION_INSTRUCTIONS_TEXT))).toExist()
    await expect(element(by.text('Refills left'))).toExist()
    await expect(element(by.text('5'))).toExist()
    await expect(element(by.text('Fill date'))).toExist()
    await expect(element(by.text('Date not available'))).toExist()
    await expect(element(by.text('Quantity'))).toExist()
    await expect(element(by.text('30'))).toExist()
    await expect(element(by.text('Expires on'))).toExist()
    await expect(element(by.text('10/28/2026'))).toExist()
    await expect(element(by.text('Ordered on'))).toExist()
    await expect(element(by.text('10/28/2025'))).toExist()
    await expect(element(by.text('VA facility'))).toExist()
    await expect(element(by.text('Test VA Medical Center'))).toExist()
  })

  it('should display status definition after status label in prescription details is tapped', async () => {
    await element(by.text(ReviewPrescriptionsE2eIdConstants.PRESCRIPTION_STATUS_LABEL_HEADER_TEXT)).atIndex(0).tap()
    await expect(
      element(by.text(ReviewPrescriptionsE2eIdConstants.PRESCRIPTION_STATUS_LABEL_HEADER_TEXT)).atIndex(0),
    ).toExist()
    await expect(element(by.label(ReviewPrescriptionsE2eIdConstants.PRESCRIPTION_STATUS_LABEL_BODY_LABEL))).toExist()
    await element(by.id(ReviewPrescriptionsE2eIdConstants.PRESCRIPTION_BACK_ID)).tap()
  })
})

describeWithSetup('Review prescription tracking information', () => {
  it('should filter out prescriptions without tracking information', async () => {
    await element(by.id(ReviewPrescriptionsE2eIdConstants.PRESCRIPTION_FILTER_BUTTON_ID)).tap()
    await element(by.text('Tracking (1)')).tap()
    await element(by.id(ReviewPrescriptionsE2eIdConstants.PRESCRIPTION_FILTER_APPLY_ID)).tap()

    await expect(element(by.text('Refills with tracking (1), sorted by status (A to Z)'))).toBeVisible()
    await expect(element(by.text('This list shows refills with current tracking information available.'))).toBeVisible()
    await expect(element(by.text('ACETAMINOPHEN 325MG TAB'))).toBeVisible()
  })

  it('verify prescription tracking item specific info', async () => {
    await element(by.id(CommonE2eIdConstants.PRESCRIPTION_HISTORY_SCROLL_ID)).scrollTo('bottom', 0.5, 0.5)
    await element(by.id(ReviewPrescriptionsE2eIdConstants.PRESCRIPTION_TRACKING_GET_TRACKING_ID)).atIndex(0).tap()
    await expect(element(by.label('Prescription number 2 7 2 0 1 9 2 A')).atIndex(0)).toExist()
    await expect(
      element(by.text(ReviewPrescriptionsE2eIdConstants.PRESCRIPTION_REFILL_REQUEST_DESCRIPTION_1_TEXT)),
    ).toExist()
    await expect(
      element(by.label(ReviewPrescriptionsE2eIdConstants.PRESCRIPTION_REFILL_REQUEST_DESCRIPTION_2_LABEL)),
    ).toExist()
    await expect(element(by.text('Package 1 of 2'))).toExist()
    await expect(element(by.text('Tracking number')).atIndex(0)).toExist()
    await expect(
      element(by.label(ReviewPrescriptionsE2eIdConstants.PRESCRIPTION_TRACKING_NUMBER)).atIndex(trackingIndex),
    ).toExist()
    await expect(element(by.text('Delivery service: UPS')).atIndex(0)).toExist()
    await expect(element(by.label('Date shipped: October 15, 2022')).atIndex(0)).toExist()
    await expect(element(by.text('Other prescriptions in this package:')).atIndex(0)).toExist()
    await expect(element(by.text('LAMIVUDINE 10MG TAB'))).toExist()
    await expect(element(by.label('Prescription number 2 3 3 6 8 0 0')).atIndex(0)).toExist()
  })

  it('verify tracking link works', async () => {
    await element(by.label(ReviewPrescriptionsE2eIdConstants.PRESCRIPTION_TRACKING_NUMBER)).atIndex(trackingIndex).tap()
    await expect(element(by.text(CommonE2eIdConstants.LEAVING_APP_POPUP_TEXT))).toExist()
    await element(by.text(CommonE2eIdConstants.LEAVING_APP_CANCEL_TEXT)).tap()
  })
})
