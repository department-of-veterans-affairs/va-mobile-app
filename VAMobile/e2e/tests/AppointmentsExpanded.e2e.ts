import { by, device, element, expect, waitFor } from 'detox'

import { loginToDemoMode, openAppointments, openHealth, resetInAppReview } from './utils'

export const Appointmentse2eConstants = {
  APPOINTMENT_DESCRIPTION:
    "Here are your appointments. This list includes appointments you've requested but not yet confirmed.",
  APPOINTMENT_4_ID: 'Pending Optometry (routine eye exam) Vilasini Reddy Request type: In-person',
  APPOINTMENT_5_ID: 'Pending Optometry (routine eye exam) Community care Request type: In-person',
  APPOINTMENT_6_ID: 'Canceled Optometry (routine eye exam) Community care Request type: In-person',
  APPOINTMENT_7_ID: 'Canceled  Community care Request type: In-person',
  APPOINTMENT_8_ID: 'Pending Primary Care Cheyenne VA Medical Center Request type: In-person',
  ADD_TO_CALENDAR_ID: 'addToCalendarTestID',
  GET_DIRECTIONS_ID: 'directionsTestID',
  PHONE_NUMBER_ASSISTANCE_LINK_ID: 'CallVATestID',
  PHONE_NUMBER_ID: 'CallTTYTestID',
  PATIENT_CANCELLATION: 'You canceled this appointment.',
  VA_PAST_APPOINTMENT: 'To schedule another appointment, please visit VA.gov or call your VA medical center.',
  DATE_RANGE_INITIAL_TEXT: 'Past 3 months',
  APPOINTMENT_CANCEL_REQUEST_TEXT: device.getPlatform() === 'ios' ? 'Cancel Request' : 'Cancel Request ',
}

const checkUpcomingApptDetails = async (appointmentType, appointmentStatus, pastAppointment = false) => {
  if (!pastAppointment) {
    if (appointmentStatus == 'Confirmed') {
      await expect(element(by.id('addToCalendarTestID'))).toExist()
      await expect(element(by.id('upcomingApptCancellationTestID'))).toExist()
    } else if (appointmentStatus == 'Canceled') {
      await expect(
        element(by.text('To schedule another appointment, please visit VA.gov or call your VA medical center.')),
      ).toExist()
    } else if (appointmentStatus == 'Pending') {
      await expect(element(by.text('Preferred type of appointment'))).toExist()
      if (appointmentType != 'Claim') {
        await expect(element(by.text('Cancel request'))).toExist()
      }
    }
  }

  if (appointmentType == 'Onsite') {
    await expect(element(by.text('VA Video Connect\r\nVA location'))).toExist()
    await expect(element(by.id('directionsTestID'))).toExist()
    await expect(element(by.id('CallVATestID')).atIndex(0)).toExist()
    await expect(element(by.id('CallTTYTestID')).atIndex(0)).toExist()
  } else if (appointmentType == 'ATLAS') {
    await expect(element(by.text('VA Video Connect\r\nATLAS location'))).toExist()
    await expect(element(by.id('directionsTestID'))).toExist()
  } else if (appointmentType === 'Home') {
    await expect(element(by.text('VA Video Connect\r\nHome'))).toExist()
  } else if (appointmentType === 'GFE') {
    await expect(element(by.text('VA Video Connect\r\nusing a VA device'))).toExist()
  } else if (appointmentType == 'VA' && !pastAppointment) {
    await expect(element(by.text('In-person appointment'))).toExist()
  } else if (appointmentType == 'Claim') {
    await expect(element(by.text('Claim exam'))).toExist()
    await expect(element(by.id('directionsTestID'))).toExist()
    await expect(element(by.id('CallVATestID'))).toExist()
    await expect(element(by.id('CallTTYTestID'))).toExist()
  } else if (appointmentType == 'Covid') {
    await expect(element(by.text('COVID-19 vaccine')))
    if (!pastAppointment) {
      await expect(element(by.id('directionsTestID'))).toExist()
    }
    await expect(element(by.id('CallVATestID')).atIndex(0)).toExist()
    await expect(element(by.id('CallTTYTestID')).atIndex(0)).toExist()
  }
  await element(by.text('Appointments')).tap()
}

const scrollToThenTap = async (text: string, pastAppointment: string) => {
  if (pastAppointment !== '') {
    try {
      await waitFor(element(by.text(text)))
        .toBeVisible()
        .whileElement(by.id('appointmentsTestID'))
        .scroll(300, 'down')
    } catch (ex) {
      await waitFor(element(by.text(text)))
        .toBeVisible()
        .whileElement(by.id('appointmentsTestID'))
        .scroll(300, 'up')
    }
  } else {
    if (
      text === 'Sami Alsahhar - HOME - Confirmed' ||
      text === 'At VA Memphis Healthcare System' ||
      text === 'At Northport VA Medical Center' ||
      text === 'At Nashville VA Medical Center'
    ) {
      await element(by.id('appointmentsTestID')).scrollTo('bottom')
      await element(by.id('next-page')).tap()
    }

    await waitFor(element(by.text(text)))
      .toBeVisible()
      .whileElement(by.id('appointmentsTestID'))
      .scroll(300, 'down')
  }
  await element(by.text(text)).tap()
}

export async function apppointmentVerification(pastAppointment = false) {
  let pastAppointmentString = ''
  if (pastAppointment) {
    pastAppointmentString = 'Past: '
  }

  it(pastAppointmentString + 'verify confirmed VA video connect - Onsite appt', async () => {
    if (pastAppointment) {
      await element(by.id('appointmentsTestID')).scrollTo('top')
      await element(by.text('Past')).tap()
      if (device.getPlatform() === 'android') {
        await element(by.text('Past 3 months')).atIndex(1).tap()
      } else {
        await element(by.text('Past 3 months')).atIndex(0).tap()
      }
      await element(by.text('All of 2023')).tap()
      await element(by.text('Done')).tap()
    }
    await scrollToThenTap('Sami Alsahhar - Onsite - Confirmed', pastAppointmentString)
    if (!pastAppointment) {
      await expect(element(by.text('How to join your video appointment'))).toExist()
      await expect(element(by.text('You must join this video meeting from the VA location listed below.'))).toExist()
    }
    await checkUpcomingApptDetails('Onsite', 'Confirmed', pastAppointment)
  })

  it(pastAppointmentString + 'verify canceled VA video connect - Onsite appt', async () => {
    await scrollToThenTap('Sami Alsahhar - Onsite - Canceled', pastAppointmentString)
    await expect(element(by.text('You canceled this appointment.'))).toExist()
    await checkUpcomingApptDetails('Onsite', 'Canceled', pastAppointment)
  })

  it(pastAppointmentString + 'verify pending VA video connect - Onsite appt', async () => {
    if (device.getPlatform() === 'ios') {
      await resetInAppReview()
      await openHealth()
      await openAppointments()
      await waitFor(element(by.text('Upcoming')))
        .toExist()
        .withTimeout(10000)
    } else {
      await element(by.text('Health')).atIndex(0).tap()
      await openAppointments()
    }
    if (pastAppointment) {
      await element(by.text('Past')).tap()
      if (device.getPlatform() === 'android') {
        await element(by.text('Past 3 months')).atIndex(1).tap()
      } else {
        await element(by.text('Past 3 months')).atIndex(0).tap()
      }
      await element(by.text('All of 2023')).tap()
      await element(by.text('Done')).tap()
    }
    await scrollToThenTap('Request type: VA Video Connect - Onsite', pastAppointmentString)
    await expect(element(by.text('The time and date of this appointment are still to be determined.'))).toExist()
    if (!pastAppointment) {
      await expect(element(by.text('How to join your video appointment'))).toExist()
    }
    await checkUpcomingApptDetails('Onsite', 'Pending', pastAppointment)
  })

  it(pastAppointmentString + 'verify confirmed VA video connect - ATLAS appt', async () => {
    await scrollToThenTap('Sami Alsahhar - ATLAS - Confirmed', pastAppointmentString)
    if (!pastAppointment) {
      await expect(element(by.text('How to join your video appointment'))).toExist()
      await expect(
        element(by.text('You must join this video meeting from the ATLAS (non-VA) location listed below.')),
      ).toExist()
      await expect(element(by.id('addToCalendarTestID'))).toExist()
    }
    await checkUpcomingApptDetails('ATLAS', 'Confirmed', pastAppointment)
  })

  it(pastAppointmentString + 'verify canceled VA video connect - ATLAS appt', async () => {
    await scrollToThenTap('Sami Alsahhar - ATLAS - Canceled', pastAppointmentString)
    await expect(element(by.text('Middletown VA Clinic canceled this appointment.'))).toExist()
    await checkUpcomingApptDetails('ATLAS', 'Canceled', pastAppointment)
  })

  it(pastAppointmentString + 'verify pending VA video connect - ATLAS appt', async () => {
    if (pastAppointment) {
      await element(by.id('appointmentsTestID')).scrollTo('top')
      await element(by.text('Past')).tap()
    }
    await scrollToThenTap('Request type: VA Video Connect - ATLAS', pastAppointmentString)
    await expect(element(by.text('The time and date of this appointment are still to be determined.'))).toExist()
    if (!pastAppointment) {
      await expect(element(by.text('How to join your video appointment'))).toExist()
    }
    await checkUpcomingApptDetails('ATLAS', 'Pending', pastAppointment)
  })

  it(pastAppointmentString + 'verify confirmed VA video connect - Home appt', async () => {
    if (device.getPlatform() === 'ios') {
      await resetInAppReview()
      await openHealth()
      await openAppointments()
      await waitFor(element(by.text('Upcoming')))
        .toExist()
        .withTimeout(10000)
    } else {
      await element(by.text('Health')).atIndex(0).tap()
      await openAppointments()
    }
    if (pastAppointment) {
      await element(by.id('appointmentsTestID')).scrollTo('top')
      await element(by.text('Past')).tap()
      if (device.getPlatform() === 'android') {
        await element(by.text('Past 3 months')).atIndex(1).tap()
      } else {
        await element(by.text('Past 3 months')).atIndex(0).tap()
      }
      await element(by.text('All of 2023')).tap()
      await element(by.text('Done')).tap()
    } else {
      await element(by.id('appointmentsTestID')).scrollTo('bottom')
    }

    await scrollToThenTap('Sami Alsahhar - HOME - Confirmed', pastAppointmentString)
    if (!pastAppointment) {
      await expect(element(by.id('addToCalendarTestID'))).toExist()
      await expect(element(by.text('How to join your virtual session'))).toExist()
      await expect(element(by.text('You can join VA Video Connect 30 minutes prior to the start time.'))).toExist()
      await expect(element(by.text('Join session'))).toExist()
      await expect(element(by.id('prepareForVideoVisitTestID'))).toExist()
      await element(by.id('prepareForVideoVisitTestID')).tap()
      await expect(element(by.text('Appointments help'))).toExist()
      await element(by.text('Close')).tap()
    }
    await checkUpcomingApptDetails('Home', 'Confirmed', pastAppointment)
  })

  it(pastAppointmentString + 'verify canceled VA video connect - Home appt', async () => {
    await scrollToThenTap('Sami Alsahhar - HOME - Canceled', pastAppointmentString)
    await expect(element(by.text('Middletown VA Clinic canceled this appointment.'))).toExist()
    await checkUpcomingApptDetails('Home', 'Canceled', pastAppointment)
  })

  it(pastAppointmentString + 'verify pending VA video connect - Home appt', async () => {
    await scrollToThenTap('Request type: VA Video Connect - Home', pastAppointmentString)
    await expect(element(by.text('The time and date of this appointment are still to be determined.'))).toExist()
    if (!pastAppointment) {
      await expect(element(by.text('How to join your virtual session'))).toExist()
      await expect(element(by.text('You can join VA Video Connect 30 minutes prior to the start time.'))).toExist()
      await expect(element(by.text('Join session'))).toExist()
      await expect(element(by.id('prepareForVideoVisitTestID'))).toExist()
      await element(by.id('prepareForVideoVisitTestID')).tap()
      await expect(element(by.text('Appointments help'))).toExist()
      await element(by.text('Close')).tap()
    }
    await checkUpcomingApptDetails('Home', 'Pending', pastAppointment)
  })

  it(pastAppointmentString + 'verify confirmed VA video connect - GFE appt', async () => {
    await scrollToThenTap('Sami Alsahhar - GFE - Confirmed', pastAppointmentString)
    if (!pastAppointment) {
      await expect(element(by.id('addToCalendarTestID'))).toExist()
      await expect(element(by.text('How to join your video appointment'))).toExist()
      await expect(
        element(by.text("To join this video appointment, you'll need to use a device we provide.")),
      ).toExist()
    }
    await checkUpcomingApptDetails('GFE', 'Confirmed', pastAppointment)
  })

  it(pastAppointmentString + 'verify canceled VA video connect - GFE appt', async () => {
    await scrollToThenTap('Sami Alsahhar - GFE - Canceled', pastAppointmentString)
    await expect(element(by.text('Middletown VA Clinic canceled this appointment.'))).toExist()
    await checkUpcomingApptDetails('GFE', 'Canceled', pastAppointment)
  })

  it(pastAppointmentString + 'verify pending VA video connect - GFE appt', async () => {
    await scrollToThenTap('Request type: VA Video Connect - GFE', pastAppointmentString)
    await expect(element(by.text('The time and date of this appointment are still to be determined.'))).toExist()
    if (!pastAppointment) {
      await expect(element(by.text('How to join your video appointment'))).toExist()
    }
    await checkUpcomingApptDetails('GFE', 'Pending', pastAppointment)
  })

  it(pastAppointmentString + 'verify confirmed claim exam', async () => {
    if (device.getPlatform() === 'ios') {
      await resetInAppReview()
      await openHealth()
      await openAppointments()
      await waitFor(element(by.text('Upcoming')))
        .toExist()
        .withTimeout(10000)
    } else {
      await element(by.text('Health')).atIndex(0).tap()
      await openAppointments()
    }
    if (pastAppointment) {
      await element(by.text('Past')).tap()
      if (device.getPlatform() === 'android') {
        await element(by.text('Past 3 months')).atIndex(1).tap()
      } else {
        await element(by.text('Past 3 months')).atIndex(0).tap()
      }
      await element(by.text('All of 2023')).tap()
      await element(by.text('Done')).tap()
    } else {
      await element(by.id('appointmentsTestID')).scrollTo('bottom')
      await element(by.id('next-page')).tap()
    }
    await scrollToThenTap('Fort Collins VA Clinic - Claim - Confirmed', pastAppointmentString)
    if (!pastAppointment) {
      await expect(element(by.id('claimExamExplanationTestID'))).toExist()
      await expect(element(by.id('addToCalendarTestID'))).toExist()
    }
    await checkUpcomingApptDetails('Claim', 'Upcoming', pastAppointment)
  })

  it(pastAppointmentString + 'verify canceled claim exam', async () => {
    await scrollToThenTap('Fort Collins VA Clinic - Claim - Canceled', pastAppointmentString)
    await expect(element(by.text('Fort Collins VA Clinic - Claim - Canceled canceled this appointment.'))).toExist()
    await checkUpcomingApptDetails('Claim', 'Canceled', pastAppointment)
  })

  it(pastAppointmentString + 'verify canceled VA Covid-19 appt', async () => {
    await element(by.id('appointmentsTestID')).scrollTo('bottom')
    await scrollToThenTap('At VA Memphis Healthcare System', pastAppointmentString)
    if (!pastAppointment) {
      await expect(element(by.text('Special instructions'))).toExist()
    }
    await expect(
      element(by.text('If you need to reschedule this appointment, call us or schedule a new appointment on VA.gov.')),
    ).toExist()
    await element(by.text('Appointments')).tap()
  })

  it(pastAppointmentString + 'verify confirmed VA Covid-19 appt', async () => {
    await element(by.id('appointmentsTestID')).scrollTo('top')
    await scrollToThenTap('At VA Long Beach Healthcare System', pastAppointmentString)
    if (!pastAppointment) {
      await expect(element(by.text('Special instructions'))).toExist()
    }
    await checkUpcomingApptDetails('Covid', 'Confirmed', pastAppointment)
  })

  it(pastAppointmentString + 'verify confirmed VA appt - provider/typeOfCare/facility/number', async () => {
    await scrollToThenTap('At San Francisco VA Health Care System', pastAppointmentString)
    await expect(element(by.text('Primary Care'))).toExist()
    await expect(element(by.text('Jane Smith'))).toExist()
    await expect(element(by.text('Details you shared with your provider'))).toExist()
    await expect(element(by.text('Reason: New Issue'))).toExist()
    if (!pastAppointment) {
      await expect(element(by.text('Cancel appointment'))).toExist()
      await expect(element(by.text('Go to San Francisco VA Health Care System for this appointment.'))).toExist()
    }
    await expect(element(by.id('CallVATestID')).atIndex(0)).toExist()
    await expect(element(by.id('CallTTYTestID')).atIndex(0)).toExist()
    await expect(element(by.id('CallVATestID')).atIndex(1)).toExist()
    await expect(element(by.id('CallTTYTestID')).atIndex(1)).toExist()
    await checkUpcomingApptDetails('VA', 'Confirmed', pastAppointment)
  })

  it(pastAppointmentString + 'verify confirmed VA appt - no provider/typeOfCare/address/number', async () => {
    await scrollToThenTap('At LA VA Medical Center', pastAppointmentString)
    await expect(element(by.text('Type of care not noted'))).toExist()
    await expect(element(by.text('Provider not noted'))).toExist()
    await element(by.text('Appointments')).tap()
  })

  it(pastAppointmentString + 'verify canceled VA appt - provider/typeOfCare/address/number', async () => {
    if (device.getPlatform() === 'ios') {
      await resetInAppReview()
      await openHealth()
      await openAppointments()
      await waitFor(element(by.text('Upcoming')))
        .toExist()
        .withTimeout(10000)
    } else {
      await element(by.text('Health')).atIndex(0).tap()
      await openAppointments()
    }
    if (pastAppointment) {
      await element(by.text('Past')).tap()
      if (device.getPlatform() === 'android') {
        await element(by.text('Past 3 months')).atIndex(1).tap()
      } else {
        await element(by.text('Past 3 months')).atIndex(0).tap()
      }
      await element(by.text('All of 2023')).tap()
      await element(by.text('Done')).tap()
    } else {
      await element(by.id('appointmentsTestID')).scrollTo('bottom')
      await element(by.id('next-page')).tap()
      await element(by.id('appointmentsTestID')).scrollTo('bottom')
      await element(by.id('next-page')).tap()
    }
    await scrollToThenTap('At Central California VA Health Care System', pastAppointmentString)
    await expect(element(by.text('You canceled this appointment.'))).toExist()
    await expect(element(by.text('Primary Care'))).toExist()
    await expect(element(by.text('John Smith'))).toExist()
    await expect(element(by.text('Details you shared with your provider'))).toExist()
    await expect(element(by.text('Reason: New Issue'))).toExist()
    await expect(
      element(by.text('If you need to reschedule this appointment, call us or schedule a new appointment on VA.gov.')),
    ).toExist()
    await expect(element(by.id('CallVATestID')).atIndex(0)).toExist()
    await expect(element(by.id('CallTTYTestID')).atIndex(0)).toExist()
    await expect(element(by.id('CallVATestID')).atIndex(1)).toExist()
    await expect(element(by.id('CallTTYTestID')).atIndex(1)).toExist()
    await expect(element(by.text('Go to VA.gov to schedule'))).toExist()
    await element(by.text('Appointments')).tap()
  })

  it(pastAppointmentString + 'verify canceled VA appt - provider/typeOfCare/address/number', async () => {
    await scrollToThenTap('At VA Palo Alto Health Care System', pastAppointmentString)
    await expect(element(by.text('Type of care not noted'))).toExist()
    await expect(element(by.text('Provider not noted'))).toExist()
    await element(by.text('Appointments')).tap()
  })

  it(pastAppointmentString + 'verify canceled VA appt - no address/phone number & directions', async () => {
    await scrollToThenTap('At Albany VA Medical Center', pastAppointmentString)
    await expect(
      element(
        by.text(
          "We can't show your health care facility's address or phone number right now. But you can still get directions to the facility. You can also find your facility's information on VA.gov.",
        ),
      ),
    ).toExist()
    await expect(element(by.text('Go to VA.gov to find your VA facility'))).toExist()
    await element(by.text('Appointments')).tap()
  })

  it(pastAppointmentString + 'verify upcoming VA appt - no address/phone number & directions', async () => {
    await scrollToThenTap('At Bath VA Medical Center', pastAppointmentString)
    await expect(
      element(
        by.text(
          "We can't show your health care facility's address or phone number right now. But you can still get directions to the facility. You can also find your facility's information on VA.gov.",
        ),
      ),
    ).toExist()
    if (!pastAppointment) {
      await expect(element(by.id(Appointmentse2eConstants.GET_DIRECTIONS_ID))).toExist()
    }
    await expect(element(by.text('Go to VA.gov to find your VA facility'))).toExist()
    await element(by.text('Appointments')).tap()
  })

  it(pastAppointmentString + 'verify canceled VA appt - no address/number & directions link', async () => {
    await scrollToThenTap('At Northport VA Medical Center', pastAppointmentString)
    await expect(
      element(
        by.text(
          "We can't show your health care facility's address right now. But you can still get directions to the facility. You can also call your facility to get the address.",
        ),
      ),
    ).toExist()
    await expect(element(by.id('CallVATestID')).atIndex(0)).toExist()
    await expect(element(by.id('CallTTYTestID')).atIndex(0)).toExist()
    await element(by.text('Appointments')).tap()
  })

  it(pastAppointmentString + 'verify upcoming VA appt - no address/number & directions link', async () => {
    await scrollToThenTap('At Syracuse VA Medical Center', pastAppointmentString)
    await expect(
      element(
        by.text(
          "We can't show your health care facility's address right now. But you can still get directions to the facility. You can also call your facility to get the address.",
        ),
      ),
    ).toExist()
    if (!pastAppointment) {
      await expect(element(by.id(Appointmentse2eConstants.GET_DIRECTIONS_ID))).toExist()
    }
    await expect(element(by.id('CallVATestID')).atIndex(0)).toExist()
    await expect(element(by.id('CallTTYTestID')).atIndex(0)).toExist()
    await element(by.text('Appointments')).tap()
  })

  it(pastAppointmentString + 'verify canceled VA appt - no name/address/phone & directions link', async () => {
    if (device.getPlatform() === 'ios') {
      await resetInAppReview()
      await openHealth()
      await openAppointments()
      await waitFor(element(by.text('Upcoming')))
        .toExist()
        .withTimeout(10000)
    } else {
      await element(by.text('Health')).atIndex(0).tap()
      await openAppointments()
    }
    if (pastAppointment) {
      await element(by.text('Past')).tap()
      if (device.getPlatform() === 'android') {
        await element(by.text('Past 3 months')).atIndex(1).tap()
      } else {
        await element(by.text('Past 3 months')).atIndex(0).tap()
      }
      await element(by.text('All of 2023')).tap()
      await element(by.text('Done')).tap()
    } else {
      await element(by.id('appointmentsTestID')).scrollTo('bottom')
      await element(by.id('next-page')).tap()
      await element(by.id('appointmentsTestID')).scrollTo('bottom')
      await element(by.id('next-page')).tap()
      await element(by.id('appointmentsTestID')).scrollTo('bottom')
      await element(by.id('next-page')).tap()
    }

    if (pastAppointment) {
      await element(by.text('Past')).tap()
    }
    await scrollToThenTap('John Jones', pastAppointmentString)
    await expect(
      element(
        by.text(
          "We can't show your health care facility's information right now. But you can still get directions to the facility. You can also find your facility's information on VA.gov.",
        ),
      ),
    ).toExist()
    await expect(element(by.text('Go to VA.gov to find your VA facility'))).toExist()
    await element(by.text('Appointments')).tap()
  })

  it(pastAppointmentString + 'verify upcoming VA appt - no name/address/phone & directions link', async () => {
    await scrollToThenTap('John James', pastAppointmentString)
    await expect(
      element(
        by.text(
          "We can't show your health care facility's information right now. But you can still get directions to the facility. You can also find your facility's information on VA.gov.",
        ),
      ),
    ).toExist()
    if (!pastAppointment) {
      await expect(element(by.id(Appointmentse2eConstants.GET_DIRECTIONS_ID))).toExist()
    }
    await expect(element(by.text('Go to VA.gov to find your VA facility'))).toExist()
    await element(by.text('Appointments')).tap()
  })

  it(pastAppointmentString + 'verify canceled VA appt - no address/phone/directions', async () => {
    if (pastAppointment) {
      await element(by.id('appointmentsTestID')).scrollTo('top')
      await element(by.text('Past')).tap()
    }
    await scrollToThenTap('At Houston VA Medical Center', pastAppointmentString)
    await expect(
      element(
        by.text(
          "We can't show your health care facility's address or phone number right now. Try again later. Or go to VA.gov to find your facility's information.",
        ),
      ),
    ).toExist()
    await expect(element(by.text('Go to VA.gov to find your VA facility'))).toExist()
    await element(by.text('Appointments')).tap()
  })

  it(pastAppointmentString + 'verify upcoming VA appt - no address/phone/directions', async () => {
    if (pastAppointment) {
      await element(by.id('appointmentsTestID')).scrollTo('top')
      await element(by.text('Past')).tap()
    }
    await scrollToThenTap('At Dallas VA Medical Center', pastAppointmentString)
    await expect(
      element(
        by.text(
          "We can't show your health care facility's address or phone number right now. Try again later. Or go to VA.gov to find your facility's information.",
        ),
      ),
    ).toExist()
    await expect(element(by.text('Go to VA.gov to find your VA facility'))).toExist()
    await element(by.text('Appointments')).tap()
  })

  it(pastAppointmentString + 'verify canceled VA appt - no name/address/directions', async () => {
    if (pastAppointment) {
      await element(by.id('appointmentsTestID')).scrollTo('top')
      await element(by.text('Past')).tap()
    }
    await scrollToThenTap('At Salem VA Medical Center', pastAppointmentString)
    await expect(
      element(
        by.text(
          "We can't show your health care facility's address right now. Try again later. Or call your facility to get the address.",
        ),
      ),
    ).toExist()
    await expect(element(by.id('CallVATestID')).atIndex(0)).toExist()
    await expect(element(by.id('CallTTYTestID')).atIndex(0)).toExist()
    await element(by.text('Appointments')).tap()
  })

  it(pastAppointmentString + 'verify upcoming VA appt - no name/address/directions', async () => {
    if (pastAppointment) {
      await element(by.id('appointmentsTestID')).scrollTo('top')
      await element(by.text('Past')).tap()
    }
    await scrollToThenTap('At Hampton VA Medical Center', pastAppointmentString)
    await expect(
      element(
        by.text(
          "We can't show your health care facility's address right now. Try again later. Or call your facility to get the address.",
        ),
      ),
    ).toExist()
    await expect(element(by.id('CallVATestID')).atIndex(0)).toExist()
    await expect(element(by.id('CallTTYTestID')).atIndex(0)).toExist()
    await element(by.text('Appointments')).tap()
  })

  it(pastAppointmentString + 'verify canceled VA appt - no name/address/phone/directions', async () => {
    if (device.getPlatform() === 'ios') {
      await resetInAppReview()
      await openHealth()
      await openAppointments()
      await waitFor(element(by.text('Upcoming')))
        .toExist()
        .withTimeout(10000)
    } else {
      await element(by.text('Health')).atIndex(0).tap()
      await openAppointments()
    }
    if (pastAppointment) {
      await element(by.text('Past')).tap()
      if (device.getPlatform() === 'android') {
        await element(by.text('Past 3 months')).atIndex(1).tap()
      } else {
        await element(by.text('Past 3 months')).atIndex(0).tap()
      }
      await element(by.text('All of 2023')).tap()
      await element(by.text('Done')).tap()
    } else {
      await element(by.id('appointmentsTestID')).scrollTo('bottom')
      await element(by.id('next-page')).tap()
      await element(by.id('appointmentsTestID')).scrollTo('bottom')
      await element(by.id('next-page')).tap()
      await element(by.id('appointmentsTestID')).scrollTo('bottom')
      await element(by.id('next-page')).tap()
    }
    await scrollToThenTap('Jane Jones', pastAppointmentString)
    await expect(
      element(
        by.text(
          "We can't show the health care facility's information right now. Try again later. Or go to VA.gov to find your facility's information.",
        ),
      ),
    ).toExist()
    await expect(element(by.text('Go to VA.gov to find your VA facility'))).toExist()
    await element(by.text('Appointments')).tap()
  })

  it(pastAppointmentString + 'verify upcoming VA appt - no name/address/phone/directions', async () => {
    if (pastAppointment) {
      await element(by.id('appointmentsTestID')).scrollTo('top')
      await element(by.text('Past')).tap()
    }
    await scrollToThenTap('Jim Jones', pastAppointmentString)
    await expect(
      element(
        by.text(
          "We can't show the health care facility's information right now. Try again later. Or go to VA.gov to find your facility's information.",
        ),
      ),
    ).toExist()
    await expect(element(by.text('Go to VA.gov to find your VA facility'))).toExist()
    await element(by.text('Appointments')).tap()
  })
}

beforeAll(async () => {
  await loginToDemoMode()
  await openHealth()
  await openAppointments()
  await waitFor(element(by.text('Upcoming')))
    .toExist()
    .withTimeout(10000)
})

describe('Appointments Screen Expansion', () => {
  apppointmentVerification()
  apppointmentVerification(true)
})
