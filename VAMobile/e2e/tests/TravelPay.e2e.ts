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
  ADDRESS_CITY_TEXT: 'Flagstaff',
  ADDRESS_COUNTRY_TEXT: 'United States',
  ADDRESS_CONFIRMATION_ID: 'addressConfirmationID',
  ADDRESS_QUESTION_ID: 'addressQuestionID',
  ADDRESS_STATE_TEXT: 'Arizona',
  ADDRESS_STREET_ADDRESS_LINE_1_TEXT: '3101 N Fort Valley Rd',
  ADDRESS_STREET_ADDRESS_LINE_2_TEXT: '2',
  ADDRESS_ZIP_CODE_TEXT: '86001',
  APPOINTMENTS_SCREEN_TEXT: 'Appointments',
  APPOINTMENT_FILE_TRAVEL_PAY_ALERT_ID: 'appointmentFileTravelPayAlert',
  TRAVEL_CLAIM_DETAILS_TEXT: 'Travel Claim Details',
  BENEFICIARY_TRAVEL_AGREEMENT_ID: 'beneficiaryTravelAgreementID',
  BURDEN_STATEMENT_ACT_TEXT_ID: 'burdenStatementActTextID',
  BURDEN_STATEMENT_ACT_TITLE_ID: 'burdenStatementActTitleID',
  BURDEN_STATEMENT_SCREEN_ID: 'burdenStatementScreenID',
  BURDEN_STATEMENT_TEXT_ID: 'burdenStatementTextID',
  BURDEN_STATEMENT_TITLE_ID: 'burdenStatementTitleID',
  BURDEN_TIME_ID: 'burdenTimeID',
  CANCEL_CLAIM_TEXT: 'Cancel Claim',
  CANCEL_CLAIM_TEXT_ANDROID: 'Cancel Claim ',
  CANCEL_TRAVEL_CLAIM_TEXT: 'Cancel travel claim?',
  CHECK_BOX_ID: 'checkboxTestID',
  CLOSE_BUTTON_ID: 'closeButtonID',
  CONTINUE_BUTTON_ID: 'continueTestID',
  DIRECT_DEPOSIT_DESCRIPTION_ID: 'directDepositDescriptionID',
  DIRECT_DEPOSIT_LINK_ID: 'setUpDirectDepositLinkID',
  DIRECT_DEPOSIT_TITLE_ID: 'directDepositTitleID',
  ELIGIBILITY_DESCRIPTION_ID: 'eligibilityDescriptionID',
  ELIGIBILITY_LINK_ID: 'checkEligibilityLinkID',
  ELIGIBILITY_TITLE_ID: 'eligibilityTitleID',
  ERROR_SCREEN_ID: 'SMOCErrorScreen',
  ERROR_TEXT_ID: 'errorTextID',
  ERROR_TITLE_ID: 'errorTitleID',
  FILE_ONLINE_COMPONENT_ID: 'fileOnlineComponent',
  FILE_ONLINE_METHOD_ONE_ID: 'fileOnlineComponentMethod1ID',
  FILE_ONLINE_METHOD_ONE_LINK_ID: 'fileOnlineBTSSSLink',
  FILE_ONLINE_METHOD_TWO_ID: 'fileOnlineComponentMethod2ID',
  FILE_ONLINE_METHOD_TWO_LINK_ID: 'fileOnlineVAFormLink',
  FILE_ONLINE_TITLE_ID: 'fileOnlineTitle',
  FILE_TRAVEL_CLAIM_TEXT: 'File travel claim',
  APPOINTMENT_FILE_TRAVEL_PAY_ALERT_PRIMARY_BUTTON_ID: 'appointmentFileTravelPayAlertPrimaryButtonTestID',
  FINISH_TRAVEL_CLAIM_LINK_ID: 'finishTravelClaimLinkID',
  FULL_ADDRESS_TEXT_ID: 'Home address 3101 N Fort Valley Rd, 2 Flagstaff, AZ, 86001',
  GO_TO_APPOINTMENT_LINK_ID: 'goToAppointmentLinkID',
  GO_TO_CLAIM_DETAILS_ID: 'goToClaimDetails-mock_id',
  GO_TO_CLAIM_DETAILS_ID_PARTIAL_SUCCESS_ID: 'goToClaimDetails-mock_id_partial_success',
  HELP_TEXT_ID: 'helpTextID',
  HELP_TITLE_ID: 'helpTitleID',
  HOW_ID: 'howID',
  KEEP_GOING_CLAIM_TEXT: 'Keep Going',
  KEEP_GOING_CLAIM_TEXT_ANDROID: 'Keep Going ',
  LEFT_BACK_BUTTON_ID: 'leftBackTestID',
  LEFT_CANCEL_BUTTON_ID: 'leftCancelTestID',
  MILEAGE_ONLY_ID: 'mileageOnlyID',
  MILEAGE_QUESTION_ID: 'mileageQuestionID',
  NO_BUTTON_TEXT: 'No',
  NOT_ELIGIBLE_SCREEN_ID: 'NotEligibleTypeScreen',
  OMB_CONTROL_NUMBER_ID: 'ombControlNumberID',
  OMB_EXPIRATION_DATE_ID: 'ombExpirationDateID',
  PAST_APPOINTMENT_DETAILS_SCROLL_ID: 'PastApptDetailsTestID',
  PENALTY_STATEMENT_AGREEMENT_ID: 'penaltyStatementAgreementID',
  PENALTY_STATEMENT_ID: 'penaltyStatementID',
  REVIEW_CLAIM_SCREEN_ID: 'reviewClaimScreenID',
  REVIEW_CLAIM_SCREEN_ADDRESS_TEXT: '3101 N Fort Valley Rd, 2',
  REVIEW_CLAIM_SCREEN_CITY_STATE_ZIP_TEXT: 'Flagstaff, AZ, 86001',
  REVIEW_ERROR_LABEL_TEXT: 'Error: (Required)',
  REVIEW_PRIVACY_STATEMENT_LINK_ID: 'reviewPrivacyStatementLinkID',
  REVIEW_TITLE_ID: 'reviewTitleID',
  RIGHT_CLOSE_BUTTON_ID: 'rightCloseTestID',
  RIGHT_HELP_BUTTON_ID: 'rightHelpTestID',
  SET_UP_DIRECT_DEPOSIT_LINK_ID: 'setUpDirectDepositLinkID',
  STATE_TEXT: 'Arizona',
  STATUS_SAVED_TEXT: 'Status: Saved',
  SUBMIT_BUTTON_ID: 'submitTestID',
  SUCCESS_CONTENT_HEADER_ID: 'successContentHeaderID',
  SUCCESS_CONTENT_DESCRIPTION_ID: 'successContentDescriptionID',
  SUCCESS_CONTENT_SECTION_TITLE_ID: 'successContentSectionTitleID',
  SUCCESS_CONTENT_INSTRUCTION_TEXT_ID: 'successContentInstructionTextID',
  SUCCESS_CONTENT_ADDITIONAL_TEXT_ID: 'successContentAdditionalTextID',
  TAVEL_PAY_DETAILS_STATUS_TEXT: 'Status: In Progress',
  TRAVEL_AGREEMENT_HEADER_ID: 'travelAgreementHeaderID',
  TRAVEL_AGREEMENT_LINK_ID: 'travelAgreementLinkID',
  TRAVEL_CLAIM_HELP_SCREEN_ID: 'travelClaimHelpScreenID',
  TRAVEL_CLAIM_HELP_TEXT_ID: 'travelClaimHelpTextID',
  TRAVEL_CLAIM_HELP_TITLE_ID: 'travelClaimHelpTitleID',
  TRAVEL_PAY_HELP_COMPONENT_ID: 'travelPayHelp',
  UPDATE_ADDRESS_LINK_ID: 'updateAddressLink',
  VEHICLE_ID: 'vehicleID',
  VEHICLE_QUESTION_ID: 'vehicleQuestionID',
  WEBVIEW_BACK_BUTTON_ID: 'webviewBack',
  WHAT_ID: 'whatID',
  WHERE_ID: 'whereID',
  YES_BUTTON_ID: 'yesTestID',
}

const CANCEL =
  device.getPlatform() === 'android'
    ? TravelPayE2eIdConstants.CANCEL_CLAIM_TEXT_ANDROID
    : TravelPayE2eIdConstants.CANCEL_CLAIM_TEXT
const KEEP =
  device.getPlatform() === 'android'
    ? TravelPayE2eIdConstants.KEEP_GOING_CLAIM_TEXT_ANDROID
    : TravelPayE2eIdConstants.KEEP_GOING_CLAIM_TEXT

// Actions
async function pressContinue() {
  await element(by.id(TravelPayE2eIdConstants.CONTINUE_BUTTON_ID)).tap()
}

async function answerYes() {
  await element(by.id(TravelPayE2eIdConstants.YES_BUTTON_ID)).tap()
}

async function answerNo() {
  await element(by.text(TravelPayE2eIdConstants.NO_BUTTON_TEXT)).tap()
}

async function chooseKeepGoing() {
  await element(by.text(KEEP)).atIndex(0).tap()
}

async function chooseCancel() {
  await element(by.text(CANCEL)).atIndex(0).tap()
}

async function pressFileClaimButton() {
  await element(by.id(TravelPayE2eIdConstants.APPOINTMENT_FILE_TRAVEL_PAY_ALERT_PRIMARY_BUTTON_ID)).tap()
}

async function pressCloseTopRight() {
  await element(by.id(TravelPayE2eIdConstants.RIGHT_CLOSE_BUTTON_ID)).tap()
}

async function pressUpdateAddressLink() {
  await element(by.id(TravelPayE2eIdConstants.UPDATE_ADDRESS_LINK_ID)).tap()
}

async function acceptTravelAgreement() {
  await element(by.id(TravelPayE2eIdConstants.CHECK_BOX_ID)).tap()
}

async function reviewClaimsScroll(direction: 'top' | 'bottom') {
  await element(by.id(TravelPayE2eIdConstants.REVIEW_CLAIM_SCREEN_ID)).scrollTo(direction)
}

async function pressBack() {
  await element(by.id(TravelPayE2eIdConstants.LEFT_BACK_BUTTON_ID)).tap()
}

async function pressSubmitButton() {
  await element(by.id(TravelPayE2eIdConstants.SUBMIT_BUTTON_ID)).tap()
}

async function pressHelpButton() {
  await element(by.id(TravelPayE2eIdConstants.RIGHT_HELP_BUTTON_ID)).tap()
}

// Expectations
const expectTravelPayFileOnlineComponent = async (checkExternalLink: boolean = false) => {
  await expect(element(by.id(TravelPayE2eIdConstants.FILE_ONLINE_COMPONENT_ID))).toExist()
  await expect(element(by.id(TravelPayE2eIdConstants.FILE_ONLINE_TITLE_ID))).toExist()
  await expect(element(by.id(TravelPayE2eIdConstants.FILE_ONLINE_METHOD_ONE_ID))).toExist()
  await expect(element(by.id(TravelPayE2eIdConstants.FILE_ONLINE_METHOD_ONE_LINK_ID))).toExist()
  await expect(element(by.id(TravelPayE2eIdConstants.FILE_ONLINE_METHOD_TWO_ID))).toExist()
  await expect(element(by.id(TravelPayE2eIdConstants.FILE_ONLINE_METHOD_TWO_LINK_ID))).toExist()
  if (checkExternalLink) {
    await openDismissLeavingAppPopup(TravelPayE2eIdConstants.FILE_ONLINE_METHOD_ONE_LINK_ID)
    await openDismissLeavingAppPopup(TravelPayE2eIdConstants.FILE_ONLINE_METHOD_TWO_LINK_ID)
  }
}

const expectTravelPayHelpComponent = async () => {
  await expect(element(by.id(TravelPayE2eIdConstants.TRAVEL_PAY_HELP_COMPONENT_ID)).atIndex(0)).toExist()
  await expect(element(by.id(TravelPayE2eIdConstants.HELP_TITLE_ID)).atIndex(0)).toExist()
  await expect(element(by.id(TravelPayE2eIdConstants.HELP_TEXT_ID)).atIndex(0)).toExist()
  if (device.getPlatform() === 'android') {
    await expect(element(by.id(CommonE2eIdConstants.CALL_VA_PHONE_NUMBER_ID)).atIndex(0)).toExist()
    await expect(element(by.id(CommonE2eIdConstants.CALL_VA_TTY_PHONE_NUMBER_ID)).atIndex(0)).toExist()
  } else {
    await expect(element(by.id(CommonE2eIdConstants.CALL_VA_PHONE_NUMBER_ID)).atIndex(0)).toExist()
    await expect(element(by.id(CommonE2eIdConstants.CALL_VA_TTY_PHONE_NUMBER_ID)).atIndex(0)).toExist()
  }
}

const expectBurdenStatementScreen = async () => {
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

async function expectTravelClaimHelpScreen({ checkExternalLink }: { checkExternalLink: boolean }) {
  await expect(element(by.id(TravelPayE2eIdConstants.TRAVEL_CLAIM_HELP_SCREEN_ID))).toExist()
  await expect(element(by.id(TravelPayE2eIdConstants.TRAVEL_CLAIM_HELP_TITLE_ID))).toExist()
  await expect(element(by.id(TravelPayE2eIdConstants.TRAVEL_CLAIM_HELP_TEXT_ID))).toExist()
  //Scroll down to the bullet list
  await element(by.id(TravelPayE2eIdConstants.TRAVEL_CLAIM_HELP_SCREEN_ID)).scrollTo('bottom')
  await expectTravelPayFileOnlineComponent(checkExternalLink)
  await expectTravelPayHelpComponent()
}

async function expectErrorScreen({ errorType, checkExternalLink }: { errorType: string; checkExternalLink: boolean }) {
  await expect(element(by.id(TravelPayE2eIdConstants.ERROR_SCREEN_ID))).toExist()
  await expect(element(by.id(TravelPayE2eIdConstants.ERROR_TITLE_ID))).toExist()
  switch (errorType) {
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
  await expectTravelPayFileOnlineComponent(checkExternalLink)
  await expectTravelPayHelpComponent()
  await expect(element(by.id(TravelPayE2eIdConstants.RIGHT_CLOSE_BUTTON_ID))).toExist()
}

async function expectCancelModal() {
  await element(by.id(TravelPayE2eIdConstants.LEFT_CANCEL_BUTTON_ID)).tap()
  await waitFor(element(by.text(TravelPayE2eIdConstants.CANCEL_TRAVEL_CLAIM_TEXT)))
    .toBeVisible()
    .withTimeout(2000)

  await expect(element(by.text(CANCEL))).toExist()
  await expect(element(by.text(KEEP))).toExist()
}

async function expectInterstitialScreen({
  checkBurdenStatement,
  checkExternalLink,
}: {
  checkBurdenStatement: boolean
  checkExternalLink: boolean
}) {
  await expect(element(by.id(TravelPayE2eIdConstants.LEFT_CANCEL_BUTTON_ID))).toExist()
  await expect(element(by.id(TravelPayE2eIdConstants.CONTINUE_BUTTON_ID))).toExist()
  await expect(element(by.id(TravelPayE2eIdConstants.MILEAGE_QUESTION_ID))).toExist()
  await expect(element(by.id(TravelPayE2eIdConstants.ELIGIBILITY_TITLE_ID))).toExist()
  await expect(element(by.id(TravelPayE2eIdConstants.ELIGIBILITY_DESCRIPTION_ID))).toExist()
  await expect(element(by.id(TravelPayE2eIdConstants.ELIGIBILITY_LINK_ID))).toExist()
  if (checkExternalLink) {
    await openDismissLeavingAppPopup(TravelPayE2eIdConstants.ELIGIBILITY_LINK_ID)
  }
  await expect(element(by.id(TravelPayE2eIdConstants.DIRECT_DEPOSIT_TITLE_ID))).toExist()
  await expect(element(by.id(TravelPayE2eIdConstants.DIRECT_DEPOSIT_DESCRIPTION_ID))).toExist()
  await expect(element(by.id(TravelPayE2eIdConstants.DIRECT_DEPOSIT_LINK_ID))).toExist()
  if (checkExternalLink) {
    await openDismissLeavingAppPopup(TravelPayE2eIdConstants.DIRECT_DEPOSIT_LINK_ID)
  }
  await expect(element(by.id(TravelPayE2eIdConstants.BURDEN_TIME_ID))).toExist()
  await expect(element(by.id(TravelPayE2eIdConstants.OMB_CONTROL_NUMBER_ID))).toExist()
  await expect(element(by.id(TravelPayE2eIdConstants.OMB_EXPIRATION_DATE_ID))).toExist()
  await expect(element(by.id(TravelPayE2eIdConstants.REVIEW_PRIVACY_STATEMENT_LINK_ID))).toExist()
  if (checkBurdenStatement) {
    await element(by.id(TravelPayE2eIdConstants.REVIEW_PRIVACY_STATEMENT_LINK_ID)).tap()
    await expectBurdenStatementScreen()
  }
}

async function expectMileageScreen() {
  await expect(element(by.id(TravelPayE2eIdConstants.MILEAGE_QUESTION_ID))).toExist()
  await expect(element(by.id(TravelPayE2eIdConstants.LEFT_BACK_BUTTON_ID))).toExist()
  await expect(element(by.id(TravelPayE2eIdConstants.YES_BUTTON_ID))).toExist()
  await expect(element(by.text(TravelPayE2eIdConstants.NO_BUTTON_TEXT))).toExist()
  await expect(element(by.id(TravelPayE2eIdConstants.RIGHT_HELP_BUTTON_ID))).toExist()
}

async function expectVehicleScreen() {
  await expect(element(by.id(TravelPayE2eIdConstants.VEHICLE_QUESTION_ID))).toExist()
  await expect(element(by.id(TravelPayE2eIdConstants.LEFT_BACK_BUTTON_ID))).toExist()
  await expect(element(by.id(TravelPayE2eIdConstants.RIGHT_HELP_BUTTON_ID))).toExist()
  await expect(element(by.id(TravelPayE2eIdConstants.YES_BUTTON_ID))).toExist()
  await expect(element(by.text(TravelPayE2eIdConstants.NO_BUTTON_TEXT))).toExist()
  await expect(element(by.id(TravelPayE2eIdConstants.RIGHT_HELP_BUTTON_ID))).toExist()
}

async function expectAddressScreen() {
  await expect(element(by.id(TravelPayE2eIdConstants.ADDRESS_QUESTION_ID))).toExist()
  await expect(element(by.id(TravelPayE2eIdConstants.FULL_ADDRESS_TEXT_ID))).toExist()
  await expect(element(by.id(TravelPayE2eIdConstants.ADDRESS_CONFIRMATION_ID))).toExist()
  await expect(element(by.id(TravelPayE2eIdConstants.LEFT_BACK_BUTTON_ID))).toExist()
  await expect(element(by.id(TravelPayE2eIdConstants.RIGHT_HELP_BUTTON_ID))).toExist()
  await expect(element(by.id(TravelPayE2eIdConstants.YES_BUTTON_ID))).toExist()
  await expect(element(by.text(TravelPayE2eIdConstants.NO_BUTTON_TEXT))).toExist()
  await expect(element(by.id(TravelPayE2eIdConstants.RIGHT_HELP_BUTTON_ID))).toExist()
}

async function expectReviewClaimScreen({
  checkTravelAgreement,
  checkErrorState,
}: {
  checkTravelAgreement: boolean
  checkErrorState: boolean
}) {
  await expect(element(by.id(TravelPayE2eIdConstants.REVIEW_CLAIM_SCREEN_ID))).toExist()
  await expect(element(by.id(TravelPayE2eIdConstants.REVIEW_TITLE_ID))).toExist()
  await expect(element(by.id(TravelPayE2eIdConstants.WHAT_ID))).toExist()
  await expect(element(by.id(TravelPayE2eIdConstants.MILEAGE_ONLY_ID))).toExist()
  await expect(element(by.id(TravelPayE2eIdConstants.HOW_ID))).toExist()
  await expect(element(by.id(TravelPayE2eIdConstants.VEHICLE_ID))).toExist()
  await expect(element(by.id(TravelPayE2eIdConstants.WHERE_ID))).toExist()
  await expect(element(by.text(TravelPayE2eIdConstants.REVIEW_CLAIM_SCREEN_ADDRESS_TEXT))).toExist()
  await expect(element(by.text(TravelPayE2eIdConstants.REVIEW_CLAIM_SCREEN_CITY_STATE_ZIP_TEXT))).toExist()
  await expect(element(by.id(TravelPayE2eIdConstants.LEFT_BACK_BUTTON_ID))).toExist()
  await expect(element(by.id(TravelPayE2eIdConstants.RIGHT_HELP_BUTTON_ID))).toExist()

  //Scroll down to the submit button
  await element(by.id(TravelPayE2eIdConstants.REVIEW_CLAIM_SCREEN_ID)).scrollTo('bottom')
  await expect(element(by.id(TravelPayE2eIdConstants.SUBMIT_BUTTON_ID))).toExist()
  await expect(element(by.id(TravelPayE2eIdConstants.TRAVEL_AGREEMENT_HEADER_ID))).toExist()
  await expect(element(by.id(TravelPayE2eIdConstants.PENALTY_STATEMENT_ID))).toExist()
  await expect(element(by.id(TravelPayE2eIdConstants.PENALTY_STATEMENT_AGREEMENT_ID))).toExist()
  await expect(element(by.id(TravelPayE2eIdConstants.TRAVEL_AGREEMENT_LINK_ID))).toExist()
  await expect(element(by.id(TravelPayE2eIdConstants.CHECK_BOX_ID))).toExist()
  await expect(element(by.id(TravelPayE2eIdConstants.SUBMIT_BUTTON_ID))).toExist()

  if (checkTravelAgreement) {
    await element(by.id(TravelPayE2eIdConstants.TRAVEL_AGREEMENT_LINK_ID)).tap()
    await expect(element(by.id(TravelPayE2eIdConstants.BENEFICIARY_TRAVEL_AGREEMENT_ID))).toExist()
    await element(by.id(TravelPayE2eIdConstants.CLOSE_BUTTON_ID)).tap()
  }

  if (checkErrorState) {
    await element(by.id(TravelPayE2eIdConstants.SUBMIT_BUTTON_ID)).tap()
    await expect(element(by.label(TravelPayE2eIdConstants.REVIEW_ERROR_LABEL_TEXT))).toExist()
  }
}

const expectSubmitSuccessScreen = async ({
  partialSuccess,
  checkExternalLink,
}: {
  partialSuccess: boolean
  checkExternalLink: boolean
}) => {
  await expect(element(by.id(TravelPayE2eIdConstants.SUCCESS_CONTENT_HEADER_ID))).toExist()
  await expect(element(by.id(TravelPayE2eIdConstants.SUCCESS_CONTENT_DESCRIPTION_ID))).toExist()
  await expect(element(by.id(TravelPayE2eIdConstants.SUCCESS_CONTENT_SECTION_TITLE_ID))).toExist()
  await expect(element(by.id(TravelPayE2eIdConstants.SUCCESS_CONTENT_INSTRUCTION_TEXT_ID))).toExist()
  await expect(element(by.id(TravelPayE2eIdConstants.SUCCESS_CONTENT_ADDITIONAL_TEXT_ID))).toExist()
  await expect(element(by.id(TravelPayE2eIdConstants.SET_UP_DIRECT_DEPOSIT_LINK_ID))).toExist()
  if (partialSuccess) {
    await expect(element(by.id(TravelPayE2eIdConstants.FINISH_TRAVEL_CLAIM_LINK_ID))).toExist()
  } else {
    await expect(element(by.id(TravelPayE2eIdConstants.GO_TO_APPOINTMENT_LINK_ID))).toExist()
  }

  if (checkExternalLink) {
    await openDismissLeavingAppPopup(TravelPayE2eIdConstants.SET_UP_DIRECT_DEPOSIT_LINK_ID)
    if (partialSuccess) {
      await openDismissLeavingAppPopup(TravelPayE2eIdConstants.FINISH_TRAVEL_CLAIM_LINK_ID)
    }
  }
  await expect(element(by.id(TravelPayE2eIdConstants.RIGHT_CLOSE_BUTTON_ID))).toExist()
}

/**
 * Fills in the home address fields in the Edit Address screen
 */
const fillHomeAddressFields = async ({
  streetAddressLine1,
  streetAddressLine2,
  city,
  state,
  country,
  zipCode,
}: {
  streetAddressLine1: string
  streetAddressLine2: string
  city: string
  state: string
  country: string // Only supports the first countries in the list
  zipCode: string
}) => {
  await element(by.id(CommonE2eIdConstants.CONTACT_INFO_STREET_ADDRESS_LINE_2_ID)).typeText(streetAddressLine2)
  await element(by.id(CommonE2eIdConstants.CONTACT_INFO_STREET_ADDRESS_LINE_2_ID)).tapReturnKey()
  await waitFor(element(by.id(CommonE2eIdConstants.CONTACT_INFO_STREET_ADDRESS_LINE_2_ID)))
    .toBeVisible()
    .withTimeout(4000)
  await element(by.id(CommonE2eIdConstants.COUNTRY_PICKER_ID)).tap()
  await expect(element(by.text(country))).toExist()
  await element(by.text(country)).tap()
  await element(by.id(CommonE2eIdConstants.COUNTRY_PICKER_CONFIRM_ID)).tap()
  await element(by.id(CommonE2eIdConstants.CITY_TEST_ID)).replaceText(city)
  await element(by.id(CommonE2eIdConstants.CITY_TEST_ID)).tapReturnKey()
  await waitFor(element(by.id(CommonE2eIdConstants.ZIP_CODE_ID)))
    .toBeVisible()
    .whileElement(by.id(CommonE2eIdConstants.EDIT_ADDRESS_ID))
    .scroll(100, 'down', NaN, 0.8)
  await element(by.id(CommonE2eIdConstants.STATE_ID)).tap()
  await element(by.text(state)).tap()
  await element(by.id(CommonE2eIdConstants.STATE_PICKER_CONFIRM_ID)).tap()
  await element(by.id(CommonE2eIdConstants.EDIT_ADDRESS_ID)).scrollTo('top')
  await waitFor(element(by.id(CommonE2eIdConstants.COUNTRY_PICKER_ID)))
    .toBeVisible()
    .withTimeout(4000)
  await element(by.id(CommonE2eIdConstants.STREET_ADDRESS_LINE_1_ID)).typeText(streetAddressLine1)
  await element(by.id(CommonE2eIdConstants.STREET_ADDRESS_LINE_1_ID)).tapReturnKey()
  await waitFor(element(by.id(CommonE2eIdConstants.STREET_ADDRESS_LINE_1_ID)))
    .toBeVisible()
    .withTimeout(4000)
  await waitFor(element(by.id(CommonE2eIdConstants.ZIP_CODE_ID)))
    .toBeVisible()
    .whileElement(by.id(CommonE2eIdConstants.EDIT_ADDRESS_ID))
    .scroll(100, 'down', NaN, 0.8)
  await element(by.id(CommonE2eIdConstants.ZIP_CODE_ID)).replaceText(zipCode)
  await element(by.id(CommonE2eIdConstants.ZIP_CODE_ID)).tapReturnKey()
  await waitFor(element(by.id(CommonE2eIdConstants.ZIP_CODE_ID)))
    .toBeVisible()
    .withTimeout(4000)
}

/**
 * Executes the flow to update the entered address as save it to demo mode
 */
export async function updateAddress() {
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

  // Open the appointments screen to the past appointments list
  await openHealth()
  await openAppointments()
  await waitFor(element(by.text('Upcoming')))
    .toExist()
    .withTimeout(10000)
  await element(by.id(CommonE2eIdConstants.APPOINTMENTS_SCROLL_ID)).scrollTo('top')
  await element(by.text('Past')).tap()

  // Open the appointment in the list
  await openAppointmentInList(text)
}

describe('Travel Pay', () => {
  beforeAll(async () => {
    await toggleRemoteConfigFlag(CommonE2eIdConstants.IN_APP_REVIEW_TOGGLE_TEXT)
    await toggleRemoteConfigFlag(CommonE2eIdConstants.TRAVEL_PAY_CONFIG_FLAG_TEXT)
  })

  describe('when the user presses "File a Travel Pay Claim" from the Appointment details screen', () => {
    it('starts the SMOC flow at the interstitial screen', async () => {
      await openTravelPayFlow('Sami Alsahhar - Onsite - Confirmed')
      // Start the travel pay flow
      await pressFileClaimButton()
      await expectInterstitialScreen({ checkBurdenStatement: false, checkExternalLink: false })
    })
  })

  describe('Interstitial screen', () => {
    it('correctly displays the Interstitial screen', async () => {
      await expectInterstitialScreen({ checkBurdenStatement: true, checkExternalLink: true })
    })

    describe('Cancel and Keep Going Confirmation', () => {
      it('correctly displays the cancel and keep going buttons when the top left cancel button is tapped', async () => {
        await expectCancelModal()
      })
      it('countinues the flow when tapping the keep going confirmation button', async () => {
        await chooseKeepGoing()
        await waitFor(element(by.id(TravelPayE2eIdConstants.LEFT_CANCEL_BUTTON_ID)))
          .toBeVisible()
          .withTimeout(2000)
        await expect(element(by.id(TravelPayE2eIdConstants.LEFT_CANCEL_BUTTON_ID))).toBeVisible()
        await expect(element(by.text(TravelPayE2eIdConstants.CANCEL_TRAVEL_CLAIM_TEXT))).not.toExist()
      })

      it('exits the flow when tapping the cancel confirmation button', async () => {
        await expectCancelModal()
        await chooseCancel()
        await waitFor(element(by.text(TravelPayE2eIdConstants.FILE_TRAVEL_CLAIM_TEXT)))
          .toBeVisible()
          .withTimeout(2000)
        await expect(element(by.text(TravelPayE2eIdConstants.FILE_TRAVEL_CLAIM_TEXT))).toExist()
      })
    })
  })

  it('navigates to the Mileage screen when the user taps the Continue button on the Interstitial screen', async () => {
    await pressFileClaimButton()
    await pressContinue()
    await expectMileageScreen()
  })

  describe('Mileage screen', () => {
    it('correctly displays the Mileage screen', async () => {
      await expectMileageScreen()
    })
    it('navigates to the Help screen when the user taps the Help button', async () => {
      await pressHelpButton()
      await expectTravelClaimHelpScreen({ checkExternalLink: true })
      await pressCloseTopRight()
    })
  })

  it('navigates to the Vehicle screen when the user taps the Yes button on the Mileage screen', async () => {
    await answerYes()
    await expectVehicleScreen()
  })

  describe('Vehicle screen', () => {
    it('correctly displays the Vehicle screen', async () => {
      await expectVehicleScreen()
    })
    it('navigates to the Help screen when the user taps the Help button', async () => {
      await pressHelpButton()
      await expectTravelClaimHelpScreen({ checkExternalLink: true })
      await pressCloseTopRight()
    })
  })

  describe('when the user does NOT have an existing address', () => {
    it('navigates to the No Address Error screen when the user answers Yes to the Vehicle screen', async () => {
      await answerYes()
      await expectErrorScreen({ errorType: 'noAddress', checkExternalLink: false })
    })

    describe('No Address Error', () => {
      it('correctly displays the No Address Error screen', async () => {
        await expectErrorScreen({ errorType: 'noAddress', checkExternalLink: true })
      })
    })

    it('allows the user to enter their home address by navigating to the Edit Address screen', async () => {
      await pressUpdateAddressLink()
      await fillHomeAddressFields({
        streetAddressLine1: TravelPayE2eIdConstants.ADDRESS_STREET_ADDRESS_LINE_1_TEXT,
        streetAddressLine2: TravelPayE2eIdConstants.ADDRESS_STREET_ADDRESS_LINE_2_TEXT,
        city: TravelPayE2eIdConstants.ADDRESS_CITY_TEXT,
        state: TravelPayE2eIdConstants.ADDRESS_STATE_TEXT,
        zipCode: TravelPayE2eIdConstants.ADDRESS_ZIP_CODE_TEXT,
        country: TravelPayE2eIdConstants.ADDRESS_COUNTRY_TEXT,
      })
    })
    it('navigates the user to the Address screen when the user updates their home address', async () => {
      await updateAddress()
      await expect(element(by.id(TravelPayE2eIdConstants.ERROR_SCREEN_ID))).not.toExist()
      await expectAddressScreen()
    })
  })

  describe('Address screen', () => {
    it('correctly displays the Address screen', async () => {
      await expectAddressScreen()
    })

    it('navigates to the Help screen when the user taps the Help button', async () => {
      await pressHelpButton()
      await expectTravelClaimHelpScreen({ checkExternalLink: true })
      await pressCloseTopRight()
    })
  })

  it('navigates to the Review Claim screen when the user answers Yes to the Address screen', async () => {
    await answerYes()
    await expectReviewClaimScreen({ checkTravelAgreement: false, checkErrorState: false })
  })

  describe('Review Claim screen', () => {
    it('correctly displays the Review Claim screen', async () => {
      // Scroll to the top of the screen so the review claim expectation can be made
      await reviewClaimsScroll('top')
      await expectReviewClaimScreen({ checkTravelAgreement: true, checkErrorState: false })
    })
  })

  it('navigates back to the Address screen when the back button is tapped on the Review Claim screen', async () => {
    await pressBack()
    await expectAddressScreen()
  })

  it('navigates back to the Vehicle screen when the back button is tapped on the Address screen', async () => {
    await pressBack()
    await expectVehicleScreen()
  })

  it('navigates back to the Mileage screen when the back button is tapped on the Vehicle screen', async () => {
    await pressBack()
    await expectMileageScreen()
  })

  it('navigates back to the Interstitial screen when the back button is tapped on the Mileage screen', async () => {
    await pressBack()
    await expectInterstitialScreen({ checkBurdenStatement: false, checkExternalLink: false })
  })

  it('navigates to the error screen when the answer is NO to the Mileage screen', async () => {
    //Set up to get to the Mileage screen
    await pressContinue()
    await answerNo()
    await expectErrorScreen({ errorType: 'unsupportedType', checkExternalLink: false })
    await pressCloseTopRight()
  })

  it('navigates to the error screen when the answer is NO to the Vehicle screen', async () => {
    //Set up to get to the Vehicle screen
    await pressFileClaimButton()
    await pressContinue()
    await answerYes()

    await answerNo()
    await expectErrorScreen({ errorType: 'unsupportedType', checkExternalLink: false })
    await pressCloseTopRight()
  })

  it('navigates to the error screen when the answer is NO to the Address screen', async () => {
    //Set up to get to the Address screen
    await pressFileClaimButton()
    await pressContinue()
    await answerYes()
    await answerYes()
    await answerNo()
    await expectErrorScreen({ errorType: 'unsupportedType', checkExternalLink: false })
  })

  it('correctly displays the Unsupported Type Error screen', async () => {
    await expectErrorScreen({ errorType: 'unsupportedType', checkExternalLink: true })
    await pressCloseTopRight()
  })

  it('shows an error state on the Review Claim screen when the user does not accept the travel agreement when submitting the claim', async () => {
    await pressFileClaimButton()
    await pressContinue()
    await answerYes()
    await answerYes()
    await answerYes()
    await expectReviewClaimScreen({ checkTravelAgreement: false, checkErrorState: true })
  })

  it('submits the travel pay claim when the user accepts the travel agreement and presses the Submit button', async () => {
    await acceptTravelAgreement()
    await pressSubmitButton()
    await setTimeout(4000)
  })

  describe('when the travel claim submission is successful', () => {
    it('navigates to the Submit Success screen', async () => {
      await expectSubmitSuccessScreen({ partialSuccess: false, checkExternalLink: false })
    })
    it('correctly displays the Submit Success screen', async () => {
      await expectSubmitSuccessScreen({ partialSuccess: false, checkExternalLink: true })
    })
    it('does not display the file a claim alert after closing the Submit Success screen', async () => {
      await pressCloseTopRight()
      await expect(element(by.id(TravelPayE2eIdConstants.FILE_TRAVEL_CLAIM_TEXT))).not.toExist()
      await expect(element(by.id(TravelPayE2eIdConstants.APPOINTMENT_FILE_TRAVEL_PAY_ALERT_ID))).not.toExist()
    })
  })

  it('shows the travel claim details after filing the travel pay claim', async () => {
    await waitFor(element(by.id(TravelPayE2eIdConstants.GO_TO_CLAIM_DETAILS_ID)))
      .toBeVisible()
      .whileElement(by.id(TravelPayE2eIdConstants.PAST_APPOINTMENT_DETAILS_SCROLL_ID))
      .scroll(100, 'down', NaN, 0.8)
    await expect(element(by.id(TravelPayE2eIdConstants.GO_TO_CLAIM_DETAILS_ID))).toExist()
    await expect(element(by.text(TravelPayE2eIdConstants.TAVEL_PAY_DETAILS_STATUS_TEXT))).toExist()
  })

  it('updates the appointments cache when the travel pay claim is submitted', async () => {
    await element(by.text('Back')).tap()
    await openAppointmentInList('Sami Alsahhar - Onsite - Confirmed')
    await expect(element(by.id(TravelPayE2eIdConstants.FILE_TRAVEL_CLAIM_TEXT))).not.toExist()
    await expect(element(by.id(TravelPayE2eIdConstants.APPOINTMENT_FILE_TRAVEL_PAY_ALERT_ID))).not.toExist()
    await element(by.id(TravelPayE2eIdConstants.PAST_APPOINTMENT_DETAILS_SCROLL_ID)).scrollTo('bottom')
    await waitFor(element(by.id(TravelPayE2eIdConstants.GO_TO_CLAIM_DETAILS_ID)))
      .toBeVisible()
      .whileElement(by.id(TravelPayE2eIdConstants.PAST_APPOINTMENT_DETAILS_SCROLL_ID))
      .scroll(100, 'down', NaN, 0.8)
    await expect(element(by.id(TravelPayE2eIdConstants.GO_TO_CLAIM_DETAILS_ID))).toExist()
    await expect(element(by.text(TravelPayE2eIdConstants.TAVEL_PAY_DETAILS_STATUS_TEXT))).toExist()
  })

  describe('when the travel claim submission is partially successful', () => {
    it('shows partial success status on the Submit Success screen', async () => {
      await element(by.text('Back')).tap()
      await element(by.id(CommonE2eIdConstants.APPOINTMENTS_SCROLL_ID)).scrollTo('bottom')
      // go to the next page
      await element(by.id(CommonE2eIdConstants.NEXT_PAGE_ID)).tap()
      await openAppointmentInList('At Fort Collins VA Clinic - Claim - Confirmed')
      await pressFileClaimButton()
      await pressContinue()
      await answerYes()
      await answerYes()
      await answerYes()
      await reviewClaimsScroll('bottom')
      await acceptTravelAgreement()
      await pressSubmitButton()
      await setTimeout(4000)
      await expectSubmitSuccessScreen({ partialSuccess: true, checkExternalLink: false })
    })

    it('shows the travel claim details', async () => {
      await element(by.id(TravelPayE2eIdConstants.RIGHT_CLOSE_BUTTON_ID)).tap()
      await waitFor(element(by.id(TravelPayE2eIdConstants.GO_TO_CLAIM_DETAILS_ID_PARTIAL_SUCCESS_ID)))
        .toBeVisible()
        .whileElement(by.id(TravelPayE2eIdConstants.PAST_APPOINTMENT_DETAILS_SCROLL_ID))
        .scroll(100, 'down', NaN, 0.8)
      await expect(element(by.text(TravelPayE2eIdConstants.STATUS_SAVED_TEXT))).toExist()
    })
  })

  describe('when the travel pay claim fails to submit due to an API error', () => {
    it('shows the error screen', async () => {
      await element(by.text('Back')).tap()
      await element(by.id(CommonE2eIdConstants.APPOINTMENTS_SCROLL_ID)).scrollTo('bottom')
      await element(by.id(CommonE2eIdConstants.PREVIOUS_PAGE_ID)).tap()
      await element(by.id(CommonE2eIdConstants.APPOINTMENTS_SCROLL_ID)).scrollTo('top')
      await element(by.id(CommonE2eIdConstants.HOME_TAB_BUTTON_ID)).tap()
      // Override the travel pay claim API to return a 500 error
      await toggleOverrideApi('/v0/travel-pay/claims', { otherStatus: '500' })
      await openHealth()

      await openAppointmentInList('Sami Alsahhar - ATLAS - Confirmed')

      await pressFileClaimButton()
      await pressContinue()
      await answerYes()
      await answerYes()
      await answerYes()
      await reviewClaimsScroll('bottom')
      await acceptTravelAgreement()
      await pressSubmitButton()
      await setTimeout(4000)

      await expectErrorScreen({ errorType: 'error', checkExternalLink: false })
    })

    describe('Api Error Screen', () => {
      it('correctly displays the Api Error Screen', async () => {
        await expectErrorScreen({ errorType: 'error', checkExternalLink: true })
      })
    })

    it('continues to show the Travel Pay Alert to submit a claim after the error screen is closed', async () => {
      await element(by.id(TravelPayE2eIdConstants.RIGHT_CLOSE_BUTTON_ID)).tap()
      await expect(
        element(by.id(TravelPayE2eIdConstants.APPOINTMENT_FILE_TRAVEL_PAY_ALERT_PRIMARY_BUTTON_ID)),
      ).toExist()
      await expect(element(by.id(TravelPayE2eIdConstants.APPOINTMENT_FILE_TRAVEL_PAY_ALERT_ID))).toExist()
      await element(by.text('Back')).tap()
      await openAppointmentInList('Sami Alsahhar - ATLAS - Confirmed')
      await expect(
        element(by.id(TravelPayE2eIdConstants.APPOINTMENT_FILE_TRAVEL_PAY_ALERT_PRIMARY_BUTTON_ID)),
      ).toExist()
      await expect(element(by.id(TravelPayE2eIdConstants.APPOINTMENT_FILE_TRAVEL_PAY_ALERT_ID))).toExist()
    })
  })
})
