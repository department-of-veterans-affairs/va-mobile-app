import { by, element, expect } from 'detox'
import { loginToDemoMode, openBenefits } from './utils'

export const LettersE2eIdConstants = {
  LETTERS_SCREEN_TITLE: 'Letters',
  MAILING_ADDRESS: '3101 N Fort Valley Rd',
  CANCEL_TEXT: 'Cancel',
  SAVE_TEXT: 'Save',
  REVIEW_LETTERS_BUTTON_TEXT: 'Review letters',
  BENEFIT_VERIFICATION_LETTER_TEXT: 'Benefit verification letter'
}

beforeAll(async () => {
  await loginToDemoMode()
  await openBenefits()
})

describe('VA Letters and Documents Screen', () => {
  it('should show mailing address', async () => {
    await expect(element(by.text(LettersE2eIdConstants.MAILING_ADDRESS))).toExist()
  })

  it('should open editing screen when address is tapped', async () => {
    await element(by.text(LettersE2eIdConstants.MAILING_ADDRESS)).tap()

    await expect(element(by.text(LettersE2eIdConstants.CANCEL_TEXT))).toExist()
    await expect(element(by.text(LettersE2eIdConstants.SAVE_TEXT))).toExist()
  })

  it('should return to letters screen when cancel is tapped in editing screen', async () => {
    await element(by.text(LettersE2eIdConstants.MAILING_ADDRESS)).tap()

    await element(by.text(LettersE2eIdConstants.CANCEL_TEXT)).tap()
    await expect(element(by.text(LettersE2eIdConstants.LETTERS_SCREEN_TITLE))).toExist()
  })

  it('should open review letters screen when review letters button is tapped', async () => {
    await element(by.text(LettersE2eIdConstants.REVIEW_LETTERS_BUTTON_TEXT)).tap()

    await expect(element(by.text(LettersE2eIdConstants.BENEFIT_VERIFICATION_LETTER_TEXT))).toExist()
  })
})
