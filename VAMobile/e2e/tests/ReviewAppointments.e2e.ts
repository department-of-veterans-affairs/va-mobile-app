import { by, device, element, expect, waitFor } from 'detox'

import { CommonE2eIdConstants, loginToDemoMode, openAppointments, openHealth } from './utils'

export const Appointmentse2eConstants = {
  APPOINTMENT_CANCEL_REQUEST_TEXT: device.getPlatform() === 'ios' ? 'Cancel Request' : 'Cancel Request ',
  APPT_DETAILS_BACK_ID: 'apptDetailsBackID',
  CANCEL_REQUEST_BUTTON_ID: 'Cancel request',
  CANCELLED_CC_APPT_TITLE: 'Canceled request for community care',
  CANCELLED_DIALOG_TEXT: 'Request canceled',
  CLINIC_NOT_AVAILABLE_TEXT: 'Clinic: Not available',
  DETAILS_COMMENT_TEXT: 'Other details: instructions to veteran.  xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx123',
  DETAILS_COMMENT_TEXT_2: 'Other details: Not available',
  DETAILS_REASON_TEXT: 'Reason: Test',
  DETAILS_REASON_TEXT_2: 'Reason: Not available',
  DETAILS_SHARED_HEADER: 'Details you shared with your provider',
  LOCATION_ADDRESS_CITY: 'Commerce, CA 90022',
  LOCATION_ADDRESS_CITY_2: 'Middletown, OH 45005-5211',
  LOCATION_ADDRESS_STREET: '2341 North Ave',
  LOCATION_ADDRESS_STREET_2: '4337 North Union Road',
  LOCATION_NAME: 'Outpatient Clinic',
  LOCATION_NAME_2: 'Middletown VA Clinic',
  LOCATION_NOT_AVAILABLE_TEXT: 'Location: Not available',
  LOCATION_TITLE: 'Where to attend',
  MEDICATION_WORDING_BODY:
    'Bring your insurance cards, a list of medications, and other things to share with your provider.',
  MEDICATION_WORDING_TITLE: 'Prepare for your appointment',
  PAST_APPT_BODY: 'This appointment happened in the past.',
  PAST_APPT_DETAILS_SCROLL_ID: 'PastApptDetailsTestID',
  PAST_APPT_TITLE: 'Past video appointment at VA location',
  PAST_APPTS_TAB_ID: 'apptsPastID',
  PROVIDER_INFORMATION_HEADER: 'Provider information',
  PROVIDER_TITLE: 'Who',
  SCHEDULE_BODY: 'If you need to schedule another appointment, call us or schedule a new appointment on VA.gov.',
  SCHEDULE_OR_CANCEL_BODY: 'If you need to reschedule or cancel this appointment, call your provider.',
  SCHEDULE_OR_CANCEL_HEADER: 'Need to reschedule or cancel?',
  SCHEDULE_TITLE: 'Need to schedule another appointment?',
  TYPE_OF_CARE_TEXT_1: 'Podiatry',
  TYPE_OF_CARE_TEXT_2: 'Mental Health',
  TYPE_OF_CARE_TITLE: 'What',
  UPCOMING_APPT_DETAILS_SCROLL_ID: 'UpcomingApptDetailsTestID',
  UPCOMING_CC_APPT_BODY: 'Ask your provider how to attend this appointment.',
  UPCOMING_CC_APPT_TITLE: 'Community care appointment',
  WEBVIEW_BACK_BUTTON_ID: 'webviewBack',
  WHAT_TO_BRING_ID: 'whatToBringLinkTestID',
}

beforeAll(async () => {
  await loginToDemoMode()
  await openHealth()
  await openAppointments()
})

describe('Review Upcoming Appointments', () => {
  it('should open and view appointment details', async () => {
    await waitFor(element(by.text('Vilanisi Reddy')))
      .toBeVisible()
      .whileElement(by.id(CommonE2eIdConstants.APPOINTMENTS_SCROLL_ID))
      .scroll(200, 'down')
    await element(by.text('Vilanisi Reddy')).tap()

    // Verify Appoinment details
    await expect(element(by.text(Appointmentse2eConstants.UPCOMING_CC_APPT_TITLE))).toExist()
    await expect(element(by.text(Appointmentse2eConstants.UPCOMING_CC_APPT_BODY))).toExist()
    await expect(element(by.id(CommonE2eIdConstants.ADD_TO_CALENDAR_ID))).toExist()
    await expect(element(by.text(Appointmentse2eConstants.TYPE_OF_CARE_TITLE))).toExist()
    await expect(element(by.text(Appointmentse2eConstants.TYPE_OF_CARE_TEXT_1))).toExist()
    await expect(element(by.text(Appointmentse2eConstants.PROVIDER_INFORMATION_HEADER))).toExist()
    await expect(element(by.text('Vilanisi Reddy'))).toExist()
    await expect(element(by.text(Appointmentse2eConstants.LOCATION_NAME))).toExist()
    await expect(element(by.text(Appointmentse2eConstants.LOCATION_ADDRESS_STREET))).toExist()
    await expect(element(by.text(Appointmentse2eConstants.LOCATION_ADDRESS_CITY))).toExist()
    await expect(element(by.id(CommonE2eIdConstants.GET_DIRECTIONS_ID))).toExist()
    await expect(element(by.id(CommonE2eIdConstants.CALL_VA_TTY_PHONE_NUMBER_ID)).atIndex(0)).toExist()
    await expect(element(by.id(CommonE2eIdConstants.CALL_VA_PHONE_NUMBER_ID)).atIndex(0)).toExist()

    await element(by.id(Appointmentse2eConstants.UPCOMING_APPT_DETAILS_SCROLL_ID)).scrollTo('bottom')

    await expect(element(by.text(Appointmentse2eConstants.DETAILS_SHARED_HEADER))).toExist()
    await expect(element(by.text(Appointmentse2eConstants.DETAILS_REASON_TEXT))).toExist()
    await expect(element(by.text(Appointmentse2eConstants.DETAILS_COMMENT_TEXT))).toExist()
    await expect(element(by.text(Appointmentse2eConstants.MEDICATION_WORDING_TITLE))).toExist()
    await expect(element(by.text(Appointmentse2eConstants.MEDICATION_WORDING_BODY))).toExist()
    await expect(element(by.id(Appointmentse2eConstants.WHAT_TO_BRING_ID))).toExist()
    await expect(element(by.text(Appointmentse2eConstants.SCHEDULE_OR_CANCEL_HEADER))).toExist()
    await expect(element(by.text(Appointmentse2eConstants.SCHEDULE_OR_CANCEL_BODY))).toExist()
    await expect(element(by.id(CommonE2eIdConstants.CALL_VA_TTY_PHONE_NUMBER_ID)).atIndex(1)).toExist()
    await expect(element(by.id(CommonE2eIdConstants.CALL_VA_PHONE_NUMBER_ID)).atIndex(1)).toExist()
  })

  it(':android: should tap and open the appointment details links', async () => {
    await element(by.id(Appointmentse2eConstants.UPCOMING_APPT_DETAILS_SCROLL_ID)).scrollTo('top')
    // Add appointment to Calendar
    await device.disableSynchronization()
    await element(by.id(CommonE2eIdConstants.ADD_TO_CALENDAR_ID)).atIndex(0).tap()
    await device.launchApp({ newInstance: false })

    // Get directions
    await element(by.id(CommonE2eIdConstants.GET_DIRECTIONS_ID)).atIndex(0).tap()
    await element(by.text(CommonE2eIdConstants.LEAVING_APP_LEAVE_TEXT)).tap()
    await device.launchApp({ newInstance: false })

    await element(by.id(Appointmentse2eConstants.UPCOMING_APPT_DETAILS_SCROLL_ID)).scrollTo('bottom')

    // Get info about what to bring to appointment
    await element(by.id(Appointmentse2eConstants.WHAT_TO_BRING_ID)).tap()
    await element(by.id(Appointmentse2eConstants.WEBVIEW_BACK_BUTTON_ID)).tap()

    // Call VA phone numbers
    await element(by.id(CommonE2eIdConstants.CALL_VA_TTY_PHONE_NUMBER_ID)).atIndex(1).tap()
    await device.launchApp({ newInstance: false })
    await element(by.id(CommonE2eIdConstants.CALL_VA_PHONE_NUMBER_ID)).atIndex(1).tap()
    await device.launchApp({ newInstance: false })
    await device.enableSynchronization()
  })
})

describe('Cancel an Upcoming Appointment', () => {
  it('should cancel an appointment and dismiss the dialog', async () => {
    await element(by.id(Appointmentse2eConstants.APPT_DETAILS_BACK_ID)).tap()
    await waitFor(element(by.text('GUARINO, ANTHONY')))
      .toBeVisible()
      .whileElement(by.id(CommonE2eIdConstants.APPOINTMENTS_SCROLL_ID))
      .scroll(200, 'down')
    await element(by.text('GUARINO, ANTHONY')).tap()
    await element(by.id(Appointmentse2eConstants.UPCOMING_APPT_DETAILS_SCROLL_ID)).scrollTo('bottom')
    await element(by.id(Appointmentse2eConstants.CANCEL_REQUEST_BUTTON_ID)).tap()
    await element(by.text(Appointmentse2eConstants.APPOINTMENT_CANCEL_REQUEST_TEXT)).tap()
    await expect(element(by.text(Appointmentse2eConstants.CANCELLED_DIALOG_TEXT))).toExist()
    await element(by.text(CommonE2eIdConstants.DISMISS_TEXT)).tap()
  })

  it('verify the appointment details after cancel', async () => {
    await waitFor(element(by.text('GUARINO, ANTHONY')))
      .toBeVisible()
      .whileElement(by.id(CommonE2eIdConstants.APPOINTMENTS_SCROLL_ID))
      .scroll(200, 'down')
    await element(by.text('GUARINO, ANTHONY')).tap()
    await expect(element(by.text(Appointmentse2eConstants.CANCELLED_CC_APPT_TITLE))).toExist()
    await element(by.id(Appointmentse2eConstants.APPT_DETAILS_BACK_ID)).tap()
  })
})

describe('Review Past Appointments', () => {
  it('should open and view appointment details', async () => {
    await element(by.id(Appointmentse2eConstants.PAST_APPTS_TAB_ID)).tap()
    await waitFor(element(by.text('Sami Alsahhar - Onsite - Confirmed')))
      .toBeVisible()
      .whileElement(by.id(CommonE2eIdConstants.APPOINTMENTS_SCROLL_ID))
      .scroll(200, 'down')
    await element(by.text('Sami Alsahhar - Onsite - Confirmed')).tap()

    // Verify Appoinment details
    await expect(element(by.text(Appointmentse2eConstants.PAST_APPT_TITLE))).toExist()
    await expect(element(by.text(Appointmentse2eConstants.PAST_APPT_BODY))).toExist()
    await expect(element(by.text(Appointmentse2eConstants.TYPE_OF_CARE_TITLE))).toExist()
    await expect(element(by.text(Appointmentse2eConstants.TYPE_OF_CARE_TEXT_2))).toExist()
    await expect(element(by.text(Appointmentse2eConstants.PROVIDER_TITLE))).toExist()
    await expect(element(by.text('Sami Alsahhar - Onsite - Confirmed'))).toExist()
    await expect(element(by.text(Appointmentse2eConstants.LOCATION_TITLE))).toExist()
    await expect(element(by.text(Appointmentse2eConstants.LOCATION_NAME_2))).toExist()
    await expect(element(by.text(Appointmentse2eConstants.LOCATION_ADDRESS_STREET_2))).toExist()
    await expect(element(by.text(Appointmentse2eConstants.LOCATION_ADDRESS_CITY_2))).toExist()

    await element(by.id(Appointmentse2eConstants.PAST_APPT_DETAILS_SCROLL_ID)).scrollTo('bottom')

    await expect(element(by.id(CommonE2eIdConstants.GET_DIRECTIONS_ID))).toExist()
    await expect(element(by.id(CommonE2eIdConstants.CALL_VA_TTY_PHONE_NUMBER_ID)).atIndex(0)).toExist()
    await expect(element(by.id(CommonE2eIdConstants.CALL_VA_PHONE_NUMBER_ID)).atIndex(0)).toExist()
    await expect(element(by.text(Appointmentse2eConstants.CLINIC_NOT_AVAILABLE_TEXT))).toExist()
    await expect(element(by.text(Appointmentse2eConstants.LOCATION_NOT_AVAILABLE_TEXT))).toExist()
    await expect(element(by.text(Appointmentse2eConstants.DETAILS_SHARED_HEADER))).toExist()
    await expect(element(by.text(Appointmentse2eConstants.DETAILS_REASON_TEXT_2))).toExist()
    await expect(element(by.text(Appointmentse2eConstants.DETAILS_COMMENT_TEXT_2))).toExist()
    await expect(element(by.text(Appointmentse2eConstants.SCHEDULE_TITLE))).toExist()
    await expect(element(by.text(Appointmentse2eConstants.SCHEDULE_BODY))).toExist()
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
    await element(by.id(CommonE2eIdConstants.CALL_VA_TTY_PHONE_NUMBER_ID)).atIndex(1).tap()
    await device.launchApp({ newInstance: false })

    await element(by.id(CommonE2eIdConstants.CALL_VA_PHONE_NUMBER_ID)).atIndex(1).tap()
    await device.launchApp({ newInstance: false })
    await device.enableSynchronization()
  })
})
