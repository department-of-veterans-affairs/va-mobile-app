import { context } from 'testUtils'
import { notificationsEnabled } from 'utils/notifications'
import { isIOS } from 'utils/platform'

jest.mock('react-native-notifications', () => ({
  Notifications: {
    ios: {
      checkPermissions: jest.fn().mockResolvedValue({ alert: true }),
    },
  },
}))

jest.mock('react-native', () => {
  const reactNative = jest.requireActual('react-native')
  reactNative.NativeModules.RNNotificationPrefs = {
    notificationsOn: jest.fn().mockResolvedValue(true),
  }

  return reactNative
})

jest.mock('utils/platform', () => ({
  isIOS: jest.fn().mockResolvedValueOnce(true),
}))

context('notifications', () => {
  it('should check if ios notifications are enabled', async () => {
    const enabled = await notificationsEnabled()
    expect(enabled).toEqual(true)
  })

  it('should check if android notifications are enabled', async () => {
    ;(isIOS as jest.Mock).mockResolvedValueOnce(false)
    const enabled = await notificationsEnabled()
    expect(enabled).toEqual(true)
  })
})
