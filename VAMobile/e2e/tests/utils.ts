import { expect as jestExpect } from '@jest/globals'
import { by, device, element, expect, waitFor } from 'detox'
import { setTimeout } from 'timers/promises'

import getEnv from '../../src/utils/env'

const spawnSync = require('child_process').spawnSync

const { toMatchImageSnapshot } = require('jest-image-snapshot')
const fs = require('fs')
jestExpect.extend({ toMatchImageSnapshot })

const { DEMO_PASSWORD } = getEnv()
const mockNotification = {
  trigger: {
    type: 'push',
  },
  title: 'New Secure Message',
  body: 'Review your messages in the health care section of the VA app',
  payload: {
    url: 'vamobile://messages/2092809',
  },
}

export const CommonE2eIdConstants = {
  VA_LOGO_ICON_ID: 'va-icon',
  DEMO_MODE_INPUT_ID: 'demo-mode-password',
  DEMO_BTN_ID: 'demo-btn',
  SIGN_IN_BTN_ID: 'Sign in',
  SKIP_BTN_TEXT: 'Skip',
  VETERAN_CRISIS_LINE_BTN_TEXT: 'Talk to the Veterans Crisis Line now',
  VETERAN_CRISIS_LINE_BTN_ID: 'veteransCrisisLineID',
  VETERAN_CRISIS_LINE_BACK_ID: 'veteranCrisisLineBackID',
  PROFILE_TAB_BUTTON_TEXT: 'Profile',
  HEALTH_TAB_BUTTON_TEXT: 'Health',
  APPOINTMENTS_TAB_BUTTON_TEXT: 'Appointments',
  PAYMENTS_TAB_BUTTON_TEXT: 'Payments',
  DIRECT_DEPOSIT_ROW_TEXT: 'Direct deposit information',
  BENEFITS_TAB_BUTTON_TEXT: 'Benefits',
  HOME_TAB_BUTTON_TEXT: 'Home',
  PERSONAL_INFORMATION_ROW_TEXT: 'Personal information',
  LETTERS_ROW_TEXT: 'VA letters and documents',
  DISABILITY_RATING_ROW_TEXT: 'Disability rating',
  SETTINGS_ROW_TEXT: 'Settings',
  MILITARY_INFORMATION_ROW_TEXT: 'Military information',
  VACCINE_RECORDS_BUTTON_TEXT: 'V\ufeffA vaccine records',
  MESSAGES_ROW_TEXT: 'Messages',
  BACK_BTN_LABEL: 'Back',
  LEAVING_APP_POPUP_TEXT: 'Leave the mobile app?',
  LEAVING_APP_CANCEL_TEXT: 'Go back',
  LEAVING_APP_LEAVE_TEXT: 'Leave',
  CANCEL_UNIVERSAL_TEXT: 'Cancel',
  PRESCRIPTIONS_BUTTON_TEXT: 'Prescriptions',
  OK_UNIVERSAL_TEXT: 'OK',
  CONTACT_INFORMATION_TEXT: 'Contact information',
  VA_PAYMENT_HISTORY_BUTTON_TEXT: 'VA payment history',
  CLAIMS_BUTTON_TEXT: 'Claims',
  CLAIMS_HISTORY_BUTTON_TEXT: 'Claims history',
  CANCEL_PLATFORM_SPECIFIC_TEXT: device.getPlatform() === 'ios' ? 'Cancel' : 'Cancel ',
  DEVELOPER_SCREEN_ROW_TEXT: 'Developer Screen',
  RESET_INAPP_REVIEW_BUTTON_TEXT: 'Reset in-app review actions',
  REMOTE_CONFIG_TEST_ID: 'remoteConfigTestID',
  REMOTE_CONFIG_BUTTON_TEXT: 'Remote Config',
  APPLY_OVERRIDES_BUTTON_TEXT: 'Apply Overrides',
  OK_PLATFORM_SPECIFIC_TEXT: device.getPlatform() === 'ios' ? 'Ok' : 'OK',
  UPCOMING_APPT_BUTTON_TEXT: 'Upcoming',
  START_NEW_MESSAGE_BUTTON_ID: 'startNewMessageButtonTestID',
  PRESCRIPTION_REFILL_BUTTON_TEXT: 'Start refill request',
  PRESCRIPTION_REFILL_BUTTON_ID: 'refillRequestTestID',
  HOME_ACTIVITY_HEADER_TEXT: 'Activity',
  IN_APP_REVIEW_TOGGLE_TEXT: 'inAppReview',
  CONTACT_INFO_SAVE_ID: 'contactInfoSaveTestID',
  CONTACT_INFO_SUGGESTED_ADDRESS_ID: 'suggestedAddressTestID',
  CONTACT_INFO_USE_THIS_ADDRESS_ID: 'Use this address',
  CONTACT_INFO_STREET_ADDRESS_LINE_2_ID: 'streetAddressLine2TestID',
  CALL_VA_PHONE_NUMBER_ID: 'CallVATestID',
  CALL_VA_TTY_PHONE_NUMBER_ID: 'CallTTYTestID',
  APPOINTMENTS_SCROLL_ID: 'appointmentsTestID',
  GO_TO_VA_GOV_LINK_ID: 'goToVAGovID',
  CLAIMS_HISTORY_SCROLL_ID: 'claimsHistoryID',
  NEXT_PAGE_ID: 'next-page',
  VETERANS_CRISIS_LINE_CALL_ID: 'veteransCrisisLineCallID',
  VETERANS_CRISIS_LINE_TTY_ID: 'veteransCrisisLineHearingLossNumberTestID',
  VETERANS_CRISIS_LINE_TEXT_ID: 'veteransCrisisLineTextNumberTestID',
  VETERANS_CRISIS_LINE_CHAT_ID: 'veteransCrisisLineConfidentialChatTestID',
  PREVIOUS_PAGE_ID: 'previous-page',
  CLAIMS_DETAILS_BACK_ID: 'claimsDetailsBackTestID',
  CLAIMS_HISTORY_BACK_ID: 'claimsHistoryBackTestID',
  CLAIMS_HISTORY_CLOSED_TAB_ID: 'claimsHistoryClosedID',
  DEVELOPER_SCREEN_SCROLL_ID: 'developerScreenTestID',
  HOME_SCREEN_SCROLL_ID: 'homeScreenID',
  PROFILE_SCREEN_SCROLL_ID: 'profileID',
  PRESCRIPTION_HISTORY_SCROLL_ID: 'PrescriptionHistory',
  AF_TYPE_INPUT_FIELD_ID: 'AFTypeTestID',
  AF_ERROR_TITLE_FIELD_ID: 'AFErrorMsgTitleTestID',
  AF_ERROR_BODY_FIELD_ID: 'AFErrorMsgBodyTestID',
  AF_APP_UPDATE_TOGGLE_BUTTON_ID: 'remoteConfigAppUpdateTestID',
  AF_USE_CASE_2_ALERT_ID: 'AFUseCase2TestID',
}

/** Log the automation into demo mode
 * */
export async function loginToDemoMode(skipOnboarding = true, pushNotifications?: boolean) {
  try {
    await waitFor(element(by.id(CommonE2eIdConstants.VA_LOGO_ICON_ID)))
      .toExist()
      .withTimeout(120000)
  } catch (ex) {
    await device.uninstallApp()
    await device.installApp()
    if (pushNotifications) {
      await device.launchApp({
        delete: true,
        permissions: { notifications: 'YES' },
        newInstance: true,
        userNotification: mockNotification,
      })
    } else {
      await device.launchApp({ newInstance: true, permissions: { notifications: 'YES' } })
    }
    await waitFor(element(by.id(CommonE2eIdConstants.VA_LOGO_ICON_ID)))
      .toExist()
      .withTimeout(60000)
  }
  await element(by.id(CommonE2eIdConstants.VA_LOGO_ICON_ID)).multiTap(7)

  if (DEMO_PASSWORD !== undefined) {
    await element(by.id(CommonE2eIdConstants.DEMO_MODE_INPUT_ID)).replaceText(DEMO_PASSWORD)
  }

  await element(by.id(CommonE2eIdConstants.DEMO_MODE_INPUT_ID)).tapReturnKey()
  await element(by.id(CommonE2eIdConstants.DEMO_BTN_ID)).multiTap(2)

  await element(by.text(CommonE2eIdConstants.SIGN_IN_BTN_ID)).tap()

  if (skipOnboarding === true) {
    const ifCarouselSkipBtnExist = await checkIfElementIsPresent(CommonE2eIdConstants.SKIP_BTN_TEXT, true)

    if (ifCarouselSkipBtnExist) {
      await element(by.text(CommonE2eIdConstants.SKIP_BTN_TEXT)).tap()
    }
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

export async function checkIfElementIsPresent(
  matchString: string,
  findbyText = false,
  waitForElement = false,
  timeOut = 2000,
) {
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

/* Scroll down inside container until specified text is found, then tap the text
 *
 * @param text - string of the text to match
 * @param containerID - testID of the container
 */
export async function scrollToThenTap(text: string, containerID: string) {
  await waitFor(element(by.text(text)))
    .toBeVisible()
    .whileElement(by.id(containerID))
    .scroll(200, 'down')
  await element(by.text(text)).tap()
}

/* Scroll down inside container until specified testID is found, then tap the testID
 *
 * @param scrollToID - testID of the item to scroll to
 * @param containerID - testID of the container
 */
export async function scrollToIDThenTap(scrollToID: string, containerID: string) {
  await waitFor(element(by.id(scrollToID)))
    .toBeVisible()
    .whileElement(by.id(containerID))
    .scroll(200, 'down')
  await element(by.id(scrollToID)).tap()
}

/*This function will open, check for, and dismiss the leaving app popup from a specified launching point
 *
 * @param matchString - string of the text or id to match
 * @param findbyText - boolean to search by testID or Text
 * @param cancelPopUp - boolean to either cancel the popUp or leave the app
 */
export async function openDismissLeavingAppPopup(matchString: string, findbyText = false) {
  if (findbyText) {
    await element(by.text(matchString)).tap()
  } else {
    await element(by.id(matchString)).tap()
  }

  await expect(element(by.text(CommonE2eIdConstants.LEAVING_APP_POPUP_TEXT))).toExist()
  await element(by.text(CommonE2eIdConstants.LEAVING_APP_CANCEL_TEXT)).tap()
}

/** This function will change the mock data for demo mode
 *
 * @param matchString - string: name of the json file ie appointments.json
 * @param jsonProperty - array of strings and dictionaries: should match the path to get to the
 * json obj you want changed that matches the path to get to the object you want changed
 * @param newJsonValue - string or boolean: new value for the json object
 */

export async function changeMockData(mockFileName: string, jsonProperty, newJsonValue) {
  const mockDirectory = './src/store/api/demo/mocks/'

  fs.readFile(mockDirectory + mockFileName, 'utf8', (error, data) => {
    if (error) {
      console.log(error)
      return
    }

    const jsonParsed = JSON.parse(data)
    let mockDataVariable
    let mockDataKeyValue
    for (let x = 0; x < jsonProperty.length; x++) {
      if (x === 0) {
        mockDataVariable = jsonParsed[jsonProperty[x]]
      } else if (x === jsonProperty.length - 1) {
        mockDataVariable[jsonProperty[x]] = newJsonValue
      } else {
        if (jsonProperty[x].constructor === Object) {
          const key = String(Object.keys(jsonProperty[x]))
          const value = jsonProperty[x][key]
          mockDataKeyValue = mockDataVariable[key]
          mockDataVariable = mockDataKeyValue[value]
        } else {
          mockDataVariable = mockDataVariable[jsonProperty[x]]
        }
      }
    }

    fs.writeFile(mockDirectory + mockFileName, JSON.stringify(jsonParsed, null, 2), function writeJSON(err) {
      if (err) {
        return console.log(err)
      }
    })
  })

  await device.uninstallApp()
  await setTimeout(1000)
  if (device.getPlatform() === 'ios') {
    await spawnSync('yarn', ['bundle:ios'], { maxBuffer: Infinity, timeout: 200000 })
    await spawnSync('detox', ['build', '-c ios'], { maxBuffer: Infinity, timeout: 200000 })
  } else {
    await spawnSync('yarn', ['bundle:android'], { maxBuffer: Infinity, timeout: 200000 })
    await spawnSync('detox', ['build', '-c android'], { maxBuffer: Infinity, timeout: 200000 })
  }
  await device.installApp()
  await device.launchApp({ newInstance: true, permissions: { notifications: 'YES' } })
  await loginToDemoMode()
}

/** This function will check and verify if the image provided matches the image in the _imagesnapshot_ folder
 * @param screenshotPath: png returned from detox getScreenshot function
 */
export async function checkImages(screenshotPath) {
  const image = fs.readFileSync(screenshotPath)
  await (jestExpect(image) as any).toMatchImageSnapshot({
    comparisonMethod: 'ssim',
    failureThreshold: 0.01,
    failureThresholdType: 'percent',
  })
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
  await waitFor(element(by.text(CommonE2eIdConstants.SETTINGS_ROW_TEXT)))
    .toBeVisible()
    .whileElement(by.id(CommonE2eIdConstants.PROFILE_SCREEN_SCROLL_ID))
    .scroll(50, 'down')
  await element(by.text(CommonE2eIdConstants.SETTINGS_ROW_TEXT)).tap()
}

export async function openPersonalInformation() {
  await element(by.text(CommonE2eIdConstants.PERSONAL_INFORMATION_ROW_TEXT)).tap()
}

export async function openMilitaryInformation() {
  await element(by.text(CommonE2eIdConstants.MILITARY_INFORMATION_ROW_TEXT)).tap()
}

export async function openHealth() {
  await element(by.text(CommonE2eIdConstants.HEALTH_TAB_BUTTON_TEXT)).tap()
}

export async function openAppointments() {
  await element(by.text(CommonE2eIdConstants.APPOINTMENTS_TAB_BUTTON_TEXT)).tap()
}

export async function openPayments() {
  await element(by.text(CommonE2eIdConstants.PAYMENTS_TAB_BUTTON_TEXT)).tap()
}

export async function openDirectDeposit() {
  await element(by.text(CommonE2eIdConstants.DIRECT_DEPOSIT_ROW_TEXT)).tap()
}

export async function openPrescriptions() {
  await element(by.text(CommonE2eIdConstants.PRESCRIPTIONS_BUTTON_TEXT)).tap()
}

export async function openContactInfo() {
  await element(by.text(CommonE2eIdConstants.CONTACT_INFORMATION_TEXT)).tap()
}

export async function openVAPaymentHistory() {
  await element(by.text(CommonE2eIdConstants.VA_PAYMENT_HISTORY_BUTTON_TEXT)).tap()
}

export async function openBenefits() {
  await element(by.text(CommonE2eIdConstants.BENEFITS_TAB_BUTTON_TEXT)).tap()
}

export async function openLetters() {
  await element(by.text(CommonE2eIdConstants.LETTERS_ROW_TEXT)).tap()
}

export async function openDisabilityRating() {
  await element(by.text(CommonE2eIdConstants.DISABILITY_RATING_ROW_TEXT)).tap()
}

export async function openVaccineRecords() {
  await element(by.text(CommonE2eIdConstants.VACCINE_RECORDS_BUTTON_TEXT)).tap()
}

export async function openMessages() {
  await element(by.text(CommonE2eIdConstants.MESSAGES_ROW_TEXT)).tap()
}

export async function openClaims() {
  await element(by.text(CommonE2eIdConstants.CLAIMS_BUTTON_TEXT)).tap()
}

export async function openClaimsHistory() {
  await element(by.text(CommonE2eIdConstants.CLAIMS_HISTORY_BUTTON_TEXT)).tap()
}

export async function openDeveloperScreen() {
  await element(by.text(CommonE2eIdConstants.DEVELOPER_SCREEN_ROW_TEXT)).tap()
}

/**
 * Going back on android and iOS
 */
export async function backButton(backButtonName: string) {
  if (device.getPlatform() === 'android') {
    await device.pressBack() // Android only
  } else {
    await element(by.text(backButtonName)).atIndex(0).tap()
  }
}

export async function enableAF(AFFeature, AFUseCase, AFAppUpdate = false) {
  await device.launchApp({ newInstance: true, permissions: { notifications: 'YES' } })
  await loginToDemoMode()
  await openProfile()
  await openSettings()
  await openDeveloperScreen()
  await waitFor(element(by.text('Remote Config')))
    .toBeVisible()
    .whileElement(by.id(CommonE2eIdConstants.DEVELOPER_SCREEN_SCROLL_ID))
    .scroll(200, 'down')
  await element(by.text('Remote Config')).tap()
  if (AFUseCase === 'DenyAccess') {
    await waitFor(element(by.text(CommonE2eIdConstants.IN_APP_REVIEW_TOGGLE_TEXT)))
      .toBeVisible()
      .whileElement(by.id(CommonE2eIdConstants.REMOTE_CONFIG_TEST_ID))
      .scroll(600, 'down')
    await element(by.text(CommonE2eIdConstants.IN_APP_REVIEW_TOGGLE_TEXT)).tap()
  }
  await waitFor(element(by.text(AFFeature)))
    .toBeVisible()
    .whileElement(by.id(CommonE2eIdConstants.REMOTE_CONFIG_TEST_ID))
    .scroll(600, 'down')
  await element(by.text(AFFeature)).tap()

  if (AFAppUpdate) {
    try {
      await expect(element(by.id(CommonE2eIdConstants.AF_APP_UPDATE_TOGGLE_BUTTON_ID))).toHaveToggleValue(true)
    } catch (ex) {
      await element(by.text('appUpdateButton')).tap()
    }
  } else if (AFFeature === 'WG_Health') {
    try {
      await expect(element(by.id(CommonE2eIdConstants.AF_APP_UPDATE_TOGGLE_BUTTON_ID))).toHaveToggleValue(false)
    } catch (ex) {
      await element(by.text('Enabled')).tap()
    }
  }

  if (!AFAppUpdate) {
    if (AFUseCase === 'AllowFunction') {
      try {
        await expect(element(by.id(CommonE2eIdConstants.AF_APP_UPDATE_TOGGLE_BUTTON_ID))).toHaveToggleValue(false)
      } catch (ex) {
        await element(by.text('Enabled')).tap()
      }
    } else if (AFUseCase === 'DenyAccess') {
      try {
        await expect(element(by.id(CommonE2eIdConstants.AF_APP_UPDATE_TOGGLE_BUTTON_ID))).toHaveToggleValue(false)
      } catch (ex) {
        await element(by.text('Enabled')).tap()
      }
    }
  }
  await element(by.id(CommonE2eIdConstants.AF_TYPE_INPUT_FIELD_ID)).replaceText(AFUseCase)
  await element(by.id(CommonE2eIdConstants.AF_TYPE_INPUT_FIELD_ID)).tapReturnKey()
  await element(by.id(CommonE2eIdConstants.AF_ERROR_TITLE_FIELD_ID)).replaceText('AF Heading Test')
  await element(by.id(CommonE2eIdConstants.AF_ERROR_TITLE_FIELD_ID)).tapReturnKey()
  await element(by.id(CommonE2eIdConstants.AF_ERROR_BODY_FIELD_ID)).replaceText('AF Body Test')
  await element(by.id(CommonE2eIdConstants.AF_ERROR_BODY_FIELD_ID)).tapReturnKey()

  await element(by.text('Save')).tap()
  if (AFUseCase === 'DenyAccess') {
    await waitFor(element(by.text(CommonE2eIdConstants.APPLY_OVERRIDES_BUTTON_TEXT)))
      .toBeVisible()
      .whileElement(by.id(CommonE2eIdConstants.REMOTE_CONFIG_TEST_ID))
      .scroll(600, 'up')
    await element(by.text(CommonE2eIdConstants.APPLY_OVERRIDES_BUTTON_TEXT)).tap()
    if (AFFeature !== 'WG_Login' && AFFeature !== 'WG_VeteransCrisisLine') {
      await loginToDemoMode()
    }
  } else {
    await element(by.text('Home')).tap()
  }
}

export async function disableAF(featureNavigationArray, AFFeature, AFFeatureName, AFUseCaseName) {
  if (AFUseCaseName === 'AllowFunction') {
    await element(by.id(CommonE2eIdConstants.HOME_TAB_BUTTON_TEXT)).tap()
  } else {
    await device.launchApp({ newInstance: true, permissions: { notifications: 'YES' } })
    await loginToDemoMode()
  }
  await openProfile()
  await openSettings()
  await openDeveloperScreen()
  await waitFor(element(by.text('Remote Config')))
    .toBeVisible()
    .whileElement(by.id(CommonE2eIdConstants.DEVELOPER_SCREEN_SCROLL_ID))
    .scroll(200, 'down')
  await element(by.text('Remote Config')).tap()
  await waitFor(element(by.text(AFFeature)))
    .toBeVisible()
    .whileElement(by.id(CommonE2eIdConstants.REMOTE_CONFIG_TEST_ID))
    .scroll(600, 'down')
  await element(by.text(AFFeature)).tap()
  await element(by.text('Enabled')).tap()
  await element(by.text('Save')).tap()

  await element(by.text('Home')).tap()

  if (featureNavigationArray !== undefined) {
    await navigateToFeature(featureNavigationArray)
    await expect(element(by.text('AF Heading Test'))).not.toExist()
    await expect(element(by.text('AF Body Test'))).not.toExist()
  }
  await device.uninstallApp()
  await device.installApp()
}

const navigateToFeature = async (featureNavigationArray) => {
  for (let j = 2; j < featureNavigationArray.length; j++) {
    if (featureNavigationArray[j] === 'Talk to the Veterans Crisis Line now') {
      await element(by.text(featureNavigationArray[j])).tap()
    } else if (featureNavigationArray[j] === 'Get prescription details') {
      await waitFor(element(by.label('CAPECITABINE 500MG TAB.')))
        .toBeVisible()
        .whileElement(by.id(CommonE2eIdConstants.PRESCRIPTION_HISTORY_SCROLL_ID))
        .scroll(50, 'down')
      await element(by.text(featureNavigationArray[j])).atIndex(0).tap()
    } else if (featureNavigationArray[j] === 'Get prescription tracking') {
      await waitFor(element(by.label('CITALOPRAM HYDROBROMIDE 20MG TAB.')))
        .toBeVisible()
        .whileElement(by.id(CommonE2eIdConstants.PRESCRIPTION_HISTORY_SCROLL_ID))
        .scroll(50, 'down')
      await element(by.text(featureNavigationArray[j])).atIndex(0).tap()
    } else if (
      featureNavigationArray[j] === 'Reply' ||
      featureNavigationArray[j] === 'Only use messages for non-urgent needs'
    ) {
      await element(by.id('viewMessageTestID')).scrollTo('bottom')
      await element(by.text(featureNavigationArray[j])).atIndex(0).tap()
    } else if (featureNavigationArray[j] === 'Email address') {
      await waitFor(element(by.text(featureNavigationArray[j])))
        .toBeVisible()
        .whileElement(by.id('ContactInfoTestID'))
        .scroll(50, 'down')
      await element(by.text(featureNavigationArray[j])).tap()
    } else if (featureNavigationArray[j] === 'Received July 17, 2008') {
      await waitFor(element(by.text(featureNavigationArray[j])))
        .toBeVisible()
        .whileElement(by.id(CommonE2eIdConstants.CLAIMS_HISTORY_SCROLL_ID))
        .scroll(50, 'down')
      await element(by.text(featureNavigationArray[j])).tap()
    } else if (
      featureNavigationArray[j] === 'Find out why we sometimes combine claims' ||
      featureNavigationArray[j] === 'Learn what to do if you disagree with our decision'
    ) {
      await waitFor(element(by.text(featureNavigationArray[j])))
        .toBeVisible()
        .whileElement(by.id('ClaimDetailsScreen'))
        .scroll(50, 'down')
      await element(by.text(featureNavigationArray[j])).tap()
    } else if (featureNavigationArray[j] === 'Request Refill') {
      if (device.getPlatform() === 'ios') {
        await element(by.text(featureNavigationArray[j])).tap()
      } else {
        await element(by.text('Request Refill ')).tap()
      }
    } else if (featureNavigationArray[j] === 'Contact us' || featureNavigationArray[j] === 'Proof of Veteran status') {
      await waitFor(element(by.text(featureNavigationArray[j])))
        .toBeVisible()
        .whileElement(by.id(CommonE2eIdConstants.HOME_SCREEN_SCROLL_ID))
        .scroll(200, 'down')
      await element(by.text(featureNavigationArray[j])).tap()
    } else if (featureNavigationArray[0] === 'HomeScreen.e2e' && featureNavigationArray[j] !== 'Appointments') {
      await waitFor(element(by.text(featureNavigationArray[j])))
        .toBeVisible()
        .whileElement(by.id(CommonE2eIdConstants.HOME_SCREEN_SCROLL_ID))
        .scroll(200, 'down')
      await element(by.text(featureNavigationArray[j])).tap()
    } else {
      try {
        await element(by.text(featureNavigationArray[j])).tap()
      } catch (ex) {
        await element(by.text(featureNavigationArray[j])).atIndex(0).tap()
      }
    }
  }
}

export async function verifyAF(featureNavigationArray, AFUseCase, AFUseCaseUpgrade = false) {
  let featureName
  if (AFUseCase !== 'AllowFunction') {
    featureName = featureNavigationArray[featureNavigationArray.length - 1]
    await navigateToFeature(featureNavigationArray)
  }
  await expect(element(by.text('AF Heading Test'))).toExist()
  await expect(element(by.text('AF Body Test'))).toExist()
  if (AFUseCase === 'DenyAccess') {
    try {
      await element(by.text('OK')).tap()
    } catch (ex) {
      await element(by.text('OK')).atIndex(0).tap()
    }
  } else if (AFUseCase === 'DenyContent' || AFUseCase === 'AllowFunction') {
    if (device.getPlatform() === 'android') {
      await device.disableSynchronization()
      try {
        await element(by.text('800-698-2411')).atIndex(0).tap()
      } catch (ex) {
        await element(by.text('800-698-2411').withAncestor(by.id(CommonE2eIdConstants.AF_USE_CASE_2_ALERT_ID))).tap()
      }
      await setTimeout(5000)
      await device.takeScreenshot(featureName + 'AFUseCase2PhoneNumber')
      await device.launchApp({ newInstance: false })
      try {
        await element(by.text('TTY: 711')).atIndex(0).tap()
      } catch (ex) {
        await element(by.text('TTY: 711').withAncestor(by.id(CommonE2eIdConstants.AF_USE_CASE_2_ALERT_ID))).tap()
      }
      await setTimeout(5000)
      await device.takeScreenshot(featureName + 'AFUseCase2TTY')
      await device.launchApp({ newInstance: false })
      await device.enableSynchronization()
    }

    if (AFUseCaseUpgrade) {
      try {
        await expect(element(by.text('Update now'))).toExist()
      } catch (ex) {
        await expect(element(by.text('Update now')).atIndex(1)).toExist()
      }
    }
  }

  if (AFUseCase !== 'AllowFunction') {
    if (AFUseCase === 'DenyContent' && AFUseCaseUpgrade) {
      await disableAF(featureNavigationArray, featureNavigationArray[1], featureName, AFUseCase)
    }
  }
}

/* Toggle the specified remote config feature flag
 *
 * @param flagName - name of flag to toggle
 */
export async function toggleRemoteConfigFlag(flagName: string) {
  await loginToDemoMode()
  await openProfile()
  await openSettings()
  await openDeveloperScreen()
  await element(by.id(CommonE2eIdConstants.REMOTE_CONFIG_BUTTON_TEXT)).tap()
  await scrollToThenTap(flagName, CommonE2eIdConstants.REMOTE_CONFIG_TEST_ID)
  await scrollToThenTap(CommonE2eIdConstants.APPLY_OVERRIDES_BUTTON_TEXT, CommonE2eIdConstants.REMOTE_CONFIG_TEST_ID)
}
