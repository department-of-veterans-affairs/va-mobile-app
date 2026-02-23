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
  DESIRED_DEMO_MODE_USER_ID: 'John Monroe',
  PRESCRIPTION_BACK_ID: 'prescriptionsBackTestID',
  PRESCRIPTION_DETAILS_LABEL: 'Get prescription details',
  PRESCRIPTION_FILL_DATE_TEXT: 'Fill date: 06/06/2022',
  PRESCRIPTION_HELP_BUTTON_ID: 'prescriptionsHelpID',
  PRESCRIPTION_PENDING_DESCRIPTION_LABEL:
    "This list shows refill requests you've submitted. It also shows refills the  V-A  pharmacy is processing.",
  PRESCRIPTION_PENDING_NUMBER_OF_PRESCRIPTIONS_TEXT: 'Pending refills (8), sorted by status (A to Z)',
  PRESCRIPTION_PENDING_STATUS_LABEL_HEADER_TEXT: 'Active: Refill in process',
  PRESCRIPTION_REFILL_NAME_TEXT: 'AMLODIPINE BESYLATE 10MG TAB',
  PRESCRIPTION_REFILL_NUMBER_OF_PRESCRIPTION_TEXT: 'Prescriptions for refill (10)',
  PRESCRIPTION_REFILL_REQUEST_CANCEL_TEXT: device.getPlatform() === 'android' ? 'Cancel ' : 'Cancel',
  PRESCRIPTION_REFILL_REQUEST_CONFIRMATION_BUTTON_TEXT:
    device.getPlatform() === 'android' ? 'Request refill ' : 'Request Refill',
  PRESCRIPTION_REFILL_REQUESTS_CONFIRMATION_BUTTON_TEXT:
    device.getPlatform() === 'android' ? 'Request refills ' : 'Request Refills',
  PRESCRIPTION_REFILL_REQUEST_CONFIRMATION_TITLE_TEXT: 'Request prescription refill?',
  PRESCRIPTION_REFILL_REQUEST_DESCRIPTION_1_TEXT: 'Request refills at least 15 days before you need more medication.',
  PRESCRIPTION_REFILL_REQUEST_DESCRIPTION_2_LABEL:
    "We'll mail your refills to the address on file at your local VA Pharmacy.",
  PRESCRIPTION_REFILL_REQUEST_SUMMARY_DESCRIPTION_1_LABEL:
    "We're reviewing your refill request. Once approved, the  V-A  pharmacy will process your refill.",
  PRESCRIPTION_REFILL_REQUEST_SUMMARY_DESCRIPTION_2_LABEL:
    'If you have questions about the status of your refill, contact your provider or local  V-A  pharmacy.',
  PRESCRIPTION_REFILL_REQUEST_SUMMARY_HEADER_TEXT: 'Refill request summary',
  PRESCRIPTION_REFILL_REQUEST_SUMMARY_PENDING_BUTTON_TEXT: 'Go to all pending refills',
  PRESCRIPTION_REFILL_REQUEST_SUMMARY_TEXT: 'We got your refill requests',
  PRESCRIPTION_REFILL_REQUEST_SUMMARY_WHATS_NEXT_HEADER_TEXT: 'What’s next',
  PRESCRIPTION_REFILL_REQUEST_TITLE_TEXT: 'Refill request',
  PRESCRIPTION_REFILLS_LEFT_TEXT: 'Refills left: 5',
  PRESCRIPTION_REQUEST_REFILL_ID: 'requestRefillsButtonID',
  PRESCRIPTION_FLOATING_REQUEST_REFILL_BUTTON_TEXT: 'Start refill request',
  PRESCRIPTION_STATUS_LABEL_BODY_LABEL:
    'A prescription that can be filled at the local  V-A  pharmacy. If this prescription is refillable, you may request a refill of this  V-A  prescription.',
  PRESCRIPTION_TRACKING_GET_TRACKING_ID: 'getPrescriptionTrackingTestID',
  PRESCRIPTION_VA_FACILITY_TEXT: 'VA facility: SLC10 TEST LAB',
  PRESCRIPTION_DETAILS_SCREEN_ID: 'prescriptionDetailsScreenID',
  REFILL_REQUEST_SCREEN_ID: 'refillScreenID',
}

const describeWithSetup = (name: string, fn: jest.EmptyFunction) => {
  describe(name, () => {
    beforeAll(async () => {
      await openHealth()
      await openPrescriptions()
    })
    afterAll(async () => {
      await device.launchApp({ newInstance: true, permissions: { notifications: 'YES' } })
      await loginToDemoMode()
    })
    fn()
  })
}

const cancelRequest = async (screenId: string) => {
  if (device.getPlatform() === 'android') {
    await element(by.text(PrescriptionsE2eIdConstants.PRESCRIPTION_REFILL_REQUEST_CANCEL_TEXT)).tap()
  } else {
    await element(by.id(screenId)).tap({ x: 200, y: 200 })
  }
}

beforeAll(async () => {
  await toggleRemoteConfigFlag(CommonE2eIdConstants.IN_APP_REVIEW_TOGGLE_TEXT)
  await loginToDemoMode()
  await changeDemoModeUser(PrescriptionsE2eIdConstants.DESIRED_DEMO_MODE_USER_ID)
})

describeWithSetup('Start a refill request for a single prescription', () => {
  it('should display confirmation modal when refill request button is pressed in prescription details', async () => {
    // Scroll until AMLODIPINE BESYLATE 10MG TAB is entirely in view
    await waitFor(element(by.label('CAPECITABINE 500MG TAB')))
      .toBeVisible()
      .whileElement(by.id(CommonE2eIdConstants.PRESCRIPTION_HISTORY_SCROLL_ID))
      .scroll(50, 'down', 0.5, 0.5)

    await element(by.label(PrescriptionsE2eIdConstants.PRESCRIPTION_DETAILS_LABEL)).atIndex(0).tap()
    await expect(element(by.text('AMLODIPINE BESYLATE 10MG TAB'))).toExist()
    await element(by.id(PrescriptionsE2eIdConstants.PRESCRIPTION_REQUEST_REFILL_ID)).tap()
    await expect(
      element(by.text(PrescriptionsE2eIdConstants.PRESCRIPTION_REFILL_REQUEST_CONFIRMATION_TITLE_TEXT)),
    ).toExist()
    await expect(
      element(by.text(PrescriptionsE2eIdConstants.PRESCRIPTION_REFILL_REQUEST_CONFIRMATION_BUTTON_TEXT)),
    ).toExist()
  })

  it('should close the confirmation modal when cancel is pressed', async () => {
    await cancelRequest(PrescriptionsE2eIdConstants.PRESCRIPTION_DETAILS_SCREEN_ID)
    await expect(
      element(by.text(PrescriptionsE2eIdConstants.PRESCRIPTION_REFILL_REQUEST_CONFIRMATION_TITLE_TEXT)),
    ).not.toExist()
  })

  it('should correctly display the refill request summary when request is successful', async () => {
    await element(by.id(PrescriptionsE2eIdConstants.PRESCRIPTION_REQUEST_REFILL_ID)).tap()
    await element(by.text(PrescriptionsE2eIdConstants.PRESCRIPTION_REFILL_REQUEST_CONFIRMATION_BUTTON_TEXT)).tap()

    await expect(
      element(by.text(PrescriptionsE2eIdConstants.PRESCRIPTION_REFILL_REQUEST_TITLE_TEXT)).atIndex(0),
    ).toExist()
    await expect(element(by.text(PrescriptionsE2eIdConstants.PRESCRIPTION_REFILL_REQUEST_SUMMARY_TEXT))).toExist()
    await expect(
      element(by.text(PrescriptionsE2eIdConstants.PRESCRIPTION_REFILL_REQUEST_SUMMARY_HEADER_TEXT)),
    ).toExist()
    await expect(element(by.text('AMLODIPINE BESYLATE 10MG TAB')).atIndex(0)).toExist()
    await expect(element(by.label('Prescription number 3 6 3 6 7 1 1 A')).atIndex(0)).toExist()
    await expect(
      element(by.text(PrescriptionsE2eIdConstants.PRESCRIPTION_REFILL_REQUEST_SUMMARY_WHATS_NEXT_HEADER_TEXT)),
    ).toExist()
    await expect(
      element(by.label(PrescriptionsE2eIdConstants.PRESCRIPTION_REFILL_REQUEST_SUMMARY_DESCRIPTION_1_LABEL)),
    ).toExist()
    await expect(
      element(by.label(PrescriptionsE2eIdConstants.PRESCRIPTION_REFILL_REQUEST_SUMMARY_DESCRIPTION_2_LABEL)),
    ).toExist()
  })

  it('should display all pending refills', async () => {
    await element(by.id(PrescriptionsE2eIdConstants.PRESCRIPTION_REFILL_REQUEST_SUMMARY_PENDING_BUTTON_TEXT)).tap()
    await expect(
      element(by.text(PrescriptionsE2eIdConstants.PRESCRIPTION_PENDING_NUMBER_OF_PRESCRIPTIONS_TEXT)),
    ).toExist()
    await expect(element(by.label(PrescriptionsE2eIdConstants.PRESCRIPTION_PENDING_DESCRIPTION_LABEL))).toExist()
    await expect(
      element(by.text(PrescriptionsE2eIdConstants.PRESCRIPTION_PENDING_STATUS_LABEL_HEADER_TEXT)).atIndex(0),
    ).toExist()
  })
})

describeWithSetup('Start a refill request for multiple prescriptions', () => {
  it('should open refill request screen when "Start refill request" button is pressed', async () => {
    await element(by.label(PrescriptionsE2eIdConstants.PRESCRIPTION_FLOATING_REQUEST_REFILL_BUTTON_TEXT)).tap()
    await expect(
      element(by.text(PrescriptionsE2eIdConstants.PRESCRIPTION_REFILL_REQUEST_TITLE_TEXT)).atIndex(0),
    ).toExist()
    await expect(element(by.text(PrescriptionsE2eIdConstants.PRESCRIPTION_REFILL_REQUEST_DESCRIPTION_1_TEXT))).toExist()
    await expect(
      element(by.text(PrescriptionsE2eIdConstants.PRESCRIPTION_REFILL_REQUEST_DESCRIPTION_2_LABEL)),
    ).toExist()
    await expect(
      element(by.text(PrescriptionsE2eIdConstants.PRESCRIPTION_REFILL_NUMBER_OF_PRESCRIPTION_TEXT)),
    ).toExist()
    await expect(element(by.text('0/10 selected'))).toExist()
    await expect(element(by.text('Select all'))).toExist()
    await expect(element(by.text('AMLODIPINE BESYLATE 10MG TAB')).atIndex(0)).toExist()
    await expect(element(by.label('Prescription number 3 6 3 6 7 1 1 A')).atIndex(0)).toExist()
    await expect(element(by.text(PrescriptionsE2eIdConstants.PRESCRIPTION_REFILLS_LEFT_TEXT)).atIndex(0)).toExist()
    await expect(element(by.text(PrescriptionsE2eIdConstants.PRESCRIPTION_FILL_DATE_TEXT)).atIndex(0)).toExist()
    await expect(element(by.text(PrescriptionsE2eIdConstants.PRESCRIPTION_VA_FACILITY_TEXT)).atIndex(0)).toExist()
  })

  it('should update the selected count when the selection of a prescription item is changed', async () => {
    await element(by.label('Prescription 1 of 10.')).tap()
    await expect(element(by.text('1/10 selected'))).toExist()
    await element(by.label('Prescription 1 of 10.')).tap()
    await expect(element(by.text('0/10 selected'))).toExist()
  })

  it('should update the selected count when "Select all" checkbox is changed', async () => {
    await element(by.text('Select all')).tap()
    await expect(element(by.text('10/10 selected'))).toExist()
    await expect(element(by.text('Request all refills'))).toExist()
    await element(by.text('Select all')).tap()
    await expect(element(by.text('0/10 selected'))).toExist()
  })

  it('should display confirmation modal when refill request button is pressed', async () => {
    await element(by.label('Prescription 1 of 10.')).tap()
    await element(by.label('Prescription 2 of 10.')).tap()
    await element(by.id(PrescriptionsE2eIdConstants.PRESCRIPTION_REQUEST_REFILL_ID)).tap()

    await expect(element(by.text('Request prescription refills?'))).toExist()
    await expect(
      element(by.text(PrescriptionsE2eIdConstants.PRESCRIPTION_REFILL_REQUESTS_CONFIRMATION_BUTTON_TEXT)),
    ).toExist()
  })

  it('should close the confirmation modal when cancel is pressed', async () => {
    await cancelRequest(PrescriptionsE2eIdConstants.REFILL_REQUEST_SCREEN_ID)
    await expect(
      element(by.text(PrescriptionsE2eIdConstants.PRESCRIPTION_REFILL_REQUEST_CONFIRMATION_TITLE_TEXT)),
    ).not.toExist()
  })

  it('should correctly display the refill request summary when request is successful', async () => {
    await element(by.id(PrescriptionsE2eIdConstants.PRESCRIPTION_REQUEST_REFILL_ID)).tap()
    await element(by.text(PrescriptionsE2eIdConstants.PRESCRIPTION_REFILL_REQUESTS_CONFIRMATION_BUTTON_TEXT)).tap()

    await expect(
      element(by.text(PrescriptionsE2eIdConstants.PRESCRIPTION_REFILL_REQUEST_TITLE_TEXT)).atIndex(0),
    ).toExist()
    await expect(element(by.text(PrescriptionsE2eIdConstants.PRESCRIPTION_REFILL_REQUEST_SUMMARY_TEXT))).toExist()
    await expect(
      element(by.text(PrescriptionsE2eIdConstants.PRESCRIPTION_REFILL_REQUEST_SUMMARY_HEADER_TEXT)),
    ).toExist()
    await expect(element(by.text('AMLODIPINE BESYLATE 10MG TAB')).atIndex(0)).toExist()
    await expect(element(by.label('Prescription number 3 6 3 6 7 1 1 A')).atIndex(0)).toExist()
    await expect(element(by.text('CAPECITABINE 500MG TAB')).atIndex(0)).toExist()
    await expect(element(by.label('Prescription number 3 6 3 6 8 5 6')).atIndex(0)).toExist()
    await expect(
      element(by.text(PrescriptionsE2eIdConstants.PRESCRIPTION_REFILL_REQUEST_SUMMARY_WHATS_NEXT_HEADER_TEXT)),
    ).toExist()
    await expect(
      element(by.label(PrescriptionsE2eIdConstants.PRESCRIPTION_REFILL_REQUEST_SUMMARY_DESCRIPTION_1_LABEL)),
    ).toExist()
    await expect(
      element(by.label(PrescriptionsE2eIdConstants.PRESCRIPTION_REFILL_REQUEST_SUMMARY_DESCRIPTION_2_LABEL)),
    ).toExist()
  })

  it('should display all pending refills', async () => {
    await element(by.id(PrescriptionsE2eIdConstants.PRESCRIPTION_REFILL_REQUEST_SUMMARY_PENDING_BUTTON_TEXT)).tap()
    await expect(
      element(by.text(PrescriptionsE2eIdConstants.PRESCRIPTION_PENDING_NUMBER_OF_PRESCRIPTIONS_TEXT)),
    ).toExist()
    await expect(element(by.label(PrescriptionsE2eIdConstants.PRESCRIPTION_PENDING_DESCRIPTION_LABEL))).toExist()
    await expect(
      element(by.text(PrescriptionsE2eIdConstants.PRESCRIPTION_PENDING_STATUS_LABEL_HEADER_TEXT)).atIndex(0),
    ).toExist()
  })
})
