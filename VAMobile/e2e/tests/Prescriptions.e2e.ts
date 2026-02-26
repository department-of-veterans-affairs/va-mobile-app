import { by, device, element, expect, waitFor } from 'detox'

import { CommonE2eIdConstants, loginToDemoMode, openHealth, openPrescriptions, toggleRemoteConfigFlag } from './utils'

export const PrescriptionsE2eIdConstants = {
  PRESCRIPTION_FILTER_BUTTON_ID: 'openFilterAndSortTestID',
  PRESCRIPTION_FILTER_MODAL_ID: 'ModalTestID',
  PRESCRIPTION_FILTER_APPLY_ID: 'radioButtonApplyTestID',
  PRESCRIPTION_DETAILS_LINK_ID: 'prescriptionDetailsTestID',
  PRESCRIPTION_TRACKING_GET_TRACKING_ID: 'getPrescriptionTrackingTestID',
  PRESCRIPTION_HELP_BUTTON_ID: 'prescriptionsHelpID',
  PRESCRIPTION_BACK_ID: 'prescriptionsBackTestID',
  PRESCRIPTION_DETAILS_BACK_ID: 'prescriptionsDetailsBackTestID',
}

describe('Prescriptions', () => {
  beforeAll(async () => {
    // await toggleRemoteConfigFlag(CommonE2eIdConstants.IN_APP_REVIEW_TOGGLE_TEXT)
    await loginToDemoMode()
    await openHealth()
    await openPrescriptions()
    await waitFor(element(by.text('Loading prescriptions...')))
      .not.toExist()
      .withTimeout(15000)
  })

  it('should sort and filter prescriptions, view details and tracking', async () => {
    // 1. Help Modal
    await element(by.id(PrescriptionsE2eIdConstants.PRESCRIPTION_HELP_BUTTON_ID)).tap()
    await expect(element(by.text('This list may not include all your medications '))).toExist()
    await element(by.id(PrescriptionsE2eIdConstants.PRESCRIPTION_BACK_ID)).tap()

    // 2. Filter and Sort
    await element(by.id(PrescriptionsE2eIdConstants.PRESCRIPTION_FILTER_BUTTON_ID)).tap()

    await waitFor(element(by.id(PrescriptionsE2eIdConstants.PRESCRIPTION_FILTER_MODAL_ID)))
      .toBeVisible()
      .withTimeout(5000)

    // Select 'Tracking (1)' filter
    await element(by.text('Tracking (1)')).tap()

    // Swipe up to find sort options
    await element(by.id(PrescriptionsE2eIdConstants.PRESCRIPTION_FILTER_MODAL_ID)).swipe('up', 'fast')

    await element(by.text('Medication name (A to Z)')).atIndex(0).tap()
    await element(by.id(PrescriptionsE2eIdConstants.PRESCRIPTION_FILTER_APPLY_ID)).tap()

    await expect(element(by.text('Refills with tracking (1), sorted by medication name (A to Z)'))).toExist()

    // Verify ACETAMINOPHEN 325MG TAB TAB is visible (it matches tracking)
    await waitFor(element(by.text('ACETAMINOPHEN 325MG TAB'))).toBeVisible()

    // 2. View Prescription Details
    // View prescription details
    await element(by.text('ACETAMINOPHEN 325MG TAB')).swipe('up', 'fast')
    await waitFor(element(by.id(PrescriptionsE2eIdConstants.PRESCRIPTION_DETAILS_LINK_ID)))
      .toBeVisible()
      .withTimeout(5000)
    await element(by.id(PrescriptionsE2eIdConstants.PRESCRIPTION_DETAILS_LINK_ID)).tap()

    // Check for details
    await waitFor(element(by.text('Expires on')))
      .toExist()
      .withTimeout(10000)

    // Back to list
    await element(by.id(PrescriptionsE2eIdConstants.PRESCRIPTION_DETAILS_BACK_ID)).tap()

    // 3. View Tracking Information
    await waitFor(element(by.id(PrescriptionsE2eIdConstants.PRESCRIPTION_TRACKING_GET_TRACKING_ID)))
      .toBeVisible()
      .whileElement(by.id(CommonE2eIdConstants.PRESCRIPTION_HISTORY_SCROLL_ID))
      .scroll(200, 'down')

    // Tap 'Get tracking information'
    await element(by.id(PrescriptionsE2eIdConstants.PRESCRIPTION_TRACKING_GET_TRACKING_ID)).atIndex(0).tap()

    // Verify tracking information screen
    await waitFor(element(by.text('Tracking number'))).toBeVisible()

    // 4. Verify External Link (Webview Launch)
    const trackingNo = '77298027203980000000398' // Mock tracking number
    const trackingLabel = trackingNo.split('').join(' ') // Labels are often split for screen readers

    const trackingIndex = device.getPlatform() === 'android' ? 0 : 1

    // Tap the tracking number link
    await element(by.label(trackingLabel)).atIndex(trackingIndex).tap()

    // Verify it triggers the leaving app popup
    await expect(element(by.text(CommonE2eIdConstants.LEAVING_APP_POPUP_TEXT))).toExist()

    // Go back (Cancel the popup)
    await element(by.text(CommonE2eIdConstants.LEAVING_APP_CANCEL_TEXT)).tap()

    // Navigate back to history
    await element(by.id(PrescriptionsE2eIdConstants.PRESCRIPTION_BACK_ID)).tap()
  })
})
