import { element, by, expect, waitFor } from 'detox'
import getEnv from '../../src/utils/env'

export const CommonE2eIdConstants = {
  VA_LOGO_ICON_ID: 'va-icon',
  DEMO_MODE_INPUT_ID: 'demo-mode-password',
  DEMO_BTN_ID: 'demo-btn',
  SIGN_IN_BTN_ID: 'Sign in',
  SKIP_BTN_TEXT: 'Skip',
  VETERAN_CRISIS_LINE_BTN_ID: 'talk-to-the-veterans-crisis-line-now',
  PROFILE_TAB_BUTTON_TEXT: 'Profile',
  SETTINGS_ROW_TEXT: 'Settings',
  SIGN_OUT_BTN_ID: 'Sign out',
  SIGN_OUT_CONFIRM_TEXT: 'Are you sure you want to sign out?',
  BACK_BTN_LABEL: 'Back',
  LEAVING_APP_POPUP_TEXT: 'You’re leaving the app',
  CANCEL_UNIVERSAL_TEXT: 'Cancel'
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

/** This function will open, check for, and dismiss the leaving app popup from a specified launching point
 * 
 * @param matchString - string of the text or id to match
 * @param findbyText - boolean to search by testID or Text
 */
export async function openDismissLeavingAppPopup(matchString: string, findbyText = false) {
  if (findbyText) {
    await element(by.text(matchString)).tap()
  } else {
    await element(by.id(matchString)).tap()
  }

  await expect(element(by.text(CommonE2eIdConstants.LEAVING_APP_POPUP_TEXT))).toExist()
  await element(by.text(CommonE2eIdConstants.CANCEL_UNIVERSAL_TEXT)).tap()
}

/**
 * Single-source collection for 'open this screen' functions
 * Having multiple functions repeats the line of code, but
 * Have a single file to update if the matchers change (here, vs scattered throughout tests files)
 * And can have a more specific & readable name for each function
*/
 export async function openVeteransCrisisLine() { 
  await element(by.id(CommonE2eIdConstants.VETERAN_CRISIS_LINE_BTN_ID)).tap()
}

export async function openProfile() {
  await element(by.text(CommonE2eIdConstants.PROFILE_TAB_BUTTON_TEXT)).tap() 
}

export async function openSettings() {
  await element(by.text(CommonE2eIdConstants.SETTINGS_ROW_TEXT)).tap() 
}

