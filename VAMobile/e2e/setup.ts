import { device } from 'detox'

import { CommonE2eIdConstants, toggleRemoteConfigFlag } from './tests/utils'

beforeAll(async () => {
  await device.launchApp({ newInstance: true, permissions: { notifications: 'YES' } })
  await toggleRemoteConfigFlag(CommonE2eIdConstants.CLAIM_PHASE_TOGGLE_TEXT)
})
