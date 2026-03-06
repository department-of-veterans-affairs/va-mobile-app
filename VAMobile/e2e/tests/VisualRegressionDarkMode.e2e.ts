/*
Description:
Detox script that runs dark mode accessibility tests for navigation regression.
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
import { setTimeout } from 'timers/promises'

import { execCommand, getTestName, navigateToPage, navigationDic, shouldRunTest } from './VisualRegressionShared'
import { CommonE2eIdConstants, checkImages, loginToDemoMode, toggleRemoteConfigFlag } from './utils'

// Shell commands to toggle OS-level appearance settings via simulator/emulator CLI
const DARK_MODE_OPTIONS =
  device.getPlatform() === 'ios' ? 'xcrun simctl ui booted appearance dark' : 'adb shell "cmd uimode night yes"'
const LIGHT_MODE_OPTIONS =
  device.getPlatform() === 'ios' ? 'xcrun simctl ui booted appearance light' : 'adb shell "cmd uimode night no"'

// Before all tests, toggle config flags, login, and set the device to dark mode appearance
beforeAll(async () => {
  await toggleRemoteConfigFlag(CommonE2eIdConstants.IN_APP_REVIEW_TOGGLE_TEXT)
  await loginToDemoMode()
  execCommand(DARK_MODE_OPTIONS)
  await setTimeout(2000)
})

afterAll(async () => {
  execCommand(LIGHT_MODE_OPTIONS)
})

describe('Visual Regression - Dark Mode', () => {
  let testsRun = false
  // Iterate through all bottom tabs defined in navigationDic (Home, Benefits, Health, Payments)
  for (const [key, value] of Object.entries(navigationDic)) {
    // Iterate through each navigation test case defined for the current bottom tab
    for (let j = 0; j < value.length; j++) {
      const nameArray = value[j]
      const testName = getTestName(nameArray)
      if (shouldRunTest(nameArray, value)) {
        testsRun = true
        if (testName !== 'Community care' && testName !== 'Claim exam') {
          it('verify navigation dark mode for: ' + testName, async () => {
            const verifyText = value[j][2] as string
            // Step 1: Navigate to the target page using the shared navigation utility
            await navigateToPage(key, value[j])
            // Step 2: Verify that the expected text exists on the page
            await detoxExpect(element(by.text(verifyText)).atIndex(0)).toExist()
            // Step 3: Take a screenshot for visual regression check
            const feature = await device.takeScreenshot(verifyText)
            await checkImages(feature)
          })
        }
      }
    }
  }
  if (!testsRun) {
    it('no Nav changes', async () => {})
  }
})
