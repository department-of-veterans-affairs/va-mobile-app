import { by, element, expect, waitFor } from 'detox'

import {
  CommonE2eIdConstants,
  loginToDemoMode,
  openBenefits,
  openClaims,
  openClaimsHistory,
  scrollToIDThenTap,
  toggleRemoteConfigFlag,
} from './utils'

// Constants for evidence requests
export const EvidenceRequestsUpdatedUIConstants = {
  CLAIM_WITH_FILE_REQUESTS_ID:
    'Claim for disability compensation Evidence requested Received January 01, 2021 Step 3 of 8: Evidence gathering Moved to this step on May 05, 2021',
  FILE_REQUEST_DETAILS_ID: 'fileRequestDetailsID',
  FILE_REQUEST_ITEM_TEXT: 'Dental disability - More information needed',
  REQUEST_FOR_EVIDENCE_TITLE: 'Request for evidence',
  WHAT_WE_NEED_FROM_YOU_HEADER: 'What we need from you',
  HOW_TO_SUBMIT_HEADER: 'How to submit this information',
  NEED_HELP_HEADER: 'Need help?',
  MORE_ON_SUBMITTING_HEADER: 'More on submitting files',
  WE_REQUESTED_EVIDENCE_TEXT: 'We requested this evidence from you on',
  ACCESS_CLAIM_LETTERS_LINK_ID: 'accessYourClaimLettersID',
  FIND_VA_FORM_LINK_ID: 'findVAFormID',
  FIND_VA_LOCATION_LINK_ID: 'findVALocationID',
}

beforeAll(async () => {
  // Toggle in-app review off to prevent interference
  await toggleRemoteConfigFlag(CommonE2eIdConstants.IN_APP_REVIEW_TOGGLE_TEXT)
  // Toggle the new evidence requests UI on
  await toggleRemoteConfigFlag(CommonE2eIdConstants.EVIDENCE_REQUESTS_UPDATED_UI_TEXT)
  await loginToDemoMode()
  await openBenefits()
  await openClaims()
  await openClaimsHistory()
})

describe('Evidence Requests Updated UI', () => {
  beforeAll(async () => {
    // Navigate to a claim with file requests
    await scrollToIDThenTap(
      EvidenceRequestsUpdatedUIConstants.CLAIM_WITH_FILE_REQUESTS_ID,
      CommonE2eIdConstants.CLAIMS_HISTORY_SCROLL_ID,
    )
    // Tap on file requests alert
    await waitFor(element(by.id(CommonE2eIdConstants.ALERT_FILE_REQUEST_BUTTON_ID))).toExist()
    await element(by.id(CommonE2eIdConstants.ALERT_FILE_REQUEST_BUTTON_ID)).tap()
    // Navigate to file request details
    await element(by.text(EvidenceRequestsUpdatedUIConstants.FILE_REQUEST_ITEM_TEXT)).tap()
  })

  it('should display the new "Request for evidence" title', async () => {
    await expect(element(by.text(EvidenceRequestsUpdatedUIConstants.REQUEST_FOR_EVIDENCE_TITLE))).toExist()
  })

  it('should display the "respond by" subtitle with date and display name', async () => {
    await expect(element(by.text(/Respond by .* for:/))).toExist()
  })

  it('should display the "We requested this evidence" blurb', async () => {
    await expect(element(by.text(/We requested this evidence from you on/))).toExist()
  })

  it('should display the "What we need from you" section', async () => {
    await expect(element(by.text(EvidenceRequestsUpdatedUIConstants.WHAT_WE_NEED_FROM_YOU_HEADER))).toExist()
  })

  it('should display the "How to submit this information" section', async () => {
    await waitFor(element(by.text(EvidenceRequestsUpdatedUIConstants.HOW_TO_SUBMIT_HEADER)))
      .toBeVisible()
      .whileElement(by.id(EvidenceRequestsUpdatedUIConstants.FILE_REQUEST_DETAILS_ID))
      .scroll(200, 'down')
    await expect(element(by.text(EvidenceRequestsUpdatedUIConstants.HOW_TO_SUBMIT_HEADER))).toExist()
  })

  it('should display the "Access your claim letters" link', async () => {
    await expect(element(by.id(EvidenceRequestsUpdatedUIConstants.ACCESS_CLAIM_LETTERS_LINK_ID))).toExist()
  })

  it('should display the "Find a VA form" link', async () => {
    await expect(element(by.id(EvidenceRequestsUpdatedUIConstants.FIND_VA_FORM_LINK_ID))).toExist()
  })

  it('should display the "More on submitting files" accordion', async () => {
    await waitFor(element(by.text(EvidenceRequestsUpdatedUIConstants.MORE_ON_SUBMITTING_HEADER)))
      .toBeVisible()
      .whileElement(by.id(EvidenceRequestsUpdatedUIConstants.FILE_REQUEST_DETAILS_ID))
      .scroll(200, 'down')
    await expect(element(by.text(EvidenceRequestsUpdatedUIConstants.MORE_ON_SUBMITTING_HEADER))).toExist()
  })

  it('should expand "More on submitting files" accordion and show content', async () => {
    await element(by.text(EvidenceRequestsUpdatedUIConstants.MORE_ON_SUBMITTING_HEADER)).tap()
    await expect(element(by.text('Submit your files in the app.'))).toExist()
    await expect(element(by.text('Deliver your files by mail or in person.'))).toExist()
    await expect(element(by.id(EvidenceRequestsUpdatedUIConstants.FIND_VA_LOCATION_LINK_ID))).toExist()
  })

  it('should display the "Need help?" accordion', async () => {
    await waitFor(element(by.text(EvidenceRequestsUpdatedUIConstants.NEED_HELP_HEADER)))
      .toBeVisible()
      .whileElement(by.id(EvidenceRequestsUpdatedUIConstants.FILE_REQUEST_DETAILS_ID))
      .scroll(200, 'down')
    await expect(element(by.text(EvidenceRequestsUpdatedUIConstants.NEED_HELP_HEADER))).toExist()
  })

  it('should expand "Need help?" accordion and show VA hotline info', async () => {
    await element(by.text(EvidenceRequestsUpdatedUIConstants.NEED_HELP_HEADER)).tap()
    await expect(
      element(by.text("Call our VA benefits hotline. We're here Monday through Friday, 8:00 a.m. to 9:00 p.m. ET.")),
    ).toExist()
    await expect(element(by.id(CommonE2eIdConstants.CALL_VA_PHONE_NUMBER_ID))).toExist()
  })

  it('should display upload buttons when uploads are allowed', async () => {
    await waitFor(element(by.text('Select a file')))
      .toBeVisible()
      .whileElement(by.id(EvidenceRequestsUpdatedUIConstants.FILE_REQUEST_DETAILS_ID))
      .scroll(200, 'down')
    await expect(element(by.text('Select a file'))).toExist()
    await expect(element(by.text('Take or select photos'))).toExist()
  })
})
