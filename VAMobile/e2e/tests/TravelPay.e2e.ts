import { by, device, element, expect, waitFor } from 'detox'
import { setTimeout } from 'timers/promises'

import {
  CommonE2eIdConstants,
  loginToDemoMode,
  openAppointments,
  openDismissLeavingAppPopup,
  openHealth,
  toggleOverrideApi,
  toggleRemoteConfigFlag,
} from './utils'

const TravelPayE2eIdConstants = {
  RIGHT_CLOSE_BUTTON_ID: 'rightCloseTestID',
  CONTINUE_BUTTON_ID: 'continueTestID',
  YES_BUTTON_ID: 'yesTestID',
  NO_BUTTON_TEXT: 'No',
  LEFT_CANCEL_BUTTON_ID: 'leftCancelTestID',
  LEFT_BACK_BUTTON_ID: 'leftBackTestID',
  SUBMIT_BUTTON_ID: 'submitTestID',
  RIGHT_HELP_BUTTON_ID: 'rightHelpTestID',
  MILAGE_QUESTION_ID: 'milageQuestionID',
  VEHICLE_QUESTION_ID: 'vehicleQuestionID',
  ADDRESS_QUESTION_ID: 'addressQuestionID',
  HELP_TITLE_ID: 'helpTitleID',
  HELP_TEXT_ID: 'helpTextID',
  REVIEW_TITLE_ID: 'reviewTitleID',
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
  FULL_ADDRESS_TEXT_ID: 'Home address 3101 N Fort Valley Rd, 2 Flagstaff, AZ, 86001',
  NOT_ELIGIBLE_SCREEN_ID: 'NotEligibleTypeScreen',
  FILE_ONLINE_COMPONENT_ID: 'fileOnlineComponent',
  FILE_ONLINE_TITLE_ID: 'fileOnlineTitle',
  FILE_ONLINE_METHOD_ONE_ID: 'fileOnlineComponentMethod1ID',
  FILE_ONLINE_METHOD_ONE_LINK_ID: 'fileOnlineBTSSSLink',
  FILE_ONLINE_METHOD_TWO_ID: 'fileOnlineComponentMethod2ID',
  FILE_ONLINE_METHOD_TWO_LINK_ID: 'fileOnlineVAFormLink',
  CANCEL_CLAIM_TEXT: 'Cancel Claim',
  KEEP_GOING_CLAIM_TEXT: 'Keep Going',
  CANCEL_CLAIM_TEXT_ANDROID: 'Cancel Claim ',
  KEEP_GOING_CLAIM_TEXT_ANDROID: 'Keep Going ',
  CANCEL_TRAVEL_CLAIM_TEXT: 'Cancel travel claim?',
  FILE_TRAVEL_CLAIM_TEXT: 'File travel claim',
  ELIGIBILITY_TITLE_ID: 'eligibilityTitleID',
  ELIGIBILITY_DESCRIPTION_ID: 'eligibilityDescriptionID',
  ELIGIBILITY_LINK_ID: 'checkEligibilityLinkID',
  DIRECT_DEPOSIT_TITLE_ID: 'directDepositTitleID',
  DIRECT_DEPOSIT_DESCRIPTION_ID: 'directDepositDescriptionID',
  DIRECT_DEPOSIT_LINK_ID: 'setUpDirectDepositLinkID',
  BURDEN_TIME_ID: 'burdenTimeID',
  OMB_CONTROL_NUMBER_ID: 'ombControlNumberID',
  OMB_EXPIRATION_DATE_ID: 'ombExpirationDateID',
  REVIEW_PRIVACY_STATEMENT_LINK_ID: 'reviewPrivacyStatementLinkID',
  ERROR_TITLE_ID: 'errorTitleID',
  ERROR_TEXT_ID: 'errorTextID',
  UPDATE_ADDRESS_LINK_ID: 'updateAddressLink',
  BURDEN_STATEMENT_SCREEN_ID: 'burdenStatementScreenID',
  BURDEN_STATEMENT_TITLE_ID: 'burdenStatementTitleID',
  BURDEN_STATEMENT_TEXT_ID: 'burdenStatementTextID',
  BURDEN_STATEMENT_ACT_TITLE_ID: 'burdenStatementActTitleID',
  BURDEN_STATEMENT_ACT_TEXT_ID: 'burdenStatementActTextID',
  ADDRESS_CONFIRMATION_ID: 'addressConfirmationID',
  REVIEW_CLAIM_SCREEN_ID: 'reviewClaimScreenID',
  TRAVEL_AGREEMENT_LINK_ID: 'travelAgreementLinkID',
  TRAVEL_AGREEMENT_HEADER_ID: 'travelAgreementHeaderID',
  PENALTY_STATEMENT_ID: 'penaltyStatementID',
  PENALTY_STATEMENT_AGREEMENT_ID: 'penaltyStatementAgreementID',
  BENEFICIARY_TRAVEL_AGREEMENT_ID: 'beneficiaryTravelAgreementID',
  CHECK_BOX_ID: 'checkboxTestID',
  GO_TO_APPOINTMENT_LINK_ID: 'goToAppointmentLinkID',
  SET_UP_DIRECT_DEPOSIT_LINK_ID: 'setUpDirectDepositLinkID',
  TRAVEL_CLAIM_HELP_SCREEN_ID: 'travelClaimHelpScreenID',
  TRAVEL_CLAIM_HELP_TITLE_ID: 'travelClaimHelpTitleID',
  TRAVEL_CLAIM_HELP_TEXT_ID: 'travelClaimHelpTextID',
  TRAVEL_PAY_HELP_COMPONENT_ID: 'travelPayHelp',
  TAVEL_PAY_DETAILS_STATUS_TEXT: 'Status: In Progress',
  APPOINTMENT_FILE_TRAVEL_PAY_ALERT_ID: 'appointmentFileTravelPayAlert',
  ERROR_SCREEN_ID: 'SMOCErrorScreen',
  FINISH_TRAVEL_CLAIM_LINK_ID: 'finishTravelClaimLinkID',
  CLOSE_BUTTON_ID: 'closeButtonID',
}

const fillHomeAddressFields = async () => {
  await element(by.id(CommonE2eIdConstants.CONTACT_INFO_STREET_ADDRESS_LINE_2_ID)).typeText('2')
  await element(by.id(CommonE2eIdConstants.CONTACT_INFO_STREET_ADDRESS_LINE_2_ID)).tapReturnKey()
  await waitFor(element(by.id(CommonE2eIdConstants.CONTACT_INFO_STREET_ADDRESS_LINE_2_ID)))
    .toBeVisible()
    .withTimeout(4000)
  await element(by.id(CommonE2eIdConstants.COUNTRY_PICKER_ID)).tap()
  await expect(element(by.text(TravelPayE2eIdConstants.COUNTRY_TEXT))).toExist()
  await element(by.text(TravelPayE2eIdConstants.COUNTRY_TEXT)).tap()
  await element(by.id(CommonE2eIdConstants.COUNTRY_PICKER_CONFIRM_ID)).tap()
  await element(by.id(CommonE2eIdConstants.CITY_TEST_ID)).replaceText('Flagstaff')
  await element(by.id(CommonE2eIdConstants.CITY_TEST_ID)).tapReturnKey()
  await waitFor(element(by.id(CommonE2eIdConstants.ZIP_CODE_ID)))
    .toBeVisible()
    .whileElement(by.id(CommonE2eIdConstants.EDIT_ADDRESS_ID))
    .scroll(100, 'down', NaN, 0.8)
  await element(by.id(CommonE2eIdConstants.STATE_ID)).tap()
  await element(by.text('Arizona')).tap()
  await element(by.id(CommonE2eIdConstants.STATE_PICKER_CONFIRM_ID)).tap()
  await element(by.id(CommonE2eIdConstants.EDIT_ADDRESS_ID)).scrollTo('top')
}

export async function updateAddress() {
  await waitFor(element(by.id(CommonE2eIdConstants.COUNTRY_PICKER_ID)))
    .toBeVisible()
    .withTimeout(4000)
  await element(by.id(CommonE2eIdConstants.STREET_ADDRESS_LINE_1_ID)).typeText('3101 N Fort Valley Rd')
  await element(by.id(CommonE2eIdConstants.STREET_ADDRESS_LINE_1_ID)).tapReturnKey()
  await waitFor(element(by.id(CommonE2eIdConstants.STREET_ADDRESS_LINE_1_ID)))
    .toBeVisible()
    .withTimeout(4000)
  await waitFor(element(by.id(CommonE2eIdConstants.ZIP_CODE_ID)))
    .toBeVisible()
    .whileElement(by.id(CommonE2eIdConstants.EDIT_ADDRESS_ID))
    .scroll(100, 'down', NaN, 0.8)
  await element(by.id(CommonE2eIdConstants.ZIP_CODE_ID)).replaceText('86001')
  await element(by.id(CommonE2eIdConstants.ZIP_CODE_ID)).tapReturnKey()
  await waitFor(element(by.id(CommonE2eIdConstants.ZIP_CODE_ID)))
    .toBeVisible()
    .withTimeout(4000)

  // Save the address by using the suggested address
  await element(by.id(CommonE2eIdConstants.CONTACT_INFO_SAVE_ID)).tap()
  await waitFor(element(by.id(CommonE2eIdConstants.CONTACT_INFO_SUGGESTED_ADDRESS_ID)))
    .toBeVisible()
    .withTimeout(4000)
  await element(by.id(CommonE2eIdConstants.CONTACT_INFO_SUGGESTED_ADDRESS_ID)).tap()
  await element(by.id(CommonE2eIdConstants.CONTACT_INFO_USE_THIS_ADDRESS_ID)).tap()

  // Dismiss the address suggestion modal
  try {
    await setTimeout(2000)
    await element(by.text(CommonE2eIdConstants.DISMISS_TEXT)).tap()
  } catch (ex) {}
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

const startTravelPayFlow = async () => {
  await element(by.text(TravelPayE2eIdConstants.FILE_TRAVEL_CLAIM_TEXT)).tap()
}

const openAppointmentInList = async (text: string) => {
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
}

const openTravelPayFlow = async (text: string, login: boolean = true) => {
  if (login) {
    await loginToDemoMode()
  }
  await openPastAppointments()
  await openAppointmentInList(text)

  await startTravelPayFlow()
}

const checkTravelClaimHelpScreen = async () => {
  await element(by.id(TravelPayE2eIdConstants.RIGHT_HELP_BUTTON_ID)).tap()
  await expect(element(by.id(TravelPayE2eIdConstants.TRAVEL_CLAIM_HELP_SCREEN_ID))).toExist()
  await expect(element(by.id(TravelPayE2eIdConstants.TRAVEL_CLAIM_HELP_TITLE_ID))).toExist()
  await expect(element(by.id(TravelPayE2eIdConstants.TRAVEL_CLAIM_HELP_TEXT_ID))).toExist()
  //Scroll down to the bullet list
  await element(by.id(TravelPayE2eIdConstants.TRAVEL_CLAIM_HELP_SCREEN_ID)).scrollTo('bottom')
  await checkTravelPayFileOnlineComponent()
  await checkTravelPayHelpComponent()
  await element(by.id(TravelPayE2eIdConstants.RIGHT_CLOSE_BUTTON_ID)).tap()
}

const checkMilageScreen = async (checkHelp: boolean = true) => {
  if (checkHelp) {
    await checkTravelClaimHelpScreen()
  }
  await expect(element(by.id(TravelPayE2eIdConstants.MILAGE_QUESTION_ID))).toExist()
  await expect(element(by.id(TravelPayE2eIdConstants.LEFT_BACK_BUTTON_ID))).toExist()
  await expect(element(by.id(TravelPayE2eIdConstants.YES_BUTTON_ID))).toExist()
  await expect(element(by.text(TravelPayE2eIdConstants.NO_BUTTON_TEXT))).toExist()
}

const checkVehicleScreen = async (checkHelp: boolean = true) => {
  if (checkHelp) {
    await checkTravelClaimHelpScreen()
  }
  await expect(element(by.id(TravelPayE2eIdConstants.VEHICLE_QUESTION_ID))).toExist()
  await expect(element(by.id(TravelPayE2eIdConstants.LEFT_BACK_BUTTON_ID))).toExist()
  await expect(element(by.id(TravelPayE2eIdConstants.RIGHT_HELP_BUTTON_ID))).toExist()
  await expect(element(by.id(TravelPayE2eIdConstants.YES_BUTTON_ID))).toExist()
  await expect(element(by.text(TravelPayE2eIdConstants.NO_BUTTON_TEXT))).toExist()
}

const checkAddressScreen = async (checkHelp: boolean = true) => {
  if (checkHelp) {
    await checkTravelClaimHelpScreen()
  }
  await expect(element(by.id(TravelPayE2eIdConstants.ADDRESS_QUESTION_ID))).toExist()
  await expect(element(by.id(TravelPayE2eIdConstants.FULL_ADDRESS_TEXT_ID))).toExist()
  await expect(element(by.id(TravelPayE2eIdConstants.ADDRESS_CONFIRMATION_ID))).toExist()
  await expect(element(by.id(TravelPayE2eIdConstants.LEFT_BACK_BUTTON_ID))).toExist()
  await expect(element(by.id(TravelPayE2eIdConstants.RIGHT_HELP_BUTTON_ID))).toExist()
  await expect(element(by.id(TravelPayE2eIdConstants.YES_BUTTON_ID))).toExist()
  await expect(element(by.text(TravelPayE2eIdConstants.NO_BUTTON_TEXT))).toExist()
}

const checkReviewClaimScreen = async () => {
  await expect(element(by.id(TravelPayE2eIdConstants.REVIEW_CLAIM_SCREEN_ID))).toExist()
  await expect(element(by.id(TravelPayE2eIdConstants.REVIEW_TITLE_ID))).toExist()
  await expect(element(by.id(TravelPayE2eIdConstants.WHAT_ID))).toExist()
  await expect(element(by.id(TravelPayE2eIdConstants.MILAGE_ONLY_ID))).toExist()
  await expect(element(by.id(TravelPayE2eIdConstants.HOW_ID))).toExist()
  await expect(element(by.id(TravelPayE2eIdConstants.VEHICLE_ID))).toExist()
  await expect(element(by.id(TravelPayE2eIdConstants.WHERE_ID))).toExist()
  await expect(element(by.text('3101 N Fort Valley Rd, 2'))).toExist()
  await expect(element(by.text('Flagstaff, AZ, 86001'))).toExist()
  await expect(element(by.id(TravelPayE2eIdConstants.LEFT_BACK_BUTTON_ID))).toExist()
  await expect(element(by.id(TravelPayE2eIdConstants.RIGHT_HELP_BUTTON_ID))).toExist()

  //Scroll down to the submit button
  await element(by.id(TravelPayE2eIdConstants.REVIEW_CLAIM_SCREEN_ID)).scrollTo('bottom')
  await expect(element(by.id(TravelPayE2eIdConstants.SUBMIT_BUTTON_ID))).toExist()
  // Check travel agreement link
  await expect(element(by.id(TravelPayE2eIdConstants.TRAVEL_AGREEMENT_HEADER_ID))).toExist()
  await expect(element(by.id(TravelPayE2eIdConstants.PENALTY_STATEMENT_ID))).toExist()
  await expect(element(by.id(TravelPayE2eIdConstants.PENALTY_STATEMENT_AGREEMENT_ID))).toExist()
  await expect(element(by.id(TravelPayE2eIdConstants.TRAVEL_AGREEMENT_LINK_ID))).toExist()
  await element(by.id(TravelPayE2eIdConstants.TRAVEL_AGREEMENT_LINK_ID)).tap()
  await expect(element(by.id(TravelPayE2eIdConstants.BENEFICIARY_TRAVEL_AGREEMENT_ID))).toExist()
  await element(by.id('closeButtonID')).tap()
  await expect(element(by.id(TravelPayE2eIdConstants.CHECK_BOX_ID))).toExist()
  await expect(element(by.id(TravelPayE2eIdConstants.SUBMIT_BUTTON_ID))).toExist()
  await element(by.id(TravelPayE2eIdConstants.SUBMIT_BUTTON_ID)).tap()

  await expect(element(by.label('Error: (Required)'))).toExist()
  await element(by.id(TravelPayE2eIdConstants.CHECK_BOX_ID)).tap()
}

const checkSubmitSuccessScreen = async (partialSuccess: boolean = false) => {
  if (partialSuccess) {
    await expect(element(by.id(TravelPayE2eIdConstants.SUCCESS_TITLE_ID))).toExist()
    await expect(element(by.id(TravelPayE2eIdConstants.SUCCESS_TEXT_ID))).toExist()
    await expect(element(by.id(TravelPayE2eIdConstants.SUCCESS_NEXT_TITLE_ID))).toExist()
    await expect(element(by.id(TravelPayE2eIdConstants.SUCCESS_NEXT_TEXT_ID))).toExist()
    await expect(element(by.id(TravelPayE2eIdConstants.FINISH_TRAVEL_CLAIM_LINK_ID))).toExist()
    await expect(element(by.id(TravelPayE2eIdConstants.SUCCESS_NEXT_TEXT2_ID))).toExist()
  } else {
    await expect(element(by.id(TravelPayE2eIdConstants.SUCCESS_TITLE_ID))).toExist()
    await expect(element(by.id(TravelPayE2eIdConstants.SUCCESS_TEXT_ID))).toExist()
    await expect(element(by.id(TravelPayE2eIdConstants.SUCCESS_NEXT_TITLE_ID))).toExist()
    await expect(element(by.id(TravelPayE2eIdConstants.SUCCESS_NEXT_TEXT_ID))).toExist()
    await expect(element(by.id(TravelPayE2eIdConstants.SUCCESS_NEXT_TEXT2_ID))).toExist()
    await expect(element(by.id(TravelPayE2eIdConstants.GO_TO_APPOINTMENT_LINK_ID))).toExist()
  }
  await expect(element(by.id(TravelPayE2eIdConstants.SET_UP_DIRECT_DEPOSIT_LINK_ID))).toExist()
  await openDismissLeavingAppPopup(TravelPayE2eIdConstants.SET_UP_DIRECT_DEPOSIT_LINK_ID)
  await expect(element(by.id(TravelPayE2eIdConstants.RIGHT_CLOSE_BUTTON_ID))).toExist()
}

const checkTravelPayFileOnlineComponent = async () => {
  await expect(element(by.id(TravelPayE2eIdConstants.FILE_ONLINE_COMPONENT_ID))).toExist()
  await expect(element(by.id(TravelPayE2eIdConstants.FILE_ONLINE_TITLE_ID))).toExist()
  await expect(element(by.id(TravelPayE2eIdConstants.FILE_ONLINE_METHOD_ONE_ID))).toExist()
  await expect(element(by.id(TravelPayE2eIdConstants.FILE_ONLINE_METHOD_ONE_LINK_ID))).toExist()
  await expect(element(by.id(TravelPayE2eIdConstants.FILE_ONLINE_METHOD_TWO_ID))).toExist()
  await expect(element(by.id(TravelPayE2eIdConstants.FILE_ONLINE_METHOD_TWO_LINK_ID))).toExist()
  await openDismissLeavingAppPopup(TravelPayE2eIdConstants.FILE_ONLINE_METHOD_TWO_LINK_ID)
}

const checkErrorScreen = async (error: string) => {
  await expect(element(by.id(TravelPayE2eIdConstants.ERROR_SCREEN_ID))).toExist()
  await expect(element(by.id(TravelPayE2eIdConstants.ERROR_TITLE_ID))).toExist()
  switch (error) {
    case 'noAddress':
      await expect(element(by.id(TravelPayE2eIdConstants.UPDATE_ADDRESS_LINK_ID))).toExist()
      await expect(element(by.id(TravelPayE2eIdConstants.ERROR_TEXT_ID + '0'))).toExist()
      break
    case 'unsupportedType':
      await expect(element(by.id(TravelPayE2eIdConstants.ERROR_TEXT_ID + '0'))).toExist()
      break
    case 'error':
    default:
      await expect(element(by.id(TravelPayE2eIdConstants.ERROR_TEXT_ID + '0'))).toExist()
      await expect(element(by.id(TravelPayE2eIdConstants.ERROR_TEXT_ID + '1'))).toExist()
      break
  }
  await checkTravelPayFileOnlineComponent()
  await checkTravelPayHelpComponent()
  await expect(element(by.id(TravelPayE2eIdConstants.RIGHT_CLOSE_BUTTON_ID))).toExist()
}

const checkBurdenStatementScreen = async () => {
  await element(by.id(TravelPayE2eIdConstants.BURDEN_STATEMENT_SCREEN_ID)).tap()
  await expect(element(by.id(TravelPayE2eIdConstants.BURDEN_STATEMENT_TITLE_ID))).toExist()
  await expect(element(by.id(TravelPayE2eIdConstants.BURDEN_STATEMENT_TEXT_ID))).toExist()
  await element(by.id(TravelPayE2eIdConstants.BURDEN_STATEMENT_SCREEN_ID)).scrollTo('bottom')
  await expect(element(by.id(TravelPayE2eIdConstants.BURDEN_STATEMENT_ACT_TITLE_ID))).toExist()
  await expect(element(by.id(TravelPayE2eIdConstants.BURDEN_STATEMENT_ACT_TEXT_ID))).toExist()

  await element(by.id(TravelPayE2eIdConstants.CLOSE_BUTTON_ID)).tap()

  // 115452: Added to fix race conditions with the modal not being fully closed
  // and interfering with view visibility in subsequent steps.
  await waitFor(element(by.id(TravelPayE2eIdConstants.BURDEN_STATEMENT_SCREEN_ID)))
    .not.toExist()
    .withTimeout(6000)
}

const checkTravelPayHelpComponent = async () => {
  await expect(element(by.id(TravelPayE2eIdConstants.TRAVEL_PAY_HELP_COMPONENT_ID))).toExist()
  await expect(element(by.id(TravelPayE2eIdConstants.HELP_TITLE_ID))).toExist()
  await expect(element(by.id(TravelPayE2eIdConstants.HELP_TEXT_ID))).toExist()
  if (device.getPlatform() === 'android') {
    await expect(element(by.id(CommonE2eIdConstants.CALL_VA_PHONE_NUMBER_ID)).atIndex(0)).toExist()
  } else {
    await expect(element(by.id(CommonE2eIdConstants.CALL_VA_PHONE_NUMBER_ID))).toExist()
  }
  if (device.getPlatform() === 'android') {
    await expect(element(by.id(CommonE2eIdConstants.CALL_VA_TTY_PHONE_NUMBER_ID)).atIndex(0)).toExist()
  } else {
    await expect(element(by.id(CommonE2eIdConstants.CALL_VA_TTY_PHONE_NUMBER_ID))).toExist()
  }
}

const checkInterstitialScreen = async () => {
  await expect(element(by.id(TravelPayE2eIdConstants.LEFT_CANCEL_BUTTON_ID))).toExist()
  await expect(element(by.id(TravelPayE2eIdConstants.CONTINUE_BUTTON_ID))).toExist()
  await expect(element(by.id(TravelPayE2eIdConstants.MILAGE_QUESTION_ID))).toExist()
  await expect(element(by.id(TravelPayE2eIdConstants.ELIGIBILITY_TITLE_ID))).toExist()
  await expect(element(by.id(TravelPayE2eIdConstants.ELIGIBILITY_DESCRIPTION_ID))).toExist()
  await expect(element(by.id(TravelPayE2eIdConstants.ELIGIBILITY_LINK_ID))).toExist()
  await openDismissLeavingAppPopup(TravelPayE2eIdConstants.ELIGIBILITY_LINK_ID)
  await expect(element(by.id(TravelPayE2eIdConstants.DIRECT_DEPOSIT_TITLE_ID))).toExist()
  await expect(element(by.id(TravelPayE2eIdConstants.DIRECT_DEPOSIT_DESCRIPTION_ID))).toExist()
  await expect(element(by.id(TravelPayE2eIdConstants.DIRECT_DEPOSIT_LINK_ID))).toExist()
  await openDismissLeavingAppPopup(TravelPayE2eIdConstants.DIRECT_DEPOSIT_LINK_ID)
  await expect(element(by.id(TravelPayE2eIdConstants.BURDEN_TIME_ID))).toExist()
  await expect(element(by.id(TravelPayE2eIdConstants.OMB_CONTROL_NUMBER_ID))).toExist()
  await expect(element(by.id(TravelPayE2eIdConstants.OMB_EXPIRATION_DATE_ID))).toExist()
  await expect(element(by.id(TravelPayE2eIdConstants.REVIEW_PRIVACY_STATEMENT_LINK_ID))).toExist()
  await element(by.id(TravelPayE2eIdConstants.REVIEW_PRIVACY_STATEMENT_LINK_ID)).tap()
  await checkBurdenStatementScreen()
}

const checkTravelPayFlow = async (existingAddress: boolean, checkHelp: boolean = false) => {
  await checkInterstitialScreen()
  await element(by.id(TravelPayE2eIdConstants.CONTINUE_BUTTON_ID)).tap()
  await checkMilageScreen(checkHelp)
  await element(by.id(TravelPayE2eIdConstants.YES_BUTTON_ID)).tap()
  await checkVehicleScreen(checkHelp)
  await element(by.id(TravelPayE2eIdConstants.YES_BUTTON_ID)).tap()
  if (existingAddress) {
    await checkAddressScreen(checkHelp)
    await element(by.id(TravelPayE2eIdConstants.YES_BUTTON_ID)).tap()
    await checkReviewClaimScreen()
    await element(by.id(TravelPayE2eIdConstants.SUBMIT_BUTTON_ID)).tap()
    await setTimeout(4000)
    await checkSubmitSuccessScreen()
    await element(by.id(TravelPayE2eIdConstants.RIGHT_CLOSE_BUTTON_ID)).tap()
  } else {
    await checkErrorScreen('noAddress')
    await expect(element(by.id(TravelPayE2eIdConstants.RIGHT_CLOSE_BUTTON_ID))).toExist()
  }
}

describe('Travel Pay', () => {
  beforeAll(async () => {
    await toggleRemoteConfigFlag(CommonE2eIdConstants.IN_APP_REVIEW_TOGGLE_TEXT)
    await toggleRemoteConfigFlag(CommonE2eIdConstants.TRAVEL_PAY_CONFIG_FLAG_TEXT)
  })

  it('shows the no address error screen when the home address is not entered', async () => {
    await openTravelPayFlow('Sami Alsahhar - Onsite - Confirmed')
    await checkTravelPayFlow(false)
    await element(by.id(TravelPayE2eIdConstants.RIGHT_CLOSE_BUTTON_ID)).tap()
  })

  it('correctly displays the cancel and keep going buttons when the top left cancel button is tapped', async () => {
    await startTravelPayFlow()
    await element(by.id(TravelPayE2eIdConstants.LEFT_CANCEL_BUTTON_ID)).tap()
    await waitFor(element(by.text(TravelPayE2eIdConstants.CANCEL_TRAVEL_CLAIM_TEXT)))
      .toBeVisible()
      .withTimeout(2000)
    if (device.getPlatform() === 'android') {
      // Android has a different text for the cancel button
      await expect(element(by.text(TravelPayE2eIdConstants.CANCEL_CLAIM_TEXT_ANDROID))).toExist()
      await expect(element(by.text(TravelPayE2eIdConstants.KEEP_GOING_CLAIM_TEXT_ANDROID))).toExist()
    } else {
      await expect(element(by.text(TravelPayE2eIdConstants.CANCEL_CLAIM_TEXT)).atIndex(0)).toExist()
      await expect(element(by.text(TravelPayE2eIdConstants.KEEP_GOING_CLAIM_TEXT))).toExist()
    }
  })

  it('countinues the flow when tapping the keep going confirmation button', async () => {
    if (device.getPlatform() === 'android') {
      await element(by.text(TravelPayE2eIdConstants.KEEP_GOING_CLAIM_TEXT_ANDROID)).tap()
    } else {
      await element(by.text(TravelPayE2eIdConstants.KEEP_GOING_CLAIM_TEXT)).atIndex(0).tap()
    }
    await waitFor(element(by.id(TravelPayE2eIdConstants.LEFT_CANCEL_BUTTON_ID)))
      .toBeVisible()
      .withTimeout(2000)
    await expect(element(by.id(TravelPayE2eIdConstants.LEFT_CANCEL_BUTTON_ID))).toBeVisible()
    await expect(element(by.text(TravelPayE2eIdConstants.CANCEL_TRAVEL_CLAIM_TEXT))).not.toExist()
  })

  it('exits the flow when tapping the cancel confirmation button', async () => {
    await element(by.id(TravelPayE2eIdConstants.LEFT_CANCEL_BUTTON_ID)).tap()
    await waitFor(element(by.text(TravelPayE2eIdConstants.CANCEL_TRAVEL_CLAIM_TEXT)))
      .toBeVisible()
      .withTimeout(2000)
    if (device.getPlatform() === 'android') {
      await element(by.text(TravelPayE2eIdConstants.CANCEL_CLAIM_TEXT_ANDROID)).tap()
    } else {
      await element(by.text(TravelPayE2eIdConstants.CANCEL_CLAIM_TEXT)).atIndex(0).tap()
    }
    await waitFor(element(by.text(TravelPayE2eIdConstants.FILE_TRAVEL_CLAIM_TEXT)))
      .toBeVisible()
      .withTimeout(2000)
    await expect(element(by.text(TravelPayE2eIdConstants.FILE_TRAVEL_CLAIM_TEXT))).toExist()
  })

  it('allows the user to update the address from the no address error screen', async () => {
    await startTravelPayFlow()
    await checkTravelPayFlow(false)
    await element(by.id(TravelPayE2eIdConstants.UPDATE_ADDRESS_LINK_ID)).tap()
    await fillHomeAddressFields()
    await updateAddress()
    await expect(element(by.id(TravelPayE2eIdConstants.ERROR_SCREEN_ID))).not.toExist()
    await checkAddressScreen()
  })

  it('navigates back to the previous question screen when the back button is tapped ', async () => {
    await element(by.id(TravelPayE2eIdConstants.YES_BUTTON_ID)).tap()
    await expect(element(by.id(TravelPayE2eIdConstants.REVIEW_CLAIM_SCREEN_ID))).toExist()
    await element(by.id(TravelPayE2eIdConstants.LEFT_BACK_BUTTON_ID)).tap()
    await expect(element(by.id(TravelPayE2eIdConstants.ADDRESS_QUESTION_ID))).toExist()
    await element(by.id(TravelPayE2eIdConstants.LEFT_BACK_BUTTON_ID)).tap()
    await expect(element(by.id(TravelPayE2eIdConstants.VEHICLE_QUESTION_ID))).toExist()
    await element(by.id(TravelPayE2eIdConstants.LEFT_BACK_BUTTON_ID)).tap()
    await expect(element(by.id(TravelPayE2eIdConstants.MILAGE_QUESTION_ID))).toExist()
    await element(by.id(TravelPayE2eIdConstants.LEFT_BACK_BUTTON_ID)).tap()
    await expect(element(by.id(TravelPayE2eIdConstants.CONTINUE_BUTTON_ID))).toExist()
  })

  it('navigates to the error screen when the answer is no to any of the questions', async () => {
    await element(by.id(TravelPayE2eIdConstants.CONTINUE_BUTTON_ID)).tap()
    await element(by.id(TravelPayE2eIdConstants.NO_BUTTON_TEXT)).tap()
    await checkErrorScreen('unsupportedType')
    await element(by.id(TravelPayE2eIdConstants.RIGHT_CLOSE_BUTTON_ID)).tap()
    await startTravelPayFlow()
    await element(by.id(TravelPayE2eIdConstants.CONTINUE_BUTTON_ID)).tap()
    await element(by.id(TravelPayE2eIdConstants.YES_BUTTON_ID)).tap()
    await element(by.id(TravelPayE2eIdConstants.NO_BUTTON_TEXT)).tap()
    await checkErrorScreen('unsupportedType')
    await element(by.id(TravelPayE2eIdConstants.RIGHT_CLOSE_BUTTON_ID)).tap()
    await startTravelPayFlow()
    await element(by.id(TravelPayE2eIdConstants.CONTINUE_BUTTON_ID)).tap()
    await element(by.id(TravelPayE2eIdConstants.YES_BUTTON_ID)).tap()
    await element(by.id(TravelPayE2eIdConstants.YES_BUTTON_ID)).tap()
    await element(by.id(TravelPayE2eIdConstants.NO_BUTTON_TEXT)).tap()
    await checkErrorScreen('unsupportedType')
    await element(by.id(TravelPayE2eIdConstants.RIGHT_CLOSE_BUTTON_ID)).tap()
  })

  it('submits the travel pay claim', async () => {
    await startTravelPayFlow()
    await checkTravelPayFlow(true, true)
    await expect(element(by.id(TravelPayE2eIdConstants.FILE_TRAVEL_CLAIM_TEXT))).not.toExist()
    await expect(element(by.id(TravelPayE2eIdConstants.APPOINTMENT_FILE_TRAVEL_PAY_ALERT_ID))).not.toExist()
  })

  it('shows the travel claim detials after filing the travel pay claim', async () => {
    await waitFor(element(by.id('goToVAGovID-mock_id')))
      .toBeVisible()
      .whileElement(by.id('PastApptDetailsTestID'))
      .scroll(100, 'down', NaN, 0.8)
    await expect(element(by.id('goToVAGovID-mock_id'))).toExist()
    await expect(element(by.text(TravelPayE2eIdConstants.TAVEL_PAY_DETAILS_STATUS_TEXT))).toExist()
  })

  it('opens a webview to view claim details on web', async () => {
    await element(by.id('goToVAGovID-mock_id')).tap()
    await expect(element(by.text('Travel Claim Details'))).toExist()
    await element(by.id('webviewBack')).tap()
  })

  it('updates the appointments cache when the travel pay claim is submitted', async () => {
    await element(by.text('Appointments')).tap()
    await openAppointmentInList('Sami Alsahhar - Onsite - Confirmed')
    await expect(element(by.id(TravelPayE2eIdConstants.FILE_TRAVEL_CLAIM_TEXT))).not.toExist()
    await expect(element(by.id(TravelPayE2eIdConstants.APPOINTMENT_FILE_TRAVEL_PAY_ALERT_ID))).not.toExist()
    await element(by.id('PastApptDetailsTestID')).scrollTo('bottom')
    await waitFor(element(by.id('goToVAGovID-mock_id')))
      .toBeVisible()
      .whileElement(by.id('PastApptDetailsTestID'))
      .scroll(100, 'down', NaN, 0.8)
    await expect(element(by.id('goToVAGovID-mock_id'))).toExist()
    await expect(element(by.text(TravelPayE2eIdConstants.TAVEL_PAY_DETAILS_STATUS_TEXT))).toExist()
  })

  it('shows partial success if status is Incomplete or Saved', async () => {
    await element(by.text('Appointments')).tap()
    await element(by.id(CommonE2eIdConstants.APPOINTMENTS_SCROLL_ID)).scrollTo('bottom')
    // go to the next page
    await element(by.id(CommonE2eIdConstants.NEXT_PAGE_ID)).tap()
    await openAppointmentInList('At Fort Collins VA Clinic - Claim - Confirmed')
    await startTravelPayFlow()
    await element(by.id(TravelPayE2eIdConstants.CONTINUE_BUTTON_ID)).tap()
    await element(by.id(TravelPayE2eIdConstants.YES_BUTTON_ID)).tap()
    await element(by.id(TravelPayE2eIdConstants.YES_BUTTON_ID)).tap()
    await element(by.id(TravelPayE2eIdConstants.YES_BUTTON_ID)).tap()
    await element(by.id(TravelPayE2eIdConstants.REVIEW_CLAIM_SCREEN_ID)).scrollTo('bottom')
    await element(by.id(TravelPayE2eIdConstants.CHECK_BOX_ID)).tap()
    await element(by.id(TravelPayE2eIdConstants.SUBMIT_BUTTON_ID)).tap()
    await setTimeout(4000)
    await checkSubmitSuccessScreen(true)
  })

  it('shows the travel claim details for the partial success claim', async () => {
    await element(by.id(TravelPayE2eIdConstants.RIGHT_CLOSE_BUTTON_ID)).tap()
    await waitFor(element(by.id('goToVAGovID-mock_id_partial_success')))
      .toBeVisible()
      .whileElement(by.id('PastApptDetailsTestID'))
      .scroll(100, 'down', NaN, 0.8)
    await expect(element(by.text('Status: Saved'))).toExist()
  })

  it('shows the error screen when the travel pay claim fails to submit', async () => {
    await element(by.text('Appointments')).tap()
    await element(by.id(CommonE2eIdConstants.APPOINTMENTS_SCROLL_ID)).scrollTo('bottom')
    await element(by.id(CommonE2eIdConstants.PREVIOUS_PAGE_ID)).tap()
    await element(by.id(CommonE2eIdConstants.APPOINTMENTS_SCROLL_ID)).scrollTo('top')
    await element(by.id(CommonE2eIdConstants.HOME_TAB_BUTTON_ID)).tap()
    // Override the travel pay claim API to return a 500 error
    await toggleOverrideApi('/v0/travel-pay/claims', { otherStatus: '500' })
    await openHealth()

    await openAppointmentInList('Sami Alsahhar - ATLAS - Confirmed')

    await startTravelPayFlow()
    await element(by.id(TravelPayE2eIdConstants.CONTINUE_BUTTON_ID)).tap()
    await element(by.id(TravelPayE2eIdConstants.YES_BUTTON_ID)).tap()
    await element(by.id(TravelPayE2eIdConstants.YES_BUTTON_ID)).tap()
    await element(by.id(TravelPayE2eIdConstants.YES_BUTTON_ID)).tap()
    await element(by.id(TravelPayE2eIdConstants.REVIEW_CLAIM_SCREEN_ID)).scrollTo('bottom')
    await element(by.id(TravelPayE2eIdConstants.CHECK_BOX_ID)).tap()
    await element(by.id(TravelPayE2eIdConstants.SUBMIT_BUTTON_ID)).tap()

    await checkErrorScreen('error')
  })

  it('continues to show the Travel Pay Alert to submit a claim after the error screen', async () => {
    await element(by.id(TravelPayE2eIdConstants.RIGHT_CLOSE_BUTTON_ID)).tap()
    await expect(element(by.id(TravelPayE2eIdConstants.FILE_TRAVEL_CLAIM_TEXT))).toExist()
    await expect(element(by.id(TravelPayE2eIdConstants.APPOINTMENT_FILE_TRAVEL_PAY_ALERT_ID))).toExist()
    await element(by.text('Appointments')).tap()
    await openAppointmentInList('Sami Alsahhar - ATLAS - Confirmed')
    await expect(element(by.id(TravelPayE2eIdConstants.FILE_TRAVEL_CLAIM_TEXT))).toExist()
    await expect(element(by.id(TravelPayE2eIdConstants.APPOINTMENT_FILE_TRAVEL_PAY_ALERT_ID))).toExist()
  })
})
