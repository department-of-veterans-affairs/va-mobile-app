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

export const ReviewClaimDetailsE2eIdConstants = {
  CLAIM_ID:
    'Claim for compensation Received December 05, 2021 Step 1 of 5: Claim received Moved to this step on December 05, 2021',
  CLAIM_5_STEPS_ID:
    'Claim for compensation Received July 20, 2021 Step 2 of 5: Initial review Moved to this step on July 20, 2021',
  CLAIM_WITH_EVIDENCE_REQUEST_ID:
    'Claim for disability compensation Evidence requested Received January 01, 2021 Step 3 of 8: Evidence gathering Moved to this step on May 05, 2021',
  CLAIM_5_STEPS_STATUS_STEP_1_ID: 'Step 1 of 5. Claim received. Complete.',
  CLAIM_5_STEPS_STATUS_STEP_2_ID: 'Step 2 of 5. Initial review. Current step. Step 1 complete.',
  CLAIM_5_STEPS_STATUS_STEP_3_ID: 'Step 3 of 5. Evidence gathering, review, and decision. Incomplete.',
  CLAIM_5_STEPS_STATUS_STEP_4_ID: 'Step 4 of 5. Preparation for notification. Incomplete.',
  CLAIM_5_STEPS_STATUS_STEP_5_ID: 'Step 5 of 5. Complete. Incomplete.',
  CLAIM_WITH_EVIDENCE_STATUS_STEP_1_ID: 'Step 1 of 8. Claim received. Complete.',
  CLAIM_WITH_EVIDENCE_STATUS_STEP_2_ID: 'Step 2 of 8. Initial review. Complete.',
  CLAIM_WITH_EVIDENCE_STATUS_STEP_3_ID: 'Step 3 of 8. Evidence gathering. Current step. Step 1 through 2 complete.',
  CLAIM_WITH_EVIDENCE_STATUS_STEP_4_ID: 'Step 4 of 8. Evidence review. Incomplete.',
  CLAIM_WITH_EVIDENCE_STATUS_STEP_5_ID: 'Step 5 of 8. Rating. Incomplete.',
  CLAIM_WITH_EVIDENCE_STATUS_STEP_6_ID: 'Step 6 of 8. Preparing decision letter. Incomplete.',
  CLAIM_WITH_EVIDENCE_STATUS_STEP_7_ID: 'Step 7 of 8. Final review. Incomplete.',
  CLAIM_WITH_EVIDENCE_STATUS_STEP_8_ID: 'Step 8 of 8. Claim decided. Incomplete.',
  FILE_REQUEST_BUTTON_ID: 'Step3FileRequestButton',
  CURRENT_STEP_TEXT: 'Current step',
  SELECT_A_FILE_TEXT: 'Select a file',
  SELECT_A_FILE_TEXT2: 'Select a file\uFEFF',
  TAKE_OR_SELECT_PHOTOS_TEXT: 'Take or select photos',
  TAKE_OR_SELECT_PHOTOS_TEXT2: 'Take or select photos\uFEFF',
  CLAIMS_STATUS_ID: 'claimsStatusID',
  CLAIMS_FILES_ID: 'claimsFilesID',
  CLAIMS_WHY_COMBINE_LINK_ID: 'claimDetailsWhyWeCombineLinkID',
  CLAIMS_WHY_COMBINE_ID: 'claimsWhyCombineID',
  CLAIMS_WHY_COMBINE_CLOSE_ID: 'claimsWhyCombineCloseID',
  FILE_REQUEST_DETAILS_BACK: 'fileRequestDetailsBackID',
  FILE_REQUEST_BACK: 'fileRequestPageBackID',
  CLAIMS_LEARN_WHAT_TO_DO: 'claimDetailsLearnWhatToDoIFDisagreeLinkID',
  CLAIMS_DECISION_REVIEW_OPTIONS: 'ClaimsDecisionReviewOptionsTestID',
  CLAIMS_LEARN_WHAT_TO_DO_BACK: 'claimsWhatToDoDisagreementCloseID',
  NOTICE_5103_REVIEW_WAIVER: 'Review waiver',
  NOTICE_5103_SUBMIT_WAIVER: 'Submit waiver',
  NOTICE_5103_SUBMIT_WAIVER_ERROR: 'You must confirm you’re done adding evidence for now before submitting the waiver',
  NOTICE_5103_SUBMIT_EVIDENCE: 'Submit evidence',
  NOTICE_5103_REQUEST_DETAILS_ID: 'file5103RequestDetailsID',
  CLAIMS_TITLE: 'Your active claims, decision reviews, and appeals',
  CLAIM_5_STEPS_CURRENT_STEP: 'Initial review',
  CLAIM_5_STEPS_CURRENT_STEP_DETAILS:
    'Your claim has been assigned to a reviewer who is determining if additional information is needed.',
  STEP_2_COLLAPSE_TOGGLE: 'Step 2',
  WHAT_YOUVE_CLAIMED: "What you've claimed",
  FILE_REQUEST_TEXT: 'You have 5 file requests',
  FILE_REQUEST_TITLE: 'You have 5 file requests from VA',
  FILE_REQUEST_LIST_ITEM: 'Clarify claimed condition',
  BACK: 'Back',
  LIST_ITEM_5103: 'Request for evidence',
  TITLE_5103: '5103 notice - Evidence we may need',
  DECISION_LETTER_READY: 'Decision letter ready',
  PAYMENTS: 'Payments',
}

beforeAll(async () => {
  await toggleRemoteConfigFlag(CommonE2eIdConstants.IN_APP_REVIEW_TOGGLE_TEXT)
  await loginToDemoMode()
  await openBenefits()
  await openClaims()
  await openClaimsHistory()
})

describe('Review Claim Details', () => {
  it('should display the claim list title and claims', async () => {
    await expect(element(by.text(ReviewClaimDetailsE2eIdConstants.CLAIMS_TITLE))).toExist()
    await expect(element(by.id(ReviewClaimDetailsE2eIdConstants.CLAIM_ID))).toExist()
    await expect(element(by.id(ReviewClaimDetailsE2eIdConstants.CLAIM_WITH_EVIDENCE_REQUEST_ID))).toExist()
  })

  it('should display an 8 step claim details', async () => {
    await scrollToIDThenTap(
      ReviewClaimDetailsE2eIdConstants.CLAIM_WITH_EVIDENCE_REQUEST_ID,
      CommonE2eIdConstants.CLAIMS_HISTORY_SCROLL_ID,
    )
    await expect(element(by.id(ReviewClaimDetailsE2eIdConstants.CLAIMS_STATUS_ID))).toExist()
    await expect(element(by.id(ReviewClaimDetailsE2eIdConstants.CLAIMS_FILES_ID))).toExist()
    await expect(element(by.id(ReviewClaimDetailsE2eIdConstants.CLAIM_WITH_EVIDENCE_STATUS_STEP_1_ID))).toExist()
    await expect(element(by.id(ReviewClaimDetailsE2eIdConstants.CLAIM_WITH_EVIDENCE_STATUS_STEP_2_ID))).toExist()
    await expect(element(by.id(ReviewClaimDetailsE2eIdConstants.CLAIM_WITH_EVIDENCE_STATUS_STEP_3_ID))).toExist()
    await expect(element(by.id(ReviewClaimDetailsE2eIdConstants.CLAIM_WITH_EVIDENCE_STATUS_STEP_4_ID))).toExist()
    await expect(element(by.id(ReviewClaimDetailsE2eIdConstants.CLAIM_WITH_EVIDENCE_STATUS_STEP_5_ID))).toExist()
    await expect(element(by.id(ReviewClaimDetailsE2eIdConstants.CLAIM_WITH_EVIDENCE_STATUS_STEP_6_ID))).toExist()
    await expect(element(by.id(ReviewClaimDetailsE2eIdConstants.CLAIM_WITH_EVIDENCE_STATUS_STEP_7_ID))).toExist()
    await expect(element(by.id(ReviewClaimDetailsE2eIdConstants.CLAIM_WITH_EVIDENCE_STATUS_STEP_8_ID))).toExist()
    await element(by.id(CommonE2eIdConstants.CLAIMS_DETAILS_SCREEN_ID)).scrollTo('top')
    await element(by.id(CommonE2eIdConstants.CLAIMS_DETAILS_BACK_ID)).tap()
  })

  it('should display a 5 step claim details', async () => {
    await scrollToIDThenTap(
      ReviewClaimDetailsE2eIdConstants.CLAIM_5_STEPS_ID,
      CommonE2eIdConstants.CLAIMS_HISTORY_SCROLL_ID,
    )
    await expect(element(by.id(ReviewClaimDetailsE2eIdConstants.CLAIMS_STATUS_ID))).toExist()
    await expect(element(by.id(ReviewClaimDetailsE2eIdConstants.CLAIMS_FILES_ID))).toExist()
    await expect(element(by.id(ReviewClaimDetailsE2eIdConstants.CLAIM_5_STEPS_STATUS_STEP_1_ID))).toExist()
    await expect(element(by.id(ReviewClaimDetailsE2eIdConstants.CLAIM_5_STEPS_STATUS_STEP_2_ID))).toExist()
    await expect(element(by.id(ReviewClaimDetailsE2eIdConstants.CLAIM_5_STEPS_STATUS_STEP_3_ID))).toExist()
    await expect(element(by.id(ReviewClaimDetailsE2eIdConstants.CLAIM_5_STEPS_STATUS_STEP_4_ID))).toExist()
    await expect(element(by.id(ReviewClaimDetailsE2eIdConstants.CLAIM_5_STEPS_STATUS_STEP_5_ID))).toExist()
  })

  it('should display the current step as expanded with details text', async () => {
    await expect(element(by.text(ReviewClaimDetailsE2eIdConstants.CLAIM_5_STEPS_CURRENT_STEP))).toExist()
    await expect(element(by.text(ReviewClaimDetailsE2eIdConstants.CURRENT_STEP_TEXT))).toExist()
    await expect(element(by.text(ReviewClaimDetailsE2eIdConstants.CLAIM_5_STEPS_CURRENT_STEP_DETAILS))).toExist()
  })

  it('should collapse initial review step and verify that no details are still displayed', async () => {
    await setTimeout(2000)
    await waitFor(element(by.id(ReviewClaimDetailsE2eIdConstants.CLAIM_5_STEPS_STATUS_STEP_2_ID)))
      .toBeVisible()
      .whileElement(by.id(CommonE2eIdConstants.CLAIMS_DETAILS_SCREEN_ID))
      .scroll(100, 'down')
    await setTimeout(2000)
    await element(by.text(ReviewClaimDetailsE2eIdConstants.STEP_2_COLLAPSE_TOGGLE)).tap()
    await setTimeout(2000)
    await expect(
      element(by.text(ReviewClaimDetailsE2eIdConstants.CLAIM_5_STEPS_CURRENT_STEP_DETAILS)),
    ).not.toBeVisible()
  })

  it('should show what you claimed section', async () => {
    await element(by.id(CommonE2eIdConstants.CLAIMS_DETAILS_SCREEN_ID)).scrollTo('bottom')
    await expect(element(by.text(ReviewClaimDetailsE2eIdConstants.WHAT_YOUVE_CLAIMED))).toExist()
  })

  it('should show the VA sometimes combine claims information modal', async () => {
    await element(by.id(ReviewClaimDetailsE2eIdConstants.CLAIMS_WHY_COMBINE_LINK_ID)).tap()
    await expect(element(by.id(ReviewClaimDetailsE2eIdConstants.CLAIMS_WHY_COMBINE_ID))).toExist()
    await element(by.id(ReviewClaimDetailsE2eIdConstants.CLAIMS_WHY_COMBINE_CLOSE_ID)).tap()
  })

  it('should show the need help? section information', async () => {
    await expect(element(by.text('Need help?'))).toExist()
    await expect(
      element(by.text('Call our VA benefits hotline. We’re here Monday through Friday, 8:00 a.m. to 9:00 p.m. ET.')),
    ).toExist()
    await expect(element(by.id(CommonE2eIdConstants.CALL_VA_PHONE_NUMBER_ID))).toExist()
  })

  it('should navigate back to the claims history page', async () => {
    await element(by.id(CommonE2eIdConstants.CLAIMS_DETAILS_BACK_ID)).tap()
  })

  it('should show review file request alert', async () => {
    await element(by.id(ReviewClaimDetailsE2eIdConstants.CLAIM_WITH_EVIDENCE_REQUEST_ID)).tap()
    await waitFor(element(by.id(CommonE2eIdConstants.ALERT_FILE_REQUEST_BUTTON_ID))).toExist()
  })

  it('should send the user to file requests screen', async () => {
    await element(by.id(CommonE2eIdConstants.ALERT_FILE_REQUEST_BUTTON_ID)).tap()
    await expect(element(by.text(ReviewClaimDetailsE2eIdConstants.FILE_REQUEST_TITLE))).toExist()
    await expect(element(by.text(ReviewClaimDetailsE2eIdConstants.FILE_REQUEST_LIST_ITEM))).toExist()
  })

  it('should send the user to the file upload page', async () => {
    await element(by.text(ReviewClaimDetailsE2eIdConstants.FILE_REQUEST_LIST_ITEM)).tap()
    await expect(element(by.text(ReviewClaimDetailsE2eIdConstants.SELECT_A_FILE_TEXT))).toExist()
    await expect(element(by.text(ReviewClaimDetailsE2eIdConstants.TAKE_OR_SELECT_PHOTOS_TEXT))).toExist()
    await element(by.id(ReviewClaimDetailsE2eIdConstants.FILE_REQUEST_DETAILS_BACK)).tap()
  })

  it('should open the 5103 notice', async () => {
    await element(by.text(ReviewClaimDetailsE2eIdConstants.LIST_ITEM_5103)).atIndex(0).tap()

    await expect(element(by.text(ReviewClaimDetailsE2eIdConstants.TITLE_5103))).toExist()
    await element(by.id(ReviewClaimDetailsE2eIdConstants.NOTICE_5103_REQUEST_DETAILS_ID)).scrollTo('bottom')

    await expect(element(by.text(ReviewClaimDetailsE2eIdConstants.NOTICE_5103_REVIEW_WAIVER))).toExist()
    await expect(element(by.text(ReviewClaimDetailsE2eIdConstants.NOTICE_5103_SUBMIT_EVIDENCE))).toExist()

    await element(by.text(ReviewClaimDetailsE2eIdConstants.NOTICE_5103_SUBMIT_EVIDENCE)).tap()

    await element(by.id(CommonE2eIdConstants.SUBMIT_EVIDENCE_5103_ID)).scrollTo('bottom')

    await expect(element(by.text(ReviewClaimDetailsE2eIdConstants.SELECT_A_FILE_TEXT2))).toExist()
    await expect(element(by.text(ReviewClaimDetailsE2eIdConstants.TAKE_OR_SELECT_PHOTOS_TEXT2))).toExist()
    await element(by.text(ReviewClaimDetailsE2eIdConstants.BACK)).atIndex(0).tap()
    await element(by.text(ReviewClaimDetailsE2eIdConstants.BACK)).atIndex(0).tap()
    await element(by.id(ReviewClaimDetailsE2eIdConstants.FILE_REQUEST_BACK)).tap()
    await element(by.id(CommonE2eIdConstants.CLAIMS_DETAILS_BACK_ID)).tap()
  })

  it('should tap the closed tab', async () => {
    await element(by.id(CommonE2eIdConstants.CLAIMS_HISTORY_SCROLL_ID)).scrollTo('top')
    await element(by.id(CommonE2eIdConstants.CLAIMS_HISTORY_CLOSED_TAB_ID)).tap()
  })

  it('should show status details page of closed claim with decision letter', async () => {
    await element(by.id(CommonE2eIdConstants.CLOSED_CLAIM_DECISION_LETTER_ID)).tap()
    await expect(element(by.text(ReviewClaimDetailsE2eIdConstants.DECISION_LETTER_READY))).toExist()
    await expect(
      element(
        by.text(
          'We decided your claim on April 09, 2021. You can download your decision letter. We also mailed you this letter.',
        ),
      ),
    ).toExist()
    await expect(element(by.text(ReviewClaimDetailsE2eIdConstants.WHAT_YOUVE_CLAIMED))).toExist()
    await expect(element(by.text(ReviewClaimDetailsE2eIdConstants.PAYMENTS)).atIndex(0)).toExist()
    await expect(
      element(
        by.text(
          "If you're entitled to back payment (based on an effective date), you can expect to receive payment within 1 month of your claim's decision date.",
        ),
      ),
    ).toExist()
  })

  it('should show what should I do if I disagree information', async () => {
    await element(by.id(CommonE2eIdConstants.CLAIMS_DETAILS_SCREEN_ID)).scrollTo('bottom')
    await element(by.id(ReviewClaimDetailsE2eIdConstants.CLAIMS_LEARN_WHAT_TO_DO)).atIndex(0).tap()
    await expect(element(by.text('What to do if you disagree with our decision')).atIndex(0)).toExist()
    await element(by.id(ReviewClaimDetailsE2eIdConstants.CLAIMS_DECISION_REVIEW_OPTIONS)).tap()
    await element(by.text(CommonE2eIdConstants.LEAVING_APP_CANCEL_TEXT)).tap()
    await element(by.id(ReviewClaimDetailsE2eIdConstants.CLAIMS_LEARN_WHAT_TO_DO_BACK)).tap()
  })

  it('should show files tab infomation', async () => {
    await element(by.id(CommonE2eIdConstants.CLAIMS_DETAILS_SCREEN_ID)).scrollTo('top')
    await element(by.id(ReviewClaimDetailsE2eIdConstants.CLAIMS_FILES_ID)).tap()
    await expect(element(by.text("This claim doesn't have any files yet."))).toExist()
  })
})
