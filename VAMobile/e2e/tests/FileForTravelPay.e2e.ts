import { by, element, expect, waitFor } from 'detox'

import {
  CommonE2eIdConstants,
  fillHomeAddressFields,
  loginToDemoMode,
  openAppointmentInList,
  openAppointments,
  openDismissLeavingAppPopup,
  openHealth,
  toggleRemoteConfigFlag,
  updateAddress,
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

beforeAll(async () => {
  await toggleRemoteConfigFlag(CommonE2eIdConstants.TRAVEL_PAY_CONFIG_FLAG_TEXT)
  await loginToDemoMode()
  await openHealth()
  await openAppointments()
})

describe('File for Travel Pay', () => {
  it('opens the SMOC flow when the user presses "File a Travel Pay Claim" from the Appointment details screen', async () => {
    await element(by.id('apptsPastID')).tap()
    await openAppointmentInList('Sami Alsahhar - Onsite - Confirmed')

    await element(by.id(TravelPayE2eIdConstants.APPOINTMENT_FILE_TRAVEL_PAY_ALERT_PRIMARY_BUTTON_ID)).tap()
  })

  it('starts the SMOC flow at the interstitial screen', async () => {
    // Verify Interstitial Screen
    await expect(element(by.id(TravelPayE2eIdConstants.LEFT_CANCEL_BUTTON_ID))).toExist()
    await expect(element(by.id(TravelPayE2eIdConstants.CONTINUE_BUTTON_ID))).toExist()
    await expect(element(by.id(TravelPayE2eIdConstants.MILEAGE_QUESTION_ID))).toExist()
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

    // Verify Burden Statement
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
  })

  it('navigates to the Mileage screen when the user taps the Continue button on the Interstitial screen', async () => {
    await element(by.id(TravelPayE2eIdConstants.CONTINUE_BUTTON_ID)).tap()

    // Verify Mileage Screen
    await expect(element(by.id(TravelPayE2eIdConstants.MILEAGE_QUESTION_ID))).toExist()
    await expect(element(by.id(TravelPayE2eIdConstants.LEFT_BACK_BUTTON_ID))).toExist()
    await expect(element(by.id(TravelPayE2eIdConstants.YES_BUTTON_ID))).toExist()
    await expect(element(by.text(TravelPayE2eIdConstants.NO_BUTTON_TEXT))).toExist()
    await expect(element(by.id(TravelPayE2eIdConstants.RIGHT_HELP_BUTTON_ID))).toExist()
  })

  it('navigates to the Help screen when the user taps the Help button', async () => {
    await element(by.id(TravelPayE2eIdConstants.RIGHT_HELP_BUTTON_ID)).tap()

    // Verify Help Screen
    await expect(element(by.id(TravelPayE2eIdConstants.TRAVEL_CLAIM_HELP_SCREEN_ID))).toExist()
    await expect(element(by.id(TravelPayE2eIdConstants.TRAVEL_CLAIM_HELP_TITLE_ID))).toExist()
    await expect(element(by.id(TravelPayE2eIdConstants.TRAVEL_CLAIM_HELP_TEXT_ID))).toExist()

    //Scroll down to the bullet list
    await element(by.id(TravelPayE2eIdConstants.TRAVEL_CLAIM_HELP_SCREEN_ID)).scrollTo('bottom')

    await expect(element(by.id(TravelPayE2eIdConstants.FILE_ONLINE_COMPONENT_ID))).toExist()
    await expect(element(by.id(TravelPayE2eIdConstants.FILE_ONLINE_TITLE_ID))).toExist()
    await expect(element(by.id(TravelPayE2eIdConstants.FILE_ONLINE_METHOD_ONE_ID))).toExist()
    await expect(element(by.id(TravelPayE2eIdConstants.FILE_ONLINE_METHOD_ONE_LINK_ID))).toExist()
    await expect(element(by.id(TravelPayE2eIdConstants.FILE_ONLINE_METHOD_TWO_ID))).toExist()
    await expect(element(by.id(TravelPayE2eIdConstants.FILE_ONLINE_METHOD_TWO_LINK_ID))).toExist()

    await openDismissLeavingAppPopup(TravelPayE2eIdConstants.FILE_ONLINE_METHOD_ONE_LINK_ID)
    await openDismissLeavingAppPopup(TravelPayE2eIdConstants.FILE_ONLINE_METHOD_TWO_LINK_ID)

    await expect(element(by.id(TravelPayE2eIdConstants.TRAVEL_PAY_HELP_COMPONENT_ID)).atIndex(0)).toExist()
    await expect(element(by.id(TravelPayE2eIdConstants.HELP_TITLE_ID)).atIndex(0)).toExist()
    await expect(element(by.id(TravelPayE2eIdConstants.HELP_TEXT_ID)).atIndex(0)).toExist()

    await expect(element(by.id(CommonE2eIdConstants.CALL_VA_PHONE_NUMBER_ID)).atIndex(0)).toExist()
    await expect(element(by.id(CommonE2eIdConstants.CALL_VA_TTY_PHONE_NUMBER_ID)).atIndex(0)).toExist()

    await element(by.id(TravelPayE2eIdConstants.RIGHT_CLOSE_BUTTON_ID)).tap()
  })

  it('navigates to the Vehicle screen when the user taps the Yes button on the Mileage screen', async () => {
    await element(by.id(TravelPayE2eIdConstants.YES_BUTTON_ID)).tap()

    // Verify Vehicle Screen
    await expect(element(by.id(TravelPayE2eIdConstants.VEHICLE_QUESTION_ID))).toExist()
    await expect(element(by.id(TravelPayE2eIdConstants.LEFT_BACK_BUTTON_ID))).toExist()
    await expect(element(by.id(TravelPayE2eIdConstants.RIGHT_HELP_BUTTON_ID))).toExist()
    await expect(element(by.id(TravelPayE2eIdConstants.YES_BUTTON_ID))).toExist()
    await expect(element(by.text(TravelPayE2eIdConstants.NO_BUTTON_TEXT))).toExist()
    await expect(element(by.id(TravelPayE2eIdConstants.RIGHT_HELP_BUTTON_ID))).toExist()
  })

  it('navigates to the No Address Error screen when the user answers Yes to the Vehicle screen', async () => {
    await element(by.id(TravelPayE2eIdConstants.YES_BUTTON_ID)).tap()

    // Verify No Address Error screen
    await expect(element(by.id(TravelPayE2eIdConstants.ERROR_SCREEN_ID))).toExist()
    await expect(element(by.id(TravelPayE2eIdConstants.ERROR_TITLE_ID))).toExist()
    await expect(element(by.id(TravelPayE2eIdConstants.UPDATE_ADDRESS_LINK_ID))).toExist()
    await expect(element(by.id(TravelPayE2eIdConstants.ERROR_TEXT_ID + '0'))).toExist()

    await expect(element(by.id(TravelPayE2eIdConstants.FILE_ONLINE_COMPONENT_ID))).toExist()
    await expect(element(by.id(TravelPayE2eIdConstants.FILE_ONLINE_TITLE_ID))).toExist()
    await expect(element(by.id(TravelPayE2eIdConstants.FILE_ONLINE_METHOD_ONE_ID))).toExist()
    await expect(element(by.id(TravelPayE2eIdConstants.FILE_ONLINE_METHOD_ONE_LINK_ID))).toExist()
    await expect(element(by.id(TravelPayE2eIdConstants.FILE_ONLINE_METHOD_TWO_ID))).toExist()
    await expect(element(by.id(TravelPayE2eIdConstants.FILE_ONLINE_METHOD_TWO_LINK_ID))).toExist()

    await openDismissLeavingAppPopup(TravelPayE2eIdConstants.FILE_ONLINE_METHOD_ONE_LINK_ID)
    await openDismissLeavingAppPopup(TravelPayE2eIdConstants.FILE_ONLINE_METHOD_TWO_LINK_ID)

    await expect(element(by.id(TravelPayE2eIdConstants.TRAVEL_PAY_HELP_COMPONENT_ID)).atIndex(0)).toExist()
    await expect(element(by.id(TravelPayE2eIdConstants.HELP_TITLE_ID)).atIndex(0)).toExist()
    await expect(element(by.id(TravelPayE2eIdConstants.HELP_TEXT_ID)).atIndex(0)).toExist()
    await expect(element(by.id(CommonE2eIdConstants.CALL_VA_PHONE_NUMBER_ID)).atIndex(0)).toExist()
    await expect(element(by.id(CommonE2eIdConstants.CALL_VA_TTY_PHONE_NUMBER_ID)).atIndex(0)).toExist()
    await expect(element(by.id(TravelPayE2eIdConstants.RIGHT_CLOSE_BUTTON_ID))).toExist()
  })

  it('allows the user to enter their home address by navigating to the Edit Address screen', async () => {
    await element(by.id(TravelPayE2eIdConstants.UPDATE_ADDRESS_LINK_ID)).tap()

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

    // Verify Address screen
    await expect(element(by.id(TravelPayE2eIdConstants.ADDRESS_QUESTION_ID))).toExist()
    await expect(element(by.id(TravelPayE2eIdConstants.FULL_ADDRESS_TEXT_ID))).toExist()
    await expect(element(by.id(TravelPayE2eIdConstants.ADDRESS_CONFIRMATION_ID))).toExist()
    await expect(element(by.id(TravelPayE2eIdConstants.LEFT_BACK_BUTTON_ID))).toExist()
    await expect(element(by.id(TravelPayE2eIdConstants.RIGHT_HELP_BUTTON_ID))).toExist()
    await expect(element(by.id(TravelPayE2eIdConstants.YES_BUTTON_ID))).toExist()
    await expect(element(by.text(TravelPayE2eIdConstants.NO_BUTTON_TEXT))).toExist()
    await expect(element(by.id(TravelPayE2eIdConstants.RIGHT_HELP_BUTTON_ID))).toExist()
  })

  it('navigates to the Review Claim screen when the user answers Yes to the Address screen', async () => {
    await element(by.id(TravelPayE2eIdConstants.YES_BUTTON_ID)).tap()

    // Verfiy Review Claim Screen
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

    // Scroll down to the submit button
    await element(by.id(TravelPayE2eIdConstants.REVIEW_CLAIM_SCREEN_ID)).scrollTo('bottom')

    await expect(element(by.id(TravelPayE2eIdConstants.SUBMIT_BUTTON_ID))).toExist()
    await expect(element(by.id(TravelPayE2eIdConstants.TRAVEL_AGREEMENT_HEADER_ID))).toExist()
    await expect(element(by.id(TravelPayE2eIdConstants.PENALTY_STATEMENT_ID))).toExist()
    await expect(element(by.id(TravelPayE2eIdConstants.PENALTY_STATEMENT_AGREEMENT_ID))).toExist()
    await expect(element(by.id(TravelPayE2eIdConstants.TRAVEL_AGREEMENT_LINK_ID))).toExist()
    await expect(element(by.id(TravelPayE2eIdConstants.CHECK_BOX_ID))).toExist()
    await expect(element(by.id(TravelPayE2eIdConstants.SUBMIT_BUTTON_ID))).toExist()

    // Verify Travel Agreement
    await element(by.id(TravelPayE2eIdConstants.TRAVEL_AGREEMENT_LINK_ID)).tap()
    await expect(element(by.id(TravelPayE2eIdConstants.BENEFICIARY_TRAVEL_AGREEMENT_ID))).toExist()
    await element(by.id(TravelPayE2eIdConstants.CLOSE_BUTTON_ID)).tap()
  })

  it('correctly displays the Submit Success screen when the travel claim submission is successful', async () => {
    // Accept travel agreement and submit
    await element(by.id(TravelPayE2eIdConstants.CHECK_BOX_ID)).tap()
    await element(by.id(TravelPayE2eIdConstants.SUBMIT_BUTTON_ID)).tap()

    // Verify Submit Success screen
    await expect(element(by.id(TravelPayE2eIdConstants.SUCCESS_CONTENT_HEADER_ID))).toExist()
    await expect(element(by.id(TravelPayE2eIdConstants.SUCCESS_CONTENT_DESCRIPTION_ID))).toExist()
    await expect(element(by.id(TravelPayE2eIdConstants.SUCCESS_CONTENT_SECTION_TITLE_ID))).toExist()
    await expect(element(by.id(TravelPayE2eIdConstants.SUCCESS_CONTENT_INSTRUCTION_TEXT_ID))).toExist()
    await expect(element(by.id(TravelPayE2eIdConstants.SUCCESS_CONTENT_ADDITIONAL_TEXT_ID))).toExist()
    await expect(element(by.id(TravelPayE2eIdConstants.SET_UP_DIRECT_DEPOSIT_LINK_ID))).toExist()

    await expect(element(by.id(TravelPayE2eIdConstants.GO_TO_APPOINTMENT_LINK_ID))).toExist()

    await openDismissLeavingAppPopup(TravelPayE2eIdConstants.SET_UP_DIRECT_DEPOSIT_LINK_ID)

    await expect(element(by.id(TravelPayE2eIdConstants.RIGHT_CLOSE_BUTTON_ID))).toExist()
  })

  it('does not display the file a claim alert after closing the Submit Success screen', async () => {
    await element(by.id(TravelPayE2eIdConstants.RIGHT_CLOSE_BUTTON_ID)).tap()

    await expect(element(by.id(TravelPayE2eIdConstants.FILE_TRAVEL_CLAIM_TEXT))).not.toExist()
    await expect(element(by.id(TravelPayE2eIdConstants.APPOINTMENT_FILE_TRAVEL_PAY_ALERT_ID))).not.toExist()
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
})
