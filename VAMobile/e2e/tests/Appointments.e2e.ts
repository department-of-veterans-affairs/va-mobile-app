import { by, device, element, expect, waitFor } from 'detox'
import { DateTime } from 'luxon'
import { setTimeout } from 'timers/promises'

import { CommonE2eIdConstants, loginToDemoMode, openAppointments, openHealth } from './utils'

const todaysDate = DateTime.local()
const shortDateFormat = 'MM-dd-yyyy'

const sixtyThreeDaysLaterShort = todaysDate.plus({ days: 63 }).toFormat(shortDateFormat)
const sixtyFourDaysLaterShort = todaysDate.plus({ days: 64 }).toFormat(shortDateFormat)

const fiveMonthsEarlier = todaysDate.minus({ months: 5 }).startOf('month').startOf('day')
const threeMonthsEarlier = todaysDate.minus({ months: 3 })
const eightMonthsEarlier = todaysDate.minus({ months: 8 }).startOf('month').startOf('day')
const sixMonthsEarlier = todaysDate.minus({ months: 6 }).endOf('month').endOf('day')
const elevenMonthsEarlier = todaysDate.minus({ months: 11 }).startOf('month').startOf('day')
const nineMonthsEarlier = todaysDate.minus({ months: 9 }).endOf('month').endOf('day')
const currentYear = todaysDate.get('year')
const lastYearDateTime = todaysDate.minus({ years: 1 })
const lastYear = lastYearDateTime.get('year')

export const Appointmentse2eConstants = {
  APPOINTMENT_DESCRIPTION:
    "Here are your appointments. This list includes appointments you've requested but not yet confirmed.",
  VA_PAST_APPOINTMENT: 'To schedule another appointment, please visit VA.gov or call your VA medical center.',
  APPOINTMENT_CANCEL_REQUEST_TEXT: device.getPlatform() === 'ios' ? 'Cancel Request' : 'Cancel Request ',
}

beforeAll(async () => {
  await loginToDemoMode()
  await openHealth()
  await openAppointments()
})

describe('Appointments Screen', () => {
  it('should tap and open the appointment details links', async () => {
    await waitFor(element(by.text('Vilanisi Reddy')))
      .toBeVisible()
      .whileElement(by.id(CommonE2eIdConstants.APPOINTMENTS_SCROLL_ID))
      .scroll(200, 'down')
    await element(by.text('Vilanisi Reddy')).tap()
    if (device.getPlatform() === 'android') {
      await device.disableSynchronization()
      await element(by.id(CommonE2eIdConstants.ADD_TO_CALENDAR_ID)).atIndex(0).tap()
      await device.takeScreenshot('appointmentCalendar')
      await device.launchApp({ newInstance: false })

      await element(by.id(CommonE2eIdConstants.GET_DIRECTIONS_ID)).atIndex(0).tap()
      await element(by.text(CommonE2eIdConstants.LEAVING_APP_LEAVE_TEXT)).tap()
      await device.takeScreenshot('appointmentGetDirections')
      await device.launchApp({ newInstance: false })

      await expect(element(by.id(CommonE2eIdConstants.CALL_VA_TTY_PHONE_NUMBER_ID)).atIndex(0)).toExist()
      await expect(element(by.id(CommonE2eIdConstants.CALL_VA_PHONE_NUMBER_ID)).atIndex(0)).toExist()

      await element(by.id('UpcomingApptDetailsTestID')).scrollTo('bottom')

      await element(by.id(CommonE2eIdConstants.CALL_VA_TTY_PHONE_NUMBER_ID)).atIndex(1).tap()
      await device.takeScreenshot('appointmentCancelPhoneNumber')
      await device.launchApp({ newInstance: false })

      await element(by.id(CommonE2eIdConstants.CALL_VA_PHONE_NUMBER_ID)).atIndex(1).tap()
      await device.takeScreenshot('appointmentCancelTTY')
      await device.launchApp({ newInstance: false })
      await device.enableSynchronization()
    }
  })

  it('should cancel an appointment and dismiss the dialog', async () => {
    await element(by.id('apptDetailsBackID')).tap()
    await waitFor(element(by.text('GUARINO, ANTHONY')))
      .toBeVisible()
      .whileElement(by.id(CommonE2eIdConstants.APPOINTMENTS_SCROLL_ID))
      .scroll(200, 'down')
    await element(by.text('GUARINO, ANTHONY')).tap()
    await element(by.id('UpcomingApptDetailsTestID')).scrollTo('bottom')
    await element(by.id('Cancel request')).tap()
    await element(by.text(Appointmentse2eConstants.APPOINTMENT_CANCEL_REQUEST_TEXT)).tap()
    await expect(element(by.text('Request canceled'))).toExist()
    await element(by.text(CommonE2eIdConstants.DISMISS_TEXT)).tap()
  })

  it('verify the appointment details after cancel', async () => {
    await waitFor(element(by.text('GUARINO, ANTHONY')))
      .toBeVisible()
      .whileElement(by.id(CommonE2eIdConstants.APPOINTMENTS_SCROLL_ID))
      .scroll(200, 'down')
    await element(by.text('GUARINO, ANTHONY')).tap()
    await expect(element(by.text('Canceled request for community care'))).toExist()
    await element(by.id('apptDetailsBackID')).tap()
  })

  it('should tap on and show past appointments', async () => {
    await element(by.id(CommonE2eIdConstants.APPOINTMENTS_SCROLL_ID)).scrollTo('top')
    await element(by.id('apptsPastID')).tap()
    if (device.getPlatform() === 'android') {
      await expect(element(by.text(CommonE2eIdConstants.DATE_RANGE_INITIAL_TEXT)).atIndex(0)).toExist()
    } else {
      await expect(element(by.text(CommonE2eIdConstants.DATE_RANGE_INITIAL_TEXT))).toExist()
    }
  })

  it('should show the same date field after cancelling', async () => {
    await element(by.id('getDateRangeTestID')).tap()
    if (device.getPlatform() === 'android') {
      await element(by.text(CommonE2eIdConstants.DATE_RANGE_INITIAL_TEXT)).atIndex(0).tap()
      await element(by.id('pastApptsDateRangeCancelID')).tap()
      await expect(element(by.text(CommonE2eIdConstants.DATE_RANGE_INITIAL_TEXT)).atIndex(0)).toExist()
    } else {
      await element(by.id('pastApptsDateRangeCancelID')).tap()
      await expect(element(by.text(CommonE2eIdConstants.DATE_RANGE_INITIAL_TEXT))).toExist()
    }
  })

  it('past appts: three months - five months earlier verification', async () => {
    await element(by.id('getDateRangeTestID')).tap()
    await element(
      by.text(
        fiveMonthsEarlier.monthShort +
          ' ' +
          fiveMonthsEarlier.year +
          ' - ' +
          threeMonthsEarlier.monthShort +
          ' ' +
          threeMonthsEarlier.year,
      ),
    ).tap()
    await element(by.text('Done')).tap()
  })

  it('past appts: six months - eight months earlier verification', async () => {
    await element(by.id('getDateRangeTestID')).tap()
    await element(
      by.text(
        eightMonthsEarlier.monthShort +
          ' ' +
          eightMonthsEarlier.year +
          ' - ' +
          sixMonthsEarlier.monthShort +
          ' ' +
          sixMonthsEarlier.year,
      ),
    ).tap()
    await element(by.text('Done')).tap()
  })

  it('past appts: eleven months - nine months earlier verification', async () => {
    await element(by.id('getDateRangeTestID')).tap()
    await element(
      by.text(
        elevenMonthsEarlier.monthShort +
          ' ' +
          elevenMonthsEarlier.year +
          ' - ' +
          nineMonthsEarlier.monthShort +
          ' ' +
          nineMonthsEarlier.year,
      ),
    ).tap()
    await element(by.text('Done')).tap()
  })

  it('past appts: current year verification', async () => {
    await element(by.id('getDateRangeTestID')).tap()
    await element(by.text('All of ' + currentYear)).tap()
    await element(by.text('Done')).tap()
  })

  it('past appts: previous year verification', async () => {
    await element(by.id('getDateRangeTestID')).tap()
    await element(by.text('All of ' + lastYear)).tap()
    await element(by.text('Done')).tap()
  })
})
