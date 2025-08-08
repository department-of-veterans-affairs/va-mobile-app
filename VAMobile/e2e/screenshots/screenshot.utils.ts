import { by, element, expect, waitFor } from 'detox'

import {
  CommonE2eIdConstants,
  disableAF,
  openAppointments,
  openBenefits,
  openClaims,
  openClaimsHistory,
  openHealth,
  openMessages,
  openPayments,
  openPrescriptions,
  openProfile,
  openVAPaymentHistory,
} from '../tests/utils'

export const claimsId = {
  CLAIM_1_ID_BOX:
    'Compensation Received December 05, 2021 Step 1 of 5: Claim received Moved to this step on December 05, 2021',
}

// A collection of reusable setup functions for screenshot tests.
// Each function should navigate to a specific screen.
const utils = {
  goHome: async () => {
    await element(by.text(CommonE2eIdConstants.HOME_TAB_BUTTON_TEXT)).tap()
    await disableAF(undefined, 'WG_Home', undefined, undefined, 'skipAppInstall')
  },

  skipUpdate: async () => {
    try {
      await element(by.text('Skip this update')).tap()
    } catch (e) {}
  },

  healthScreen: async () => {
    await element(by.text(CommonE2eIdConstants.HEALTH_TAB_BUTTON_TEXT)).tap()
  },

  benefitsScreen: async () => {
    await element(by.text(CommonE2eIdConstants.BENEFITS_TAB_BUTTON_TEXT)).tap()
  },

  appointmentDetails: async () => {
    await openHealth()
    await openAppointments()
    // NOTE: This is an example of specific navigation logic
    await waitFor(element(by.text('Vilanisi Reddy')))
      .toBeVisible()
      .whileElement(by.id(CommonE2eIdConstants.APPOINTMENTS_SCROLL_ID))
      .scroll(200, 'down')
    await element(by.text('Vilanisi Reddy')).tap()
  },

  messagesInbox: async () => {
    await openHealth()
    await openMessages()
  },

  paymentsHistory: async () => {
    await openPayments()
    await openVAPaymentHistory()
  },

  profileScreen: async () => {
    await element(by.text(CommonE2eIdConstants.HOME_TAB_BUTTON_TEXT)).tap()
    await openProfile()
  },

  // BUG: Screenshot is gathered manually
  // lettersDownload: async () => {
  //   await openProfile();
  //   await element(by.text('VA letters and documents')).tap();
  // },

  prescriptions: async () => {
    // NOTE: NEed to open health twice because it is not at the home screen upon opening.  It is at Messages Inbox
    await openHealth()
    await openHealth()
    await openPrescriptions()
  },

  claimDetails: async () => {
    await openBenefits()
    await openBenefits()
    await openClaims()
    await openClaimsHistory()
    await expect(element(by.text('Your active claims, decision reviews, and appeals'))).toExist()
    await expect(element(by.id(claimsId.CLAIM_1_ID_BOX))).toExist()
    await element(by.id(claimsId.CLAIM_1_ID_BOX)).tap()
  },
}

export default utils
