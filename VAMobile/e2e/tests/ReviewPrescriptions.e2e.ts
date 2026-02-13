/*
Description:
Detox script that follows the prescriptions test case found in testRail (VA Mobile App > RC Regression Test > Manual > Health Page Elements)
When to update:
This script should be updated whenever new things are added/changed in prescriptions or if anything is changed in src/store/api/demo/mocks/prescriptions.json.
*/
import { by, device, element, expect, waitFor } from 'detox'

import {
  CommonE2eIdConstants,
  changeDemoModeUser,
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
  PRESCRIPTION_ALL_NUMBER_OF_PRESCRIPTIONS_TEXT: 'All prescriptions (32), sorted by status (A to Z)',
  PRESCRIPTION_PENDING_NUMBER_OF_PRESCRIPTIONS_TEXT: 'Pending refills (8), sorted by status (A to Z)',
  PRESCRIPTION_TRACKING_NUMBER_OF_PRESCRIPTION_TEXT: 'Refills with tracking information (5)',
  PRESCRIPTION_REFILL_NUMBER_OF_PRESCRIPTION_TEXT: 'Prescriptions for refill (10)',
  PRESCRIPTION_PENDING_STATUS_LABEL_HEADER_TEXT: 'Active: Refill in process',
  PRESCRIPTION_STATUS_LABEL_HEADER_TEXT: 'Active',
  PRESCRIPTION_STATUS_LABEL_BODY_LABEL:
    'A prescription that can be filled at the local  V-A  pharmacy. If this prescription is refillable, you may request a refill of this  V-A  prescription.',
  PRESCRIPTION_INSTRUCTIONS_TEXT: 'TAKE ONE-HALF TABLET EVERY DAY FOR 30 DAYS',
  PRESCRIPTION_REFILLS_LEFT_TEXT: 'Refills left: 5',
  PRESCRIPTION_FILL_DATE_TEXT: 'Fill date: 06/06/2022',
  PRESCRIPTION_VA_FACILITY_TEXT: 'VA facility: SLC10 TEST LAB',
  PRESCRIPTION_DETAILS_LABEL: 'Get prescription details',
  PRESCRIPTION_PENDING_DESCRIPTION_LABEL:
    "This list shows refill requests you've submitted. It also shows refills the  V-A  pharmacy is processing.",
  PRESCRIPTION_TRACKING_GET_TRACKING_ID: 'getPrescriptionTrackingTestID',
  PRESCRIPTION_REFILL_NAME_TEXT: 'AMLODIPINE BESYLATE 10MG TAB',
  PRESCRIPTION_REFILL_REQUEST_TITLE_TEXT: 'Refill request',
  PRESCRIPTION_REFILL_REQUEST_DESCRIPTION_1_TEXT:
    "We share tracking information here for up to 15 days, even if you've received your prescription.",
  PRESCRIPTION_REFILL_REQUEST_DESCRIPTION_2_LABEL:
    "We'll mail your refills to the address on file at your local  V-A  Pharmacy.",
  PRESCRIPTION_REFILL_REQUEST_SUMMARY_TEXT: 'We got your refill requests',
  PRESCRIPTION_REFILL_REQUEST_SUMMARY_HEADER_TEXT: 'Refill request summary',
  PRESCRIPTION_REFILL_REQUEST_SUMMARY_WHATS_NEXT_HEADER_TEXT: "What's next",
  PRESCRIPTION_REFILL_REQUEST_SUMMARY_DESCRIPTION_1_LABEL:
    "We're reviewing your refill request. Once approved, the  V-A  pharmacy will process your refill.",
  PRESCRIPTION_REFILL_REQUEST_SUMMARY_DESCRIPTION_2_LABEL:
    'If you have questions about the status of your refill, contact your provider or local  V-A  pharmacy.',
  PRESCRIPTION_REFILL_REQUEST_SUMMARY_PENDING_BUTTON_TEXT: 'Go to all pending refills',
  PRESCRIPTION_REFILL_REQUEST_CONFIRMATION_TITLE_TEXT: 'Request prescription refill?',
  PRESCRIPTION_REFILL_REQUEST_CONFIRMATION_BUTTON_TEXT: 'Request refill',
  PRESCRIPTION_REFILL_REQUEST_CANCEL_TEXT: 'Cancel',
  PRESCRIPTION_BACK_ID: 'prescriptionsBackTestID',
  FILTER_PRESCRIPTIONS_TEST_ID: 'filterSortWrapperBoxTestID',
  PRESCRIPTION_GO_TO_MY_VA_HEALTH_LINK_ID: 'goToMyVAHealthPrescriptionHistoryID',
  PRESCRIPTION_DETAILS_BACK_ID: 'prescriptionsDetailsBackTestID',
  PRESCRIPTION_FILTER_CANCEL_ID: 'radioButtonCancelTestID',
  PRESCRIPTION_HELP_BUTTON_ID: 'prescriptionsHelpID',
  PRESCRIPTION_REQUEST_REFILL_ID: 'requestRefillsButtonID',
  DESIRED_DEMO_MODE_USER_ID: 'Dennis Madison option 5 of 5',
  PRESCRIPTION_SORTED_NAME_FIRST: 'ACETAMINOPHEN 325MG TAB',
  PRESCRIPTION_SORTED_NAME_LAST: 'ZIPRASIDONE HCL 40MG CAP',
}

const trackingIndex = device.getPlatform() === 'android' ? 0 : 1

const describeWithSetup = (name: string, fn: jest.EmptyFunction) => {
  describe(name, () => {
    beforeAll(async () => {
      await toggleRemoteConfigFlag(CommonE2eIdConstants.IN_APP_REVIEW_TOGGLE_TEXT)
      await toggleRemoteConfigFlag(CommonE2eIdConstants.IN_APP_FEEDBACK_TOGGLE_TEXT)
      await loginToDemoMode()
      await changeDemoModeUser(PrescriptionsE2eIdConstants.DESIRED_DEMO_MODE_USER_ID)
      await openHealth()
      await openPrescriptions()
    })
    afterAll(async () => {
      await device.launchApp({ newInstance: true, permissions: { notifications: 'YES' } })
    })
    fn()
  })
}

describeWithSetup('Review prescriptions list', () => {
  it('should match the prescription page design', async () => {
    await expect(element(by.id(CommonE2eIdConstants.PRESCRIPTION_REFILL_BUTTON_ID))).toExist()
    await expect(element(by.id(PrescriptionsE2eIdConstants.PRESCRIPTION_FILTER_BUTTON_ID))).toExist()
    await expect(element(by.label(PrescriptionsE2eIdConstants.PRESCRIPTION_ALL_DESCRIPTION_LABEL))).toExist()
    await expect(element(by.text(PrescriptionsE2eIdConstants.PRESCRIPTION_ALL_NUMBER_OF_PRESCRIPTIONS_TEXT))).toExist()

    await waitFor(element(by.label('CAPECITABINE 500MG TAB')))
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
    await expect(element(by.label(PrescriptionsE2eIdConstants.PRESCRIPTION_DETAILS_LABEL)).atIndex(0)).toBeVisible()
  })

  it('should verify prescriptions help modal information', async () => {
    await element(by.id(PrescriptionsE2eIdConstants.PRESCRIPTION_HELP_BUTTON_ID)).tap()
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

  it('should display the filter and sort menu', async () => {
    await element(by.id(PrescriptionsE2eIdConstants.PRESCRIPTION_FILTER_BUTTON_ID)).tap()
    await expect(element(by.text('All (32)'))).toExist()
    await expect(element(by.text('Active (24)'))).toExist()
    await expect(element(by.text('Discontinued (1)'))).toExist()
    await expect(element(by.text('Expired (4)'))).toExist()
    await expect(element(by.text('Pending (8)'))).toExist()
    await expect(element(by.text('Tracking (3)'))).toExist()
    await expect(element(by.text('Transferred (1)'))).toExist()
    await expect(element(by.text('Status Not Available (2)'))).toExist()

    await element(by.id(PrescriptionsE2eIdConstants.PRESCRIPTION_FILTER_MODAL_ID)).scrollTo('bottom')

    await expect(element(by.text('Fill date (newest to oldest)'))).toExist()
    await expect(element(by.text('Medication name (A to Z)'))).toExist()
    await expect(element(by.text('Refills left (least to most)'))).toExist()
    await expect(element(by.text('Status (A to Z)'))).toExist()
  })

  it('should sort the prescriptions by medication name', async () => {
    await element(by.text('Medication name (A to Z)')).tap()
    await element(by.id(PrescriptionsE2eIdConstants.PRESCRIPTION_FILTER_APPLY_ID)).tap()

    await expect(element(by.text(PrescriptionsE2eIdConstants.PRESCRIPTION_SORTED_NAME_FIRST))).toExist()
    await element(by.id(CommonE2eIdConstants.PRESCRIPTION_HISTORY_SCROLL_ID)).scrollTo('bottom')
    await element(by.id(CommonE2eIdConstants.NEXT_PAGE_ID)).tap()
    await element(by.id(CommonE2eIdConstants.PRESCRIPTION_HISTORY_SCROLL_ID)).scrollTo('bottom')
    await element(by.id(CommonE2eIdConstants.NEXT_PAGE_ID)).tap()
    await element(by.id(CommonE2eIdConstants.PRESCRIPTION_HISTORY_SCROLL_ID)).scrollTo('bottom')
    await element(by.id(CommonE2eIdConstants.NEXT_PAGE_ID)).tap()
    await element(by.id(CommonE2eIdConstants.PRESCRIPTION_HISTORY_SCROLL_ID)).scrollTo('bottom')
    await expect(element(by.text(PrescriptionsE2eIdConstants.PRESCRIPTION_SORTED_NAME_LAST))).toExist()
  })

  it('should display status definition after status label is tapped', async () => {
    await element(by.text(PrescriptionsE2eIdConstants.PRESCRIPTION_STATUS_LABEL_HEADER_TEXT)).atIndex(0).tap()
    await expect(
      element(by.text(PrescriptionsE2eIdConstants.PRESCRIPTION_STATUS_LABEL_HEADER_TEXT)).atIndex(0),
    ).toBeVisible()
    await expect(element(by.label(PrescriptionsE2eIdConstants.PRESCRIPTION_STATUS_LABEL_BODY_LABEL))).toBeVisible()
    await element(by.id(PrescriptionsE2eIdConstants.PRESCRIPTION_BACK_ID)).tap()
  })
})

describeWithSetup('Review prescription details', () => {
  it('should verify prescription details information', async () => {
    // Scroll until AMLODIPINE BESYLATE 10MG TAB is entirely in view
    await waitFor(element(by.label('CAPECITABINE 500MG TAB')))
      .toBeVisible()
      .whileElement(by.id(CommonE2eIdConstants.PRESCRIPTION_HISTORY_SCROLL_ID))
      .scroll(50, 'down', 0.5, 0.5)

    await element(by.label(PrescriptionsE2eIdConstants.PRESCRIPTION_DETAILS_LABEL)).atIndex(0).tap()
    await expect(element(by.text('AMLODIPINE BESYLATE 10MG TAB'))).toExist()
    await expect(element(by.label('Prescription number 3 6 3 6 7 1 1 A'))).toExist()
    await expect(element(by.text(PrescriptionsE2eIdConstants.PRESCRIPTION_STATUS_LABEL_HEADER_TEXT))).toExist()
    await expect(element(by.text('TAKE ONE-HALF TABLET EVERY DAY FOR 30 DAYS'))).toExist()
    await expect(element(by.text('Refills left'))).toExist()
    await expect(element(by.text('5'))).toExist()
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

  it('should display status definition after status label in prescription details is tapped', async () => {
    await element(by.text(PrescriptionsE2eIdConstants.PRESCRIPTION_STATUS_LABEL_HEADER_TEXT)).atIndex(0).tap()
    await expect(
      element(by.text(PrescriptionsE2eIdConstants.PRESCRIPTION_STATUS_LABEL_HEADER_TEXT)).atIndex(0),
    ).toExist()
    await expect(element(by.label(PrescriptionsE2eIdConstants.PRESCRIPTION_STATUS_LABEL_BODY_LABEL))).toExist()
    await element(by.id(PrescriptionsE2eIdConstants.PRESCRIPTION_BACK_ID)).tap()
  })
})

describeWithSetup('Review prescription tracking information', () => {
  it('should filter out prescriptions without tracking information', async () => {
    await element(by.id(PrescriptionsE2eIdConstants.PRESCRIPTION_FILTER_BUTTON_ID)).tap()
    await element(by.text('Tracking (3)')).tap()
    await element(by.id(PrescriptionsE2eIdConstants.PRESCRIPTION_FILTER_APPLY_ID)).tap()

    await expect(element(by.text('Refills with tracking (3), sorted by status (A to Z)'))).toBeVisible()
    await expect(element(by.text('This list shows refills with current tracking information available.'))).toBeVisible()
    await expect(element(by.text('CAPECITABINE 500MG TAB'))).toBeVisible()
  })

  it('verify prescription tracking item specific info', async () => {
    await waitFor(element(by.label('IDOQUINOL 650MG TAB')))
      .toBeVisible()
      .whileElement(by.id(CommonE2eIdConstants.PRESCRIPTION_HISTORY_SCROLL_ID))
      .scroll(500, 'down', 0.5, 0.5)
    await element(by.id(PrescriptionsE2eIdConstants.PRESCRIPTION_TRACKING_GET_TRACKING_ID)).atIndex(0).tap()
    await expect(element(by.label('Prescription number 3 6 3 6 7 3 6'))).toExist()
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
    await expect(element(by.label('7 5 3 4 5 3 3 6 3 6 8 5 6')).atIndex(trackingIndex)).toExist()
    await expect(element(by.text('Delivery service: DHL'))).toExist()
    await expect(element(by.label('Date shipped: June 14, 2022'))).toExist()
    await expect(element(by.text('Other prescriptions in this package:'))).toExist()
    await expect(element(by.text('LAMIVUDINE 10MG TAB'))).toExist()
    await expect(element(by.label('Prescription number 2 3 3 6 8 0 0'))).toExist()
    await expect(element(by.text('ZIDOVUDINE 1MG CAP'))).toExist()
    await expect(element(by.label('Prescription number None noted')).atIndex(0)).toExist()
  })

  it('verify tracking link for DHL works', async () => {
    await element(by.label('7 5 3 4 5 3 3 6 3 6 8 5 6')).atIndex(trackingIndex).tap()
    await element(by.text(CommonE2eIdConstants.LEAVING_APP_LEAVE_TEXT)).tap()
    await device.launchApp({ newInstance: false })
    await element(by.id(PrescriptionsE2eIdConstants.PRESCRIPTION_BACK_ID)).tap()
  })

  it('verify tracking info for multiple packages', async () => {
    await element(by.id(CommonE2eIdConstants.PRESCRIPTION_HISTORY_SCROLL_ID)).scrollTo('bottom')
    await element(by.id(PrescriptionsE2eIdConstants.PRESCRIPTION_TRACKING_GET_TRACKING_ID)).atIndex(2).tap()
    await expect(element(by.text('Package 1 of 2'))).toExist()
    await expect(element(by.text('Delivery service: UPS'))).toExist()
    await expect(element(by.text('Package 2 of 2'))).toExist()
    await expect(element(by.text('Delivery service: USPS'))).toExist()
  })
})
