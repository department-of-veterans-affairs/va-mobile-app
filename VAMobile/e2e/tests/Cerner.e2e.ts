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
  CERNER_NOTE_HEADING_TEXT: 'Your VA health care team may be using the My VA Health portal',
  CERNER_NOTE_RECORDS_SHOW_TEXT: 'Our records show you’re registered at:',
  CERNER_NOTE_FACILITY_TEXT: 'Cary VA Medical Center (Now using My VA Health)',
  CERNER_NOTE_FACILITY_2_TEXT: 'Cheyenne VA Medical Center (Now using My VA Health)',
  CERNER_NOTE_MESSAGES_TEXT:
    "This facility currently uses our My VA Health portal. You'll need to go there to send your message.",
  CERNER_NOTE_MESSAGES_HEADER_TEXT: "Make sure you're in the right health portal",
  CERNER_HOME_SUBTEXT_TEXT: 'Information from My VA Health portal not included.',
  CERNER_PANEL_MULTI_ALL_TEXT: 'Your VA health facilities use My VA Health',
  CERNER_PANEL_MANAGE_MULTI_TEXT: 'Need to manage your health care at these facilities?',
  CERNER_PANEL_PORTAL_MULTI_TEXT:
    "You'll need to go to our My VA Health portal to manage your health care at these facilities.",
  CERNER_HEALTH_HELP_SUBTEXT_TEXT:
    "Some VA health facilities use our My VA Health portal. Information from that portal isn't included here.",
  CERNER_HEALTH_HELP_LINK_TEXT: 'Check if your facility uses My VA Health',
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
      .whileElement(by.id('developerScreenTestID'))
      .scroll(200, 'down')
    await element(by.text('Remote Config')).tap()
    await waitFor(element(by.text('cernerTrueForDemo')))
      .toBeVisible()
      .whileElement(by.id('remoteConfigTestID'))
      .scroll(200, 'down')
    await element(by.text('cernerTrueForDemo')).tap()
    await waitFor(element(by.text('Apply Overrides')))
      .toBeVisible()
      .whileElement(by.id('remoteConfigTestID'))
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
      .whileElement(by.id('homeScreenID'))
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
    await expect(element(by.text(CernerIdConstants.CERNER_PANEL_PORTAL_MULTI_TEXT))).toExist()
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

  it('appointmentts: verify the cerner notification is present and collapsed', async () => {
    await element(by.id(CernerIdConstants.HEALTH_CATEGORY_ID)).scrollTo('top')
    await openAppointments()
    await expect(element(by.text(CernerIdConstants.CERNER_NOTE_HEADING_TEXT))).toExist()
    await expect(element(by.text('Our records show you`re registered at:'))).not.toExist()
  })

  it('should match the cerner notice design', async () => {
    await element(by.text(CernerIdConstants.CERNER_NOTE_HEADING_TEXT)).tap()
    await waitFor(element(by.id(CernerIdConstants.GO_TO_VA_HEALTH_LINK_ID)))
      .toBeVisible()
      .whileElement(by.id('appointmentsTestID'))
      .scroll(200, 'down')
    await expect(element(by.text(CernerIdConstants.CERNER_NOTE_FACILITY_TEXT))).toExist()
    await expect(element(by.text(CernerIdConstants.CERNER_NOTE_FACILITY_2_TEXT))).toExist()
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
    await element(by.id('appointmentsTestID')).swipe('down')
    await element(by.text(CernerIdConstants.CERNER_NOTE_HEADING_TEXT)).tap()
    await expect(element(by.text(CernerIdConstants.CERNER_NOTE_FACILITY_TEXT))).not.toExist()
    await expect(element(by.text(CernerIdConstants.CERNER_NOTE_FACILITY_2_TEXT))).not.toExist()
  })

  it('tap on messages and verify the cerner notification is present and collapsed', async () => {
    await element(by.text('Health')).atIndex(0).tap()
    await openMessages()
    await expect(element(by.text(CernerIdConstants.CERNER_NOTE_MESSAGES_HEADER_TEXT))).toExist()
    await expect(element(by.text(CernerIdConstants.CERNER_NOTE_MESSAGES_TEXT))).not.toExist()
  })

  it('verify the correct information is displayed for multiple facilities', async () => {
    await element(by.text(CernerIdConstants.CERNER_NOTE_MESSAGES_HEADER_TEXT)).tap()
    await expect(element(by.text('Sending a message to a care team at one of these health facilities?'))).toExist()
    await expect(element(by.text('Cheyenne VA Medical Center'))).toExist()
    await expect(element(by.text('Cary VA Medical Center'))).toExist()
    await expect(
      element(
        by.text(
          "These facilities currently use our My VA Health portal. You'll need to go there to send your message.",
        ),
      ),
    ).toExist()
    await expect(element(by.id(CernerIdConstants.GO_TO_VA_HEALTH_LINK_ID))).toExist()
  })
})
