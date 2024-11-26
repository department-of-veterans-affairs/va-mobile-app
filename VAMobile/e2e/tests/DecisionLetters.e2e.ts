import { by, device, element, expect } from 'detox'
import { setTimeout } from 'timers/promises'

import {
  CommonE2eIdConstants,
  loginToDemoMode,
  openBenefits,
  openClaims,
  openClaimsHistory,
  toggleRemoteConfigFlag,
} from './utils'

export const DecisionLettersE2eIDConstants = {
  CLOSED_CLAIM_DECISION_LETTER_ID:
    'Compensation Decision letter ready Received January 01, 2021 Step 5 of 5: Complete Moved to this step on April 09, 2021',
  DECISION_CLAIM_LETTER_1_ID: 'March 11, 2023 letter Notification Letter (e.g. VA 20-8993, VA 21-0290, PCGL)',
  DECISION_CLAIM_LETTER_2_ID: 'September 21, 2022 letter Decision Rating Letter',
  CLAIMS_HISTORY_TEXT: 'Claims history',
  CLAIM_LETTERS_BACK_ID: 'claimLettersBackTestID',
  TO_DECISION_LETTERS_ID: 'toClaimLettersID',
  GET_CLAIMS_LETTER_BUTTON_ID: 'getClaimLettersTestID',
}

beforeAll(async () => {
  await toggleRemoteConfigFlag(CommonE2eIdConstants.IN_APP_REVIEW_TOGGLE_TEXT)
  await loginToDemoMode()
  await openBenefits()
  await openClaims()
  await openClaimsHistory()
})

describe('Decision Letters Screen', () => {
  it('should tap on the closed tab', async () => {
    await element(by.id(CommonE2eIdConstants.CLAIMS_HISTORY_CLOSED_TAB_ID)).tap()
  })

  it('verify the status details page of closed claim with decision letter', async () => {
    await element(by.id(DecisionLettersE2eIDConstants.CLOSED_CLAIM_DECISION_LETTER_ID)).tap()
    await expect(element(by.id(DecisionLettersE2eIDConstants.GET_CLAIMS_LETTER_BUTTON_ID))).toExist()
  })

  it('verify that the claims letters sceen is displayed', async () => {
    await element(by.id(DecisionLettersE2eIDConstants.GET_CLAIMS_LETTER_BUTTON_ID)).tap()
    await expect(element(by.id(DecisionLettersE2eIDConstants.DECISION_CLAIM_LETTER_1_ID))).toExist()
    await expect(element(by.id(DecisionLettersE2eIDConstants.DECISION_CLAIM_LETTER_2_ID))).toExist()
  })

  it('should go back to the claims details page', async () => {
    await element(by.id(DecisionLettersE2eIDConstants.CLAIM_LETTERS_BACK_ID)).tap()
  })

  it('tap on claims letters', async () => {
    await element(by.id(CommonE2eIdConstants.CLAIMS_DETAILS_BACK_ID)).tap()
    await element(by.id(CommonE2eIdConstants.CLAIMS_HISTORY_BACK_ID)).tap()
    await element(by.id(DecisionLettersE2eIDConstants.TO_DECISION_LETTERS_ID)).tap()
  })

  it('should tap on a claim letter and verify a pdf is displayed', async () => {
    if (device.getPlatform() === 'ios') {
      await element(by.id(DecisionLettersE2eIDConstants.DECISION_CLAIM_LETTER_1_ID)).tap()
      await setTimeout(5000)
      await device.takeScreenshot('DecisionLetter')
    }
  })
})
