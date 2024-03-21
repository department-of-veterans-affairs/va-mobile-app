import { by, device, element, expect, waitFor } from 'detox'
import { setTimeout } from 'timers/promises'

import {
  CommonE2eIdConstants,
  loginToDemoMode,
  openBenefits,
  openClaims,
  openClaimsHistory,
  resetInAppReview,
} from './utils'

export const ClaimsE2eIdConstants = {
  CLAIM_1_ID: 'Claim for compensation updated on December 05, 2021 Submitted December 05, 2021',
  CLAIM_2_ID: 'Claim for compensation updated on December 04, 2021 Submitted December 04, 2021',
  CLAIM_3_ID: 'Claim for compensation updated on July 20, 2021 Submitted July 20, 2021',
  CLAIM_4_ID: 'Claim for compensation updated on May 05, 2021 Submitted January 01, 2021',
  CLAIM_5_ID: 'Claim for compensation updated on May 04, 2021 Submitted January 01, 2021',
  CLAIM_6_ID: 'Claim for dependency updated on July 30, 2016 Submitted January 01, 2016',
  CLOSED_CLAIM_DECISION_LETTER_ID:
    'Claim for compensation updated on April 09, 2021 Submitted January 01, 2021 Decision letter ready',
  CLAIM_1_STATUS_STEP_1_ID: 'Step 1 of 5. completed. Claim received July 20, 2021',
  CLAIM_1_STATUS_STEP_2_ID: 'Step 2 of 5. current. Initial review July 20, 2021',
  CLAIM_1_STATUS_STEP_3_ID: 'Step 3 of 5.  Evidence gathering, review, and decision',
  CLAIM_1_STATUS_STEP_4_ID: 'Step 4 of 5.  Preparation for notification',
  CLAIM_1_STATUS_STEP_5_ID: 'Step 5 of 5.  Complete',
  GET_CLAIMS_LETTER_BUTTON_ID: 'getClaimLettersTestID',
  DECISION_CLAIM_LETTER_1_ID: 'March 11, 2023 letter Notification Letter (e.g. VA 20-8993, VA 21-0290, PCGL)',
  DECISION_CLAIM_LETTER_2_ID: 'September 21, 2022 letter Decision Rating Letter',
  FILE_REQUEST_BUTTON_ID: 'Review file requests',
  TAKE_OR_SELECT_PHOTOS_CAMERA_OPTION_TEXT: device.getPlatform() === 'ios' ? 'Camera' : 'Camera ',
  TAKE_OR_SELECT_PHOTOS_PHOTO_GALLERY_OPTION_TEXT: device.getPlatform() === 'ios' ? 'Photo Gallery' : 'Photo gallery ',
  SELECT_A_FILE_FILE_FOLDER_OPTION_TEXT: device.getPlatform() === 'ios' ? 'File Folder' : 'File folder ',
  SELECT_A_FILE_TEXT: 'Select a file',
  TAKE_OR_SELECT_PHOTOS_TEXT: 'Take or select photos',
  ACCEPTED_FILE_TYPES_TEXT: 'PDF (unlocked), GIF, JPEG, JPG, BMP, TXT',
  MAXIMUM_FILE_SIZE_LABEL: '50 megabytes',
  CLAIMS_DETAILS_SCREEN_ID: 'ClaimDetailsScreen',
  CLAIMS_HISTORY_TEXT: 'Claims history',
}

beforeAll(async () => {
  await loginToDemoMode()
  await openBenefits()
  await openClaims()
  await openClaimsHistory()
})

describe('Claims Screen', () => {
  it('should tap on the closed tab', async () => {
    await resetInAppReview()
    await openBenefits()
    await openClaims()
    await openClaimsHistory()
    await element(by.text('Closed')).tap()
  })

  it('verify the status details page of closed claim with decision letter', async () => {
    await element(by.id(ClaimsE2eIdConstants.CLOSED_CLAIM_DECISION_LETTER_ID)).tap()
    await expect(element(by.text('We decided your claim on April 09, 2021'))).toExist()
    await expect(
      element(by.text('You can download your decision letter in the app. We also mailed you this letter.')),
    ).toExist()
    await expect(element(by.id(ClaimsE2eIdConstants.GET_CLAIMS_LETTER_BUTTON_ID))).toExist()
  })

  it('verify that the claims letters sceen is displayed', async () => {
    await element(by.id(ClaimsE2eIdConstants.GET_CLAIMS_LETTER_BUTTON_ID)).tap()
    await expect(element(by.text('Claim letters'))).toExist()
    await expect(element(by.id(ClaimsE2eIdConstants.DECISION_CLAIM_LETTER_1_ID))).toExist()
    await expect(element(by.id(ClaimsE2eIdConstants.DECISION_CLAIM_LETTER_2_ID))).toExist()
  })

  it('should go back to the claims details page', async () => {
    await element(by.text('Claim details')).tap()
  })

  it('tap on claims letters', async () => {
    await element(by.text(ClaimsE2eIdConstants.CLAIMS_HISTORY_TEXT)).tap()
    await element(by.text('Claims')).tap()
    await element(by.text('Claim letters')).tap()
  })

  it('should tap on a claim letter and verify a pdf is displayed', async () => {
    if (device.getPlatform() === 'ios') {
      await element(by.id(ClaimsE2eIdConstants.DECISION_CLAIM_LETTER_1_ID)).tap()
      await setTimeout(5000)
      await device.takeScreenshot('DecisionLetter')
    }
  })
})
