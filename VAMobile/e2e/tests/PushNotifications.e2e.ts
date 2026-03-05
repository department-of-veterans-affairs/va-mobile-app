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
    url: 'vamobile://messages/2092809',
  },
}

//This script is only run on iOS because there are additional requirements that can't be met for Android
describe(':ios: Push Notifications', () => {
  it('dead state: should navigate to appropriate screen when launching', async () => {
    await launchAppWithDemoMode(CommonE2eIdConstants.DEMO_USER_KIMBERLY_WASHINGTON, true, true)
    await waitFor(element(by.text(PushNotificationsConstants.REVIEW_MESSAGE_SCREEN_TITLE)))
      .toExist()
      .withTimeout(8000)
  })

  it('should navigate back to home screen after launch', async () => {
    await element(by.text('Back')).atIndex(0).tap()
    await waitFor(element(by.text(PushNotificationsConstants.MESSAGE_COMPOSE_BUTTON_TEXT))).toExist()
    await element(by.text('Back')).atIndex(0).tap()
    await expect(element(by.text('Home'))).toExist()
  })

  it('background: should navigate to appropriate screen', async () => {
    await launchAppWithDemoMode()
    await device.sendToHome()
    await device.launchApp({ newInstance: false, userNotification: mockNotification })
    await waitFor(element(by.text(PushNotificationsConstants.REVIEW_MESSAGE_SCREEN_TITLE)))
      .toExist()
      .withTimeout(8000)
  })

  it('foreground: should navigate to appropriate screen', async () => {
    await launchAppWithDemoMode()
    await device.sendUserNotification(mockNotification)
    await waitFor(element(by.text(PushNotificationsConstants.REVIEW_MESSAGE_SCREEN_TITLE)))
      .toExist()
      .withTimeout(8000)
  })
})
