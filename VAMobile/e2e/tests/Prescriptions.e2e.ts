/*
Description:
Detox script that follows the prescriptions test case found in testRail (VA Mobile App > RC Regression Test > Manual > Health Page Elements)
When to update:
This script should be updated whenever new things are added/changed in prescriptions or if anything is changed in src/store/api/demo/mocks/prescriptions.json.
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
  PRESCRIPTION_REFILL_WARNING_ID: 'prescriptionRefillWarningTestID',
  PRESCRIPTION_ALL_DESCRIPTION_LABEL:
    'This list only shows prescriptions filled by  V-A  pharmacies and may not include all your medications.',
  PRESCRIPTION_ALL_NUMBER_OF_PRESCRIPTIONS_TEXT: 'All prescriptions (31), sorted by status (A to Z)',
  PRESCRIPTION_PENDING_NUMBER_OF_PRESCRIPTIONS_TEXT: 'Pending refills (8), sorted by status (A to Z)',
  PRESCRIPTION_TRACKING_NUMBER_OF_PRESCRIPTION_TEXT: 'Refills with tracking information (5)',
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
  PRESCRIPTION_REFILL_REQUEST_SUMMARY_TEXT: 'We got your refill requests',
  PRESCRIPTION_REFILL_REQUEST_SUMMARY_HEADER_TEXT: 'Refill request summary',
  PRESCRIPTION_REFILL_REQUEST_SUMMARY_NAME_TEXT: 'AMLODIPINE BESYLATE 10MG TAB',
  PRESCRIPTION_REFILL_REQUEST_SUMMARY_DESCRIPTION_1_LABEL:
    "We're reviewing your refill request. Once approved, the  V-A  pharmacy will process your refill.",
  PRESCRIPTION_REFILL_REQUEST_SUMMARY_DESCRIPTION_2_LABEL:
    'If you have questions about the status of your refill, contact your provider or local  V-A  pharmacy.',
  PRESCRIPTION_REFILL_REQUEST_SUMMARY_PENDING_BUTTON_TEXT: 'Go to all pending refills',
  PRESCRIPTION_BACK_ID: 'prescriptionsBackTestID',
  FILTER_PRESCRIPTIONS_TEST_ID: 'filterSortWrapperBoxTestID',
  PRESCRIPTION_GO_TO_MY_VA_HEALTH_LINK_ID: 'goToMyVAHealthPrescriptionHistoryID',
  PRESCRIPTION_DETAILS_BACK_ID: 'prescriptionsDetailsBackTestID',
  PRESCRIPTION_FILTER_CANCEL_ID: 'radioButtonCancelTestID',
  PRESCRIPTION_HELP_BUTTON_ID: 'prescriptionsHelpID',
  PRESCRIPTION_REQUEST_REFILL_ID: 'requestRefillsButtonID',
}

let tempPath

// const trackingIndex = device.getPlatform() === 'android' ? 0 : 1
const trackingIndex = 0

beforeAll(async () => {
  await toggleRemoteConfigFlag(CommonE2eIdConstants.IN_APP_REVIEW_TOGGLE_TEXT)
  await loginToDemoMode()
  await openHealth()
  await openPrescriptions()
})

/*
Validates and tests the sort prescription options
param name: String name of the sort option
param first Prescription: String name of the first prescription that appears in the list once the sort option is selected
param last Prescription: String name of the last prescription that appears in the list once the sort option is selected
param first Instance: Boolean value that tells the test to scroll to the top so the filter and sort button is displayed
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
      await element(by.text('All (31)')).atIndex(0).tap()
      await element(by.id(PrescriptionsE2eIdConstants.PRESCRIPTION_FILTER_APPLY_ID)).tap()
    } else {
      await element(by.id(CommonE2eIdConstants.PRESCRIPTION_HISTORY_SCROLL_ID)).swipe('up', 'fast', 1.0)
      await element(by.id(CommonE2eIdConstants.PRESCRIPTION_HISTORY_SCROLL_ID)).swipe('up', 'fast', 1.0)
      await element(by.id(CommonE2eIdConstants.PREVIOUS_PAGE_ID)).tap()
      await element(by.id(CommonE2eIdConstants.PRESCRIPTION_HISTORY_SCROLL_ID)).swipe('up', 'fast', 1.0)
      await element(by.id(CommonE2eIdConstants.PRESCRIPTION_HISTORY_SCROLL_ID)).swipe('up', 'fast', 1.0)
      await element(by.id(CommonE2eIdConstants.PRESCRIPTION_HISTORY_SCROLL_ID)).swipe('up', 'fast', 1.0)
      await element(by.id(CommonE2eIdConstants.PREVIOUS_PAGE_ID)).tap()
      await element(by.id(CommonE2eIdConstants.PRESCRIPTION_HISTORY_SCROLL_ID)).swipe('up', 'fast', 1.0)
      await element(by.id(CommonE2eIdConstants.PRESCRIPTION_HISTORY_SCROLL_ID)).swipe('up', 'fast', 1.0)
      await element(by.id(CommonE2eIdConstants.PRESCRIPTION_HISTORY_SCROLL_ID)).swipe('up', 'fast', 1.0)
      await element(by.id(CommonE2eIdConstants.PREVIOUS_PAGE_ID)).tap()
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
    await element(by.id(CommonE2eIdConstants.PRESCRIPTION_HISTORY_SCROLL_ID)).swipe('up', 'fast', 1.0)
    await element(by.id(CommonE2eIdConstants.PRESCRIPTION_HISTORY_SCROLL_ID)).swipe('up', 'fast', 1.0)
    await element(by.id(CommonE2eIdConstants.PRESCRIPTION_HISTORY_SCROLL_ID)).swipe('up', 'fast', 1.0)
    await element(by.id(CommonE2eIdConstants.NEXT_PAGE_ID)).tap()
    await element(by.id(CommonE2eIdConstants.PRESCRIPTION_HISTORY_SCROLL_ID)).swipe('up', 'fast', 1.0)
    await element(by.id(CommonE2eIdConstants.PRESCRIPTION_HISTORY_SCROLL_ID)).swipe('up', 'fast', 1.0)
    await element(by.id(CommonE2eIdConstants.PRESCRIPTION_HISTORY_SCROLL_ID)).swipe('up', 'fast', 1.0)
    await element(by.id(CommonE2eIdConstants.NEXT_PAGE_ID)).tap()
    await element(by.id(CommonE2eIdConstants.PRESCRIPTION_HISTORY_SCROLL_ID)).swipe('up', 'fast', 1.0)
    await element(by.id(CommonE2eIdConstants.PRESCRIPTION_HISTORY_SCROLL_ID)).swipe('up', 'fast', 1.0)
    await element(by.id(CommonE2eIdConstants.PRESCRIPTION_HISTORY_SCROLL_ID)).swipe('up', 'fast', 1.0)
    await element(by.id(CommonE2eIdConstants.NEXT_PAGE_ID)).tap()
    await expect(element(by.text(lastPrescription))).toBeVisible()
  })
}

/*
Validates and tests the filter prescription options
param name: String name of the filter option
param quantity: Number of prescriptions expected for a specific filter option
param helperText: Optional string name of the helper text for the filter option
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
    await expect(element(by.id(PrescriptionsE2eIdConstants.PRESCRIPTION_REFILL_WARNING_ID))).toExist()
    await expect(element(by.label(PrescriptionsE2eIdConstants.PRESCRIPTION_ALL_DESCRIPTION_LABEL))).toExist()
    await expect(element(by.text(PrescriptionsE2eIdConstants.PRESCRIPTION_ALL_NUMBER_OF_PRESCRIPTIONS_TEXT))).toExist()
    await waitFor(element(by.label('CAPECITABINE 500MG TAB.')))
      .toBeVisible()
      .whileElement(by.id(CommonE2eIdConstants.PRESCRIPTION_HISTORY_SCROLL_ID))
      .scroll(100, 'down')
    await expect(
      element(by.text(PrescriptionsE2eIdConstants.PRESCRIPTION_STATUS_LABEL_HEADER_TEXT)).atIndex(0),
    ).toBeVisible()
    await expect(element(by.text(PrescriptionsE2eIdConstants.PRESCRIPTION_INSTRUCTIONS_TEXT)).atIndex(0)).toBeVisible()
    await expect(element(by.text(PrescriptionsE2eIdConstants.PRESCRIPTION_REFILLS_LEFT_TEXT)).atIndex(0)).toBeVisible()
    await expect(element(by.text(PrescriptionsE2eIdConstants.PRESCRIPTION_FILL_DATE_TEXT)).atIndex(0)).toBeVisible()
    await expect(element(by.text(PrescriptionsE2eIdConstants.PRESCRIPTION_VA_FACILITY_TEXT)).atIndex(0)).toBeVisible()
    await expect(element(by.label(PrescriptionsE2eIdConstants.PRESCRIPTION_DETAILS_LABEL)).atIndex(0)).toBeVisible()
  })

  it('verify prescription refill warning label information', async () => {
    await element(by.id(CommonE2eIdConstants.PRESCRIPTION_HISTORY_SCROLL_ID)).scrollTo('top')
    await element(by.id(PrescriptionsE2eIdConstants.PRESCRIPTION_REFILL_WARNING_ID)).tap()
    await expect(element(by.text("We can't refill some of your prescriptions in the app"))).toExist()
    await expect(element(by.label('Some  V-A  health facilities use a new electronic health record system.'))).toExist()
    await expect(
      element(
        by.label(
          'Prescriptions affected by this change have a "Transferred" status. You can manage your prescriptions at these facilities using the My  V-A  Health portal.',
        ),
      ),
    ).toExist()
    await expect(element(by.id(PrescriptionsE2eIdConstants.PRESCRIPTION_GO_TO_MY_VA_HEALTH_LINK_ID))).toExist()
    await element(by.id(PrescriptionsE2eIdConstants.PRESCRIPTION_GO_TO_MY_VA_HEALTH_LINK_ID)).tap()
    await element(by.text(CommonE2eIdConstants.LEAVING_APP_LEAVE_TEXT)).tap()
    await setTimeout(5000)
    await device.takeScreenshot('PrescriptionVAHealthLink')
    await device.launchApp({ newInstance: false })
    await element(by.text("We can't refill some of your prescriptions in the app")).tap()
  })

  it('verify status label information', async () => {
    await element(by.text(PrescriptionsE2eIdConstants.PRESCRIPTION_STATUS_LABEL_HEADER_TEXT)).atIndex(0).tap()
    await expect(
      element(by.text(PrescriptionsE2eIdConstants.PRESCRIPTION_STATUS_LABEL_HEADER_TEXT)).atIndex(0),
    ).toExist()
    await expect(element(by.label(PrescriptionsE2eIdConstants.PRESCRIPTION_STATUS_LABEL_BODY_LABEL))).toExist()
    await element(by.id(PrescriptionsE2eIdConstants.PRESCRIPTION_BACK_ID)).tap()
  })

  it('verify prescription details information', async () => {
    await waitFor(element(by.label('CAPECITABINE 500MG TAB.')))
      .toBeVisible()
      .whileElement(by.id(CommonE2eIdConstants.PRESCRIPTION_HISTORY_SCROLL_ID))
      .scroll(50, 'down')
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

  it('prescription details: verify status label information', async () => {
    await element(by.text(PrescriptionsE2eIdConstants.PRESCRIPTION_STATUS_LABEL_HEADER_TEXT)).atIndex(0).tap()
    await expect(
      element(by.text(PrescriptionsE2eIdConstants.PRESCRIPTION_STATUS_LABEL_HEADER_TEXT)).atIndex(0),
    ).toExist()
    await expect(element(by.label(PrescriptionsE2eIdConstants.PRESCRIPTION_STATUS_LABEL_BODY_LABEL))).toExist()
    await element(by.id(PrescriptionsE2eIdConstants.PRESCRIPTION_BACK_ID)).tap()
    await element(by.id(PrescriptionsE2eIdConstants.PRESCRIPTION_DETAILS_BACK_ID)).tap()
  })

  validateFilter('Active', 24, 'Includes these statuses: On hold, Parked, Refill in process, and Submitted')
  validateFilter('Discontinued', 1)
  validateFilter('Expired', 4)
  validateFilter('Pending', 8, 'Includes refill requests you submitted and refills the VA pharmacy is processing')
  validateFilter('Tracking', 3, 'Includes refills with current tracking information available')
  validateFilter('Transferred', 1)
  validateFilter('Unknown', 1)
  validateFilter('All', 31)

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
    await expect(element(by.label(PrescriptionsE2eIdConstants.PRESCRIPTION_DETAILS_LABEL)).atIndex(0)).toExist()
  })

  it('pending: verify filters', async () => {
    await element(by.id(PrescriptionsE2eIdConstants.PRESCRIPTION_FILTER_BUTTON_ID)).tap()
    await expect(element(by.text('All (31)'))).toExist()
    await expect(element(by.text('Active (24)'))).toExist()
    await expect(element(by.text('Discontinued (1)'))).toExist()
    await expect(element(by.text('Expired (4)'))).toExist()
    await expect(element(by.text('Pending (8)'))).toExist()
    await expect(element(by.text('Tracking (3)'))).toExist()
    await expect(element(by.text('Transferred (1)'))).toExist()
    await expect(element(by.text('Unknown (1)'))).toExist()
    await element(by.id(PrescriptionsE2eIdConstants.PRESCRIPTION_FILTER_CANCEL_ID)).tap()
  })

  it('verify prescription tracking item specific info', async () => {
    await waitFor(element(by.label('CITALOPRAM HYDROBROMIDE 20MG TAB.')))
      .toBeVisible()
      .whileElement(by.id(CommonE2eIdConstants.PRESCRIPTION_HISTORY_SCROLL_ID))
      .scroll(500, 'down')
    await element(by.id(PrescriptionsE2eIdConstants.PRESCRIPTION_TRACKING_GET_TRACKING_ID)).atIndex(0).tap()
    await expect(element(by.label('Prescription number 3 6 3 6 8 5 6'))).toExist()
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
    await expect(element(by.label('Prescription number None noted'))).toExist()
  })

  it('verify tracking link for DHL works', async () => {
    await element(by.id('trackingLink')).tap()
    await element(
      by.label(CommonE2eIdConstants.LEAVING_APP_LEAVE_TEXT).and(by.type('_UIAlertControllerActionView')),
    ).tap()
    await setTimeout(5000)
    await device.takeScreenshot('PrescriptionTrackingWebsiteDHL')
    await device.launchApp({ newInstance: false })
    await element(by.id(PrescriptionsE2eIdConstants.PRESCRIPTION_BACK_ID)).tap()
  })

  it('verify tracking link for FEDEX works', async () => {
    await waitFor(element(by.label('LAMIVUDINE 100MG TAB.')))
      .toBeVisible()
      .whileElement(by.id(CommonE2eIdConstants.PRESCRIPTION_HISTORY_SCROLL_ID))
      .scroll(500, 'down')
    await element(by.id(PrescriptionsE2eIdConstants.PRESCRIPTION_TRACKING_GET_TRACKING_ID)).atIndex(1).tap()
    await expect(element(by.text('Delivery service: FEDEX'))).toExist()
    await element(by.id('trackingLink')).tap()
    await element(
      by.label(CommonE2eIdConstants.LEAVING_APP_LEAVE_TEXT).and(by.type('_UIAlertControllerActionView')),
    ).tap()
    await setTimeout(5000)
    await device.takeScreenshot('PrescriptionTrackingWebsiteFedex')
    await device.launchApp({ newInstance: false })
    await element(by.id(PrescriptionsE2eIdConstants.PRESCRIPTION_BACK_ID)).tap()
  })

  it('verify tracking info for multiple packages', async () => {
    await waitFor(element(by.label('LAMIVUDINE 150MG/ZIDOVUDINE 300MG TAB.')))
      .toBeVisible()
      .whileElement(by.id(CommonE2eIdConstants.PRESCRIPTION_HISTORY_SCROLL_ID))
      .scroll(500, 'down')
    await element(by.id(PrescriptionsE2eIdConstants.PRESCRIPTION_TRACKING_GET_TRACKING_ID)).atIndex(2).tap()
    await expect(element(by.text('Package 1 of 2'))).toExist()
    await expect(element(by.text('Delivery service: UPS'))).toExist()
    await expect(element(by.text('Package 2 of 2'))).toExist()
    await expect(element(by.text('Delivery service: USPS'))).toExist()
  })

  it(':android: verify tracking link for UPS works', async () => {
    await element(by.label('7 7 2 9 8 0 2 7 2 0 3 9 8 0 0 0 0 0 0 0 3 9 8')).atIndex(trackingIndex).tap()
    await element(by.text(CommonE2eIdConstants.LEAVING_APP_LEAVE_TEXT)).tap()
    await setTimeout(5000)
    await device.takeScreenshot('PrescriptionTrackingWebsiteUPS')
    await device.launchApp({ newInstance: true, permissions: { location: 'always' } })
    await loginToDemoMode()
    await openHealth()
    await openPrescriptions()
    await waitFor(element(by.label('LAMIVUDINE 150MG/ZIDOVUDINE 300MG TAB.')))
      .toBeVisible()
      .whileElement(by.id(CommonE2eIdConstants.PRESCRIPTION_HISTORY_SCROLL_ID))
      .scroll(500, 'down')
    await element(by.id(PrescriptionsE2eIdConstants.PRESCRIPTION_TRACKING_GET_TRACKING_ID)).atIndex(2).tap()
  })

  it('verify tracking link for USPS works', async () => {
    await element(by.id('refillTrackingDetailsTestID')).scrollTo('bottom')
    await element(by.label('9 2 0 5   5 0 0 0   0 0 0 0   0 0 0 0   0 0 0 0   0 0')).atIndex(trackingIndex).tap()
    await element(by.text(CommonE2eIdConstants.LEAVING_APP_LEAVE_TEXT)).tap()
    await setTimeout(5000)
    await device.takeScreenshot('PrescriptionTrackingWebsiteUSPS')
    await device.launchApp({ newInstance: false })
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

  it('verify refill request screen information', async () => {
    await element(by.id(CommonE2eIdConstants.PRESCRIPTION_HISTORY_SCROLL_ID)).scrollTo('top')
    await element(by.id(CommonE2eIdConstants.PRESCRIPTION_REFILL_BUTTON_ID)).tap()
    await expect(element(by.text('Refill request'))).toExist()
    await expect(element(by.text('Request refills at least 15 days before you need more medication.'))).toExist()
    await expect(
      element(by.text("We'll mail your refills to the address on file at your local VA Pharmacy.")),
    ).toExist()
    await expect(element(by.text('Prescriptions for refill (10)'))).toExist()
    await expect(element(by.label('0 of 10 selected'))).toExist()
    await expect(element(by.text('Select all'))).toExist()
    await expect(element(by.text(PrescriptionsE2eIdConstants.PRESCRIPTION_REFILL_NAME_TEXT)).atIndex(0)).toExist()
    await expect(element(by.label('Prescription number 3 6 3 6 7 1 1 A.')).atIndex(0)).toExist()
    await expect(element(by.label('Refills left: 5.')).atIndex(0)).toExist()
    await expect(element(by.label('Fill date June 06, 2022.')).atIndex(0)).toExist()
    await expect(element(by.label(' V-A  facility: SLC10 TEST LAB.')).atIndex(0)).toExist()
  })

  it('verify error when nothing is selected for request refills', async () => {
    await element(by.id(PrescriptionsE2eIdConstants.PRESCRIPTION_REQUEST_REFILL_ID)).tap()
    await expect(element(by.text('Please select a prescription'))).toExist()
  })

  it('verify action sheet for request refill', async () => {
    await element(by.text(PrescriptionsE2eIdConstants.PRESCRIPTION_REFILL_NAME_TEXT)).atIndex(0).tap()
    await element(by.id(PrescriptionsE2eIdConstants.PRESCRIPTION_REQUEST_REFILL_ID)).tap()
    await expect(element(by.text('Request prescription refill?'))).toExist()
    if (device.getPlatform() === 'android') {
      await element(by.text('Cancel ')).tap()
    } else {
      await element(by.label('Cancel')).atIndex(1).tap()
    }
  })

  it('verify refill request summary screen information', async () => {
    await element(by.id(PrescriptionsE2eIdConstants.PRESCRIPTION_REQUEST_REFILL_ID)).tap()
    await element(by.text(CommonE2eIdConstants.PRESCRIPTION_REFILL_DIALOG_YES_TEXT)).tap()
    await expect(element(by.text(PrescriptionsE2eIdConstants.PRESCRIPTION_REFILL_REQUEST_SUMMARY_TEXT))).toExist()
    await expect(
      element(by.text(PrescriptionsE2eIdConstants.PRESCRIPTION_REFILL_REQUEST_SUMMARY_HEADER_TEXT)),
    ).toExist()
    await expect(
      element(by.text(PrescriptionsE2eIdConstants.PRESCRIPTION_REFILL_REQUEST_SUMMARY_NAME_TEXT)).atIndex(0),
    ).toExist()
    await expect(
      element(by.label(PrescriptionsE2eIdConstants.PRESCRIPTION_REFILL_REQUEST_SUMMARY_DESCRIPTION_1_LABEL)),
    ).toExist()
    await expect(
      element(by.label(PrescriptionsE2eIdConstants.PRESCRIPTION_REFILL_REQUEST_SUMMARY_DESCRIPTION_2_LABEL)),
    ).toExist()
    await expect(
      element(by.text(PrescriptionsE2eIdConstants.PRESCRIPTION_REFILL_REQUEST_SUMMARY_PENDING_BUTTON_TEXT)),
    ).toExist()
  })

  it('verify pending prescriptions are displayed on pending refills button tap', async () => {
    await element(by.text(PrescriptionsE2eIdConstants.PRESCRIPTION_REFILL_REQUEST_SUMMARY_PENDING_BUTTON_TEXT)).tap()
    await expect(element(by.label(PrescriptionsE2eIdConstants.PRESCRIPTION_PENDING_DESCRIPTION_LABEL))).toExist()
    await expect(
      element(by.text(PrescriptionsE2eIdConstants.PRESCRIPTION_PENDING_NUMBER_OF_PRESCRIPTIONS_TEXT)),
    ).toExist()
  })

  it('verify user can request refill from get prescriptions details', async () => {
    await element(by.id(PrescriptionsE2eIdConstants.PRESCRIPTION_FILTER_BUTTON_ID)).tap()
    await element(by.text('Active (24)')).atIndex(0).tap()
    await element(by.id(PrescriptionsE2eIdConstants.PRESCRIPTION_FILTER_APPLY_ID)).tap()
    await waitFor(element(by.label('CAPECITABINE 500MG TAB.')))
      .toBeVisible()
      .whileElement(by.id(CommonE2eIdConstants.PRESCRIPTION_HISTORY_SCROLL_ID))
      .scroll(500, 'down')
    await element(by.label(PrescriptionsE2eIdConstants.PRESCRIPTION_DETAILS_LABEL)).atIndex(0).tap()
    await element(by.id(PrescriptionsE2eIdConstants.PRESCRIPTION_REQUEST_REFILL_ID)).tap()
    await element(by.text(CommonE2eIdConstants.PRESCRIPTION_REFILL_DIALOG_YES_TEXT)).tap()
    await expect(element(by.text(PrescriptionsE2eIdConstants.PRESCRIPTION_REFILL_REQUEST_SUMMARY_TEXT))).toExist()
    await expect(
      element(by.text(PrescriptionsE2eIdConstants.PRESCRIPTION_REFILL_REQUEST_SUMMARY_HEADER_TEXT)),
    ).toExist()
    await expect(
      element(by.text(PrescriptionsE2eIdConstants.PRESCRIPTION_REFILL_REQUEST_SUMMARY_NAME_TEXT)).atIndex(0),
    ).toExist()
    await expect(
      element(by.label(PrescriptionsE2eIdConstants.PRESCRIPTION_REFILL_REQUEST_SUMMARY_DESCRIPTION_1_LABEL)),
    ).toExist()
    await expect(
      element(by.label(PrescriptionsE2eIdConstants.PRESCRIPTION_REFILL_REQUEST_SUMMARY_DESCRIPTION_2_LABEL)),
    ).toExist()
    await expect(
      element(by.text(PrescriptionsE2eIdConstants.PRESCRIPTION_REFILL_REQUEST_SUMMARY_PENDING_BUTTON_TEXT)),
    ).toExist()
  })

  it('verify tapping close from refill request summary', async () => {
    await element(by.id(PrescriptionsE2eIdConstants.PRESCRIPTION_BACK_ID)).tap()
    await expect(element(by.text('AMLODIPINE BESYLATE 10MG TAB'))).toExist()
  })

  validateSort('Fill date (newest to oldest)', 'LAMIVUDINE 100MG TAB', 'OLANZAPINE 10MG RAPID DISINTEGRATING TAB', true)
  validateSort('Medication name (A to Z)', 'ACETAMINOPHEN 325MG TAB', 'ZIPRASIDONE HCL 40MG CAP')
  validateSort('Refills left (least to most)', 'ATORVASTATIN CALCIUM 10MG TAB', 'BERNA VACCINE CAP B/P')
  validateSort('Status (A to Z)', 'AMLODIPINE BESYLATE 10MG TAB', 'LAMIVUDINE 10MG TAB')
})
