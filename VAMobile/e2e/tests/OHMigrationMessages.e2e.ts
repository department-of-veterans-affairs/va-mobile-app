import { by, element, expect, waitFor } from 'detox'

import { MessagesE2eIdConstants } from './MessagesConstants'
import { CommonE2eIdConstants, launchAppWithDemoMode, openHealth, openMessages } from './utils'

export const OHMigrationIdConstants = {
  DESIRED_DEMO_MODE_USER_ID: CommonE2eIdConstants.DEMO_USER_KIMBERLY_OH_MIGRATION,
  OH_ALERT_HEADING_TEXT: "You can't reply to conversations at some facilities",
  FACILITY_NAME_TEXT: 'Test VA Medical Center',
}

beforeAll(async () => {
  await launchAppWithDemoMode(CommonE2eIdConstants.DEMO_USER_KIMBERLY_OH_MIGRATION)
  await openHealth()
  await openMessages()
})

describe('OH Migration Messages', () => {
  it('should navigate to messages and open a message with a blocking migration phase', async () => {
    await waitFor(element(by.id(MessagesE2eIdConstants.MESSAGE_1_ID)))
      .toBeVisible()
      .whileElement(by.id(MessagesE2eIdConstants.MESSAGES_ID))
      .scroll(100, 'down')
    await element(by.id(MessagesE2eIdConstants.MESSAGE_1_ID)).tap()
  })

  it('should show the OH migration reply alert on the message detail screen', async () => {
    await expect(element(by.text(OHMigrationIdConstants.OH_ALERT_HEADING_TEXT))).toExist()
  })

  it('should display the facility name in the migration alert', async () => {
    await expect(element(by.text(OHMigrationIdConstants.FACILITY_NAME_TEXT))).toExist()
  })

  it('should hide the Reply button when migration blocks replies', async () => {
    await expect(element(by.id(MessagesE2eIdConstants.REVIEW_MESSAGE_REPLY_ID))).not.toExist()
  })

  it('should show the Start new message button as a fallback when migration blocks replies', async () => {
    await expect(element(by.id(CommonE2eIdConstants.START_NEW_MESSAGE_BUTTON_ID))).toExist()
  })

  it('should hide the Only use messages for non-urgent needs text when migration blocks replies', async () => {
    await expect(element(by.text(MessagesE2eIdConstants.ONLY_USE_MESSAGES_TEXT))).not.toExist()
  })

  it('should hide the older than 45 days alert when migration blocks replies', async () => {
    await expect(element(by.id('secureMessagingOlderThan45DaysAlertID'))).not.toExist()
  })

  it('should hide the not in triage team alert when migration blocks replies', async () => {
    await expect(element(by.id('secureMessagingYouCanNoLongerAlertID'))).not.toExist()
  })
})
