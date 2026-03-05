import { by, element, expect } from 'detox'

import { CommonE2eIdConstants, launchAppWithDemoMode, openProfile } from './utils'

describe('Demo Launch Verification', () => {
  it('should launch directly into demo mode with Benjamin Adams', async () => {
    // Launch app with Benjamin Adams
    await launchAppWithDemoMode(CommonE2eIdConstants.DEMO_USER_BENJAMIN_ADAMS)

    // Verify we are logged in as Benjamin Adams
    await openProfile()
    await expect(element(by.text('Benjamin Adams'))).toExist()
  })

  it('should launch directly into demo mode with Kimberly Washington', async () => {
    // Launch app with Kimberly Washington
    await launchAppWithDemoMode(CommonE2eIdConstants.DEMO_USER_KIMBERLY_WASHINGTON)

    // Verify we are logged in as Kimberly Washington
    await openProfile()
    await expect(element(by.text('Kimberly Washington'))).toExist()
  })
})
