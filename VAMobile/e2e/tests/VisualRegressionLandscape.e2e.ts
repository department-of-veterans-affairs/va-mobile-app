/*
Description:
Detox script that runs landscape accessibility tests for visual regression.
Navigates to each page, rotates to landscape, verifies content visibility, and takes a screenshot.
The script can run either as a full suite or a subset:
* Full suite: The script will check every page outlined in navigationDic. A full suite run occurs
* either on the nightly dev build or when you check "run full e2e test" in the workflow options
* (if running manually).
* Subset: The script will only check the pages where the test name given in the array matches
* the test name typed into the "List tests to test in" workflow option.
When to update:
Update VisualRegressionShared.ts whenever a new feature/new page that has the bottom nav bar is added to the app.
See https://department-of-veterans-affairs.github.io/va-mobile-app/docs/QA/QualityAssuranceProcess/Automation/AddingNewFeatures for more information.
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
