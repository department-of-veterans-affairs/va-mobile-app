import { device } from 'detox'

beforeAll(async () => {
  device.disableSynchronization()
  await device.launchApp({ newInstance: true, permissions: { notifications: 'YES' } })
  device.enableSynchronization()
})
