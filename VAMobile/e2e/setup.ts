import { device } from 'detox'

beforeAll(async () => {
  await device.launchApp({ newInstance: true, permissions: { notifications: 'NO' } })
})
