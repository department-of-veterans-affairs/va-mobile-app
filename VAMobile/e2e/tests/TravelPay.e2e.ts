import { by, element, expect, waitFor } from 'detox'
import { setTimeout } from 'timers/promises'

import {
  CommonE2eIdConstants,
  loginToDemoMode,
  openAppointments,
  openContactInfo,
  openHealth,
  openProfile,
  toggleRemoteConfigFlag,
} from './utils'

const TravelPayE2eIdConstants = {
  CLOSE_BUTTON_ID: 'closeTestID',
  LEFT_CLOSE_BUTTON_ID: 'leftCloseTestID',
  YES_BUTTON_ID: 'yesTestID',
  NO_BUTTON: 'No',
  CANCEL_BUTTON_ID: 'cancelTestID',
  LEFT_CANCEL_BUTTON_ID: 'leftCancelTestID',
  SUBMIT_BUTTON_ID: 'submitTestID',
  MILAGE_QUESTION_ID: 'milageQuestionID',
  MILAGE_QUALIFIER_ID: 'milageQualifierID',
  REFER_TO_PORTAL_ID: 'referToPortalID',
  VEHICLE_QUESTION_ID: 'vehicleQuestionID',
  VEHICLE_QUALIFIER_ID: 'vehicleQualifierID',
  ADDRESS_QUESTION_ID: 'addressQuestionID',
  ADDRESS_QUALIFIER_ID: 'addressQualifierID',
  NO_ADDRESS_TEXT_ID: 'noAddressTextID',
  ADDRESS_PO_BOX_ID: 'addressPOBoxID',
  HELP_TITLE_ID: 'helpTitleID',
  HELP_TEXT_ID: 'helpTextID',
  REVIEW_TITLE_ID: 'reviewTitleID',
  REVIEW_TEXT_ID: 'reviewTextID',
  WHAT_ID: 'whatID',
  MILAGE_ONLY_ID: 'milageOnlyID',
  HOW_ID: 'howID',
  VEHICLE_ID: 'vehicleID',
  WHERE_ID: 'whereID',
  SUCCESS_TITLE_ID: 'successTitleID',
  SUCCESS_TEXT_ID: 'successTextID',
  SUCCESS_NEXT_TITLE_ID: 'successNextTitleID',
  SUCCESS_NEXT_TEXT_ID: 'successNextTextID',
  SUCCESS_NEXT_TEXT2_ID: 'successNextText2ID',
  COUNTRY_TEXT: 'United States',
  STATE_TEXT: 'Arizona',
}

const fillHomeAddressFields = async () => {
  // Set the country field
  await element(by.id(CommonE2eIdConstants.COUNTRY_PICKER_ID)).tap()
  await waitFor(element(by.text(TravelPayE2eIdConstants.COUNTRY_TEXT)))
    .toBeVisible()
    .withTimeout(2000)
  await element(by.text(TravelPayE2eIdConstants.COUNTRY_TEXT)).tap()
  await element(by.id(CommonE2eIdConstants.COUNTRY_PICKER_CONFIRM_ID)).tap()
  await waitFor(element(by.id(CommonE2eIdConstants.COUNTRY_PICKER_ID)))
    .toBeVisible()
    .withTimeout(2000)
  // Set the street address
  await element(by.id(CommonE2eIdConstants.STREET_ADDRESS_LINE_1_ID)).typeText('3101 N Fort Valley Rd')
  await element(by.id(CommonE2eIdConstants.STREET_ADDRESS_LINE_1_ID)).tapReturnKey()
  await waitFor(element(by.id(CommonE2eIdConstants.STREET_ADDRESS_LINE_1_ID)))
    .toBeVisible()
    .withTimeout(2000)
  // Scroll the page to make the state and zip code fields visible
  await waitFor(element(by.id(CommonE2eIdConstants.ZIP_CODE_ID)))
    .toBeVisible()
    .whileElement(by.id(CommonE2eIdConstants.EDIT_ADDRESS_ID))
    .scroll(100, 'down', NaN, 0.8)
  // Set the city
  await element(by.id(CommonE2eIdConstants.CITY_TEST_ID)).replaceText('Flagstaff')
  await element(by.id(CommonE2eIdConstants.CITY_TEST_ID)).tapReturnKey()
  // Set the state
  await element(by.id(CommonE2eIdConstants.STATE_ID)).tap()
  await waitFor(element(by.text(TravelPayE2eIdConstants.STATE_TEXT)))
    .toBeVisible()
    .withTimeout(2000)
  await element(by.text(TravelPayE2eIdConstants.STATE_TEXT)).tap()
  await element(by.id(CommonE2eIdConstants.STATE_PICKER_CONFIRM_ID)).tap()
  await waitFor(element(by.id(CommonE2eIdConstants.STATE_ID)))
    .toBeVisible()
    .withTimeout(2000)
  // Set the zip code
  await element(by.id(CommonE2eIdConstants.ZIP_CODE_ID)).replaceText('86001')
  await element(by.id(CommonE2eIdConstants.ZIP_CODE_ID)).tapReturnKey()

  // Save the address by using the suggested address
  await element(by.id(CommonE2eIdConstants.CONTACT_INFO_SAVE_ID)).tap()
  await waitFor(element(by.id(CommonE2eIdConstants.CONTACT_INFO_SUGGESTED_ADDRESS_ID)))
    .toBeVisible()
    .withTimeout(2000)
  await element(by.id(CommonE2eIdConstants.CONTACT_INFO_SUGGESTED_ADDRESS_ID)).tap()
  await element(by.id(CommonE2eIdConstants.CONTACT_INFO_USE_THIS_ADDRESS_ID)).tap()

  // Dismiss the address suggestion modal
  try {
    await setTimeout(1000)
    await element(by.text(CommonE2eIdConstants.DISMISS_TEXT)).tap()
  } catch (ex) {}
}

const setHomeAddress = async () => {
  await loginToDemoMode()

  await openProfile()
  await openContactInfo()
  await element(by.id(CommonE2eIdConstants.HOME_ADDRESS_ID)).tap()

  await fillHomeAddressFields()
}

const openPastAppointments = async () => {
  await openHealth()
  await openAppointments()
  await waitFor(element(by.text('Upcoming')))
    .toExist()
    .withTimeout(10000)
  await element(by.id(CommonE2eIdConstants.APPOINTMENTS_SCROLL_ID)).scrollTo('top')
  await element(by.text('Past')).tap()
}

beforeAll(async () => {
  await toggleRemoteConfigFlag(CommonE2eIdConstants.IN_APP_REVIEW_TOGGLE_TEXT)
})

const openTravelPayFlow = async (text: string, existingAddress: boolean) => {
  if (existingAddress) {
    await setHomeAddress()
  }
  await openPastAppointments()
  try {
    await waitFor(element(by.text(text)))
      .toBeVisible()
      .whileElement(by.id(CommonE2eIdConstants.APPOINTMENTS_SCROLL_ID))
      .scroll(250, 'down')
  } catch (ex) {
    await waitFor(element(by.text(text)))
      .toBeVisible()
      .whileElement(by.id(CommonE2eIdConstants.APPOINTMENTS_SCROLL_ID))
      .scroll(250, 'up')
  }
  await element(by.text(text)).tap()

  await element(by.text('File travel claim')).tap()
}

const checkMilageScreen = async () => {
  await expect(element(by.id(TravelPayE2eIdConstants.MILAGE_QUALIFIER_ID))).toExist()
  await expect(element(by.id(TravelPayE2eIdConstants.MILAGE_QUESTION_ID))).toExist()
  await expect(element(by.id(TravelPayE2eIdConstants.REFER_TO_PORTAL_ID))).toExist()
  await expect(element(by.id(TravelPayE2eIdConstants.LEFT_CANCEL_BUTTON_ID))).toExist()
  await expect(element(by.id(TravelPayE2eIdConstants.YES_BUTTON_ID))).toExist()
  await expect(element(by.text(TravelPayE2eIdConstants.NO_BUTTON))).toExist()
}

const checkVehicleScreen = async () => {
  await expect(element(by.id(TravelPayE2eIdConstants.VEHICLE_QUESTION_ID))).toExist()
  await expect(element(by.id(TravelPayE2eIdConstants.VEHICLE_QUALIFIER_ID))).toExist()
  await expect(element(by.id(TravelPayE2eIdConstants.REFER_TO_PORTAL_ID))).toExist()
  await expect(element(by.id(TravelPayE2eIdConstants.LEFT_CANCEL_BUTTON_ID))).toExist()
  await expect(element(by.id(TravelPayE2eIdConstants.YES_BUTTON_ID))).toExist()
  await expect(element(by.text(TravelPayE2eIdConstants.NO_BUTTON))).toExist()
}

const checkTravelPayHelp = async () => {
  await expect(element(by.id(TravelPayE2eIdConstants.HELP_TITLE_ID))).toExist()
  await expect(element(by.id(TravelPayE2eIdConstants.HELP_TEXT_ID))).toExist()
  await expect(element(by.id(CommonE2eIdConstants.CALL_VA_PHONE_NUMBER_ID))).toExist()
  await expect(element(by.id(CommonE2eIdConstants.CALL_VA_TTY_PHONE_NUMBER_ID))).toExist()
}

const checkAddressScreen = async (existingAddress: boolean) => {
  await expect(element(by.id(TravelPayE2eIdConstants.ADDRESS_QUESTION_ID))).toExist()
  if (existingAddress) {
    await expect(element(by.id(TravelPayE2eIdConstants.ADDRESS_QUALIFIER_ID))).toExist()
    await expect(element(by.id(TravelPayE2eIdConstants.REFER_TO_PORTAL_ID))).toExist()
    await expect(element(by.id('Home address 3101 N Fort Valley Rd Flagstaff, AZ, 86001'))).toExist()
    await expect(element(by.id(TravelPayE2eIdConstants.ADDRESS_PO_BOX_ID))).toExist()
    await expect(element(by.id(TravelPayE2eIdConstants.LEFT_CANCEL_BUTTON_ID))).toExist()
    await expect(element(by.id(TravelPayE2eIdConstants.YES_BUTTON_ID))).toExist()
    await expect(element(by.text(TravelPayE2eIdConstants.NO_BUTTON))).toExist()
  } else {
    await expect(element(by.id(CommonE2eIdConstants.HOME_ADDRESS_ID))).toExist()
    await expect(element(by.id(TravelPayE2eIdConstants.NO_ADDRESS_TEXT_ID))).toExist()
    await checkTravelPayHelp()
    await expect(element(by.id(TravelPayE2eIdConstants.CANCEL_BUTTON_ID))).toExist()
  }
}

const checkReviewClaimScreen = async () => {
  await expect(element(by.id(TravelPayE2eIdConstants.REVIEW_TITLE_ID))).toExist()
  await expect(element(by.id(TravelPayE2eIdConstants.REVIEW_TEXT_ID))).toExist()
  await expect(element(by.id(TravelPayE2eIdConstants.WHAT_ID))).toExist()
  await expect(element(by.id(TravelPayE2eIdConstants.MILAGE_ONLY_ID))).toExist()
  await expect(element(by.id(TravelPayE2eIdConstants.HOW_ID))).toExist()
  await expect(element(by.id(TravelPayE2eIdConstants.VEHICLE_ID))).toExist()
  await expect(element(by.id(TravelPayE2eIdConstants.WHERE_ID))).toExist()
  await expect(element(by.text('3101 N Fort Valley Rd'))).toExist()
  await expect(element(by.text('Flagstaff, AZ, 86001'))).toExist()
  await expect(element(by.id(TravelPayE2eIdConstants.LEFT_CANCEL_BUTTON_ID))).toExist()
  await expect(element(by.id(TravelPayE2eIdConstants.SUBMIT_BUTTON_ID))).toExist()
}

const checkSubmitSuccessScreen = async () => {
  await expect(element(by.id(TravelPayE2eIdConstants.SUCCESS_TITLE_ID))).toExist()
  await expect(element(by.id(TravelPayE2eIdConstants.SUCCESS_TEXT_ID))).toExist()
  await expect(element(by.id(TravelPayE2eIdConstants.SUCCESS_NEXT_TITLE_ID))).toExist()
  await expect(element(by.id(TravelPayE2eIdConstants.SUCCESS_NEXT_TEXT_ID))).toExist()
  await expect(element(by.id(TravelPayE2eIdConstants.SUCCESS_NEXT_TEXT2_ID))).toExist()
  await expect(element(by.id(TravelPayE2eIdConstants.LEFT_CLOSE_BUTTON_ID))).toExist()
  await expect(element(by.id(TravelPayE2eIdConstants.CLOSE_BUTTON_ID))).toExist()
}

const checkTravelPayFlow = async (existingAddress: boolean) => {
  await checkMilageScreen()
  await element(by.id(TravelPayE2eIdConstants.YES_BUTTON_ID)).tap()
  await checkVehicleScreen()
  await element(by.id(TravelPayE2eIdConstants.YES_BUTTON_ID)).tap()
  await checkAddressScreen(existingAddress)
  await element(by.id(TravelPayE2eIdConstants.YES_BUTTON_ID)).tap()
  await checkReviewClaimScreen()
  await element(by.id(TravelPayE2eIdConstants.SUBMIT_BUTTON_ID)).tap()
  await checkSubmitSuccessScreen()
  await element(by.id(TravelPayE2eIdConstants.CLOSE_BUTTON_ID)).tap()
}

describe('Travel Pay', () => {
  describe('when the veteran has a home address', () => {
    it('verifies travel pay flow', async () => {
      await openTravelPayFlow('Sami Alsahhar - Onsite - Confirmed', true)
      await checkTravelPayFlow(true)
    })
  })
})
