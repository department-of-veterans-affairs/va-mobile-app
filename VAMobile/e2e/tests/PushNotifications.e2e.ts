/*
Description:
Detox script that follows the notifications test cases found in testRail (VA Mobile App > Active/Organized Cases > Home > Profile > Settings > Notifications)
More information about detox and mocking user notifications can be found here: https://wix.github.io/Detox/docs/guide/mocking-user-notifications
When to update:
This script should be updated whenever any new notification types are added to the app and or if anything changes on how the notification is displayed in the app.
*/
import { by, device, element, expect, waitFor } from 'detox'

import { CommonE2eIdConstants, launchAppWithDemoMode } from './utils'

const PushNotificationsConstants = {
  MESSAGE_COMPOSE_BUTTON_TEXT: 'Start new message',
  REVIEW_MESSAGE_SCREEN_TITLE: 'Review message',
}

const mockNotification = {
  trigger: {
    type: 'push',
  },
  title: 'New Secure Message',
  body: 'Review your messages in the health care section of the VA app',
  payload: {
    url: 'vamobile://messages/2092809?demo=true&skipOnboarding=true&skipNotifications=true',
  },
}

//This script is only run on iOS because there are additional requirements that can't be met for Android
describe(':ios: Push Notifications', () => {
  it('dead state: should navigate to appropriate screen when launching', async () => {
    // 115452: We need to launch with demo mode first to establish the session,
    // then relaunch with the notification to test "dead state" navigation.
    await launchAppWithDemoMode(CommonE2eIdConstants.DEMO_USER_KIMBERLY_WASHINGTON, true, false, true)
    await device.launchApp({ newInstance: true, userNotification: mockNotification })

    await waitFor(element(by.id('viewMessageTestID')))
      .toExist()
      .withTimeout(20000)

    // Verify navigation back
    await waitFor(element(by.id('backToMessagesID')))
      .toExist()
      .withTimeout(20000)
    await element(by.id('backToMessagesID')).tap()

    await waitFor(element(by.id('messagesTestID')))
      .toExist()
      .withTimeout(20000)
    await waitFor(element(by.id('startNewMessageButtonTestID')))
      .toExist()
      .withTimeout(20000)
    await element(by.id('messagesBackID')).tap()

    await waitFor(element(by.text('Home')))
      .toExist()
      .withTimeout(20000)
  })

  it('background: should navigate to appropriate screen', async () => {
    await launchAppWithDemoMode(undefined, true, false, true)
    await device.sendToHome()
    await device.launchApp({ newInstance: false, userNotification: mockNotification })
    await waitFor(element(by.id('viewMessageTestID')))
      .toExist()
      .withTimeout(20000)
  })

  it('foreground: should navigate to appropriate screen', async () => {
    await launchAppWithDemoMode(undefined, true, false, true)
    await device.sendUserNotification(mockNotification)
    await waitFor(element(by.id('viewMessageTestID')))
      .toExist()
      .withTimeout(20000)
  })
})
