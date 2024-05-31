import { device } from 'detox'

beforeAll(async () => {
  await device.terminateApp()
  await device.launchApp({ newInstance: true, permissions: { notifications: 'YES' } })
})
