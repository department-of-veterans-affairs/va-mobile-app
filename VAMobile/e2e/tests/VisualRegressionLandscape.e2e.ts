/*
Description:
Detox script that runs landscape accessibility tests for navigation regression.
Specifically checks if the screen content remains accessible and correct when rotated.
*/
import { by, expect as detoxExpect, device, element } from 'detox'

import { getTestName, navigateToPage, navigationDic, shouldRunTest } from './VisualRegressionShared'
import { CommonE2eIdConstants, checkImages, loginToDemoMode, toggleRemoteConfigFlag } from './utils'

beforeAll(async () => {
  await toggleRemoteConfigFlag(CommonE2eIdConstants.IN_APP_REVIEW_TOGGLE_TEXT)
  await loginToDemoMode()
})

describe('Visual Regression - Landscape', () => {
  let testsRun = false
  // Iterate through all bottom tabs defined in navigationDic
  for (const [key, value] of Object.entries(navigationDic)) {
    // Iterate through each navigation test case
    for (let j = 0; j < value.length; j++) {
      const nameArray = value[j]
      const testName = getTestName(nameArray)
      if (shouldRunTest(nameArray)) {
        testsRun = true
        if (testName !== 'Community care' && testName !== 'Claim exam') {
          it('verify navigation landscape mode for: ' + testName, async () => {
            const verifyText = value[j][2] as string
            // Step 1: Navigate to the target page in portrait mode
            await navigateToPage(key, value[j])
            // Step 2: Set orientation to landscape
            await device.setOrientation('landscape')
            try {
              // Step 3: Verify content visibility and take screenshot
              await detoxExpect(element(by.text(verifyText)).atIndex(0)).toExist()
              const feature = await device.takeScreenshot(verifyText)
              await checkImages(feature)
            } finally {
              await device.setOrientation('portrait')
            }
          })
        }
      }
    }
  }
  if (!testsRun) {
    it('no Nav changes', async () => {})
  }
})
