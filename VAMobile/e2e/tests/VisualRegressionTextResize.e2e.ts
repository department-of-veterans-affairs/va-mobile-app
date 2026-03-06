/*
Description:
Detox script that runs text resize accessibility tests for navigation regression.
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

// OS-level commands to simulate accessibility settings for high-density and large font scales
const FONT_RESIZING_LARGEST =
  device.getPlatform() === 'ios'
    ? 'xcrun simctl ui booted content_size extra-extra-extra-large'
    : 'adb shell settings put system font_scale 1.30'
const DISPLAY_RESIZING_LARGEST = device.getPlatform() === 'android' ? 'adb shell wm density 728' : ''
const FONT_RESIZING_RESET =
  device.getPlatform() === 'ios'
    ? 'xcrun simctl ui booted content_size medium'
    : 'adb shell settings put system font_scale 1.00'
const DISPLAY_RESIZING_RESET = 'adb shell wm density reset'

// Before all tests, set device font and display scales to the largest available settings
beforeAll(async () => {
  await toggleRemoteConfigFlag(CommonE2eIdConstants.IN_APP_REVIEW_TOGGLE_TEXT)
  await loginToDemoMode()
  execCommand(FONT_RESIZING_LARGEST)
  await setTimeout(2000)
  if (device.getPlatform() === 'android') {
    execCommand(DISPLAY_RESIZING_LARGEST)
    await setTimeout(2000)
  }
})

afterAll(async () => {
  execCommand(FONT_RESIZING_RESET)
  if (device.getPlatform() === 'android') {
    execCommand(DISPLAY_RESIZING_RESET)
  }
})

describe('Visual Regression - Text Resize', () => {
  let testsRun = false
  // Loop through all navigation scenarios and verify readability with large text
  for (const [key, value] of Object.entries(navigationDic)) {
    for (let j = 0; j < value.length; j++) {
      const nameArray = value[j]
      const testName = getTestName(nameArray)
      if (shouldRunTest(nameArray, value)) {
        testsRun = true
        if (testName !== 'Community care' && testName !== 'Claim exam') {
          it('verify navigation text resizing for: ' + testName, async () => {
            if (device.getPlatform() === 'ios') {
              const verifyText = value[j][2] as string
              // Step 1: Navigate to page with large font size active
              await navigateToPage(key, value[j])
              // Step 2: Verify accessibility and take screenshot
              await detoxExpect(element(by.text(verifyText)).atIndex(0)).toExist()
              const feature = await device.takeScreenshot(verifyText)
              await checkImages(feature)
              try {
                await element(by.id(key)).tap()
              } catch (ex) {
                await element(by.text(key)).atIndex(0).tap()
              }
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
