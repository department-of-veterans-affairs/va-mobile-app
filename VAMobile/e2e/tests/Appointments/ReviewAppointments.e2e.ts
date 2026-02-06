import { by, device, element, expect, waitFor } from 'detox'

import { CommonE2eIdConstants, loginToDemoMode, openAppointments, openHealth } from '../utils'

export const Appointmentse2eConstants = {
  APPOINTMENT_DESCRIPTION:
    "Here are your appointments. This list includes appointments you've requested but not yet confirmed.",
  VA_PAST_APPOINTMENT: 'To schedule another appointment, please visit VA.gov or call your VA medical center.',
  APPOINTMENT_CANCEL_REQUEST_TEXT: device.getPlatform() === 'ios' ? 'Cancel Request' : 'Cancel Request ',
  DATE_PICKER_LABEL_TEXT: 'Select a past date range',
  RESET_SELECTED_DATES_BUTTON_TEXT: 'Reset',
  WHAT_TO_BRING: 'Find out what to bring to your appointment',
  WEBVIEW_BACK_BUTTON_ID: 'webviewBack',
}

beforeAll(async () => {
  await loginToDemoMode()
  await openHealth()
  await openAppointments()
})

describe('Review Upcoming Appointments', () => {
  it('should tap and open the appointment details links', async () => {
    await waitFor(element(by.text('Vilanisi Reddy')))
      .toBeVisible()
      .whileElement(by.id(CommonE2eIdConstants.APPOINTMENTS_SCROLL_ID))
      .scroll(200, 'down')
    await element(by.text('Vilanisi Reddy')).tap()
    if (device.getPlatform() === 'android') {
      // Add appointment to Calendar
      await device.disableSynchronization()
      await element(by.id(CommonE2eIdConstants.ADD_TO_CALENDAR_ID)).atIndex(0).tap()
      await device.launchApp({ newInstance: false })

      // Get directions
      await element(by.id(CommonE2eIdConstants.GET_DIRECTIONS_ID)).atIndex(0).tap()
      await element(by.text(CommonE2eIdConstants.LEAVING_APP_LEAVE_TEXT)).tap()
      await device.launchApp({ newInstance: false })

      await element(by.id('UpcomingApptDetailsTestID')).scrollTo('bottom')

      // Get info about what to bring to appointment
      await element(by.id('whatToBringLinkTestID')).tap()
      await element(by.id(Appointmentse2eConstants.WEBVIEW_BACK_BUTTON_ID)).tap()

      // Call VA phone numbers
      await expect(element(by.id(CommonE2eIdConstants.CALL_VA_TTY_PHONE_NUMBER_ID)).atIndex(0)).toExist()
      await expect(element(by.id(CommonE2eIdConstants.CALL_VA_PHONE_NUMBER_ID)).atIndex(0)).toExist()

      await element(by.id(CommonE2eIdConstants.CALL_VA_TTY_PHONE_NUMBER_ID)).atIndex(1).tap()
      await device.launchApp({ newInstance: false })

      await element(by.id(CommonE2eIdConstants.CALL_VA_PHONE_NUMBER_ID)).atIndex(1).tap()
      await device.launchApp({ newInstance: false })
      await device.enableSynchronization()
    }
  })
})

describe('Cancel an Upcoming Appointment', () => {
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
})

describe('Review Past Appointments', () => {
  it('should open and view appointment details', async () => {
    await element(by.id('apptsPastID')).tap()
    await waitFor(element(by.text('Sami Alsahhar - Onsite - Confirmed')))
      .toBeVisible()
      .whileElement(by.id(CommonE2eIdConstants.APPOINTMENTS_SCROLL_ID))
      .scroll(200, 'down')
    await element(by.text('Sami Alsahhar - Onsite - Confirmed')).tap()

    // Verify Appoinment details
    await expect(element(by.text('Past video appointment at VA location'))).toExist()
    await expect(element(by.text('This appointment happened in the past.'))).toExist()

    await expect(element(by.text('What'))).toExist()
    await expect(element(by.text('Mental Health'))).toExist()

    await expect(element(by.text('Who'))).toExist()
    await expect(element(by.text('Sami Alsahhar - Onsite - Confirmed'))).toExist()

    await expect(element(by.text('Where to attend'))).toExist()
    await expect(element(by.text('Middletown VA Clinic'))).toExist()
    await expect(element(by.text('4337 North Union Road'))).toExist()
    await expect(element(by.text('Middletown, OH 45005-5211'))).toExist()

    await element(by.id('PastApptDetailsTestID')).scrollTo('bottom')

    await expect(element(by.id(CommonE2eIdConstants.GET_DIRECTIONS_ID))).toExist()
    await expect(element(by.id(CommonE2eIdConstants.CALL_VA_TTY_PHONE_NUMBER_ID)).atIndex(0)).toExist()
    await expect(element(by.id(CommonE2eIdConstants.CALL_VA_PHONE_NUMBER_ID)).atIndex(0)).toExist()

    await expect(element(by.text('Clinic: Not available'))).toExist()
    await expect(element(by.text('Location: Not available'))).toExist()

    await expect(element(by.text('Details you shared with your provider'))).toExist()
    await expect(element(by.text('Reason: Not available'))).toExist()
    await expect(element(by.text('Other details: Not available'))).toExist()

    await expect(element(by.text('Need to schedule another appointment?'))).toExist()
    await expect(
      element(by.text('If you need to schedule another appointment, call us or schedule a new appointment on VA.gov.')),
    ).toExist()
    await expect(element(by.id(CommonE2eIdConstants.CALL_VA_TTY_PHONE_NUMBER_ID)).atIndex(1)).toExist()
    await expect(element(by.id(CommonE2eIdConstants.CALL_VA_PHONE_NUMBER_ID)).atIndex(1)).toExist()
  })

  it(':android: should tap and open the appointment details links', async () => {
    // Get directions
    await device.disableSynchronization()
    await element(by.id(CommonE2eIdConstants.GET_DIRECTIONS_ID)).atIndex(0).tap()
    await element(by.text(CommonE2eIdConstants.LEAVING_APP_LEAVE_TEXT)).tap()
    await device.launchApp({ newInstance: false })

    // Call VA phone numbers
    await expect(element(by.id(CommonE2eIdConstants.CALL_VA_TTY_PHONE_NUMBER_ID)).atIndex(0)).toExist()
    await expect(element(by.id(CommonE2eIdConstants.CALL_VA_PHONE_NUMBER_ID)).atIndex(0)).toExist()

    await element(by.id(CommonE2eIdConstants.CALL_VA_TTY_PHONE_NUMBER_ID)).atIndex(1).tap()
    await device.launchApp({ newInstance: false })

    await element(by.id(CommonE2eIdConstants.CALL_VA_PHONE_NUMBER_ID)).atIndex(1).tap()
    await device.launchApp({ newInstance: false })
    await device.enableSynchronization()
  })
})
