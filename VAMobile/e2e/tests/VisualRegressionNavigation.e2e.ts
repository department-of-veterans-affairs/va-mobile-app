/*
Description:
Detox script that runs navigation state persistence tests for visual regression.
The script navigates to each page outlined in navigationDic, switches to all other
bottom tabs, switches back, and verifies the page is still active.
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
import { by, expect as detoxExpect, element } from 'detox'

import { getTestName, navigateToPage, navigationDic, shouldRunTest } from './VisualRegressionShared'
import { CommonE2eIdConstants, loginToDemoMode, toggleRemoteConfigFlag } from './utils'

const appTabs = ['Home', 'Benefits', 'Health', 'Payments']

beforeAll(async () => {
  await toggleRemoteConfigFlag(CommonE2eIdConstants.IN_APP_REVIEW_TOGGLE_TEXT)
  await loginToDemoMode()
})

describe('Visual Regression - Navigation Persistence', () => {
  let testsRun = false
  // Iterate through all bottom tabs defined in navigationDic (Home, Benefits, Health, Payments)
  for (const [key, value] of Object.entries(navigationDic)) {
    // Iterate through each navigation test case defined for the current bottom tab
    for (let j = 0; j < value.length; j++) {
      const nameArray = value[j]
      const testName = getTestName(nameArray)
      if (shouldRunTest(nameArray)) {
        testsRun = true
        it('verify navigation for: ' + testName, async () => {
          const verifyText = value[j][2] as string
          // Step 1: Navigate to the target page using the shared navigation utility
          await navigateToPage(key, value[j])
          // Step 2: Verify that the expected text exists on the page
          await detoxExpect(element(by.text(verifyText)).atIndex(0)).toExist()
          // Step 3: Switch to every other tab, switch back, and ensure state was persisted
          for (let i = 0; i < appTabs.length; i++) {
            if (appTabs[i] !== key) {
              await element(by.text(appTabs[i])).atIndex(0).tap()
              await element(by.text(key)).atIndex(0).tap()
              await detoxExpect(element(by.text(verifyText)).atIndex(0)).toExist()
            }
          }
        })
      }
    }
  }
  if (!testsRun) {
    it('no Nav changes', async () => {})
  }
})
