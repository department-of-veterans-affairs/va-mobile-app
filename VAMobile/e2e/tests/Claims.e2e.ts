import { by, device, element, expect, waitFor } from 'detox'
import { setTimeout } from 'timers/promises'

import {
  CommonE2eIdConstants,
  loginToDemoMode,
  openBenefits,
  openClaims,
  openClaimsHistory,
  scrollToIDThenTap,
  toggleRemoteConfigFlag,
} from './utils'

export const ClaimsE2eIdConstants = {
  ALERT_FILE_REQUEST_BUTTON_ID: 'Review file requests',
  CLAIM_1_ID:
    'Compensation Received December 05, 2021 Step 1 of 5: Claim received Moved to this step on December 05, 2021',
  CLAIM_2_ID: 'Compensation Received December 04, 2021 Step 5 of 5: Complete Moved to this step on December 04, 2021',
  CLAIM_3_ID: 'Compensation Received July 20, 2021 Step 2 of 5: Initial review Moved to this step on July 20, 2021',
  CLAIM_4_ID:
    'Compensation More information needed Received January 01, 2021 Step 3 of 8: Evidence gathering Moved to this step on May 05, 2021',
  CLAIM_5_ID:
    'Compensation Received March 22, 2019 Step 3 of 5: Evidence gathering, review, and decision Moved to this step on July 18, 2019',
  CLAIM_6_ID:
    'Dependency Received January 01, 2016 Step 4 of 5: Preparation for notification Moved to this step on July 30, 2016',
  CLOSED_CLAIM_DECISION_LETTER_ID:
    'Compensation Decision letter ready Received January 01, 2021 Step 5 of 5: Complete Moved to this step on April 09, 2021',
  CLAIM_3_STATUS_STEP_1_ID: 'Step 1 of 5. Claim received. Complete.',
  CLAIM_3_STATUS_STEP_2_ID: 'Step 2 of 5. Initial review. Current step. Step 1 complete.',
  CLAIM_3_STATUS_STEP_3_ID: 'Step 3 of 5. Evidence gathering, review, and decision. Incomplete.',
  CLAIM_3_STATUS_STEP_4_ID: 'Step 4 of 5. Preparation for notification. Incomplete.',
  CLAIM_3_STATUS_STEP_5_ID: 'Step 5 of 5. Complete. Incomplete.',
  CLAIM_4_STATUS_STEP_1_ID: 'Step 1 of 8. Claim received. Complete.',
  CLAIM_4_STATUS_STEP_2_ID: 'Step 2 of 8. Initial review. Complete.',
  CLAIM_4_STATUS_STEP_3_ID: 'Step 3 of 8. Evidence gathering. Current step. Step 1 through 2 complete.',
  CLAIM_4_STATUS_STEP_4_ID: 'Step 4 of 8. Evidence review. Incomplete.',
  CLAIM_4_STATUS_STEP_5_ID: 'Step 5 of 8. Rating. Incomplete.',
  CLAIM_4_STATUS_STEP_6_ID: 'Step 6 of 8. Preparing decision letter. Incomplete.',
  CLAIM_4_STATUS_STEP_7_ID: 'Step 7 of 8. Final review. Incomplete.',
  CLAIM_4_STATUS_STEP_8_ID: 'Step 8 of 8. Claim decided. Incomplete.',
  GET_CLAIMS_LETTER_BUTTON_ID: 'getClaimLettersTestID',
  FILE_REQUEST_BUTTON_ID: 'Step3FileRequestButton',
  CURRENT_STEP_TEXT: 'Current step',
  TAKE_OR_SELECT_PHOTOS_CAMERA_OPTION_TEXT: device.getPlatform() === 'ios' ? 'Camera' : 'Camera ',
  TAKE_OR_SELECT_PHOTOS_PHOTO_GALLERY_OPTION_TEXT: device.getPlatform() === 'ios' ? 'Photo Gallery' : 'Photo gallery ',
  SELECT_A_FILE_FILE_FOLDER_OPTION_TEXT: device.getPlatform() === 'ios' ? 'File Folder' : 'File folder ',
  SELECT_A_FILE_TEXT: 'Select a file',
  TAKE_OR_SELECT_PHOTOS_TEXT: 'Take or select photos',
  ACCEPTED_FILE_TYPES_TEXT: 'PDF (unlocked), GIF, JPEG, JPG, BMP, TXT',
  MAXIMUM_FILE_SIZE_LABEL: '50 megabytes',
  CLAIMS_HISTORY_SCREEN_ID: 'claimsHistoryID',
  CLAIMS_DETAILS_BACK_ID: 'claimsDetailsBackTestID',
  CLAIMS_STATUS_ID: 'claimsStatusID',
  CLAIMS_FILES_ID: 'claimsFilesID',
  CLAIMS_WHY_COMBINE_LINK_ID: 'claimDetailsWhyWeCombineLinkID',
  CLAIMS_WHY_COMBINE_ID: 'claimsWhyCombineID',
  CLAIMS_WHY_COMBINE_CLOSE_ID: 'claimsWhyCombineCloseID',
  FILE_REQUEST_DETAILS_BACK: 'fileRequestDetailsBackID',
  FILE_REQUEST_DETAILS_PAGE: 'fileRequestPageTestID',
  ASK_FOR_CLAIM_DECISION_PAGE: 'askForClaimDecisionPageTestID',
  ASK_FOR_CLAIM_DECISION_BACK: 'askForClaimDecisionBackID',
  FILE_REQUEST_BACK: 'fileRequestPageBackID',
  CLAIMS_LEARN_WHAT_TO_DO: 'claimDetailsLearnWhatToDoIFDisagreeLinkID',
  CLAIMS_DECISION_REVIEW_OPTIONS: 'ClaimsDecisionReviewOptionsTestID',
  CLAIMS_LEARN_WHAT_TO_DO_BACK: 'claimsWhatToDoDisagreementCloseID',
}

beforeAll(async () => {
  await toggleRemoteConfigFlag(CommonE2eIdConstants.IN_APP_REVIEW_TOGGLE_TEXT)
  await loginToDemoMode()
  await openBenefits()
  await openClaims()
  await openClaimsHistory()
})

describe('Claims Screen', () => {
  it('should match the Claims history page design', async () => {
    await expect(element(by.text('Your active claims, decision reviews, and appeals'))).toExist()
    await expect(element(by.id(ClaimsE2eIdConstants.CLAIM_1_ID))).toExist()
    await expect(element(by.id(ClaimsE2eIdConstants.CLAIM_2_ID))).toExist()
    await expect(element(by.id(ClaimsE2eIdConstants.CLAIM_3_ID))).toExist()
    await expect(element(by.id(ClaimsE2eIdConstants.CLAIM_4_ID))).toExist()
    await expect(element(by.id(ClaimsE2eIdConstants.CLAIM_5_ID))).toExist()
    await expect(element(by.id(ClaimsE2eIdConstants.CLAIM_6_ID))).toExist()
  })

  it('Verify the claim status detail page (8-step claim)', async () => {
    await scrollToIDThenTap(ClaimsE2eIdConstants.CLAIM_4_ID, ClaimsE2eIdConstants.CLAIMS_HISTORY_SCREEN_ID)
    await expect(element(by.id(ClaimsE2eIdConstants.CLAIMS_STATUS_ID))).toExist()
    await expect(element(by.id(ClaimsE2eIdConstants.CLAIMS_FILES_ID))).toExist()
    await expect(element(by.id(ClaimsE2eIdConstants.CLAIM_4_STATUS_STEP_1_ID))).toExist()
    await expect(element(by.id(ClaimsE2eIdConstants.CLAIM_4_STATUS_STEP_2_ID))).toExist()
    await expect(element(by.id(ClaimsE2eIdConstants.CLAIM_4_STATUS_STEP_3_ID))).toExist()
    await expect(element(by.id(ClaimsE2eIdConstants.CLAIM_4_STATUS_STEP_4_ID))).toExist()
    await expect(element(by.id(ClaimsE2eIdConstants.CLAIM_4_STATUS_STEP_5_ID))).toExist()
    await expect(element(by.id(ClaimsE2eIdConstants.CLAIM_4_STATUS_STEP_6_ID))).toExist()
    await expect(element(by.id(ClaimsE2eIdConstants.CLAIM_4_STATUS_STEP_7_ID))).toExist()
    await expect(element(by.id(ClaimsE2eIdConstants.CLAIM_4_STATUS_STEP_8_ID))).toExist()
    await element(by.id(CommonE2eIdConstants.CLAIMS_DETAILS_SCREEN_ID)).scrollTo('top')
    await element(by.id(ClaimsE2eIdConstants.CLAIMS_DETAILS_BACK_ID)).tap()
  })

  it('Verify the claim status detail page (5-step claim)', async () => {
    await scrollToIDThenTap(ClaimsE2eIdConstants.CLAIM_3_ID, ClaimsE2eIdConstants.CLAIMS_HISTORY_SCREEN_ID)
    await expect(element(by.id(ClaimsE2eIdConstants.CLAIMS_STATUS_ID))).toExist()
    await expect(element(by.id(ClaimsE2eIdConstants.CLAIMS_FILES_ID))).toExist()
    await expect(element(by.id(ClaimsE2eIdConstants.CLAIM_3_STATUS_STEP_1_ID))).toExist()
    await expect(element(by.id(ClaimsE2eIdConstants.CLAIM_3_STATUS_STEP_2_ID))).toExist()
    await expect(element(by.id(ClaimsE2eIdConstants.CLAIM_3_STATUS_STEP_3_ID))).toExist()
    await expect(element(by.id(ClaimsE2eIdConstants.CLAIM_3_STATUS_STEP_4_ID))).toExist()
    await expect(element(by.id(ClaimsE2eIdConstants.CLAIM_3_STATUS_STEP_5_ID))).toExist()
  })

  it('Open initial review claim and give the correct details', async () => {
    await expect(element(by.text('Initial review'))).toExist()
    await expect(element(by.text(ClaimsE2eIdConstants.CURRENT_STEP_TEXT))).toExist()
    await expect(
      element(
        by.text('Your claim has been assigned to a reviewer who is determining if additional information is needed.'),
      ),
    ).toExist()
  })

  it('Close initial review claim and verify that no details are still displayed', async () => {
    await setTimeout(2000)
    await waitFor(element(by.id(ClaimsE2eIdConstants.CLAIM_3_STATUS_STEP_2_ID)))
      .toBeVisible()
      .whileElement(by.id(CommonE2eIdConstants.CLAIMS_DETAILS_SCREEN_ID))
      .scroll(100, 'down')
    await setTimeout(2000)
    await element(by.text('Step 2')).tap()
    await setTimeout(2000)
    await expect(
      element(
        by.text('Your claim has been assigned to a reviewer who is determining if additional information is needed.'),
      ),
    ).not.toBeVisible()
  })

  it('Verify what you claimed section', async () => {
    await element(by.id(CommonE2eIdConstants.CLAIMS_DETAILS_SCREEN_ID)).scrollTo('bottom')
    await expect(element(by.text("What you've claimed"))).toExist()
  })

  it('Verify VA sometimes combine claims information', async () => {
    await element(by.id(ClaimsE2eIdConstants.CLAIMS_WHY_COMBINE_LINK_ID)).tap()
    await expect(element(by.id(ClaimsE2eIdConstants.CLAIMS_WHY_COMBINE_ID))).toExist()
    await element(by.id(ClaimsE2eIdConstants.CLAIMS_WHY_COMBINE_CLOSE_ID)).tap()
  })

  it('open claim: verify that the need help? section information', async () => {
    await expect(element(by.text('Need help?'))).toExist()
    await expect(
      element(by.text('Call our VA benefits hotline. We’re here Monday through Friday, 8:00 a.m. to 9:00 p.m. ET.')),
    ).toExist()
    await expect(element(by.id(CommonE2eIdConstants.CALL_VA_PHONE_NUMBER_ID))).toExist()
    if (device.getPlatform() === 'android') {
      await device.disableSynchronization()
      await element(by.id(CommonE2eIdConstants.CALL_VA_PHONE_NUMBER_ID)).tap()
      await setTimeout(5000)
      await device.takeScreenshot('ClaimsNeedHelpAndroidCallingScreen')
      await device.launchApp({ newInstance: false })
      await device.enableSynchronization()
    }
  })

  it('should navigate back to the claims history page', async () => {
    await element(by.id(ClaimsE2eIdConstants.CLAIMS_DETAILS_BACK_ID)).tap()
  })

  it('automatically expands and scrolls to current step and dates match', async () => {
    await element(by.id(ClaimsE2eIdConstants.CLAIM_4_ID)).tap()
    await expect(element(by.text('Received January 01, 2021'))).toExist()
  })

  it('should verify that the review file request alert is visible', async () => {
    await expect(element(by.label('You have 3 file requests')).atIndex(1)).toExist()
    await waitFor(element(by.id(ClaimsE2eIdConstants.ALERT_FILE_REQUEST_BUTTON_ID))).toExist()
  })

  it('should verify that user is sent to File requests screen', async () => {
    await element(by.id(ClaimsE2eIdConstants.ALERT_FILE_REQUEST_BUTTON_ID)).tap()
    await expect(element(by.text('You have 3 file requests from VA'))).toExist()
    await expect(element(by.text('Dental disability - More information needed'))).toExist()
  })

  it('verify that the user is sent to the file upload page', async () => {
    await element(by.text('Dental disability - More information needed')).tap()
    await expect(element(by.text(ClaimsE2eIdConstants.SELECT_A_FILE_TEXT))).toExist()
    await expect(element(by.text(ClaimsE2eIdConstants.TAKE_OR_SELECT_PHOTOS_TEXT))).toExist()
  })

  it('should back out of the file request screen and reenter a new file request screen', async () => {
    await element(by.text('Back')).tap()
    await element(by.text('Accidental injury - 21-4176 needed')).tap()
  })

  it('verify Review evaluation details', async () => {
    await element(by.id(ClaimsE2eIdConstants.FILE_REQUEST_DETAILS_BACK)).tap()
    await element(by.id(ClaimsE2eIdConstants.FILE_REQUEST_DETAILS_PAGE)).scrollTo('bottom')
    await element(by.id('Review evaluation details')).tap()
    await expect(element(by.text('Claim evaluation'))).toExist()
    await expect(
      element(
        by.text(
          'I have submitted all evidence that will support my claim and I’m not going to turn in any more information. I would like VA to make a decision on my claim based on the information already provided. (Required)',
        ),
      ),
    ).toExist()
    await expect(element(by.id('Request claim evaluation'))).toExist()
  })

  it('verify error is displayed when request claim evaluation isnt checked', async () => {
    await element(by.id(ClaimsE2eIdConstants.ASK_FOR_CLAIM_DECISION_PAGE)).scrollTo('bottom')
    await element(by.id('Request claim evaluation')).tap()
    await expect(element(by.text('Check the box to confirm the information is correct.'))).toExist()
  })

  it('should verify details of claim on step 1', async () => {
    await element(by.id(ClaimsE2eIdConstants.ASK_FOR_CLAIM_DECISION_BACK)).tap()
    await element(by.id(ClaimsE2eIdConstants.FILE_REQUEST_BACK)).tap()
    await element(by.id(ClaimsE2eIdConstants.CLAIMS_DETAILS_BACK_ID)).tap()
    await element(by.id(ClaimsE2eIdConstants.CLAIMS_HISTORY_SCREEN_ID)).scrollTo('top')
    await element(by.id(ClaimsE2eIdConstants.CLAIM_1_ID)).tap()
    await expect(element(by.id('Step 1 of 5. Claim received. Current step.'))).toExist()
    await expect(element(by.text(ClaimsE2eIdConstants.CURRENT_STEP_TEXT))).toExist()
    await expect(element(by.text('Thank you. VA received your claim'))).toExist()
    await element(by.id(ClaimsE2eIdConstants.CLAIMS_DETAILS_BACK_ID)).tap()
  })

  it('should verify details of claim on step 2', async () => {
    await waitFor(element(by.id(ClaimsE2eIdConstants.CLAIM_3_ID)))
      .toBeVisible()
      .whileElement(by.id(ClaimsE2eIdConstants.CLAIMS_HISTORY_SCREEN_ID))
      .scroll(100, 'down')
    await element(by.id(ClaimsE2eIdConstants.CLAIM_3_ID)).tap()
    await expect(element(by.id('Step 2 of 5. Initial review. Current step. Step 1 complete.'))).toExist()
    await expect(
      element(
        by.text('Your claim has been assigned to a reviewer who is determining if additional information is needed.'),
      ),
    ).toExist()
  })

  //flag has been turned off per slack convo in DSVA, commenting tests out until it is turned back on
  // it('should verify submit evidence button exists', async () => {
  //   await element(by.id(CommonE2eIdConstants.CLAIMS_DETAILS_SCREEN_ID)).scrollTo('top')
  //   await element(by.text('Submit evidence')).tap()
  // })

  // it('should verify submit evidence screen', async () => {
  //   await expect(element(by.text('Submit evidence'))).toExist()
  //   await expect(element(by.text('What to know before you submit evidence'))).toExist()
  //   await expect(
  //     element(
  //       by.text(
  //         'You can submit evidence for this claim at any time. But if you submit evidence after Step 3, your claim will go back to that step for review.',
  //       ),
  //     ),
  //   ).toExist()
  //   await expect(element(by.text(ClaimsE2eIdConstants.SELECT_A_FILE_TEXT))).toExist()
  //   await expect(element(by.text(ClaimsE2eIdConstants.TAKE_OR_SELECT_PHOTOS_TEXT))).toExist()
  // })

  // it('verify the select files screen displays the correct info', async () => {
  //   await element(by.text(ClaimsE2eIdConstants.SELECT_A_FILE_TEXT)).tap()
  //   await expect(element(by.text('Select a file to upload'))).toExist()
  //   await expect(element(by.label(ClaimsE2eIdConstants.MAXIMUM_FILE_SIZE_LABEL))).toExist()
  //   await expect(element(by.text(ClaimsE2eIdConstants.ACCEPTED_FILE_TYPES_TEXT))).toExist()
  //   await expect(element(by.id(ClaimsE2eIdConstants.SELECT_A_FILE_TEXT)).atIndex(1)).toExist()
  // })

  // it('verify tap select a file options', async () => {
  //   if (device.getPlatform() === 'android') {
  //     await element(by.text(ClaimsE2eIdConstants.SELECT_A_FILE_TEXT)).atIndex(1).tap()
  //   } else {
  //     await element(by.id(ClaimsE2eIdConstants.SELECT_A_FILE_TEXT)).atIndex(1).tap()
  //   }
  //   await expect(element(by.text(ClaimsE2eIdConstants.SELECT_A_FILE_FILE_FOLDER_OPTION_TEXT))).toExist()
  //   await expect(element(by.text(CommonE2eIdConstants.CANCEL_PLATFORM_SPECIFIC_TEXT))).toExist()
  // })

  // it('should navigate back to the submit evidence screen', async () => {
  //   if (device.getPlatform() === 'android') {
  //     await element(by.text(CommonE2eIdConstants.CANCEL_PLATFORM_SPECIFIC_TEXT)).tap()
  //   } else {
  //     await element(by.text(CommonE2eIdConstants.CANCEL_PLATFORM_SPECIFIC_TEXT)).atIndex(1).tap()
  //   }
  //   await element(by.text('Back')).tap()
  // })

  // it('should verify take or select photos flow', async () => {
  //   await element(by.text(ClaimsE2eIdConstants.TAKE_OR_SELECT_PHOTOS_TEXT)).tap()
  //   await expect(element(by.text('This feature is not yet accessible to screen readers'))).toExist()
  //   await expect(element(by.label(ClaimsE2eIdConstants.MAXIMUM_FILE_SIZE_LABEL))).toExist()
  //   await expect(element(by.text(ClaimsE2eIdConstants.ACCEPTED_FILE_TYPES_TEXT))).toExist()
  //   await expect(element(by.id(ClaimsE2eIdConstants.TAKE_OR_SELECT_PHOTOS_TEXT)).atIndex(1)).toExist()
  // })

  // it('should select take or select photos and verify the options given', async () => {
  //   await element(by.id('takePhotosTestID')).scrollTo('bottom')
  //   if (device.getPlatform() === 'android') {
  //     await element(by.id(ClaimsE2eIdConstants.TAKE_OR_SELECT_PHOTOS_TEXT)).atIndex(0).tap()
  //   } else {
  //     await element(by.id(ClaimsE2eIdConstants.TAKE_OR_SELECT_PHOTOS_TEXT)).atIndex(1).tap()
  //   }
  //   await expect(element(by.text(ClaimsE2eIdConstants.TAKE_OR_SELECT_PHOTOS_CAMERA_OPTION_TEXT))).toExist()
  //   await expect(element(by.text(ClaimsE2eIdConstants.TAKE_OR_SELECT_PHOTOS_PHOTO_GALLERY_OPTION_TEXT))).toExist()
  // })

  // it('should navigate back to the claim details screen', async () => {
  //   if (device.getPlatform() === 'android') {
  //     await element(by.text(CommonE2eIdConstants.CANCEL_PLATFORM_SPECIFIC_TEXT)).tap()
  //   } else {
  //     await element(by.text(CommonE2eIdConstants.CANCEL_PLATFORM_SPECIFIC_TEXT)).atIndex(1).tap()
  //   }
  //   await element(by.text('Back')).tap()
  //   await element(by.text('Cancel')).tap()
  // })

  it('should verify details of claim on step 3 w/ waiver', async () => {
    await element(by.id(ClaimsE2eIdConstants.CLAIMS_DETAILS_BACK_ID)).tap()
    await waitFor(element(by.id(ClaimsE2eIdConstants.CLAIM_5_ID)))
      .toBeVisible()
      .whileElement(by.id(ClaimsE2eIdConstants.CLAIMS_HISTORY_SCREEN_ID))
      .scroll(100, 'down')
    await element(by.id(ClaimsE2eIdConstants.CLAIM_5_ID)).tap()
    await setTimeout(2000)
    await expect(
      element(by.id('Step 3 of 5. Evidence gathering, review, and decision. Current step. Step 1 through 2 complete.')),
    ).toExist()
    await waitFor(
      element(by.id('Step 3 of 5. Evidence gathering, review, and decision. Current step. Step 1 through 2 complete.')),
    )
      .toBeVisible()
      .whileElement(by.id(CommonE2eIdConstants.CLAIMS_DETAILS_SCREEN_ID))
      .scroll(100, 'down')
    await element(
      by.id('Step 3 of 5. Evidence gathering, review, and decision. Current step. Step 1 through 2 complete.'),
    ).tap()
    await expect(
      element(
        by.text(
          'If we need more information, we’ll request it from you, health care providers, governmental agencies, or others. Once we have all the information we need, we’ll review it and send your claim to the rating specialist for a decision.',
        ),
      ),
    ).toExist()
    await element(by.id(ClaimsE2eIdConstants.CLAIMS_DETAILS_BACK_ID)).tap()
  })

  it('should verify details of claim on step 4', async () => {
    await waitFor(element(by.id(ClaimsE2eIdConstants.CLAIM_6_ID)))
      .toBeVisible()
      .whileElement(by.id(ClaimsE2eIdConstants.CLAIMS_HISTORY_SCREEN_ID))
      .scroll(100, 'down')
    await element(by.id(ClaimsE2eIdConstants.CLAIM_6_ID)).tap()
    await expect(
      element(by.id('Step 4 of 5. Preparation for notification. Current step. Step 1 through 3 complete.')),
    ).toExist()
    await expect(element(by.text('We are preparing your claim decision packet to be mailed.'))).toExist()
    await element(by.id(ClaimsE2eIdConstants.CLAIMS_DETAILS_BACK_ID)).tap()
  })

  it('should verify details of claim on step 5', async () => {
    await element(by.id(ClaimsE2eIdConstants.CLAIMS_HISTORY_SCREEN_ID)).scrollTo('top')
    await element(by.id(ClaimsE2eIdConstants.CLAIM_2_ID)).tap()
    await waitFor(element(by.id('Step 5 of 5. Complete. Complete.')))
      .toBeVisible()
      .whileElement(by.id(CommonE2eIdConstants.CLAIMS_DETAILS_SCREEN_ID))
      .scroll(100, 'down')
    await element(by.id('Step 5 of 5. Complete. Complete.')).tap()
    await expect(element(by.text('Complete')).atIndex(1)).toExist()
    await element(by.id(ClaimsE2eIdConstants.CLAIMS_DETAILS_BACK_ID)).tap()
  })

  it('should tap on the closed tab', async () => {
    await element(by.id(CommonE2eIdConstants.CLAIMS_HISTORY_CLOSED_TAB_ID)).tap()
  })

  it('verify the status details page of closed claim with decision letter', async () => {
    await element(by.id(ClaimsE2eIdConstants.CLOSED_CLAIM_DECISION_LETTER_ID)).tap()
    await expect(element(by.text('Decision letter ready'))).toExist()
    await expect(
      element(
        by.text(
          'We decided your claim on April 09, 2021. You can download your decision letter. We also mailed you this letter.',
        ),
      ),
    ).toExist()
    await expect(element(by.text("What you've claimed"))).toExist()
    await expect(element(by.text('Payments')).atIndex(0)).toExist()
    await expect(
      element(
        by.text(
          "If you're entitled to back payment (based on an effective date), you can expect to receive payment within 1 month of your claim's decision date.",
        ),
      ),
    ).toExist()
  })

  it('Verify what should I do if disagreement information', async () => {
    await element(by.id(CommonE2eIdConstants.CLAIMS_DETAILS_SCREEN_ID)).scrollTo('bottom')
    await element(by.id(ClaimsE2eIdConstants.CLAIMS_LEARN_WHAT_TO_DO)).atIndex(0).tap()
    await expect(element(by.text('What to do if you disagree with our decision')).atIndex(0)).toExist()
    await element(by.id(ClaimsE2eIdConstants.CLAIMS_DECISION_REVIEW_OPTIONS)).tap()
    await element(by.text(CommonE2eIdConstants.LEAVING_APP_LEAVE_TEXT)).tap()
    await setTimeout(5000)
    await device.takeScreenshot('DecisionReviewOptionsWebsite')
    await device.launchApp({ newInstance: false })
    await element(by.id(ClaimsE2eIdConstants.CLAIMS_LEARN_WHAT_TO_DO_BACK)).tap()
  })

  it('closed claim: verify that the need help? section display information', async () => {
    await expect(element(by.text('Need help?'))).toExist()
    await expect(
      element(by.text('Call our VA benefits hotline. We’re here Monday through Friday, 8:00 a.m. to 9:00 p.m. ET.')),
    ).toExist()
    await expect(element(by.id(CommonE2eIdConstants.CALL_VA_PHONE_NUMBER_ID))).toExist()
    if (device.getPlatform() === 'android') {
      await element(by.id(CommonE2eIdConstants.CLAIMS_DETAILS_SCREEN_ID)).scrollTo('bottom')
      await device.disableSynchronization()
      await element(by.id(CommonE2eIdConstants.CALL_VA_PHONE_NUMBER_ID)).tap()
      await setTimeout(5000)
      await device.takeScreenshot('AndroidCallingScreen')
      await device.launchApp({ newInstance: false })
      await device.enableSynchronization()
    }
  })

  it('verify files tab infomation', async () => {
    await element(by.id(CommonE2eIdConstants.CLAIMS_DETAILS_SCREEN_ID)).scrollTo('top')
    await element(by.id(ClaimsE2eIdConstants.CLAIMS_FILES_ID)).tap()
    await expect(element(by.text("This claim doesn't have any files yet."))).toExist()
  })
})
