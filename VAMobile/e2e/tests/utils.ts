/*
Description:
Detox script for functions/constants that effect multiple other scripts.  
When to update:
New functions/constants should be added when anything is created that might effect multiple scripts.
*/
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
  //device-specific
  OK_PLATFORM_SPECIFIC_TEXT: device.getPlatform() === 'ios' ? 'Ok' : 'OK',
  CANCEL_PLATFORM_SPECIFIC_TEXT: device.getPlatform() === 'ios' ? 'Cancel' : 'Cancel ',
  CAMERA_TEXT: device.getPlatform() === 'ios' ? 'Camera' : 'Camera ',
  PHOTO_GALLERY_TEXT: device.getPlatform() === 'ios' ? 'Photo Gallery' : 'Photo gallery ',
  FILE_FOLDER_TEXT: device.getPlatform() === 'ios' ? 'File Folder' : 'File folder ',
  CANCEL_DELETE_CHANGES_BUTTON_TEXT: device.getPlatform() === 'ios' ? 'Delete Changes' : 'Delete Changes ',
  CANCEL_KEEP_EDITING_TEXT: device.getPlatform() === 'ios' ? 'Keep Editing' : 'Keep Editing ',
  //universal
  SAVE_TEXT: 'Save',
  ENABLED_TEXT: 'Enabled',
  PREVIOUS_PAGE_ID: 'previous-page',
  NEXT_PAGE_ID: 'next-page',
  BACK_BTN_LABEL: 'Back',
  LEAVING_APP_POPUP_TEXT: 'Leave the mobile app?',
  LEAVING_APP_CANCEL_TEXT: 'Go back',
  LEAVING_APP_LEAVE_TEXT: 'Leave',
  CANCEL_UNIVERSAL_TEXT: 'Cancel',
  OK_UNIVERSAL_TEXT: 'OK',
  DISMISS_TEXT: 'Dismiss',
  CALL_VA_PHONE_NUMBER_ID: 'CallVATestID',
  CALL_VA_TTY_PHONE_NUMBER_ID: 'CallTTYTestID',
  GO_TO_VA_GOV_LINK_ID: 'goToVAGovID',
  VETERAN_CRISIS_LINE_HEADING_TEXT: 'Veterans Crisis Line',
  VETERAN_CRISIS_LINE_BTN_TEXT: 'Talk to the Veterans Crisis Line now',
  VETERAN_CRISIS_LINE_BTN_ID: 'veteransCrisisLineID',
  VETERAN_CRISIS_LINE_BACK_ID: 'veteranCrisisLineBackID',
  VETERANS_CRISIS_LINE_CALL_ID: 'veteransCrisisLineCallID',
  VETERANS_CRISIS_LINE_TTY_ID: 'veteransCrisisLineHearingLossNumberTestID',
  VETERANS_CRISIS_LINE_TEXT_ID: 'veteransCrisisLineTextNumberTestID',
  VETERANS_CRISIS_LINE_CHAT_ID: 'veteransCrisisLineConfidentialChatTestID',
  MILITARY_BRANCH_COAST_GUARD: 'United States Coast Guard',
  MILITARY_PERIOD_OF_SERVICE: 'July 13, 1970 – August 31, 1998',
  //login, home, nav bar
  VA_LOGO_ICON_ID: 'va-icon',
  DEMO_MODE_INPUT_ID: 'demo-mode-password',
  DEMO_BTN_ID: 'demo-btn',
  SIGN_IN_BTN_ID: 'Sign in',
  SKIP_BACK_BUTTON_ID: 'onboardingSkipBackButtonID',
  TURN_ON_NOTIFICATIONS_TEXT: 'Turn on notifications',
  HOME_ACTIVITY_HEADER_TEXT: 'Activity',
  HEALTH_TAB_BUTTON_TEXT: 'Health',
  PAYMENTS_TAB_BUTTON_TEXT: 'Payments',
  BENEFITS_TAB_BUTTON_TEXT: 'Benefits',
  HOME_TAB_BUTTON_TEXT: 'Home',
  HEALTH_TAB_BUTTON_ID: 'Health',
  PAYMENTS_TAB_BUTTON_ID: 'Payments',
  BENEFITS_TAB_BUTTON_ID: 'Benefits',
  HOME_TAB_BUTTON_ID: 'Home',
  PROFILE_HEADER_BUTTON_ID: 'toProfileScreenID',
  HOME_SCREEN_SCROLL_ID: 'homeScreenID',
  DISABILITY_RATING_PERCENT_TEXT: '100%',
  //health
  UPCOMING_APPT_BUTTON_TEXT: 'Upcoming',
  APPOINTMENTS_SCROLL_ID: 'appointmentsTestID',
  APPOINTMENTS_BUTTON_ID: 'toAppointmentsID',
  ADD_TO_CALENDAR_ID: 'addToCalendarTestID',
  GET_DIRECTIONS_ID: 'directionsTestID',
  DATE_RANGE_INITIAL_TEXT: 'Past 3 months',
  START_NEW_MESSAGE_BUTTON_ID: 'startNewMessageButtonTestID',
  MESSAGES_INBOX_BUTTON_ID: 'toMessageInboxID',
  VIEW_MESSAGE_ID: 'viewMessageTestID',
  PRESCRIPTION_REFILL_BUTTON_TEXT: 'Start refill request',
  PRESCRIPTION_REFILL_BUTTON_ID: 'refillRequestTestID',
  PRESCRIPTION_HISTORY_SCROLL_ID: 'PrescriptionHistory',
  PRESCRIPTIONS_BUTTON_ID: 'toPrescriptionsID',
  PRESCRIPTION_REFILL_DIALOG_YES_TEXT: device.getPlatform() === 'ios' ? 'Request Refill' : 'Request Refill ',
  VACCINES_BUTTON_ID: 'toVaccineListID',
  ALLERGIES_BUTTON_ID: 'toAllergyListID',
  MEDICAL_RECORDS_BUTTON_ID: 'toMedicalRecordsListID',
  CHEYENNE_FACILITY_TEXT: 'Cheyenne VA Medical Center',
  //benefits
  CLAIMS_HISTORY_BUTTON_ID: 'toClaimsHistoryID',
  CLAIMS_HISTORY_SCROLL_ID: 'claimsHistoryID',
  CLAIMS_DETAILS_BACK_ID: 'claimsDetailsBackTestID',
  CLAIMS_HISTORY_BACK_ID: 'claimsHistoryBackTestID',
  CLAIMS_HISTORY_CLOSED_TAB_ID: 'claimsHistoryClosedID',
  CLAIMS_DETAILS_SCREEN_ID: 'ClaimDetailsScreen',
  ALERT_FILE_REQUEST_BUTTON_ID: 'Review file requests',
  CLAIMS_LANDING_BUTTON_ID: 'toClaimsLandingID',
  APPEALS_DETAILS_ID: 'appealsDetailsTestID',
  CLOSED_CLAIM_DECISION_LETTER_ID:
    'Compensation Decision letter ready Received January 01, 2021 Step 5 of 5: Complete Moved to this step on April 09, 2021',
  LETTERS_LANDING_BUTTON_ID: 'toLettersLandingID',
  DISABILITY_RATING_BUTTON_ID: 'toDisabilityRatingID',
  //payments
  PAYMENT_HISTORY_BUTTON_ID: 'toPaymentHistoryID',
  DIRECT_DEPOSIT_BUTTON_ID: 'toDirectDepositID',
  //profile, settings
  PROFILE_SCROLL_ID: 'profileID',
  PERSONAL_INFO_BUTTON_ID: 'toPersonalInfoID',
  CONTACT_INFO_BUTTON_ID: 'toContactInfoID',
  MILITARY_HISTORY_BUTTON_ID: 'toMilitaryHistoryID',
  SETTINGS_BUTTON_ID: 'toSettingsID',
  SETTINGS_ROW_TEXT: 'Settings',
  CONTACT_INFO_SCREEN_ID: 'ContactInfoTestID',
  CONTACT_INFO_SAVE_ID: 'contactInfoSaveTestID',
  CONTACT_INFO_SUGGESTED_ADDRESS_ID: 'suggestedAddressTestID',
  CONTACT_INFO_USE_THIS_ADDRESS_ID: 'Use this address',
  CONTACT_INFO_STREET_ADDRESS_LINE_2_ID: 'streetAddressLine2TestID',
  DEVELOPER_SCREEN_BUTTON_ID: 'toDeveloperScreenID',
  DEVELOPER_SCREEN_SCROLL_ID: 'developerScreenTestID',
  RESET_INAPP_REVIEW_BUTTON_TEXT: 'Reset in-app review actions',
  REMOTE_CONFIG_TEST_ID: 'remoteConfigTestID',
  REMOTE_CONFIG_BUTTON_TEXT: 'Remote Config',
  APPLY_OVERRIDES_BUTTON_TEXT: 'Apply Overrides',
  IN_APP_REVIEW_TOGGLE_TEXT: 'inAppReview',
  AF_APP_UPDATE_BUTTON_TOGGLE_ID: 'remoteConfigAppUpdateTestID',
  AF_ENABLE_TOGGLE_ID: 'remoteConfigEnableTestID',
  AF_UPDATE_NOW_BUTTON_TEXT: 'Update now',
  AF_ERROR_MSG_TITLE_INPUT_ID: 'AFErrorMsgTitleTestID',
  AF_ERROR_MSG_TITLE_ENTERED_TEXT: 'AF Heading Test',
  AF_ERROR_MSG_BODY_INPUT_ID: 'AFErrorMsgBodyTestID',
  AF_BODY_ENTERED_TEXT: 'AF Body Test',
  AF_ERROR_MSG_PHONE_ID: 'AFErrorPhoneNumberTestID',
  AF_TYPE_INPUT_ID: 'AFTypeTestID',
  AF_USE_CASE_TWO_ID: 'AFUseCase2TestID',
  // Contact information
  MAILING_ADDRESS_ID: 'Mailing address 3101 N Fort Valley Rd Flagstaff, AZ, 86001',
  MAILING_ADDRESS_2_ID: 'Mailing address 3101 N Fort Valley Rd, 2 Flagstaff, AZ, 86001',
  HOME_ADDRESS_ID: 'Home address Add your home address',
  HOME_PHONE_ID: 'homePhone',
  WORK_PHONE_ID: 'workPhone',
  MOBILE_PHONE_ID: 'mobilePhone',
  EMAIL_ADDRESS_ID: 'emailAddress',
  HOW_WE_USE_TEXT: 'How we use your contact information',
  COUNTRY_PICKER_ID: 'countryPickerTestID',
  STREET_ADDRESS_LINE_1_ID: 'streetAddressLine1TestID',
  STREET_ADDRESS_LINE_3_ID: 'streetAddressLine3TestID',
  MILITARY_POST_OFFICE_ID: 'militaryPostOfficeTestID',
  CITY_TEST_ID: 'cityTestID',
  STATE_ID: 'stateTestID',
  ZIP_CODE_ID: 'zipCodeTestID',
  PHONE_NUMBER_EXTENSION_ID: 'phoneNumberExtensionTestID',
  PHONE_NUMBER_ID: 'phoneNumberTestID',
  REMOVE_KEEP_TEXT: 'Keep',
  REMOVE_REMOVE_TEXT: 'Remove',
  EDIT_ADDRESS_ID: 'EditAddressTestID',
  COUNTRY_PICKER_CONFIRM_ID: 'countryPickerConfirmID',
  STATE_PICKER_CONFIRM_ID: 'statePickerConfirmID',
  CONTACT_INFO_BACK_ID: 'contactInfoBackTestID',
  VERIFY_YOUR_ADDRESS_ID: 'verifyYourAddressTestID',
  EMAIL_ADDRESS_EDIT_ID: 'emailAddressEditTestID',
  CONTACT_INFO_CLOSE_ID: 'ContactInfoCloseTestID',
  MILITARY_POST_OFFICE_PICKER_CONFIRM_ID: 'militaryPostOfficeConfirmID',
  HOW_WE_USE_CONTACT_INFO_LINK_ID: 'howWeUseContactInfoLinkTestID',
}

/** Logs into demo mode.
 * @param skipOnboarding: Boolean value that defaults to true.  Set this to false if you want the detox test to view the onboarding carasoul on login
 * @param pushNotifications: Boolean value that tells the detox tests whether to turn on/off push notifications
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
  await waitFor(element(by.id(CommonE2eIdConstants.VA_LOGO_ICON_ID)))
    .toBeVisible()
    .whileElement(by.id('Login-page'))
    .scroll(100, 'down')
  await element(by.id(CommonE2eIdConstants.VA_LOGO_ICON_ID)).multiTap(7)

  if (DEMO_PASSWORD !== undefined) {
    await element(by.id(CommonE2eIdConstants.DEMO_MODE_INPUT_ID)).replaceText(DEMO_PASSWORD)
  }

  await element(by.id(CommonE2eIdConstants.DEMO_MODE_INPUT_ID)).tapReturnKey()
  await element(by.id(CommonE2eIdConstants.DEMO_BTN_ID)).multiTap(1)

  await waitFor(element(by.id(CommonE2eIdConstants.SIGN_IN_BTN_ID)))
    .toBeVisible()
    .whileElement(by.id('Login-page'))
    .scroll(100, 'down')
  await element(by.id(CommonE2eIdConstants.SIGN_IN_BTN_ID)).tap()

  if (skipOnboarding === true) {
    const ifCarouselSkipBtnExist = await checkIfElementIsPresent(CommonE2eIdConstants.SKIP_BACK_BUTTON_ID)

    if (ifCarouselSkipBtnExist) {
      await element(by.id(CommonE2eIdConstants.SKIP_BACK_BUTTON_ID)).tap()
    }
  }
  const turnOnNotificationsBtnExist = await checkIfElementIsPresent(
    CommonE2eIdConstants.TURN_ON_NOTIFICATIONS_TEXT,
    true,
  )
  if (turnOnNotificationsBtnExist) {
    await element(by.text(CommonE2eIdConstants.TURN_ON_NOTIFICATIONS_TEXT)).tap()
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

/** Scroll down inside container until specified text is found, then tap the text
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

/** Scroll down inside container until specified testID is found, then tap the testID
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

/** This function will open, check for, and dismiss the leaving app popup from a specified launching point
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
  await element(by.id(CommonE2eIdConstants.PROFILE_HEADER_BUTTON_ID)).tap()
}

export async function openSettings() {
  await waitFor(element(by.id(CommonE2eIdConstants.SETTINGS_BUTTON_ID)))
    .toBeVisible()
    .whileElement(by.id(CommonE2eIdConstants.PROFILE_SCROLL_ID))
    .scroll(50, 'down')
  await element(by.id(CommonE2eIdConstants.SETTINGS_BUTTON_ID)).tap()
}

export async function openPersonalInformation() {
  await element(by.id(CommonE2eIdConstants.PERSONAL_INFO_BUTTON_ID)).tap()
}

export async function openMilitaryInformation() {
  await element(by.id(CommonE2eIdConstants.MILITARY_HISTORY_BUTTON_ID)).tap()
}

export async function openHealth() {
  await element(by.id(CommonE2eIdConstants.HEALTH_TAB_BUTTON_ID)).tap()
}

export async function openAppointments() {
  await element(by.id(CommonE2eIdConstants.APPOINTMENTS_BUTTON_ID)).tap()
}

export async function openPayments() {
  await element(by.id(CommonE2eIdConstants.PAYMENTS_TAB_BUTTON_ID)).tap()
}

export async function openDirectDeposit() {
  await element(by.id(CommonE2eIdConstants.DIRECT_DEPOSIT_BUTTON_ID)).tap()
}

export async function openPrescriptions() {
  await element(by.id(CommonE2eIdConstants.PRESCRIPTIONS_BUTTON_ID)).tap()
}

export async function openContactInfo() {
  await element(by.id(CommonE2eIdConstants.CONTACT_INFO_BUTTON_ID)).tap()
}

export async function openVAPaymentHistory() {
  await element(by.id(CommonE2eIdConstants.PAYMENT_HISTORY_BUTTON_ID)).tap()
}

export async function openBenefits() {
  await element(by.id(CommonE2eIdConstants.BENEFITS_TAB_BUTTON_ID)).tap()
}

export async function openLetters() {
  await element(by.id(CommonE2eIdConstants.LETTERS_LANDING_BUTTON_ID)).tap()
}

export async function openDisabilityRating() {
  await element(by.id(CommonE2eIdConstants.DISABILITY_RATING_BUTTON_ID)).tap()
}

export async function openVaccineRecords() {
  await element(by.id(CommonE2eIdConstants.VACCINES_BUTTON_ID)).tap()
}
export async function openAllergyRecords() {
  await element(by.id(CommonE2eIdConstants.ALLERGIES_BUTTON_ID)).tap()
}

export async function openMedicalRecords() {
  await element(by.id(CommonE2eIdConstants.MEDICAL_RECORDS_BUTTON_ID)).tap()
}

export async function openMessages() {
  await element(by.id(CommonE2eIdConstants.MESSAGES_INBOX_BUTTON_ID)).tap()
}

export async function openClaims() {
  await element(by.id(CommonE2eIdConstants.CLAIMS_LANDING_BUTTON_ID)).tap()
}

export async function openClaimsHistory() {
  await element(by.id(CommonE2eIdConstants.CLAIMS_HISTORY_BUTTON_ID)).tap()
}

export async function openDeveloperScreen() {
  await element(by.id(CommonE2eIdConstants.DEVELOPER_SCREEN_BUTTON_ID)).tap()
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

/** Enables the availibility banner.
 * @param AFFeature: Name of the AF waygate.
 * @param AFUseCase: Name of the AF type.
 * @param AFAppUpdate: Boolean value that tells the script whether to enable the update now button or not
 * */
export async function enableAF(AFFeature, AFUseCase, AFAppUpdate = false) {
  await device.launchApp({ newInstance: true, permissions: { notifications: 'YES' } })
  await loginToDemoMode()
  await openProfile()
  await openSettings()
  await openDeveloperScreen()
  await waitFor(element(by.text(CommonE2eIdConstants.REMOTE_CONFIG_BUTTON_TEXT)))
    .toBeVisible()
    .whileElement(by.id(CommonE2eIdConstants.DEVELOPER_SCREEN_SCROLL_ID))
    .scroll(200, 'down')
  await element(by.text(CommonE2eIdConstants.REMOTE_CONFIG_BUTTON_TEXT)).tap()
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
      await expect(element(by.id(CommonE2eIdConstants.AF_APP_UPDATE_BUTTON_TOGGLE_ID))).toHaveToggleValue(true)
    } catch (ex) {
      await element(by.id(CommonE2eIdConstants.AF_APP_UPDATE_BUTTON_TOGGLE_ID)).tap()
    }
  } else if (AFFeature === 'WG_Health') {
    try {
      await expect(element(by.id(CommonE2eIdConstants.AF_ENABLE_TOGGLE_ID))).toHaveToggleValue(false)
    } catch (ex) {
      await element(by.id(CommonE2eIdConstants.AF_ENABLE_TOGGLE_ID)).tap()
    }
  }

  if (!AFAppUpdate) {
    if (AFUseCase === 'AllowFunction') {
      try {
        await expect(element(by.id(CommonE2eIdConstants.AF_ENABLE_TOGGLE_ID))).toHaveToggleValue(false)
      } catch (ex) {
        await element(by.id(CommonE2eIdConstants.AF_ENABLE_TOGGLE_ID)).tap()
      }
    } else if (AFUseCase === 'DenyAccess') {
      try {
        await expect(element(by.id(CommonE2eIdConstants.AF_ENABLE_TOGGLE_ID))).toHaveToggleValue(false)
      } catch (ex) {
        await element(by.id(CommonE2eIdConstants.AF_ENABLE_TOGGLE_ID)).tap()
      }
    }
  }
  await element(by.id(CommonE2eIdConstants.AF_TYPE_INPUT_ID)).replaceText(AFUseCase)
  await element(by.id(CommonE2eIdConstants.AF_TYPE_INPUT_ID)).tapReturnKey()
  await element(by.id(CommonE2eIdConstants.AF_ERROR_MSG_TITLE_INPUT_ID)).replaceText('AF Heading Test')
  await element(by.id(CommonE2eIdConstants.AF_ERROR_MSG_TITLE_INPUT_ID)).tapReturnKey()
  await element(by.id(CommonE2eIdConstants.AF_ERROR_MSG_BODY_INPUT_ID)).replaceText('AF Body Test')
  await element(by.id(CommonE2eIdConstants.AF_ERROR_MSG_BODY_INPUT_ID)).tapReturnKey()
  await setTimeout(3000)
  await element(by.id(CommonE2eIdConstants.AF_ERROR_MSG_PHONE_ID)).replaceText('8006982411')
  await element(by.id(CommonE2eIdConstants.AF_ERROR_MSG_PHONE_ID)).tapReturnKey()

  await element(by.text(CommonE2eIdConstants.SAVE_TEXT)).tap()
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
    await element(by.id(CommonE2eIdConstants.HOME_TAB_BUTTON_ID)).tap()
  }
}

/** Disables the availibility banner.
 * @param featureNavigationArray: Array that tells the AF script how to navigate to the feature
 * @param AFFeature: Name of the AF waygate.
 * @param AFUseCaseName: Name of the AF type.
 * @param AFAppUpdate: Boolean value that tells the script whether to enable the update now button or not
 * */
export async function disableAF(featureNavigationArray, AFFeature, AFFeatureName, AFUseCaseName) {
  if (AFUseCaseName === 'AllowFunction') {
    await element(by.id(CommonE2eIdConstants.HOME_TAB_BUTTON_ID)).tap()
  } else {
    await device.launchApp({ newInstance: true, permissions: { notifications: 'YES' } })
    await loginToDemoMode()
  }
  await openProfile()
  await openSettings()
  await openDeveloperScreen()
  await waitFor(element(by.text(CommonE2eIdConstants.REMOTE_CONFIG_BUTTON_TEXT)))
    .toBeVisible()
    .whileElement(by.id(CommonE2eIdConstants.DEVELOPER_SCREEN_SCROLL_ID))
    .scroll(200, 'down')
  await element(by.text(CommonE2eIdConstants.REMOTE_CONFIG_BUTTON_TEXT)).tap()
  await waitFor(element(by.text(AFFeature)))
    .toBeVisible()
    .whileElement(by.id(CommonE2eIdConstants.REMOTE_CONFIG_TEST_ID))
    .scroll(600, 'down')
  await element(by.text(AFFeature)).tap()
  await element(by.text(CommonE2eIdConstants.ENABLED_TEXT)).tap()
  await element(by.text(CommonE2eIdConstants.SAVE_TEXT)).tap()

  await element(by.id(CommonE2eIdConstants.HOME_TAB_BUTTON_ID)).tap()

  if (featureNavigationArray !== undefined) {
    await navigateToFeature(featureNavigationArray)
    await expect(element(by.text(CommonE2eIdConstants.AF_ERROR_MSG_TITLE_ENTERED_TEXT))).not.toExist()
    await expect(element(by.text(CommonE2eIdConstants.AF_BODY_ENTERED_TEXT))).not.toExist()
  }
  await device.uninstallApp()
  await device.installApp()
}

/** Function that allows the AF script to navigate to a certain feature
 * */
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
      await element(by.id(CommonE2eIdConstants.VIEW_MESSAGE_ID)).scrollTo('bottom')
      await element(by.text(featureNavigationArray[j])).atIndex(0).tap()
    } else if (featureNavigationArray[j] === 'Email address') {
      await waitFor(element(by.text(featureNavigationArray[j])))
        .toBeVisible()
        .whileElement(by.id(CommonE2eIdConstants.CONTACT_INFO_SCREEN_ID))
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
        .whileElement(by.id(CommonE2eIdConstants.CLAIMS_DETAILS_SCREEN_ID))
        .scroll(50, 'down')
      await element(by.text(featureNavigationArray[j])).tap()
    } else if (featureNavigationArray[j] === 'Request Refill') {
      await element(by.text(CommonE2eIdConstants.PRESCRIPTION_REFILL_DIALOG_YES_TEXT)).tap()
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

/** Verifies that the availibility banner is the correct type and is populated with the correct information.
 * @param featureNavigationArray: Array that tells the AF script how to navigate to the feature
 * @param AFUseCaseName: Name of the AF type.
 * @param AFUseCaseUpgrade: Boolean value that tells the script whether to enable the update now button or not
 * */
export async function verifyAF(featureNavigationArray, AFUseCase, AFUseCaseUpgrade = false) {
  let featureName
  if (AFUseCase !== 'AllowFunction') {
    featureName = featureNavigationArray[featureNavigationArray.length - 1]
    await navigateToFeature(featureNavigationArray)
  }
  await expect(element(by.text(CommonE2eIdConstants.AF_ERROR_MSG_TITLE_ENTERED_TEXT))).toExist()
  await expect(element(by.text(CommonE2eIdConstants.AF_BODY_ENTERED_TEXT))).toExist()
  if (AFUseCase === 'DenyAccess') {
    try {
      await element(by.text(CommonE2eIdConstants.OK_UNIVERSAL_TEXT)).tap()
    } catch (ex) {
      await element(by.text(CommonE2eIdConstants.OK_UNIVERSAL_TEXT)).atIndex(0).tap()
    }
  } else if (AFUseCase === 'DenyContent' || AFUseCase === 'AllowFunction') {
    if (device.getPlatform() === 'android') {
      await device.disableSynchronization()
      try {
        await element(by.id(CommonE2eIdConstants.CALL_VA_PHONE_NUMBER_ID)).atIndex(0).tap()
      } catch (ex) {
        await element(
          by
            .id(CommonE2eIdConstants.CALL_VA_PHONE_NUMBER_ID)
            .withAncestor(by.id(CommonE2eIdConstants.AF_USE_CASE_TWO_ID)),
        ).tap()
      }
      await setTimeout(5000)
      await device.takeScreenshot(featureName + 'AFUseCase2PhoneNumber')
      await device.launchApp({ newInstance: false })
      try {
        await element(by.id(CommonE2eIdConstants.CALL_VA_TTY_PHONE_NUMBER_ID)).atIndex(0).tap()
      } catch (ex) {
        await element(
          by
            .id(CommonE2eIdConstants.CALL_VA_TTY_PHONE_NUMBER_ID)
            .withAncestor(by.id(CommonE2eIdConstants.AF_USE_CASE_TWO_ID)),
        ).tap()
      }
      await setTimeout(5000)
      await device.takeScreenshot(featureName + 'AFUseCase2TTY')
      await device.launchApp({ newInstance: false })
      await device.enableSynchronization()
    }

    if (AFUseCaseUpgrade) {
      try {
        await expect(element(by.text(CommonE2eIdConstants.AF_UPDATE_NOW_BUTTON_TEXT))).toExist()
      } catch (ex) {
        await expect(element(by.text(CommonE2eIdConstants.AF_UPDATE_NOW_BUTTON_TEXT)).atIndex(1)).toExist()
      }
    }
  }

  if (AFUseCase !== 'AllowFunction') {
    if (AFUseCase === 'DenyContent' && AFUseCaseUpgrade) {
      await disableAF(featureNavigationArray, featureNavigationArray[1], featureName, AFUseCase)
    }
  }
}

/** Toggle the specified remote config feature flag
 * @param flagName - name of flag to toggle
 * */
export async function toggleRemoteConfigFlag(flagName: string) {
  await loginToDemoMode()
  await openProfile()
  await openSettings()
  await openDeveloperScreen()
  await element(by.id(CommonE2eIdConstants.REMOTE_CONFIG_BUTTON_TEXT)).tap()
  await scrollToThenTap(flagName, CommonE2eIdConstants.REMOTE_CONFIG_TEST_ID)
  await scrollToThenTap(CommonE2eIdConstants.APPLY_OVERRIDES_BUTTON_TEXT, CommonE2eIdConstants.REMOTE_CONFIG_TEST_ID)
}
