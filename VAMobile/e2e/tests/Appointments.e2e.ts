import { by, device, element, expect, waitFor } from 'detox'
import { DateTime } from 'luxon'

import { CommonE2eIdConstants, loginToDemoMode, openAppointments, openHealth } from './utils'

const todaysDate = DateTime.local()
const dateFieldFormat = 'MMMM dd, yyyy'

const threeMonthsEarlierFieldText = todaysDate.minus({ months: 3 }).toFormat(dateFieldFormat)
const todaysDateFieldText = todaysDate.toFormat(dateFieldFormat)

export const Appointmentse2eConstants = {
  APPOINTMENT_DESCRIPTION:
    "Here are your appointments. This list includes appointments you've requested but not yet confirmed.",
  VA_PAST_APPOINTMENT: 'To schedule another appointment, please visit VA.gov or call your VA medical center.',
  APPOINTMENT_CANCEL_REQUEST_TEXT: device.getPlatform() === 'ios' ? 'Cancel Request' : 'Cancel Request ',
  DATE_PICKER_LABEL_TEXT: 'Select a past date range',
  RESET_SELECTED_DATES_BUTTON_TEXT: 'Reset',
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
    await expect(element(by.text(Appointmentse2eConstants.DATE_PICKER_LABEL_TEXT))).toExist()
  })

  it('should show the past 3 months date range after resetting', async () => {
    await element(by.text(Appointmentse2eConstants.RESET_SELECTED_DATES_BUTTON_TEXT)).tap()
    await expect(element(by.text(threeMonthsEarlierFieldText))).toExist()
    await expect(element(by.text(todaysDateFieldText))).toExist()
  })

  it('should show the native calendar date picker when the From field is tapped', async () => {
    await element(by.id('datePickerFromFieldTestId')).tap()
    await expect(element(by.id('datePickerFromFieldTestId-nativeCalendar'))).toExist()
    await element(by.id('datePickerFromFieldTestId')).tap()
  })

  it('should show the native calendar date picker when the To field is tapped', async () => {
    await element(by.id('datePickerToFieldTestId')).tap()
    await expect(element(by.id('datePickerToFieldTestId-nativeCalendar'))).toExist()
    await element(by.id('datePickerToFieldTestId')).tap()
  })
})
