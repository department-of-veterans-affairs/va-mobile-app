/*
Description:
Detox script that follows the VA Letters and Documents test case found in testRail (VA Mobile App > RC Regression Test > Manual > Benefits Page Elements)
Note: This test does not cover verifying that the correct letter is downloaded because demo mode mocks the letter downloads.
When to update:
This script should be updated whenever new things are added/changed in src/screens/BenefitsScreen/Letters, anything is added/changed in src/api/letters or if anything is changed in src/store/api/demo/mocks/letters.json.
*/
import { by, device, element, expect } from 'detox'
import { setTimeout } from 'timers/promises'

import {
  CommonE2eIdConstants,
  checkIfElementIsPresent,
  loginToDemoMode,
  openBenefits,
  openContactInfo,
  openLetters,
  openProfile,
  toggleRemoteConfigFlag,
} from './utils'

//Add any new letter type to the letter_types array here.
export const LettersConstants = {
  MAILING_ADDRESS: '3101 N Fort Valley Rd',
  DOWNLOAD_DOCUMENTS_TEXT: 'Downloaded documents will list your address as:',
  LETTER_FILE_NAME: 'demo_mode_benefit_summary',
  LETTER_REVIEW_LETTERS_BUTTON_ID: 'lettersOverviewViewLettersButtonID',
  LETTER_BENEFIT_SUMMARY_ROW_ID: 'BenefitSummaryServiceVerificationTestID',
  LETTER_BENEFIT_SUMMARY_ASK_VA_LINK_ID: 'lettersBenefitServiceGoToAskVAID',
  LETTER_BENEFIT_SUMMARY_BACK_ID: 'BenefitSummaryServiceVerificationBackID',
  LETTER_BENEFIT_SUMMARY_VIEW_LETTER_ID: 'lettersBenefitServiceViewLetterID',
  LETTER_TYPES: [
    {
      name: 'Benefit summary and service verification letter',
      description:
        'This letter shows your service history and some benefit information. You can customize this letter and use it for many things, including to apply for housing assistance, civil service jobs, and state or local property and car tax relief.',
    },
    {
      name: 'Benefit verification letter',
      description:
        'This letter shows the benefits you’re receiving from VA. The letter also shows your benefit gross amount (the amount before anything is taken out) and net amount (the amount after deductions are taken out), your benefit effective date, and your disability rating.',
    },
    {
      name: 'Civil service preference letter',
      description:
        'This letter shows that you’re a disabled Veteran and you qualify for preference for civil service jobs.',
    },
    {
      name: 'Commissary letter',
      description:
        'If you’re a Veteran with a 100% service-connected disability rating take this letter, a copy of your DD214 or other discharge papers, and your DD2765 to a local military ID and pass office. You can schedule an appointment to get a Retiree Military ID card at the office or use the Rapid Appointments Scheduler. The Retiree Military ID card gives you access to your local base facilities, including the commissary and post exchange.',
    },
    {
      name: 'Proof of creditable prescription drug coverage letter',
      description:
        'You will need this letter as proof that you qualify for Medicare Part D prescription drug coverage.',
    },
    {
      name: 'Proof of minimum essential coverage letter',
      description:
        'This letter indicates that you have Minimum Essential Coverage (MEC) as provided by VA. MEC means that your health care plan meets the health insurance requirements under the Affordable Care Act (ACA). To prove that you’re enrolled in the VA health care system, you must have IRS Form 1095-B from VA to show what months you were covered by a VA health care plan.',
    },
    {
      name: 'Proof of service card',
      description:
        'This card shows that you served honorably in the Armed Forces. This card might be useful as proof of status to receive discounts at certain stores or restaurants.',
    },
    {
      name: 'Service verification letter',
      description:
        'This letter shows your branch of service, the date you started active duty, and the date you were discharged from active duty.',
    },
  ],
}

beforeAll(async () => {
  await toggleRemoteConfigFlag(CommonE2eIdConstants.IN_APP_REVIEW_TOGGLE_TEXT)
  await loginToDemoMode()
  await openBenefits()
  await openLetters()
})

describe('VA Letters', () => {
  it('should match design', async () => {
    await expect(element(by.text(LettersConstants.MAILING_ADDRESS))).toExist()
  })

  it('should tap address and open edit screen', async () => {
    await element(by.text(LettersConstants.MAILING_ADDRESS)).tap()

    await element(by.id(CommonE2eIdConstants.CONTACT_INFO_STREET_ADDRESS_LINE_2_ID)).typeText('2')
    await element(by.id(CommonE2eIdConstants.CONTACT_INFO_STREET_ADDRESS_LINE_2_ID)).tapReturnKey()

    await element(by.id(CommonE2eIdConstants.CONTACT_INFO_SAVE_ID)).tap()
    await element(by.id(CommonE2eIdConstants.CONTACT_INFO_SUGGESTED_ADDRESS_ID)).tap()
    await element(by.id(CommonE2eIdConstants.CONTACT_INFO_USE_THIS_ADDRESS_ID)).tap()

    await expect(element(by.text(LettersConstants.DOWNLOAD_DOCUMENTS_TEXT))).toExist()
  })

  it('should verify address change is reflected in contact info', async () => {
    await element(by.id('Home')).tap()
    await openProfile()
    await openContactInfo()
    await expect(element(by.text('3101 N Fort Valley Rd, 2'))).toExist()
  })

  it('should navigate back to letters and reset mailing address', async () => {
    await openBenefits()
    await element(by.text('3101 N Fort Valley Rd, 2')).tap()

    await element(by.id(CommonE2eIdConstants.CONTACT_INFO_STREET_ADDRESS_LINE_2_ID)).clearText()
    await element(by.id(CommonE2eIdConstants.CONTACT_INFO_SAVE_ID)).tap()
    await element(by.id(CommonE2eIdConstants.CONTACT_INFO_SUGGESTED_ADDRESS_ID)).tap()
    await element(by.id(CommonE2eIdConstants.CONTACT_INFO_USE_THIS_ADDRESS_ID)).tap()
    await expect(element(by.text(LettersConstants.MAILING_ADDRESS))).toExist()
  })

  it('should view letter types', async () => {
    await element(by.id(LettersConstants.LETTER_REVIEW_LETTERS_BUTTON_ID)).tap()

    for (const letterType of LettersConstants.LETTER_TYPES) {
      await expect(element(by.text(letterType.name))).toExist()
    }
  })

  for (const letterType of LettersConstants.LETTER_TYPES) {
    it.skip(`should view ${letterType.name}`, async () => {
      await element(by.text(letterType.name)).tap()
      await expect(element(by.text(letterType.name))).toExist()
      await expect(element(by.text(letterType.description))).toExist()

      if (device.getPlatform() === 'ios') {
        const isBenefitSummaryLetter = await checkIfElementIsPresent(LettersConstants.LETTER_BENEFIT_SUMMARY_ROW_ID)

        if (isBenefitSummaryLetter) {
          await element(by.id(LettersConstants.LETTER_BENEFIT_SUMMARY_ROW_ID)).scrollTo('bottom')
          await element(by.id(LettersConstants.LETTER_BENEFIT_SUMMARY_ASK_VA_LINK_ID)).tap()
          await element(by.text(CommonE2eIdConstants.LEAVING_APP_LEAVE_TEXT)).tap()
          await setTimeout(2000)
          await device.takeScreenshot('benefitSummaryLetterAskVAWebpage')
          await device.launchApp({ newInstance: false })
        }

        await element(by.id(LettersConstants.LETTER_BENEFIT_SUMMARY_VIEW_LETTER_ID)).tap()
        await expect(element(by.text(LettersConstants.LETTER_FILE_NAME))).toExist()
        await element(by.text('Done')).tap()
      }

      await element(by.id(LettersConstants.LETTER_BENEFIT_SUMMARY_BACK_ID)).tap()
    })
  }
})
