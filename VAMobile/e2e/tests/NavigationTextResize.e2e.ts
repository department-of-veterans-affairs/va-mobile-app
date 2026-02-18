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

beforeAll(async () => {
  await toggleRemoteConfigFlag(CommonE2eIdConstants.IN_APP_REVIEW_TOGGLE_TEXT)
  await loginToDemoMode()
  exec(FONT_RESIZING_LARGEST, (error: Error | null) => {
    if (error) {
      console.error(`exec error: ${error}`)
      return
    }
  })
  if (device.getPlatform() === 'android') {
    exec(DISPLAY_RESIZING_LARGEST, (error: Error | null) => {
      if (error) {
        console.error(`exec error: ${error}`)
        return
      }
    })
    await setTimeout(2000)
  }
})

afterAll(async () => {
  exec(FONT_RESIZING_RESET, (error: Error | null) => {
    if (error) {
      console.error(`exec error: ${error}`)
      return
    }
  })
  if (device.getPlatform() === 'android') {
    exec(DISPLAY_RESIZING_RESET, (error: Error | null) => {
      if (error) {
        console.error(`exec error: ${error}`)
        return
      }
    })
  }
})

describe('Navigation - Text Resize', () => {
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
          it('verify navigation text resizing for: ' + testName, async () => {
            if (device.getPlatform() === 'ios') {
              const verifyText = value[j][2] as string
              await navigateToPage(key, value[j])
              await expect(element(by.text(verifyText)).atIndex(0)).toExist()
              const feature = await device.takeScreenshot(verifyText)
              checkImages(feature)
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
