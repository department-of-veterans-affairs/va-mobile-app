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
  ADD_TO_CALENDAR_ID: 'addToCalendarTestID',
  GET_DIRECTIONS_ID: 'directionsTestID',
  PHONE_NUMBER_ASSISTANCE_LINK_ID: 'CallVATestID',
  PHONE_NUMBER_ID: 'CallTTYTestID',
  PATIENT_CANCELLATION: 'You canceled this appointment.',
  VA_PAST_APPOINTMENT: 'To schedule another appointment, please visit VA.gov or call your VA medical center.',
  DATE_RANGE_INITIAL_TEXT: 'Past 3 months',
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
      .whileElement(by.id('appointmentsTestID'))
      .scroll(200, 'down')
    await element(by.text('Vilanisi Reddy')).tap()
    if (device.getPlatform() === 'android') {
      await element(by.id(Appointmentse2eConstants.ADD_TO_CALENDAR_ID)).atIndex(0).tap()
      await device.takeScreenshot('appointmentCalendar')
      await device.launchApp({ newInstance: false })

      await element(by.id(Appointmentse2eConstants.GET_DIRECTIONS_ID)).atIndex(0).tap()
      await element(by.text(CommonE2eIdConstants.LEAVING_APP_LEAVE_TEXT)).tap()
      await device.takeScreenshot('appointmentGetDirections')
      await device.launchApp({ newInstance: false })

      await device.disableSynchronization()
      await element(by.id(Appointmentse2eConstants.PHONE_NUMBER_ID)).atIndex(0).tap()
      await device.takeScreenshot('appointmentVALocationPhoneNumber')
      await device.launchApp({ newInstance: false })

      await element(by.id(Appointmentse2eConstants.PHONE_NUMBER_ASSISTANCE_LINK_ID)).atIndex(0).tap()
      await device.takeScreenshot('apointmentVALocationTTY')
      await device.launchApp({ newInstance: false })

      await element(by.id('UpcomingApptDetailsTestID')).scrollTo('bottom')

      await element(by.id(Appointmentse2eConstants.PHONE_NUMBER_ID)).atIndex(1).tap()
      await device.takeScreenshot('appointmentCancelPhoneNumber')
      await device.launchApp({ newInstance: false })

      await element(by.id(Appointmentse2eConstants.PHONE_NUMBER_ASSISTANCE_LINK_ID)).atIndex(1).tap()
      await device.takeScreenshot('appointmentCancelTTY')
      await device.launchApp({ newInstance: false })
      await device.enableSynchronization()
    }
  })

  it('should cancel an appointment and dismiss the dialog', async () => {
    await element(by.text('Appointments')).tap()
    await waitFor(element(by.text('GUARINO, ANTHONY')))
      .toBeVisible()
      .whileElement(by.id('appointmentsTestID'))
      .scroll(200, 'down')
    await element(by.text('GUARINO, ANTHONY')).tap()
    await element(by.id('UpcomingApptDetailsTestID')).scrollTo('bottom')
    await element(by.id('Cancel request')).tap()
    await element(by.text(Appointmentse2eConstants.APPOINTMENT_CANCEL_REQUEST_TEXT)).tap()
    await expect(element(by.text('Request canceled'))).toExist()
    await element(by.text('Dismiss')).tap()
  })

  it('verify the appointment details after cancel', async () => {
    await waitFor(element(by.text('GUARINO, ANTHONY')))
      .toBeVisible()
      .whileElement(by.id('appointmentsTestID'))
      .scroll(200, 'down')
    await element(by.id('Canceled Optometry (routine eye exam) Vilasini Reddy Request type: In-person')).tap()
    await expect(element(by.text('Test clinic 2 canceled this appointment.'))).toExist()
    await expect(element(by.text('Canceled request for Optometry (routine eye exam) appointment'))).toExist()
    await expect(element(by.text('Vilasini Reddy'))).toExist()
    await expect(element(by.id('Test clinic 2 123 Sesame St. Cheyenne, VA 20171'))).toExist()

    if (device.getPlatform() === 'android') {
      await element(by.id(Appointmentse2eConstants.GET_DIRECTIONS_ID)).atIndex(0).tap()
      await element(by.text(CommonE2eIdConstants.LEAVING_APP_LEAVE_TEXT)).tap()
      await setTimeout(5000)
      await device.takeScreenshot('appointmentGetDirections')
      await device.launchApp({ newInstance: false })
      await expect(element(by.id(Appointmentse2eConstants.PHONE_NUMBER_ID)).atIndex(0)).toExist()
      await setTimeout(5000)
      await device.takeScreenshot('appointmentVALocationPhoneNumber')
      await device.launchApp({ newInstance: false })

      await expect(element(by.id(Appointmentse2eConstants.PHONE_NUMBER_ASSISTANCE_LINK_ID)).atIndex(0)).toExist()
      await setTimeout(5000)
      await device.takeScreenshot('apointmentVALocationTTY')
      await device.launchApp({ newInstance: false })
    }
    await element(by.id('UpcomingApptDetailsTestID')).scrollTo('bottom')

    await expect(element(by.text('Preferred date and time'))).toExist()
    await expect(element(by.text(`${sixtyThreeDaysLaterShort} in the afternoon`))).toExist()
    await expect(element(by.text(`${sixtyFourDaysLaterShort} in the afternoon`))).toExist()
    await expect(element(by.text('Preferred type of appointment'))).toExist()
    await expect(element(by.text('Office visit'))).toExist()
    await expect(element(by.text('Your contact details'))).toExist()
    await expect(element(by.text('Email: samatha.girla@va.gov'))).toExist()
    await expect(element(by.text('Phone Number: (703) 652-0000'))).toExist()
    await expect(element(by.text('Call: Afternoon,Evening,Morning'))).toExist()
    await element(by.text('Appointments')).tap()
  })

  it('should tap on and show past appointments', async () => {
    await element(by.id('appointmentsTestID')).scrollTo('top')
    await element(by.text('Past')).tap()
    if (device.getPlatform() === 'android') {
      await expect(element(by.text(Appointmentse2eConstants.DATE_RANGE_INITIAL_TEXT)).atIndex(0)).toExist()
    } else {
      await expect(element(by.text(Appointmentse2eConstants.DATE_RANGE_INITIAL_TEXT))).toExist()
    }
  })

  it('should show the same date field after cancelling', async () => {
    await element(by.id('getDateRangeTestID')).tap()
    if (device.getPlatform() === 'android') {
      await element(by.text('Past 3 months')).atIndex(0).tap()
      await element(by.text('Cancel')).tap()
      await expect(element(by.text('Past 3 months')).atIndex(0)).toExist()
    } else {
      await element(by.text('Cancel')).tap()
      await expect(element(by.text('Past 3 months'))).toExist()
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
