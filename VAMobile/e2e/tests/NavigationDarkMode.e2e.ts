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
Update NavigationShared.ts whenever a new feature/new page that has the bottom nav bar is added to the app.
See https://department-of-veterans-affairs.github.io/va-mobile-app/docs/QA/QualityAssuranceProcess/Automation/AddingNewFeatures for more information.
*/
import { exec } from 'child_process'
import { by, device, element, expect } from 'detox'
import { setTimeout } from 'timers/promises'

import { navigateToPage, navigationDic } from './NavigationShared'
import { CommonE2eIdConstants, checkImages, loginToDemoMode, toggleRemoteConfigFlag } from './utils'

let navigationValue = process.argv[7]

if (navigationValue === undefined) {
  navigationValue = process.argv[6]
}

const DARK_MODE_OPTIONS =
  device.getPlatform() === 'ios' ? 'xcrun simctl ui booted appearance dark' : 'adb shell "cmd uimode night yes"'
const LIGHT_MODE_OPTIONS =
  device.getPlatform() === 'ios' ? 'xcrun simctl ui booted appearance light' : 'adb shell "cmd uimode night no"'

beforeAll(async () => {
  await toggleRemoteConfigFlag(CommonE2eIdConstants.IN_APP_REVIEW_TOGGLE_TEXT)
  await loginToDemoMode()
  exec(DARK_MODE_OPTIONS, (error: Error | null) => {
    if (error) {
      console.error(`exec error: ${error}`)
      return
    }
  })
  await setTimeout(2000)
})

afterAll(async () => {
  exec(LIGHT_MODE_OPTIONS, (error: Error | null) => {
    if (error) {
      console.error(`exec error: ${error}`)
      return
    }
  })
})

describe('Navigation - Dark Mode', () => {
  let testsRun = false
  for (const [key, value] of Object.entries(navigationDic)) {
    for (let j = 0; j < value.length; j++) {
      const nameArray = value[j]
      let testName = nameArray[2]
      if (
        nameArray[2] ===
        'To access or update your sign-in information, go to the website where you manage your account information. Any updates you make there will automatically update on the mobile app.'
      ) {
        testName = 'Account security'
      }
      let runTest = false
      if (nameArray[0] instanceof Array) {
        for (let z = 0; z < value.length; z++) {
          if (navigationValue === nameArray[0][z]) {
            runTest = true
          }
        }
      } else if (navigationValue === nameArray[0]) {
        runTest = true
      }
      if (runTest === true || navigationValue === undefined) {
        testsRun = true
        if (testName !== 'Community care' && testName !== 'Claim exam') {
          it('verify navigation dark mode for: ' + testName, async () => {
            const verifyText = value[j][2] as string
            await navigateToPage(key, value[j])
            await expect(element(by.text(verifyText)).atIndex(0)).toExist()
            const feature = await device.takeScreenshot(verifyText)
            checkImages(feature)
          })
        }
      }
    }
  }
  if (!testsRun) {
    it('no Nav changes', async () => {})
  }
})
