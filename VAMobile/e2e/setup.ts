import { device } from 'detox'

jest.retryTimes(3)
beforeAll(async () => {
  await device.launchApp({ newInstance: true, permissions: { notifications: 'YES' } })
})
