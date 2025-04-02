import { by, device, element, expect, waitFor } from 'detox'
import { setTimeout } from 'timers/promises'

import {
  CommonE2eIdConstants,
  loginToDemoMode,
  openAppointments,
  openDeveloperScreen,
  openHealth,
  openMessages,
  openPayments,
  openProfile,
  openSettings,
} from './utils'

export const CernerIdConstants = {
  GO_TO_VA_HEALTH_LINK_ID: 'goToMyVAHealthTestID',
  HEALTH_CATEGORY_ID: 'healthCategoryTestID',
  CERNER_NOTE_HEADING_TEXT: 'Your care team uses My VA Health',
  CERNER_NOTE_HEADING_ID: 'cernerAlertTestID',
  CERNER_NOTE_RECORDS_SHOW_TEXT: "You'll need to use our My VA Health portal to manage your care at these facilities:",
  CERNER_NOTE_FACILITY_TEXT: 'Cary VA Medical Center',
  CERNER_NOTE_MESSAGES_TEXT: 'Sending a message to a care team at these facilities:',
  CERNER_NOTE_MESSAGES_HEADER_TEXT: 'Your care team uses My VA Health',
  CERNER_HOME_SUBTEXT_TEXT: 'Information from My VA Health portal not included.',
  CERNER_PANEL_MULTI_ALL_TEXT: 'Your care team uses My VA Health',
  CERNER_PANEL_MANAGE_MULTI_TEXT: "You'll need to use our My VA Health portal to manage your care at these facilities:",
  CERNER_HEALTH_HELP_SUBTEXT_TEXT:
    "Some care teams use My VA Health. Information from that health portal isn't included here.",
  CERNER_HEALTH_HELP_LINK_TEXT: 'Check if your care team uses My VA Health',
}

beforeAll(async () => {
  if (device.getPlatform() === 'android') {
    // turns on Cerner demo mode
    await loginToDemoMode()
    await openProfile()
    await openSettings()
    await openDeveloperScreen()
    await waitFor(element(by.text('Remote Config')))
      .toBeVisible()
      .whileElement(by.id(CommonE2eIdConstants.DEVELOPER_SCREEN_SCROLL_ID))
      .scroll(200, 'down')
    await element(by.text('Remote Config')).tap()
    await waitFor(element(by.text('cernerTrueForDemo')))
      .toBeVisible()
      .whileElement(by.id(CommonE2eIdConstants.REMOTE_CONFIG_TEST_ID))
      .scroll(200, 'down')
    await element(by.text('cernerTrueForDemo')).tap()
    await waitFor(element(by.text('Apply Overrides')))
      .toBeVisible()
      .whileElement(by.id(CommonE2eIdConstants.REMOTE_CONFIG_TEST_ID))
      .scroll(200, 'down')
    await element(by.text('Apply Overrides')).tap()

    //navigates to correct screen with cerner on
    await loginToDemoMode()
  }
})

describe(':android: Cerner Notice', () => {
  it('should match the cerner subtext on home screen', async () => {
    await waitFor(element(by.text(CernerIdConstants.CERNER_HOME_SUBTEXT_TEXT)))
      .toBeVisible()
      .whileElement(by.id(CommonE2eIdConstants.HOME_SCREEN_SCROLL_ID))
      .scroll(200, 'down')
    await expect(element(by.text(CernerIdConstants.CERNER_HOME_SUBTEXT_TEXT))).toExist()
  })

  it('should automatically display cerner panel on health screen', async () => {
    await openHealth()
    await expect(element(by.text(CernerIdConstants.CERNER_PANEL_MULTI_ALL_TEXT))).toExist()
  })

  it('should have correct cerner-only multiple facilities content', async () => {
    await expect(element(by.text(CernerIdConstants.CERNER_PANEL_MULTI_ALL_TEXT))).toExist()
    await expect(element(by.text(CernerIdConstants.CERNER_PANEL_MANAGE_MULTI_TEXT))).toExist()
    await expect(element(by.id(CernerIdConstants.GO_TO_VA_HEALTH_LINK_ID))).toExist()
  })

  it('should close panel and show cerner subtext on health screen', async () => {
    await element(by.text('Close')).tap()
    await element(by.id(CernerIdConstants.HEALTH_CATEGORY_ID)).scrollTo('bottom')
    await expect(element(by.text(CernerIdConstants.CERNER_HEALTH_HELP_SUBTEXT_TEXT))).toExist()
    await expect(element(by.text(CernerIdConstants.CERNER_HEALTH_HELP_LINK_TEXT))).toExist()
  })

  it('should not automatically reopen cerner panel on health screen', async () => {
    await openPayments()
    await openHealth()
    await expect(element(by.text(CernerIdConstants.CERNER_PANEL_MULTI_ALL_TEXT))).not.toExist()
  })

  it('appointments: verify the cerner notification is present and collapsed', async () => {
    await element(by.id(CernerIdConstants.HEALTH_CATEGORY_ID)).scrollTo('top')
    await openAppointments()
    await expect(element(by.id(CernerIdConstants.CERNER_NOTE_HEADING_ID))).toExist()
    await expect(element(by.text(CernerIdConstants.CERNER_NOTE_RECORDS_SHOW_TEXT))).not.toExist()
  })

  it('should match the cerner notice design', async () => {
    await element(by.id(CernerIdConstants.CERNER_NOTE_HEADING_ID)).tap()
    await waitFor(element(by.id(CernerIdConstants.GO_TO_VA_HEALTH_LINK_ID)))
      .toBeVisible()
      .whileElement(by.id(CommonE2eIdConstants.APPOINTMENTS_SCROLL_ID))
      .scroll(200, 'down')
    await expect(element(by.text(CernerIdConstants.CERNER_NOTE_FACILITY_TEXT))).toExist()
    await expect(element(by.text(CommonE2eIdConstants.CHEYENNE_FACILITY_TEXT))).toExist()
    await expect(element(by.id(CernerIdConstants.GO_TO_VA_HEALTH_LINK_ID))).toExist()
  })

  it('verify the correct webpage My Health link is opened', async () => {
    await element(by.id(CernerIdConstants.GO_TO_VA_HEALTH_LINK_ID)).tap()
    await element(by.text(CommonE2eIdConstants.LEAVING_APP_LEAVE_TEXT)).tap()
    await setTimeout(5000)
    await device.takeScreenshot('cernerVAHealthLink')
    await device.launchApp({ newInstance: false })
  })

  it('should tap on the cerner notification and verify the alert closes', async () => {
    await element(by.id(CommonE2eIdConstants.APPOINTMENTS_SCROLL_ID)).swipe('down')
    await element(by.text(CernerIdConstants.CERNER_NOTE_HEADING_TEXT)).tap()
    await expect(element(by.text(CernerIdConstants.CERNER_NOTE_FACILITY_TEXT))).not.toExist()
    await expect(element(by.text(CommonE2eIdConstants.CHEYENNE_FACILITY_TEXT))).not.toExist()
  })

  it('tap on messages and verify the cerner notification is present and collapsed', async () => {
    await element(by.id('appointmentsBackTestID')).tap()
    await openMessages()
    await expect(element(by.id(CernerIdConstants.CERNER_NOTE_HEADING_ID))).toExist()
    await expect(element(by.text(CernerIdConstants.CERNER_NOTE_MESSAGES_TEXT))).not.toExist()
  })

  it('verify the correct information is displayed for multiple facilities', async () => {
    await element(by.id(CernerIdConstants.CERNER_NOTE_HEADING_ID)).tap()
    await expect(element(by.text(CernerIdConstants.CERNER_NOTE_MESSAGES_TEXT))).toExist()
    await expect(element(by.text(CommonE2eIdConstants.CHEYENNE_FACILITY_TEXT))).toExist()
    await expect(element(by.text(CernerIdConstants.CERNER_NOTE_FACILITY_TEXT))).toExist()
    await expect(element(by.text("You'll need to use our My VA Health portal to send your message"))).toExist()
    await expect(element(by.id(CernerIdConstants.GO_TO_VA_HEALTH_LINK_ID))).toExist()
  })
})
