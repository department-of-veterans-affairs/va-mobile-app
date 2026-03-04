import { by, element, expect, waitFor } from 'detox'

import { MessagesE2eIdConstants } from './Messages.e2e'
import { CommonE2eIdConstants, changeDemoModeUser, loginToDemoMode, openHealth, openMessages } from './utils'

export const OHMigrationIdConstants = {
  DESIRED_DEMO_MODE_USER_ID: 'Kimberly For OH Migration',
  OH_ALERT_HEADING_TEXT: "You can't use messages to contact some facilities right now",
  FACILITY_NAME_TEXT: 'Test VA Medical Center',
}

beforeAll(async () => {
  await loginToDemoMode()
  await changeDemoModeUser(OHMigrationIdConstants.DESIRED_DEMO_MODE_USER_ID)
})

describe('OH Migration Messages', () => {
  it('should navigate to messages and open a message with a blocking migration phase', async () => {
    await openHealth()
    await openMessages()
    await waitFor(element(by.id(MessagesE2eIdConstants.MESSAGE_1_ID)))
      .toBeVisible()
      .whileElement(by.id(MessagesE2eIdConstants.MESSAGES_ID))
      .scroll(100, 'down')
    await element(by.id(MessagesE2eIdConstants.MESSAGE_1_ID)).tap()
  })

  it('should show the OH migration alert on the message detail screen', async () => {
    await waitFor(element(by.text(OHMigrationIdConstants.OH_ALERT_HEADING_TEXT)))
      .toBeVisible()
      .whileElement(by.id(CommonE2eIdConstants.VIEW_MESSAGE_ID))
      .scroll(200, 'down')
    await expect(element(by.text(OHMigrationIdConstants.OH_ALERT_HEADING_TEXT))).toExist()
  })

  it('should hide the Reply button when migration blocks replies', async () => {
    await expect(element(by.id(MessagesE2eIdConstants.REVIEW_MESSAGE_REPLY_ID))).not.toExist()
  })

  it('should hide the Start new message button when migration blocks replies', async () => {
    await expect(element(by.id(CommonE2eIdConstants.START_NEW_MESSAGE_BUTTON_ID))).not.toBeVisible()
  })

  it('should hide the How to get help sooner for urgent needs text when migration blocks replies', async () => {
    await expect(element(by.text(MessagesE2eIdConstants.ONLY_USE_MESSAGES_TEXT))).not.toExist()
  })

  it('should hide the older than 45 days alert when migration blocks replies', async () => {
    await expect(element(by.id('secureMessagingOlderThan45DaysAlertID'))).not.toExist()
  })

  it('should hide the not in triage team alert when migration blocks replies', async () => {
    await expect(element(by.id('secureMessagingYouCanNoLongerAlertID'))).not.toExist()
  })

  it('should display the facility name in the migration alert', async () => {
    await element(by.id(CommonE2eIdConstants.VIEW_MESSAGE_ID)).scrollTo('top')
    await waitFor(element(by.text(OHMigrationIdConstants.OH_ALERT_HEADING_TEXT)))
      .toBeVisible()
      .whileElement(by.id(CommonE2eIdConstants.VIEW_MESSAGE_ID))
      .scroll(200, 'down')
    await element(by.text(OHMigrationIdConstants.OH_ALERT_HEADING_TEXT)).tap()
    await waitFor(element(by.text(OHMigrationIdConstants.FACILITY_NAME_TEXT)))
      .toBeVisible()
      .whileElement(by.id(CommonE2eIdConstants.VIEW_MESSAGE_ID))
      .scroll(200, 'down')
    await expect(element(by.text(OHMigrationIdConstants.FACILITY_NAME_TEXT))).toExist()
  })
})
