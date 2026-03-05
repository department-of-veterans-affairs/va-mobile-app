import { by, device, element, expect, waitFor } from 'detox'
import { setTimeout } from 'timers/promises'

import {
  CommonE2eIdConstants,
  launchAppWithDemoMode,
  openDeveloperScreen,
  openHealth,
  openMessages,
  openProfile,
  openSettings,
  scrollToIDThenTap,
} from './utils'

export const CernerIdConstants = {
  GO_TO_VA_HEALTH_LINK_ID: 'goToMyVAHealthTestID',
  HEALTH_CATEGORY_ID: 'healthCategoryTestID',
  CERNER_NOTE_HEADING_TEXT: 'Some of your care team uses My VA Health',
  CERNER_NOTE_HEADING_ID: 'cernerAlertTestID',
  CERNER_NOTE_RECORDS_SHOW_TEXT: "You'll need to use our My VA Health portal to manage your care at these facilities:",
  CERNER_NOTE_FACILITY_TEXT: 'Cary VA Medical Center',
  CERNER_NOTE_MESSAGES_TEXT: "To manage your care at these facilities you'll need to use our My VA Health portal.",
  CERNER_NOTE_MESSAGES_HEADER_TEXT: 'Some of your care team uses My VA Health',
  CERNER_HOME_SUBTEXT_TEXT: 'Information from My VA Health portal not included.',
  CERNER_PANEL_MULTI_ALL_TEXT: 'Your care team uses My VA Health',
  CERNER_PANEL_MANAGE_MULTI_TEXT: "You'll need to use our My VA Health portal to manage your care at these facilities:",
  CERNER_HEALTH_HELP_SUBTEXT_TEXT:
    "Some care teams use My VA Health. Information from that health portal isn't included here.",
  CERNER_HEALTH_HELP_LINK_TEXT: 'Check if your care team uses My VA Health',
  MESSAGES_ID: 'messagesTestID',
}

beforeAll(async () => {
  if (device.getPlatform() === 'android') {
    // turns on Cerner demo mode
    await toggleRemoteConfigFlag('cernerTrueForDemo')
    await launchAppWithDemoMode(CommonE2eIdConstants.DEMO_USER_DENNIS_MADISON)
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

  it('tap on messages and verify the cerner notification is present and collapsed', async () => {
    await openHealth()
    await openMessages()
    await expect(element(by.id(CernerIdConstants.CERNER_NOTE_HEADING_ID))).toExist()
    await expect(element(by.text(CernerIdConstants.CERNER_NOTE_MESSAGES_TEXT))).not.toExist()
  })

  it('verify the correct information is displayed', async () => {
    await element(by.id(CernerIdConstants.CERNER_NOTE_HEADING_ID)).tap()
    await expect(element(by.text(CernerIdConstants.CERNER_NOTE_MESSAGES_TEXT))).toExist()
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
    await element(by.id(CernerIdConstants.MESSAGES_ID)).swipe('down')
    await element(by.text(CernerIdConstants.CERNER_NOTE_HEADING_TEXT)).tap()
    await expect(element(by.text(CernerIdConstants.CERNER_NOTE_MESSAGES_TEXT))).not.toExist()
  })
})
