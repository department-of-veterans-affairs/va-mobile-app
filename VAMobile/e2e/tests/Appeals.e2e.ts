import { by, device, element, expect, waitFor } from 'detox'
import { setTimeout } from 'timers/promises'

import { CommonE2eIdConstants, loginToDemoMode, openBenefits, openClaims, openClaimsHistory } from './utils'

export const AppealsIdConstants = {
  APPEAL_1_ID: 'Disability compensation appeal updated on November 22, 2011 Received June 12, 2008',
  REVIEW_PAST_EVENTS_ID: 'reviewPastEventsTestID',
  ISSUES_TAB_TEXT: 'Issues',
  STATUS_TAB_TEXT: 'Status',
  APPEALS_DETAILS_ID: 'appealsDetailsTestID',
  APPEAL_DETAILS_TEXT: 'Appeal details',
  APPEAL_TYPE_TEXT: 'Appeal for compensation',
  APPEAL_SUBMITTED_TEXT: 'Received June 12, 2008',
  APPEAL_NEED_HELP_NUMBER_TEXT: '800-827-1000',
  APPEAL_VISIT_VA_TEXT: 'Go to VA.gov',
  APPEAL_UP_TO_DATE_ID: 'appealsUpToDateTestID',
}

beforeAll(async () => {
  await loginToDemoMode()
  await openBenefits()
  await openClaims()
  await openClaimsHistory()
})

describe('Appeals', () => {
  it('should match the appeals page design', async () => {
    //Uncomment when 8101 is completed
    /*await element(by.id('claimsHistoryID')).scrollTo('bottom')
    await element(by.id('next-page')).tap()
    await element(by.id('claimsHistoryID')).scrollTo('bottom')
    await element(by.id('next-page')).tap()
    await element(by.id('claimsHistoryID')).scrollTo('bottom')
    await element(by.id('next-page')).tap()
    await element(by.id('claimsHistoryID')).scrollTo('bottom')
    await element(by.id('next-page')).tap()*/
    await waitFor(element(by.id(AppealsIdConstants.APPEAL_1_ID)))
      .toBeVisible()
      .whileElement(by.id('claimsHistoryID'))
      .scroll(300, 'down')
    await element(by.id(AppealsIdConstants.APPEAL_1_ID)).tap()
    await expect(element(by.text(AppealsIdConstants.APPEAL_TYPE_TEXT))).toExist()
    await expect(element(by.text(AppealsIdConstants.APPEAL_DETAILS_TEXT))).toExist()
    await expect(element(by.id(AppealsIdConstants.APPEAL_UP_TO_DATE_ID))).toExist()
    await expect(element(by.text(AppealsIdConstants.APPEAL_SUBMITTED_TEXT))).toExist()
    await expect(element(by.text(AppealsIdConstants.STATUS_TAB_TEXT))).toExist()
    await expect(element(by.text(AppealsIdConstants.ISSUES_TAB_TEXT))).toExist()
    await expect(element(by.id(AppealsIdConstants.REVIEW_PAST_EVENTS_ID))).toExist()
    await expect(element(by.text('Current status'))).toExist()
    await expect(element(by.text('Appeals ahead of you'))).toExist()
    await expect(element(by.text('23,446'))).toExist()
    await expect(element(by.text('Need help?'))).toExist()
    await expect(element(by.text(AppealsIdConstants.APPEAL_NEED_HELP_NUMBER_TEXT))).toExist()
    await expect(element(by.text(AppealsIdConstants.APPEAL_VISIT_VA_TEXT))).toExist()
  })

  it('should tap on issues and verify the issues page design', async () => {
    await element(by.text(AppealsIdConstants.ISSUES_TAB_TEXT)).tap()
    await expect(element(by.text(AppealsIdConstants.APPEAL_TYPE_TEXT))).toExist()
    await expect(element(by.text(AppealsIdConstants.APPEAL_DETAILS_TEXT))).toExist()
    await expect(element(by.id(AppealsIdConstants.APPEAL_UP_TO_DATE_ID))).toExist()
    await expect(element(by.text(AppealsIdConstants.APPEAL_SUBMITTED_TEXT))).toExist()
    await expect(element(by.text('Currently on appeal'))).toExist()
    await expect(element(by.text('Service connection, ureteral stricture'))).toExist()
  })

  it('verify review past events information', async () => {
    await element(by.text(AppealsIdConstants.STATUS_TAB_TEXT)).tap()
    await element(by.id(AppealsIdConstants.REVIEW_PAST_EVENTS_ID)).tap()
    await expect(element(by.label(' V-A  sent you a claim decision On April 11, 2008'))).toExist()
    await expect(element(by.label(' V-A  received your Notice of Disagreement On June 12, 2008'))).toExist()
    await expect(element(by.label(' V-A  sent you a Statement of the Case On March 11, 2009'))).toExist()
    await expect(element(by.label(' V-A  received your Form 9 On March 23, 2009'))).toExist()
    await expect(element(by.label(' V-A  sent you a Supplemental Statement of the Case On January 26, 2010'))).toExist()
    await expect(element(by.label(' V-A  sent you a Supplemental Statement of the Case On July 22, 2010'))).toExist()
    await expect(
      element(by.label(' V-A  sent you a Supplemental Statement of the Case On September 26, 2011')),
    ).toExist()
    await expect(
      element(by.label("Your appeal was sent to the Board of Veterans' Appeals On November 22, 2011")),
    ).toExist()
  })

  it('should scroll to the bottom of the appeals screen', async () => {
    await element(by.id(AppealsIdConstants.APPEALS_DETAILS_ID)).scrollTo('bottom')
  })

  it('should tap on the links in the need help section', async () => {
    if (device.getPlatform() === 'android') {
      await device.disableSynchronization()
      await element(by.text(AppealsIdConstants.APPEAL_NEED_HELP_NUMBER_TEXT)).tap()
      await setTimeout(5000)
      await device.takeScreenshot('AppealsNeedHelpAndroidCallingScreen')
      await device.enableSynchronization()
    }

    await device.launchApp({ newInstance: false })
    await device.disableSynchronization()
    await element(by.text(AppealsIdConstants.APPEAL_VISIT_VA_TEXT)).tap()
    await element(by.text(CommonE2eIdConstants.LEAVING_APP_LEAVE_TEXT)).tap()
    await setTimeout(5000)
    await device.takeScreenshot('AppealsNeedHelpGoToVAScreen')
    await device.enableSynchronization()
  })
})
