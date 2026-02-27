import { by, device, element, expect, waitFor } from 'detox'

import { CommonE2eIdConstants, loginToDemoMode, openBenefits, openLetters, toggleRemoteConfigFlag } from './utils'

export const LettersConstants = {
  MAILING_ADDRESS: '3101 N Fort Valley Rd',
  DOWNLOAD_DOCUMENTS_TEXT: 'Downloaded documents will list your address as:',
  LETTER_FILE_NAME: 'demo_mode_benefit_summary',
  LETTER_REVIEW_LETTERS_BUTTON_ID: 'lettersOverviewViewLettersButtonID',
  LETTER_BENEFIT_SUMMARY_ROW_ID: 'BenefitSummaryServiceVerificationTestID',
  LETTER_BENEFIT_SUMMARY_ASK_VA_LINK_ID: 'lettersBenefitServiceGoToAskVAID',
  LETTER_BENEFIT_SUMMARY_BACK_ID: 'BenefitSummaryServiceVerificationBackID',
  LETTER_BENEFIT_SUMMARY_VIEW_LETTER_ID: 'lettersBenefitServiceViewLetterID',
  WEBVIEW_BACK_BUTTON_ID: 'webviewBack',
  BENEFIT_SUMMARY_SERVICE_LETTER_NAME: 'Benefit summary and service verification letter',
  BENEFIT_SUMMARY_SERVICE_LETTER_DESCRIPTION:
    'This letter shows your service history and some benefit information. You can customize this letter and use it for many things, including to apply for housing assistance, civil service jobs, and state or local property and car tax relief.',
  BENEFIT_VERIFICATION_LETTER_NAME: 'Benefit verification letter',
  BENEFIT_VERIFICATION_LETTER_DESCRIPTION:
    'This letter shows the benefits you’re receiving from VA. The letter also shows your benefit gross amount (the amount before anything is taken out) and net amount (the amount after deductions are taken out), your benefit effective date, and your disability rating.',
}

beforeAll(async () => {
  await toggleRemoteConfigFlag(CommonE2eIdConstants.IN_APP_REVIEW_TOGGLE_TEXT)
  await loginToDemoMode()
  await openBenefits()
  await openLetters()
})

describe('VA Letters', () => {
  it('should show the mailing address', async () => {
    await expect(element(by.text(LettersConstants.MAILING_ADDRESS))).toExist()
  })

  it('should tap address and open edit screen', async () => {
    await element(by.text(LettersConstants.MAILING_ADDRESS)).tap()
    await element(by.id(CommonE2eIdConstants.CONTACT_INFO_BACK_ID)).tap()

    await expect(element(by.text(LettersConstants.DOWNLOAD_DOCUMENTS_TEXT))).toExist()
  })

  it('should show the letters list', async () => {
    await element(by.id(LettersConstants.LETTER_REVIEW_LETTERS_BUTTON_ID)).tap()

    await expect(element(by.text(LettersConstants.BENEFIT_SUMMARY_SERVICE_LETTER_NAME))).toExist()
    await expect(element(by.text(LettersConstants.BENEFIT_VERIFICATION_LETTER_NAME))).toExist()
  })

  it('should view the benefit summary letter', async () => {
    await element(by.text(LettersConstants.BENEFIT_SUMMARY_SERVICE_LETTER_NAME)).tap()
    await expect(element(by.text(LettersConstants.BENEFIT_SUMMARY_SERVICE_LETTER_NAME))).toExist()
    await expect(element(by.text(LettersConstants.BENEFIT_SUMMARY_SERVICE_LETTER_DESCRIPTION))).toExist()
    await element(by.id(LettersConstants.LETTER_BENEFIT_SUMMARY_ROW_ID)).scrollTo('bottom')

    await element(by.id(LettersConstants.LETTER_BENEFIT_SUMMARY_VIEW_LETTER_ID)).tap()
    await waitFor(element(by.text(LettersConstants.LETTER_FILE_NAME)))
      .toBeVisible()
      .withTimeout(20000)
    await expect(element(by.text(LettersConstants.LETTER_FILE_NAME))).toExist()
    if (device.getPlatform() === 'ios') {
      await element(by.text('Done')).tap()
    } else {
      await device.pressBack()
    }
  })
})
