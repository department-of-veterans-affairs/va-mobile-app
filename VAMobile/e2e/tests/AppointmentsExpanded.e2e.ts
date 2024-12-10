import { by, device, element, expect, waitFor } from 'detox'

import { CommonE2eIdConstants, loginToDemoMode, openAppointments, openHealth, toggleRemoteConfigFlag } from './utils'

export const AppointmentsExpandede2eConstants = {
  PATIENT_CANCELLATION: 'You canceled this appointment.',
  VIDEO_VISIT_PREP_ID: 'prepareForVideoVisitTestID',
  APPT_DIRECTIONS_ID: 'directionsTestID',
  VA_APPT_CANCEL_ID: 'vaLinkApptsCancelTestID',
}

const checkMedicationWording = async ({
  appointmentType,
  appointmentStatus,
  pastAppointment,
}: {
  appointmentType: string
  appointmentStatus: string
  pastAppointment: boolean
}) => {
  if (
    appointmentType === 'Phone' ||
    appointmentType === 'CC' ||
    appointmentType === 'Onsite' ||
    appointmentType === 'VA' ||
    appointmentType === 'ATLAS' ||
    appointmentType === 'GFE' ||
    appointmentType === 'Home' ||
    appointmentType === 'Claim'
  ) {
    if (
      appointmentStatus === 'Canceled' ||
      (!pastAppointment && (appointmentStatus === 'Upcoming' || appointmentStatus === 'Confirmed'))
    ) {
      await expect(element(by.text('Prepare for your appointment'))).toExist()
      if (
        appointmentType === 'Phone' ||
        appointmentType === 'CC' ||
        appointmentType === 'Onsite' ||
        appointmentType === 'VA' ||
        appointmentType === 'ATLAS' ||
        appointmentType === 'GFE' ||
        appointmentType === 'Home'
      ) {
        await expect(element(by.text('Find a full list of things to bring to your appointment'))).toExist()
      }

      if (appointmentType === 'ATLAS' || appointmentType === 'Home' || appointmentType === 'GFE') {
        await expect(element(by.text('Get your device ready to join.'))).toExist()
        await expect(element(by.id(AppointmentsExpandede2eConstants.VIDEO_VISIT_PREP_ID))).toExist()
        await waitFor(element(by.id(AppointmentsExpandede2eConstants.VIDEO_VISIT_PREP_ID)))
          .toBeVisible()
          .whileElement(by.id(pastAppointment ? 'PastApptDetailsTestID' : 'UpcomingApptDetailsTestID'))
          .scroll(300, 'down')
        await element(by.id(AppointmentsExpandede2eConstants.VIDEO_VISIT_PREP_ID)).tap()
        await expect(element(by.text('Appointments help'))).toExist()
        await element(by.text('Close')).tap()
      } else if (appointmentType === 'Claim') {
        await expect(element(by.text('You don’t need to bring anything to your exam.'))).toExist()
        await expect(
          element(
            by.text(
              'If you have any new non-VA medication records (like records from a recent surgery or illness), be sure to submit them before your appointment.',
            ),
          ),
        ).toExist()
        await expect(element(by.text('Learn more about claim exam appointments'))).toExist()
      } else {
        await expect(element(by.text('You don’t need to bring anything to your exam.'))).not.toExist()
        await expect(
          element(
            by.text(
              'If you have any new non-VA medication records (like records from a recent surgery or illness), be sure to submit them before your appointment.',
            ),
          ),
        ).not.toExist()
        await expect(element(by.text('Learn more about claim exam appointments'))).not.toExist()
        await expect(element(by.text('Get your device ready to join.'))).not.toExist()
        await expect(element(by.id(AppointmentsExpandede2eConstants.VIDEO_VISIT_PREP_ID))).not.toExist()
      }
    } else {
      await expect(element(by.text('Prepare for your appointment'))).not.toExist()
      await expect(element(by.text('Find a full list of things to bring to your appointment'))).not.toExist()
    }
  } else {
    await expect(element(by.text('Prepare for your appointment'))).not.toExist()
    await expect(element(by.text('Find a full list of things to bring to your appointment'))).not.toExist()
  }
}

const checkUpcomingApptDetails = async (
  appointmentType: string,
  appointmentStatus: string,
  pastAppointment = false,
  typeOfCare?: string,
  healthcareProvider?: string,
  clinicName?: string,
  clinicLocation?: string,
  reason?: string,
  otherDetails?: string,
  locationName?: string,
  locationAddress?: string,
) => {
  if (typeOfCare != undefined) {
    if (appointmentStatus === 'Pending') {
      await expect(element(by.text('Type of care'))).toExist()
    } else {
      await expect(element(by.text('What'))).toExist()
    }
    await expect(element(by.text(typeOfCare))).toExist()
  } else {
    await expect(element(by.text('What'))).not.toExist()
  }

  if (healthcareProvider != undefined) {
    if (appointmentType != 'CC') {
      await expect(element(by.text('Who'))).toExist()
    }
    await expect(element(by.text(healthcareProvider))).toExist()
  } else {
    await expect(element(by.text('Who'))).not.toExist()
  }

  if (clinicName != undefined) {
    await expect(element(by.text('Clinic: ' + clinicName))).toExist()
  } else {
    if (
      (appointmentType === 'Onsite' && appointmentStatus != 'Pending') ||
      appointmentType === 'Claim' ||
      appointmentType === 'VA'
    ) {
      await expect(element(by.text('Clinic: Not available'))).toExist()
    } else {
      await expect(element(by.text('Clinic: Not available'))).not.toExist()
    }
  }

  if (clinicLocation != undefined) {
    await expect(element(by.text('Location: ' + clinicLocation))).toExist()
  } else {
    if (
      (appointmentType === 'Onsite' && appointmentStatus != 'Pending') ||
      appointmentType === 'Claim' ||
      appointmentType === 'VA'
    ) {
      await expect(element(by.text('Location: Not available'))).toExist()
    } else {
      await expect(element(by.text('Location: Not available'))).not.toExist()
    }
  }

  if (reason != undefined) {
    if (appointmentStatus === 'Pending') {
      await expect(element(by.text("Details you'd like to share with your provider")))
    } else {
      await expect(element(by.text('Details you shared with your provider'))).toExist()
    }
    await expect(element(by.text('Reason: ' + reason))).toExist()
  } else {
    if (appointmentType != 'Claim' && appointmentType != 'CC') {
      if (appointmentStatus === 'Pending') {
        await expect(element(by.text("Details you'd like to share with your provider")))
      } else {
        await expect(element(by.text('Details you shared with your provider'))).toExist()
      }
      await expect(element(by.text('Reason: Not available'))).toExist()
    }
  }

  if (otherDetails != undefined) {
    if (appointmentStatus === 'Pending') {
      await expect(element(by.text("Details you'd like to share with your provider")))
    } else {
      await expect(element(by.text('Details you shared with your provider'))).toExist()
    }
    await expect(element(by.text('Other details: ' + otherDetails))).toExist()
  } else {
    if (appointmentType != 'Claim') {
      if (appointmentStatus === 'Pending') {
        await expect(element(by.text("Details you'd like to share with your provider")))
      } else {
        await expect(element(by.text('Details you shared with your provider'))).toExist()
        await expect(element(by.text('Other details: Not available'))).toExist()
      }
    }
  }

  if (locationName != undefined) {
    await expect(element(by.text(locationName))).toExist()
  } else {
    await expect(element(by.text('Where to attend'))).not.toExist()
  }

  if (locationAddress != undefined) {
    await expect(element(by.text(locationAddress))).toExist()
    if (appointmentStatus !== 'Pending' && appointmentType !== 'CC') {
      await expect(element(by.id(AppointmentsExpandede2eConstants.APPT_DIRECTIONS_ID))).toExist()
      await expect(element(by.id(CommonE2eIdConstants.CALL_VA_PHONE_NUMBER_ID)).atIndex(0)).toExist()
      await expect(element(by.id(CommonE2eIdConstants.CALL_VA_TTY_PHONE_NUMBER_ID)).atIndex(0)).toExist()
    }
  } else {
    await expect(element(by.text('Where to attend'))).not.toExist()
  }
  if (!pastAppointment) {
    if (appointmentStatus === 'Confirmed') {
      await expect(element(by.id(CommonE2eIdConstants.ADD_TO_CALENDAR_ID))).toExist()
      if (
        appointmentType === 'Atlas' ||
        appointmentType === 'Home' ||
        appointmentType === 'Onsite' ||
        appointmentType === 'Phone' ||
        appointmentType === 'CC'
      ) {
        await expect(element(by.text('Need to reschedule or cancel?'))).toExist()
        if (appointmentType === 'Atlas' || appointmentType === 'Home') {
          await expect(
            element(by.text('If you need to reschedule or cancel this appointment, call the scheduling facility.')),
          ).toExist()
        } else if (appointmentType === 'CC') {
          await expect(
            element(by.text('If you need to reschedule or cancel this appointment, call your provider.')),
          ).toExist()
        } else {
          await expect(element(by.text('If you need to reschedule or cancel this appointment, call us.'))).toExist()
        }

        if (appointmentType !== 'CC') {
          if (appointmentType != 'Phone') {
            await expect(element(by.text('Middletown VA Clinic'))).toExist()
          }
        }
        await expect(element(by.id(CommonE2eIdConstants.CALL_VA_PHONE_NUMBER_ID)).atIndex(1)).toExist()
        await expect(element(by.id(CommonE2eIdConstants.CALL_VA_TTY_PHONE_NUMBER_ID)).atIndex(1)).toExist()
      }
    } else if (appointmentStatus === 'Canceled') {
      if (
        appointmentType === 'Atlas' ||
        appointmentType === 'Home' ||
        appointmentType === 'Onsite' ||
        appointmentType === 'Phone' ||
        appointmentType === 'CC'
      ) {
        await expect(element(by.text('Need to reschedule?'))).toExist()
        if (appointmentType === 'Atlas' || appointmentType === 'Home') {
          await expect(
            element(
              by.text(
                'If you need to reschedule this appointment, call the scheduling facility or schedule a new appointment on VA.gov.',
              ),
            ),
          ).toExist()
        } else if (appointmentType === 'CC') {
          await expect(
            element(
              by.text(
                'If you need to reschedule this appointment, call your provider or schedule a new appointment on VA.gov.',
              ),
            ),
          ).toExist()
        } else {
          await expect(
            element(
              by.text('If you need to reschedule this appointment, call us or schedule a new appointment on VA.gov.'),
            ),
          ).toExist()
        }

        if (appointmentType !== 'CC') {
          if (appointmentType !== 'Phone') {
            await expect(element(by.text('Middletown VA Clinic'))).toExist()
          }
        }
        await expect(element(by.id(CommonE2eIdConstants.CALL_VA_PHONE_NUMBER_ID)).atIndex(1)).toExist()
        await expect(element(by.id(CommonE2eIdConstants.CALL_VA_TTY_PHONE_NUMBER_ID)).atIndex(1)).toExist()
        await expect(element(by.id(AppointmentsExpandede2eConstants.VA_APPT_CANCEL_ID))).toExist()
      }
    } else if (appointmentStatus === 'Pending') {
      if (appointmentType !== 'CC') {
        await expect(element(by.text('Request for appointment'))).toExist()
        await expect(element(by.text('05/16/2024 in the afternoon'))).toExist()
      } else {
        await expect(element(by.text('Request for community care')))
        await expect(element(by.text('05/16/2024 in the morning'))).toExist()
        await expect(element(by.text('Scheduling facility'))).toExist()
        await expect(element(by.text('This facility will contact you if we need more information about your request.')))
        await expect(element(by.text('Denver VA Medical Center'))).toExist()
      }
      await expect(
        element(
          by.text(
            "We'll try to schedule your appointment in the next 2 business days. Check back here or call your facility for updates.",
          ),
        ),
      ).toExist()
      await expect(element(by.text('Preferred date and timeframe'))).toExist()
      await expect(element(by.text('Cancel request'))).toExist()
    }
  }
  if (pastAppointment && appointmentStatus === 'Confirmed') {
    await expect(element(by.text('This appointment happened in the past.'))).toExist()
    if (
      appointmentType === 'Atlas' ||
      appointmentType === 'Home' ||
      appointmentType === 'Onsite' ||
      appointmentType === 'Phone' ||
      appointmentType === 'CC'
    ) {
      await expect(element(by.text('Need to schedule another appointment?'))).toExist()
      if (appointmentType === 'Atlas' || appointmentType === 'Home') {
        await expect(
          element(
            by.text(
              'If you need to schedule another appointment, call the scheduling facility or schedule a new appointment on VA.gov.',
            ),
          ),
        ).toExist()
      } else if (appointmentType === 'CC') {
        await expect(
          element(
            by.text(
              'If you need to schedule another appointment, call your provider or schedule a new appointment on VA.gov.',
            ),
          ),
        ).toExist()
      } else {
        await expect(
          element(
            by.text('If you need to schedule another appointment, call us or schedule a new appointment on VA.gov.'),
          ),
        ).toExist()
      }

      if (appointmentType != 'Phone' && appointmentType != 'CC') {
        await expect(element(by.text('Middletown VA Clinic'))).toExist()
      }
      await expect(element(by.id(CommonE2eIdConstants.CALL_VA_PHONE_NUMBER_ID)).atIndex(1)).toExist()
      await expect(element(by.id(CommonE2eIdConstants.CALL_VA_TTY_PHONE_NUMBER_ID)).atIndex(1)).toExist()
    }
  }
  await checkMedicationWording({ appointmentType, appointmentStatus, pastAppointment })

  await element(by.text('Appointments')).tap()
}

const scrollToThenTap = async (text: string, pastAppointment: string) => {
  //Add back in when pagination is fixed
  if (
    text === 'Sami Alsahhar - HOME - Canceled' ||
    text === 'At VA Palo Alto Health Care System' ||
    text === 'At Hampton VA Medical Center'
  ) {
    await element(by.id(CommonE2eIdConstants.APPOINTMENTS_SCROLL_ID)).scrollTo('bottom')
    await element(by.id(CommonE2eIdConstants.NEXT_PAGE_ID)).tap()
  }
  if (pastAppointment !== '') {
    try {
      await waitFor(element(by.text(text)))
        .toBeVisible()
        .whileElement(by.id(CommonE2eIdConstants.APPOINTMENTS_SCROLL_ID))
        .scroll(250, 'down')
    } catch (ex) {
      await waitFor(element(by.text(text)))
        .toBeVisible()
        .whileElement(by.id(CommonE2eIdConstants.APPOINTMENTS_SCROLL_ID))
        .scroll(250, 'up')
    }
  } else {
    await waitFor(element(by.text(text)))
      .toBeVisible()
      .whileElement(by.id(CommonE2eIdConstants.APPOINTMENTS_SCROLL_ID))
      .scroll(300, 'down')

    try {
      await waitFor(element(by.text(text)))
        .toBeVisible()
        .whileElement(by.id(CommonE2eIdConstants.APPOINTMENTS_SCROLL_ID))
        .scroll(250, 'down')
    } catch (ex) {
      await waitFor(element(by.text(text)))
        .toBeVisible()
        .whileElement(by.id(CommonE2eIdConstants.APPOINTMENTS_SCROLL_ID))
        .scroll(250, 'up')
    }
  }
  await element(by.text(text)).tap()
}

export async function apppointmentVerification(pastAppointment = false) {
  let pastAppointmentString = ''
  if (pastAppointment) {
    pastAppointmentString = 'Past: '
  }

  it(pastAppointmentString + 'verify confirmed CC appt', async () => {
    if (pastAppointment) {
      await element(by.text('Health')).atIndex(0).tap()
      await openAppointments()
      await waitFor(element(by.text('Upcoming')))
        .toExist()
        .withTimeout(10000)
      await element(by.id(CommonE2eIdConstants.APPOINTMENTS_SCROLL_ID)).scrollTo('top')
      await element(by.text('Past')).tap()
    }
    await scrollToThenTap('Vilanisi Reddy', pastAppointmentString)
    if (!pastAppointment) {
      await expect(element(by.text('Ask your provider how to attend this appointment.'))).toExist()
      await expect(element(by.text('Community care appointment'))).toExist()
    } else {
      await expect(element(by.text('Past community care appointment'))).toExist()
    }
    await checkUpcomingApptDetails(
      'CC',
      'Confirmed',
      pastAppointment,
      'Podiatry',
      'Vilanisi Reddy',
      undefined,
      undefined,
      'Test',
      'instructions to veteran.  xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx123',
      undefined,
      '2341 North Ave',
    )
  })

  it(pastAppointmentString + 'verify canceled CC appt', async () => {
    await scrollToThenTap('Jim Smith', pastAppointmentString)
    await expect(element(by.text('Canceled community care appointment'))).toExist()
    await expect(element(by.text(AppointmentsExpandede2eConstants.PATIENT_CANCELLATION))).toExist()

    await checkUpcomingApptDetails(
      'CC',
      'Canceled',
      pastAppointment,
      'Podiatry',
      'Jim Smith',
      undefined,
      undefined,
      undefined,
      'Smoke test 5/21 - 1',
      undefined,
      '2341 North Ave',
    )
  })

  it(pastAppointmentString + 'verify pending CC appt', async () => {
    await scrollToThenTap('GUARINO, ANTHONY', pastAppointmentString)
    await checkUpcomingApptDetails(
      'CC',
      'Pending',
      pastAppointment,
      'Podiatry',
      'GUARINO, ANTHONY',
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
    )
  })

  it(pastAppointmentString + 'verify confirmed VA video connect - Onsite appt', async () => {
    if (pastAppointment) {
      await scrollToThenTap('Sami Alsahhar - Onsite - Confirmed', pastAppointmentString)
      await expect(element(by.text('Past video appointment at VA location'))).toExist()
      await expect(element(by.text('This appointment happened in the past')))
    }

    if (!pastAppointment) {
      await scrollToThenTap('Sami Alsahhar - Onsite - Confirmed', pastAppointmentString)
      await expect(element(by.text('Video appointment at VA location'))).toExist()
      await expect(element(by.text('Join this appointment at a VA facility.'))).toExist()
    } else {
      await expect(element(by.text('Past video appointment at VA location'))).toExist()
    }
    await expect(element(by.text('Sami Alsahhar - Onsite - Confirmed'))).toExist()
    await checkUpcomingApptDetails(
      'Onsite',
      'Confirmed',
      pastAppointment,
      'Mental Health',
      'Sami Alsahhar - Onsite - Confirmed',
      undefined,
      undefined,
      undefined,
      undefined,
      'Middletown VA Clinic',
      '4337 North Union Road',
    )
  })

  it(pastAppointmentString + 'verify canceled VA video connect - Onsite appt', async () => {
    await scrollToThenTap('Sami Alsahhar - Onsite - Canceled', pastAppointmentString)
    await expect(element(by.text(AppointmentsExpandede2eConstants.PATIENT_CANCELLATION))).toExist()
    await expect(element(by.text('Canceled video appointment at VA location'))).toExist()
    await expect(
      element(by.text('If you need to reschedule this appointment, call us or schedule a new appointment on VA.gov.')),
    ).toExist()
    await checkUpcomingApptDetails(
      'Onsite',
      'Canceled',
      pastAppointment,
      'Mental Health',
      'Sami Alsahhar - Onsite - Canceled',
      undefined,
      undefined,
      undefined,
      undefined,
      'Middletown VA Clinic',
      '4337 North Union Road',
    )
  })

  it(pastAppointmentString + 'verify pending VA video connect - Onsite appt', async () => {
    await element(by.text('Health')).atIndex(0).tap()
    await openAppointments()
    if (pastAppointment) {
      await element(by.text('Past')).tap()
      if (device.getPlatform() === 'android') {
        await element(by.text(CommonE2eIdConstants.DATE_RANGE_INITIAL_TEXT)).atIndex(1).tap()
      } else {
        await element(by.text(CommonE2eIdConstants.DATE_RANGE_INITIAL_TEXT)).atIndex(0).tap()
      }
      await element(by.text('All of 2023')).tap()
      await element(by.text('Done')).tap()
    }
    await scrollToThenTap('Sami Alsahhar - Onsite - Pending', pastAppointmentString)
    await expect(element(by.text('How you prefer to attend'))).toExist()
    await expect(element(by.text('Video'))).toExist()
    await checkUpcomingApptDetails(
      'Onsite',
      'Pending',
      pastAppointment,
      'Mental Health',
      undefined,
      undefined,
      undefined,
      'Test',
      undefined,
      'Middletown VA Clinic',
      '4337 North Union Road',
    )
  })

  it(pastAppointmentString + 'verify confirmed VA video connect - ATLAS appt', async () => {
    await scrollToThenTap('Sami Alsahhar - ATLAS - Confirmed', pastAppointmentString)
    if (!pastAppointment) {
      await expect(
        element(
          by.text("You'll use this code to find your appointment using the computer provided at the site: 12345"),
        ),
      ).toExist()
      await expect(element(by.text('Video appointment at an ATLAS location'))).toExist()
    } else {
      await expect(element(by.text('Past video appointment at an ATLAS location'))).toExist()
    }
    await checkUpcomingApptDetails(
      'ATLAS',
      'Confirmed',
      pastAppointment,
      'Mental Health',
      'Sami Alsahhar - ATLAS - Confirmed',
      undefined,
      undefined,
      'Reason test',
      'Other details test',
      'Middletown VA Clinic',
      '4337 North Union Road',
    )
  })

  it(pastAppointmentString + 'verify canceled VA video connect - ATLAS appt', async () => {
    await scrollToThenTap('Sami Alsahhar - ATLAS - Canceled', pastAppointmentString)
    await expect(element(by.text('Canceled video appointment at an ATLAS location'))).toExist()
    await expect(element(by.text(AppointmentsExpandede2eConstants.PATIENT_CANCELLATION))).toExist()
    await expect(
      element(
        by.text(
          'If you need to reschedule this appointment, call the scheduling facility or schedule a new appointment on VA.gov.',
        ),
      ),
    ).toExist()

    await checkUpcomingApptDetails(
      'ATLAS',
      'Canceled',
      pastAppointment,
      'Mental Health',
      'Sami Alsahhar - ATLAS - Canceled',
      undefined,
      undefined,
      'Reason test',
      'Other details test',
      'Middletown VA Clinic',
      '4337 North Union Road',
    )
  })

  it(pastAppointmentString + 'verify pending VA video connect - ATLAS appt', async () => {
    await scrollToThenTap('Sami Alsahhar - ATLAS - Pending', pastAppointmentString)
    await expect(element(by.text('How you prefer to attend'))).toExist()
    await expect(element(by.text('Video'))).toExist()
    await element(by.text('Appointments')).tap()
  })

  it(pastAppointmentString + 'verify confirmed VA video connect - Home appt', async () => {
    await element(by.text('Health')).atIndex(0).tap()
    await openAppointments()
    if (pastAppointment) {
      await element(by.text('Past')).tap()
    }

    await scrollToThenTap('Sami Alsahhar - HOME - Confirmed', pastAppointmentString)
    if (!pastAppointment) {
      await expect(element(by.text('Video appointment')))
      await expect(element(by.text('You can join 30 minutes before your appointment time.'))).toExist()
    } else {
      await expect(element(by.text('Past video appointment')))
    }
    await checkUpcomingApptDetails(
      'Home',
      'Confirmed',
      pastAppointment,
      'Mental Health',
      'Sami Alsahhar - HOME - Confirmed',
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
    )
  })

  it(pastAppointmentString + 'verify canceled VA video connect - Home appt', async () => {
    await scrollToThenTap('Sami Alsahhar - HOME - Canceled', pastAppointmentString)
    await expect(element(by.text(AppointmentsExpandede2eConstants.PATIENT_CANCELLATION))).toExist()
    await expect(element(by.text('Canceled video appointment'))).toExist()
    await checkUpcomingApptDetails(
      'Home',
      'Canceled',
      pastAppointment,
      'Mental Health',
      'Sami Alsahhar - HOME - Canceled',
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
    )
  })

  it(pastAppointmentString + 'verify pending VA video connect - Home appt', async () => {
    await scrollToThenTap('Sami Alsahhar - HOME - Pending', pastAppointmentString)
    await expect(element(by.text('How you prefer to attend'))).toExist()
    await expect(element(by.text('Video'))).toExist()
    await element(by.text('Appointments')).tap()
  })

  it(pastAppointmentString + 'verify confirmed VA video connect - GFE appt', async () => {
    await scrollToThenTap('Sami Alsahhar - GFE - Confirmed', pastAppointmentString)
    if (!pastAppointment) {
      await expect(element(by.text('Video appointment'))).toExist()
      await expect(element(by.text('Join this appointment using the device we provided.'))).toExist()
    } else {
      await expect(element(by.text('Past video appointment'))).toExist()
    }
    await checkUpcomingApptDetails(
      'GFE',
      'Confirmed',
      pastAppointment,
      undefined,
      'Sami Alsahhar - GFE - Confirmed',
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
    )
  })

  it(pastAppointmentString + 'verify canceled VA video connect - GFE appt', async () => {
    await scrollToThenTap('Sami Alsahhar - GFE - Canceled', pastAppointmentString)
    await expect(element(by.text(AppointmentsExpandede2eConstants.PATIENT_CANCELLATION))).toExist()
    await checkUpcomingApptDetails(
      'GFE',
      'Canceled',
      pastAppointment,
      'Mental Health',
      'Sami Alsahhar - GFE - Canceled',
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
    )
  })

  it(pastAppointmentString + 'verify pending VA video connect - GFE appt', async () => {
    await scrollToThenTap('Sami Alsahhar - GFE - Pending', pastAppointmentString)
    await expect(element(by.text('How you prefer to attend'))).toExist()
    await expect(element(by.text('Video'))).toExist()
    await element(by.text('Appointments')).tap()
  })

  it(pastAppointmentString + 'verify canceled claim exam', async () => {
    await element(by.text('Health')).atIndex(0).tap()
    await openAppointments()
    if (!pastAppointment) {
      await waitFor(element(by.text('Upcoming')))
        .toExist()
        .withTimeout(10000)
      await element(by.id(CommonE2eIdConstants.APPOINTMENTS_SCROLL_ID)).scrollTo('bottom')
      await element(by.id(CommonE2eIdConstants.NEXT_PAGE_ID)).tap()
    } else {
      await element(by.text('Past')).tap()
      await element(by.id(CommonE2eIdConstants.APPOINTMENTS_SCROLL_ID)).scrollTo('bottom')
      await element(by.id(CommonE2eIdConstants.NEXT_PAGE_ID)).tap()
    }
    await scrollToThenTap('At Fort Collins VA Clinic - Claim - Canceled', pastAppointmentString)
    await expect(element(by.text('Fort Collins VA Clinic - Claim - Canceled canceled this appointment.'))).toExist()
    await expect(element(by.text('Need to reschedule?'))).toExist()
    await expect(
      element(by.text('Call the compensation and pension office at Fort Collins VA Clinic - Claim - Canceled.')),
    )
    await checkUpcomingApptDetails(
      'Claim',
      'Canceled',
      pastAppointment,
      undefined,
      undefined,
      'Fort Collins VA Clinic',
      'FORT COLLINS AUDIO',
      undefined,
      undefined,
      'Fort Collins VA Clinic - Claim - Canceled',
      '2509 Research Boulevard',
    )
  })

  it(pastAppointmentString + 'verify confirmed claim exam', async () => {
    await scrollToThenTap('At Fort Collins VA Clinic - Claim - Confirmed', pastAppointmentString)
    if (!pastAppointment) {
      await expect(element(by.text('Claim exam'))).toExist()
      await expect(element(by.text('Need to reschedule or cancel?'))).toExist()
      await expect(
        element(by.text('Call the compensation and pension office at Fort Collins VA Clinic - Claim - Confirmed.')),
      ).toExist()
    } else {
      await expect(element(by.text('Past claim exam'))).toExist()
    }
    await checkUpcomingApptDetails(
      'Claim',
      'Upcoming',
      pastAppointment,
      undefined,
      undefined,
      'Fort Collins VA Clinic',
      'FORT COLLINS AUDIO',
      undefined,
      undefined,
      'Fort Collins VA Clinic - Claim - Confirmed',
      '2509 Research Boulevard',
    )
  })

  it(pastAppointmentString + 'verify confirmed VA appt - provider/typeOfCare/facility/number', async () => {
    await scrollToThenTap('At San Francisco VA Health Care System', pastAppointmentString)
    if (!pastAppointment) {
      await expect(element(by.text('Cancel appointment'))).toExist()
      await expect(element(by.text('Go to San Francisco VA Health Care System for this appointment.'))).toExist()
    } else {
      await expect(element(by.text('This appointment happened in the past.'))).toExist()
    }

    await checkUpcomingApptDetails(
      'VA',
      'Confirmed',
      pastAppointment,
      'Primary Care',
      'Jane Smith',
      'DAYTSHR - Dayton VA Medical Center',
      undefined,
      'New Issue',
      undefined,
      'San Francisco VA Health Care System',
      '2360 East Pershing Boulevard',
    )
  })

  it(pastAppointmentString + 'verify confirmed VA appt - no provider/typeOfCare/address/number', async () => {
    await scrollToThenTap('At LA VA Medical Center', pastAppointmentString)
    await expect(element(by.text('Type of care not noted'))).not.toExist()
    await expect(element(by.text('Provider not noted'))).not.toExist()
    await element(by.text('Appointments')).tap()
  })

  it(pastAppointmentString + 'verify canceled VA appt - provider/typeOfCare/address/number', async () => {
    await element(by.text('Health')).atIndex(0).tap()
    await openAppointments()
    if (!pastAppointment) {
      await waitFor(element(by.text('Upcoming')))
        .toExist()
        .withTimeout(10000)
      await element(by.id(CommonE2eIdConstants.APPOINTMENTS_SCROLL_ID)).scrollTo('bottom')
      await element(by.id(CommonE2eIdConstants.NEXT_PAGE_ID)).tap()
    } else {
      await element(by.text('Past')).tap()
      await element(by.id(CommonE2eIdConstants.APPOINTMENTS_SCROLL_ID)).scrollTo('bottom')
      await element(by.id(CommonE2eIdConstants.NEXT_PAGE_ID)).tap()
    }

    await scrollToThenTap('At Central California VA Health Care System', pastAppointmentString)
    await checkUpcomingApptDetails(
      'VA',
      'Canceled',
      pastAppointment,
      'Primary Care',
      'John Smith',
      'DAYTSHR - Dayton VA Medical Center',
      undefined,
      'New Issue',
      undefined,
      'Central California VA Health Care System',
      '2360 East Pershing Boulevard',
    )
  })

  it(pastAppointmentString + 'verify canceled VA appt - provider/typeOfCare/address/number', async () => {
    await scrollToThenTap('At VA Palo Alto Health Care System', pastAppointmentString)
    await expect(element(by.text('Type of care not noted'))).not.toExist()
    await expect(element(by.text('Provider not noted'))).not.toExist()
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
      await expect(element(by.id(CommonE2eIdConstants.GET_DIRECTIONS_ID))).toExist()
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
    await expect(element(by.id(CommonE2eIdConstants.CALL_VA_PHONE_NUMBER_ID)).atIndex(0)).toExist()
    await expect(element(by.id(CommonE2eIdConstants.CALL_VA_TTY_PHONE_NUMBER_ID)).atIndex(0)).toExist()
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
      await expect(element(by.id(CommonE2eIdConstants.GET_DIRECTIONS_ID))).toExist()
    }
    await expect(element(by.id(CommonE2eIdConstants.CALL_VA_PHONE_NUMBER_ID)).atIndex(0)).toExist()
    await expect(element(by.id(CommonE2eIdConstants.CALL_VA_TTY_PHONE_NUMBER_ID)).atIndex(0)).toExist()
    await element(by.text('Appointments')).tap()
  })

  it(pastAppointmentString + 'verify canceled VA appt - no name/address/phone & directions link', async () => {
    await element(by.text('Health')).atIndex(0).tap()
    await openAppointments()
    if (!pastAppointment) {
      await waitFor(element(by.text('Upcoming')))
        .toExist()
        .withTimeout(10000)
      await element(by.id(CommonE2eIdConstants.APPOINTMENTS_SCROLL_ID)).scrollTo('bottom')
      await element(by.id(CommonE2eIdConstants.NEXT_PAGE_ID)).tap()
      await element(by.id(CommonE2eIdConstants.APPOINTMENTS_SCROLL_ID)).scrollTo('bottom')
      await element(by.id(CommonE2eIdConstants.NEXT_PAGE_ID)).tap()
    } else {
      await element(by.text('Past')).tap()
      await element(by.id(CommonE2eIdConstants.APPOINTMENTS_SCROLL_ID)).scrollTo('bottom')
      await element(by.id(CommonE2eIdConstants.NEXT_PAGE_ID)).tap()
      await element(by.id(CommonE2eIdConstants.APPOINTMENTS_SCROLL_ID)).scrollTo('bottom')
      await element(by.id(CommonE2eIdConstants.NEXT_PAGE_ID)).tap()
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
      await expect(element(by.id(CommonE2eIdConstants.GET_DIRECTIONS_ID))).toExist()
    }
    await expect(element(by.text('Go to VA.gov to find your VA facility'))).toExist()
    await element(by.text('Appointments')).tap()
  })

  it(pastAppointmentString + 'verify canceled VA appt - no address/phone/directions', async () => {
    await scrollToThenTap('Valente Nihad', pastAppointmentString)
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
    await scrollToThenTap('Sakari Rina', pastAppointmentString)
    await expect(
      element(
        by.text(
          "We can't show your health care facility's address right now. Try again later. Or call your facility to get the address.",
        ),
      ),
    ).toExist()
    await expect(element(by.id(CommonE2eIdConstants.CALL_VA_PHONE_NUMBER_ID)).atIndex(0)).toExist()
    await expect(element(by.id(CommonE2eIdConstants.CALL_VA_TTY_PHONE_NUMBER_ID)).atIndex(0)).toExist()
    await element(by.text('Appointments')).tap()
  })

  it(pastAppointmentString + 'verify upcoming VA appt - no name/address/directions', async () => {
    await scrollToThenTap('At Hampton VA Medical Center', pastAppointmentString)
    await expect(
      element(
        by.text(
          "We can't show your health care facility's address right now. Try again later. Or call your facility to get the address.",
        ),
      ),
    ).toExist()
    await expect(element(by.id(CommonE2eIdConstants.CALL_VA_PHONE_NUMBER_ID)).atIndex(0)).toExist()
    await expect(element(by.id(CommonE2eIdConstants.CALL_VA_TTY_PHONE_NUMBER_ID)).atIndex(0)).toExist()
    await element(by.text('Appointments')).tap()
  })

  it(pastAppointmentString + 'verify canceled VA appt - no name/address/phone/directions', async () => {
    await element(by.text('Health')).atIndex(0).tap()
    await openAppointments()
    if (!pastAppointment) {
      await waitFor(element(by.text('Upcoming')))
        .toExist()
        .withTimeout(10000)
      await element(by.id(CommonE2eIdConstants.APPOINTMENTS_SCROLL_ID)).scrollTo('bottom')
      await element(by.id(CommonE2eIdConstants.NEXT_PAGE_ID)).tap()
      await element(by.id(CommonE2eIdConstants.APPOINTMENTS_SCROLL_ID)).scrollTo('bottom')
      await element(by.id(CommonE2eIdConstants.NEXT_PAGE_ID)).tap()
      await element(by.id(CommonE2eIdConstants.APPOINTMENTS_SCROLL_ID)).scrollTo('bottom')
      await element(by.id(CommonE2eIdConstants.NEXT_PAGE_ID)).tap()
    } else {
      await element(by.text('Past')).tap()
      await element(by.id(CommonE2eIdConstants.APPOINTMENTS_SCROLL_ID)).scrollTo('bottom')
      await element(by.id(CommonE2eIdConstants.NEXT_PAGE_ID)).tap()
      await element(by.id(CommonE2eIdConstants.APPOINTMENTS_SCROLL_ID)).scrollTo('bottom')
      await element(by.id(CommonE2eIdConstants.NEXT_PAGE_ID)).tap()
      await element(by.id(CommonE2eIdConstants.APPOINTMENTS_SCROLL_ID)).scrollTo('bottom')
      await element(by.id(CommonE2eIdConstants.NEXT_PAGE_ID)).tap()
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

  it(pastAppointmentString + 'verify confirmed phone appt', async () => {
    await scrollToThenTap('Phone consultation-Confirmed', pastAppointmentString)
    if (!pastAppointment) {
      await expect(element(by.text('Phone appointment'))).toExist()
      await expect(element(by.text('Your provider will call you.'))).toExist()
    } else {
      await expect(element(by.text('Past phone appointment'))).toExist()
    }
    await checkUpcomingApptDetails(
      'Phone',
      'Confirmed',
      pastAppointment,
      'Phone consultation-Confirmed',
      'John Smith',
      undefined,
      undefined,
      'routine-follow-up',
      undefined,
      undefined,
      undefined,
    )
  })

  it(pastAppointmentString + 'verify canceled phone appt', async () => {
    await scrollToThenTap('Phone consultation-Canceled', pastAppointmentString)
    await expect(element(by.text(AppointmentsExpandede2eConstants.PATIENT_CANCELLATION))).toExist()
    await checkUpcomingApptDetails(
      'Phone',
      'Canceled',
      pastAppointment,
      'Phone consultation-Canceled',
      'John Smith',
      undefined,
      undefined,
      'routine-follow-up',
      undefined,
      undefined,
      undefined,
    )
  })

  it(pastAppointmentString + 'verify pending phone appt', async () => {
    await scrollToThenTap('Phone consultation-Pending', pastAppointmentString)
    await expect(element(by.text('How you prefer to attend'))).toExist()
    await expect(element(by.text('Phone'))).toExist()
    await expect(element(by.text('Facility'))).toExist()
    await expect(element(by.text('Test clinic 2'))).toExist()
    await element(by.text('Appointments')).tap()
  })
}

beforeAll(async () => {
  await toggleRemoteConfigFlag(CommonE2eIdConstants.IN_APP_REVIEW_TOGGLE_TEXT)
  await loginToDemoMode()
  await openHealth()
  await openAppointments()
  await waitFor(element(by.text('Upcoming')))
    .toExist()
    .withTimeout(10000)
})

describe(':ios: Appointments Screen Expansion', () => {
  apppointmentVerification()
  apppointmentVerification(true)
})
