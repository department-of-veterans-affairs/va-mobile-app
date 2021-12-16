import { element, by, expect, waitFor } from 'detox'
import getEnv from '../../src/utils/env'

export const CommonE2eIdConstants = {
  VA_LOGO_ICON_ID: 'va-icon',
  DEMO_MODE_INPUT_ID: 'demo-mode-password',
  DEMO_BTN_ID: 'demo-btn',
  SIGN_IN_BTN_ID: 'Sign In',
  SKIP_BTN_TEXT: 'Skip',
  VETERAN_CRISIS_LINE_BTN_ID: 'talk-to-the-veterans-crisis-line-now',
}

/** Log the automation into demo mode
 * */
export async function loginToDemoMode() {
  const { DEMO_PASSWORD } = getEnv()
  await element(by.id(CommonE2eIdConstants.VA_LOGO_ICON_ID)).multiTap(21)
  await element(by.id(CommonE2eIdConstants.DEMO_MODE_INPUT_ID)).typeText(DEMO_PASSWORD)

  // due to keyboard being open one tap to close keyboard second to tap demo btn
  await element(by.id(CommonE2eIdConstants.DEMO_BTN_ID)).multiTap(2)

  await element(by.text(CommonE2eIdConstants.SIGN_IN_BTN_ID)).tap()

  const ifCarouselSkipBtnExist = await checkIfElementIsPresent(CommonE2eIdConstants.SKIP_BTN_TEXT, true)

  if (ifCarouselSkipBtnExist) {
    await element(by.text(CommonE2eIdConstants.SKIP_BTN_TEXT)).tap()
  }
}

/** this function is to see if a element is present that could sometime not be like the carousel for example
 * which will perform a check without actually performing a test and return true or false
 *
 * @param matchString - string of the text or id to match
 * @param findbyText - boolean to search by testID or Text
 * @param waitForElement - boolean to wait for an element
 * @param timeOut - time to wait for the element
 * */

const checkIfElementIsPresent = async (matchString: string, findbyText = false, waitForElement = false, timeOut = 2000) => {
  try {
    if (findbyText) {
      if (waitForElement) {
        waitFor(element(by.text(matchString)))
          .toExist()
          .withTimeout(timeOut)
      } else {
        await expect(element(by.text(matchString))).toExist()
      }
    } else {
      if (waitForElement) {
        waitFor(element(by.id(matchString)))
          .toExist()
          .withTimeout(timeOut)
      } else {
        await expect(element(by.id(matchString))).toExist()
      }
    }
    return true
  } catch (e) {
    return false
  }
}
