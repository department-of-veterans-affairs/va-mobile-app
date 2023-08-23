import { expect, device, by, element} from 'detox'
import {loginToDemoMode, openBenefits, openClaims, openClaimsHistory } from './utils'
import { setTimeout } from 'timers/promises'
import { DateTime } from 'luxon'

export const AppealsIdConstants = {
  APPEAL_1_ID: 'Disability compensation appeal updated on November 22, 2011 Submitted June 12, 2008',
  REVIEW_PAST_EVENTS_ID: 'reviewPastEventsTestID',
  ISSUES_TAB_TEXT: 'Issues',
  STATUS_TAB_TEXT: 'Status',
  APPEALS_DETAILS_ID: 'appealsDetailsTestID',
  APPEAL_DETAILS_TEXT: 'Appeal details',
  APPEAL_TYPE_TEXT: 'Appeal for compensation',
  APPEAL_SUBMITTED_TEXT: 'Submitted June 12, 2008',
  APPEAL_NEED_HELP_NUMBER_TEXT: '800-827-1000',
  APPEAL_VISIT_VA_TEXT: 'Visit VA.gov',
}

export async function getDateWithTimeZone(dateString: string) {
  var date = DateTime.fromFormat(dateString, 'LLLL d, yyyy h:m a', {zone: 'America/Chicago'})
  var dateUTC = date.toLocal()
  var dateTime = dateUTC.toLocaleString(Object.assign(DateTime.DATETIME_FULL, {day: '2-digit'}))
  return dateTime
}

var dateWithTimeZone
beforeAll(async () => {
  await loginToDemoMode()
  await openBenefits()
  await openClaims()
  await openClaimsHistory()
})

describe('Appeals', () => {
  it('should match the appeals page design', async () => {
    await element(by.id(AppealsIdConstants.APPEAL_1_ID)).tap()
    await expect(element(by.text(AppealsIdConstants.APPEAL_TYPE_TEXT))).toExist()
    await expect(element(by.text(AppealsIdConstants.APPEAL_DETAILS_TEXT))).toExist()
    dateWithTimeZone = await getDateWithTimeZone('December 03, 2021 12:39 PM')
    await expect(element(by.text('Up to date as of ' + dateWithTimeZone))).toExist()
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
    dateWithTimeZone = await getDateWithTimeZone('December 03, 2021 12:39 PM')
    await expect(element(by.text('Up to date as of ' + dateWithTimeZone))).toExist()
    await expect(element(by.text(AppealsIdConstants.APPEAL_SUBMITTED_TEXT))).toExist()
    await expect(element(by.text('Currently on appeal'))).toExist()
    await expect(element(by.text('Service connection, ureteral stricture'))).toExist()
  })

  it('should tap on status, tap review past events, and verify the correct information is displayed', async () => {
    await element(by.text(AppealsIdConstants.STATUS_TAB_TEXT)).tap()
    await element(by.id(AppealsIdConstants.REVIEW_PAST_EVENTS_ID)).tap()
    await expect(element(by.id('VA sent you a claim decision On April 11, 2008'))).toExist()
    await expect(element(by.id('VA received your Notice of Disagreement On June 12, 2008'))).toExist()
    await expect(element(by.id('VA sent you a Statement of the Case On March 11, 2009'))).toExist()
    await expect(element(by.id('VA received your Form 9 On March 23, 2009'))).toExist()
    await expect(element(by.id('VA sent you a Supplemental Statement of the Case On January 26, 2010'))).toExist()
    await expect(element(by.id('VA sent you a Supplemental Statement of the Case On July 22, 2010'))).toExist()
    await expect(element(by.id('VA sent you a Supplemental Statement of the Case On September 26, 2011'))).toExist()
    await expect(element(by.id('Your appeal was sent to the Board of Veterans\' Appeals On November 22, 2011'))).toExist()
  })

  it('should scroll to the bottom of the appeals screen', async () => {
    await element(by.id(AppealsIdConstants.APPEALS_DETAILS_ID)).scrollTo('bottom')
  })

  it('should tap on the links in the need help section', async () => {
    if (device.getPlatform() === 'android') {
			await element(by.text(AppealsIdConstants.APPEAL_NEED_HELP_NUMBER_TEXT)).tap()
      await setTimeout(5000)
			await device.takeScreenshot('AppealsNeedHelpAndroidCallingScreen')
		} 

    await device.launchApp({newInstance: false})
    await element(by.text(AppealsIdConstants.APPEAL_VISIT_VA_TEXT)).tap()
    await element(by.text('Ok')).tap()
    await setTimeout(5000)
    await device.takeScreenshot('AppealsNeedHelpVisitVAScreen')
  })
})
