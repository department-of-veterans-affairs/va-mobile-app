/*
Description:
Detox script that follows the prescriptions test case found in testRail (VA Mobile App > RC Regression Test > Manual > Health Page Elements)
When to update:
This script should be updated whenever new things are added/changed in prescriptions or if anything is changed in src/store/api/demo/mocks/prescriptions.json.
*/
import { by, device, element, expect, waitFor } from 'detox'

import { CommonE2eIdConstants, describeWithSetupPrescriptions, toggleRemoteConfigFlag } from './utils'

export const RefillPrescriptionsE2eIdConstants = {
  PRESCRIPTIONS_HEADER_TEXT: 'Prescriptions',
  PRESCRIPTION_HISTORY_SCROLL_TARGET: 'METFORMIN HCL 500MG TAB',
  PRESCRIPTION_DETAILS_LABEL: 'Get prescription details',
  PRESCRIPTION_FILL_DATE_TEXT: 'Fill date: Date not available',
  PRESCRIPTION_REFILL_NAME_TEXT: 'AMLODIPINE BESYLATE 10MG TAB',
  PRESCRIPTION_REFILL_NUMBER_TEXT: 'Prescriptions for refill (3)',
  PRESCRIPTION_REFILL_REQUEST_CANCEL_TEXT: device.getPlatform() === 'android' ? 'Cancel ' : 'Cancel',
  PRESCRIPTION_REFILL_REQUEST_CONFIRMATION_BUTTON_TEXT:
    device.getPlatform() === 'android' ? 'Request refill ' : 'Request Refill',
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
  PRESCRIPTION_REFILLS_LEFT_TEXT: 'Refills left: 1',
  PRESCRIPTION_REQUEST_REFILL_ID: 'requestRefillsButtonID',
  PRESCRIPTION_FLOATING_REQUEST_REFILL_BUTTON_TEXT: 'Start refill request',
  PRESCRIPTION_VA_FACILITY_TEXT: 'VA facility: Test VA Medical Center',
}

beforeAll(async () => {
  await toggleRemoteConfigFlag(CommonE2eIdConstants.IN_APP_REVIEW_TOGGLE_TEXT)
})

describeWithSetupPrescriptions('Start a refill request for a single prescription', () => {
  it('should display confirmation modal when refill request button is pressed in prescription details', async () => {
    // Scroll until the 'Get prescription details' link for AMLODIPINE BESYLATE 10MG TAB is accessible
    await waitFor(element(by.label(RefillPrescriptionsE2eIdConstants.PRESCRIPTION_HISTORY_SCROLL_TARGET)))
      .toBeVisible()
      .whileElement(by.id(CommonE2eIdConstants.PRESCRIPTION_HISTORY_SCROLL_ID))
      .scroll(50, 'down', 0.5, 0.5)

    await element(by.label(RefillPrescriptionsE2eIdConstants.PRESCRIPTION_DETAILS_LABEL)).atIndex(0).tap()
    await expect(element(by.text(RefillPrescriptionsE2eIdConstants.PRESCRIPTION_REFILL_NAME_TEXT))).toExist()
    await element(by.id(RefillPrescriptionsE2eIdConstants.PRESCRIPTION_REQUEST_REFILL_ID)).tap()
    await expect(
      element(by.text(RefillPrescriptionsE2eIdConstants.PRESCRIPTION_REFILL_REQUEST_CONFIRMATION_TITLE_TEXT)),
    ).toExist()
    await expect(
      element(by.text(RefillPrescriptionsE2eIdConstants.PRESCRIPTION_REFILL_REQUEST_CONFIRMATION_BUTTON_TEXT)),
    ).toExist()
    await expect(element(by.text(RefillPrescriptionsE2eIdConstants.PRESCRIPTION_REFILL_REQUEST_CANCEL_TEXT))).toExist()
  })

  it('should close the confirmation modal when cancel is pressed', async () => {
    await element(by.text(RefillPrescriptionsE2eIdConstants.PRESCRIPTION_REFILL_REQUEST_CANCEL_TEXT)).tap()
    await expect(
      element(by.text(RefillPrescriptionsE2eIdConstants.PRESCRIPTION_REFILL_REQUEST_CONFIRMATION_TITLE_TEXT)),
    ).not.toExist()
  })

  it('should correctly display the refill request summary when request is successful', async () => {
    await element(by.id(RefillPrescriptionsE2eIdConstants.PRESCRIPTION_REQUEST_REFILL_ID)).tap()
    await element(by.text(RefillPrescriptionsE2eIdConstants.PRESCRIPTION_REFILL_REQUEST_CONFIRMATION_BUTTON_TEXT)).tap()

    await expect(
      element(by.text(RefillPrescriptionsE2eIdConstants.PRESCRIPTION_REFILL_REQUEST_TITLE_TEXT)).atIndex(0),
    ).toExist()
    await expect(element(by.text(RefillPrescriptionsE2eIdConstants.PRESCRIPTION_REFILL_REQUEST_SUMMARY_TEXT))).toExist()
    await expect(
      element(by.text(RefillPrescriptionsE2eIdConstants.PRESCRIPTION_REFILL_REQUEST_SUMMARY_HEADER_TEXT)),
    ).toExist()
    await expect(element(by.text(RefillPrescriptionsE2eIdConstants.PRESCRIPTION_REFILL_NAME_TEXT)).atIndex(0)).toExist()
    await expect(element(by.label('Prescription number 1 2 3 4 5 6 7')).atIndex(0)).toExist()
    await expect(
      element(by.text(RefillPrescriptionsE2eIdConstants.PRESCRIPTION_REFILL_REQUEST_SUMMARY_WHATS_NEXT_HEADER_TEXT)),
    ).toExist()
    await expect(
      element(by.label(RefillPrescriptionsE2eIdConstants.PRESCRIPTION_REFILL_REQUEST_SUMMARY_DESCRIPTION_1_LABEL)),
    ).toExist()
    await expect(
      element(by.label(RefillPrescriptionsE2eIdConstants.PRESCRIPTION_REFILL_REQUEST_SUMMARY_DESCRIPTION_2_LABEL)),
    ).toExist()
  })

  it('should navigate back to prescriptions screen when "Go to all pending refills" is pressed', async () => {
    await element(
      by.text(RefillPrescriptionsE2eIdConstants.PRESCRIPTION_REFILL_REQUEST_SUMMARY_PENDING_BUTTON_TEXT),
    ).tap()
    await expect(element(by.text(RefillPrescriptionsE2eIdConstants.PRESCRIPTIONS_HEADER_TEXT))).toExist()
  })
})

describeWithSetupPrescriptions('Start a refill request for multiple prescriptions', () => {
  it('should open refill request screen when "Start refill request" button is pressed', async () => {
    await element(by.label(RefillPrescriptionsE2eIdConstants.PRESCRIPTION_FLOATING_REQUEST_REFILL_BUTTON_TEXT)).tap()
    await expect(
      element(by.text(RefillPrescriptionsE2eIdConstants.PRESCRIPTION_REFILL_REQUEST_TITLE_TEXT)).atIndex(0),
    ).toExist()
    await expect(
      element(by.text(RefillPrescriptionsE2eIdConstants.PRESCRIPTION_REFILL_REQUEST_DESCRIPTION_1_TEXT)),
    ).toExist()
    await expect(
      element(by.text(RefillPrescriptionsE2eIdConstants.PRESCRIPTION_REFILL_REQUEST_DESCRIPTION_2_LABEL)),
    ).toExist()
    await expect(element(by.text(RefillPrescriptionsE2eIdConstants.PRESCRIPTION_REFILL_NUMBER_TEXT))).toExist()
    await expect(element(by.text('0/3 selected'))).toExist()
    await expect(element(by.text('Select all'))).toExist()
    await expect(element(by.text(RefillPrescriptionsE2eIdConstants.PRESCRIPTION_REFILL_NAME_TEXT)).atIndex(0)).toExist()
    await expect(element(by.label('Prescription number 1 2 3 4 5 6 7')).atIndex(0)).toExist()
    await expect(
      element(by.text(RefillPrescriptionsE2eIdConstants.PRESCRIPTION_REFILLS_LEFT_TEXT)).atIndex(0),
    ).toExist()
    await expect(element(by.text(RefillPrescriptionsE2eIdConstants.PRESCRIPTION_FILL_DATE_TEXT)).atIndex(0)).toExist()
    await expect(element(by.text(RefillPrescriptionsE2eIdConstants.PRESCRIPTION_VA_FACILITY_TEXT)).atIndex(0)).toExist()
  })

  it('should update the selected count when the selection of a prescription item is changed', async () => {
    await element(by.label('Prescription 1 of 3.')).tap()
    await expect(element(by.text('1/3 selected'))).toExist()
    await element(by.label('Prescription 1 of 3.')).tap()
    await expect(element(by.text('0/3 selected'))).toExist()
  })

  it('should update the selected count when "Select all" checkbox is changed', async () => {
    await element(by.text('Select all')).tap()
    await expect(element(by.text('3/3 selected'))).toExist()
    await expect(element(by.text('Request all refills'))).toExist()
    await element(by.text('Select all')).tap()
    await expect(element(by.text('0/3 selected'))).toExist()
  })

  it('should display confirmation modal when refill request button is pressed', async () => {
    await element(by.label('Prescription 1 of 3.')).tap()
    await element(by.id(RefillPrescriptionsE2eIdConstants.PRESCRIPTION_REQUEST_REFILL_ID)).tap()

    await expect(
      element(by.text(RefillPrescriptionsE2eIdConstants.PRESCRIPTION_REFILL_REQUEST_CONFIRMATION_TITLE_TEXT)),
    ).toExist()
    await expect(
      element(by.text(RefillPrescriptionsE2eIdConstants.PRESCRIPTION_REFILL_REQUEST_CONFIRMATION_BUTTON_TEXT)),
    ).toExist()
  })

  it('should close the confirmation modal when cancel is pressed', async () => {
    if (device.getPlatform() === 'android') {
      await element(by.text(RefillPrescriptionsE2eIdConstants.PRESCRIPTION_REFILL_REQUEST_CANCEL_TEXT)).tap()
    } else {
      await element(by.text(RefillPrescriptionsE2eIdConstants.PRESCRIPTION_REFILL_REQUEST_CANCEL_TEXT)).atIndex(1).tap()
    }
    await expect(
      element(by.text(RefillPrescriptionsE2eIdConstants.PRESCRIPTION_REFILL_REQUEST_CONFIRMATION_TITLE_TEXT)),
    ).not.toExist()
  })

  it('should correctly display the refill request summary when request is successful', async () => {
    await element(by.id(RefillPrescriptionsE2eIdConstants.PRESCRIPTION_REQUEST_REFILL_ID)).tap()
    await element(by.text(RefillPrescriptionsE2eIdConstants.PRESCRIPTION_REFILL_REQUEST_CONFIRMATION_BUTTON_TEXT)).tap()

    await expect(
      element(by.text(RefillPrescriptionsE2eIdConstants.PRESCRIPTION_REFILL_REQUEST_TITLE_TEXT)).atIndex(0),
    ).toExist()
    await expect(element(by.text(RefillPrescriptionsE2eIdConstants.PRESCRIPTION_REFILL_REQUEST_SUMMARY_TEXT))).toExist()
    await expect(
      element(by.text(RefillPrescriptionsE2eIdConstants.PRESCRIPTION_REFILL_REQUEST_SUMMARY_HEADER_TEXT)),
    ).toExist()
    await expect(element(by.text(RefillPrescriptionsE2eIdConstants.PRESCRIPTION_REFILL_NAME_TEXT)).atIndex(0)).toExist()
    await expect(element(by.label('Prescription number 1 2 3 4 5 6 7')).atIndex(0)).toExist()
    await expect(
      element(by.text(RefillPrescriptionsE2eIdConstants.PRESCRIPTION_REFILL_REQUEST_SUMMARY_WHATS_NEXT_HEADER_TEXT)),
    ).toExist()
    await expect(
      element(by.label(RefillPrescriptionsE2eIdConstants.PRESCRIPTION_REFILL_REQUEST_SUMMARY_DESCRIPTION_1_LABEL)),
    ).toExist()
    await expect(
      element(by.label(RefillPrescriptionsE2eIdConstants.PRESCRIPTION_REFILL_REQUEST_SUMMARY_DESCRIPTION_2_LABEL)),
    ).toExist()
  })

  it('should navigate back to prescriptions screen when "Go to all pending refills" is pressed', async () => {
    await element(
      by.text(RefillPrescriptionsE2eIdConstants.PRESCRIPTION_REFILL_REQUEST_SUMMARY_PENDING_BUTTON_TEXT),
    ).tap()
    await expect(element(by.text(RefillPrescriptionsE2eIdConstants.PRESCRIPTIONS_HEADER_TEXT))).toExist()
  })
})
