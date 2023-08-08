import { by, device, element, expect, waitFor } from 'detox'
import { backButton, loginToDemoMode } from './utils';

const PushNotificationsConstants = {
  HEALTH_SCREEN_TITLE: 'Health',
  MESSAGE_COMPOSE_BUTTON_TEXT: 'Start new message',
  REVIEW_MESSAGE_SCREEN_TITLE: 'Review message'
}

const mockNotification = {
  "trigger": {
    "type": "push"
  },
  "title": "New Secure Message",
  "body": "Review your messages in the health care section of the VA app",
  "payload": {
    "url": "vamobile://messages/2092809"
  },
}

describe('Push Notifications', () => {
  it('should navigate to appropriate screen when launching the app from a dead state', async () => {
    await device.launchApp({delete: true, permissions: {notifications: 'YES'}, newInstance: true, userNotification: mockNotification});
    await loginToDemoMode()
    await waitFor(element(by.text(PushNotificationsConstants.REVIEW_MESSAGE_SCREEN_TITLE))).toExist().withTimeout(8000)
  });

  it('should navigate back to home screen after launch', async() => {
    await backButton()
    await waitFor(element(by.text(PushNotificationsConstants.MESSAGE_COMPOSE_BUTTON_TEXT))).toExist()
    await backButton()
    await expect(element(by.text('Home'))).toExist()
  });

  it('should navigate to appropriate screen when the app is in the background', async () => {
    await device.launchApp({newInstance: true});
    await loginToDemoMode()
    await device.sendToHome();
    await device.launchApp({newInstance: false, userNotification: mockNotification});
    await waitFor(element(by.text(PushNotificationsConstants.REVIEW_MESSAGE_SCREEN_TITLE))).toExist().withTimeout(8000)
  });

  it('should navigate to appropriate screen when the app is in the foreground', async () => {
    await device.launchApp({newInstance: true});
    await loginToDemoMode()
    await device.sendUserNotification(mockNotification);
    await waitFor(element(by.text(PushNotificationsConstants.REVIEW_MESSAGE_SCREEN_TITLE))).toExist().withTimeout(8000)
  });
});
