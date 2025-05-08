import React from 'react'

import { screen } from '@testing-library/react-native'
import { t } from 'i18next'

import {
  AppointmentAttributes,
  AppointmentStatusConstants,
  AppointmentStatusDetailTypeConsts,
  AppointmentTypeConstants,
} from 'api/types'
import { context, render } from 'testUtils'
import { a11yLabelVA } from 'utils/a11yLabel'
import { AppointmentDetailsSubType, AppointmentDetailsSubTypeConstants } from 'utils/appointments'

import VideoVAAppointment from './VideoVAAppointment'

context('VideoVAAppointment', () => {
  const defaultAppointmentAttributes: AppointmentAttributes = {
    //appointmentType and Status not used at this point in the logic, those are used in the upcoming appointments details
    appointmentType: AppointmentTypeConstants.VA_VIDEO_CONNECT_ONSITE,
    status: AppointmentStatusConstants.BOOKED,
    //fields below are used in the subcomponents
    bestTimeToCall: undefined, //pending appointments
    cancelId: '12',
    comment: 'Please arrive 20 minutes before the start of your appointment',
    friendlyLocationName: 'Johnson Clinic suite 100',
    healthcareProvider: 'Larry Bird',
    location: {
      name: 'VA Long Beach Healthcare System',
      address: {
        street: '5901 East 7th Street',
        city: 'Long Beach',
        state: 'CA',
        zipCode: '90822',
      },
      phone: {
        areaCode: '123',
        number: '456-7890',
        extension: '',
      },
      url: '',
      code: '123 code',
    },
    minutesDuration: 60,
    patientEmail: undefined, // pending appointments
    patientPhoneNumber: undefined, // pending appointments
    physicalLocation: '123 San Jacinto Ave, San Jacinto, CA 92583',
    proposedTimes: undefined, // pending appointments
    reason: 'Running a Fever',
    startDateUtc: '2021-02-06T19:53:14.000+00:00',
    statusDetail: null, // canceled appointments
    timeZone: 'America/Los_Angeles',
    typeOfCare: 'General check up',
    //fields not used below, isPending, phoneOnly, and serviceCategoryName used in the upcoming appointment details screen
    startDateLocal: '2021-02-06T18:53:14.000-01:00',
    healthcareService: undefined,
    serviceCategoryName: null,
    practitioner: undefined,
    phoneOnly: false,
    isCovidVaccine: false,
    isPending: false,
    vetextId: '600;3210206',
  }
  const initializeTestInstance = (attributes: AppointmentAttributes, subType: AppointmentDetailsSubType): void => {
    render(
      <VideoVAAppointment
        appointmentID={'1'}
        attributes={attributes}
        subType={subType}
        goBack={jest.fn}
        cancelAppointment={jest.fn}
      />,
    )
  }

  describe('VideoVAAppointment Upcoming', () => {
    it('renders correctly with no null data', () => {
      const attributes: AppointmentAttributes = {
        ...defaultAppointmentAttributes,
      }
      initializeTestInstance(attributes, AppointmentDetailsSubTypeConstants.Upcoming)
      expect(screen.getByRole('header', { name: t('appointments.videoVA.upcomingTitle') })).toBeTruthy()
      expect(screen.getByLabelText(a11yLabelVA(t('appointments.videoVA.upcomingTitle')))).toBeTruthy()
      expect(screen.getByText(t('appointments.videoVA.upcomingBody'))).toBeTruthy()
      expect(screen.getByLabelText(a11yLabelVA(t('appointments.videoVA.upcomingBody')))).toBeTruthy()

      expect(screen.getByRole('header', { name: 'Saturday, February 6, 2021\n11:53 AM PST' })).toBeTruthy()

      expect(screen.getByRole('link', { name: t('upcomingAppointments.addToCalendar') })).toBeTruthy()
      expect(screen.getByAccessibilityHint(t('upcomingAppointmentDetails.addToCalendarA11yHint'))).toBeTruthy()

      expect(screen.getByRole('header', { name: t('appointments.typeOfCare.title') })).toBeTruthy()
      expect(screen.getByText('General check up')).toBeTruthy()

      expect(screen.getByRole('header', { name: t('appointments.provider.title') })).toBeTruthy()
      expect(screen.getByText('Larry Bird')).toBeTruthy()

      expect(screen.getByRole('header', { name: t('appointments.location.title') })).toBeTruthy()
      expect(screen.getByText('VA Long Beach Healthcare System')).toBeTruthy()
      expect(screen.getByText('5901 East 7th Street')).toBeTruthy()
      expect(screen.getByText('Long Beach, CA 90822')).toBeTruthy()

      expect(screen.getByRole('link', { name: t('directions') })).toBeTruthy()
      expect(screen.getByAccessibilityHint(t('directions.a11yHint'))).toBeTruthy()

      expect(screen.getAllByRole('link', { name: '123-456-7890' })).toBeTruthy()
      expect(screen.getAllByLabelText('1 2 3 4 5 6 7 8 9 0')).toBeTruthy()
      expect(screen.getAllByRole('link', { name: t('contactVA.tty.displayText') })).toBeTruthy()
      expect(screen.getAllByLabelText(t('contactVA.tty.number.a11yLabel'))).toBeTruthy()

      expect(screen.getByText(t('appointments.clinic', { clinicName: 'Johnson Clinic suite 100' }))).toBeTruthy()
      expect(
        screen.getByText(
          t('appointments.physicalLocation', { physicalLocation: '123 San Jacinto Ave, San Jacinto, CA 92583' }),
        ),
      ).toBeTruthy()

      expect(screen.getByRole('header', { name: t('upcomingAppointmentDetails.sharedProvider') })).toBeTruthy()
      expect(
        screen.getByText(t('upcomingAppointmentDetails.reasonDetails', { reason: 'Running a Fever' })),
      ).toBeTruthy()
      expect(
        screen.getByText(
          t('upcomingAppointmentDetails.reasonComment', {
            comment: 'Please arrive 20 minutes before the start of your appointment',
          }),
        ),
      ).toBeTruthy()

      expect(screen.getByRole('header', { name: t('appointmentsTab.medicationWording.title') })).toBeTruthy()
      expect(screen.getByRole('link', { name: t('appointmentsTab.medicationWording.whatToBringLink') })).toBeTruthy()

      expect(
        screen.getByRole('header', { name: t('upcomingAppointmentDetails.doYouNeedToCancelOrReschedule') }),
      ).toBeTruthy()
      expect(
        screen.getByText(t('upcomingAppointmentDetails.doYouNeedToCancelOrReschedule.noAppCancel.body')),
      ).toBeTruthy()
    })

    it('renders correctly with null data', () => {
      const attributes: AppointmentAttributes = {
        ...defaultAppointmentAttributes,
        cancelId: undefined,
        friendlyLocationName: undefined,
        healthcareProvider: null,
        location: {
          name: '',
          address: undefined,
          phone: undefined,
          url: undefined,
          code: undefined,
        },
        physicalLocation: undefined,
        reason: null,
        typeOfCare: undefined,
      }
      initializeTestInstance(attributes, AppointmentDetailsSubTypeConstants.Upcoming)
      expect(screen.getByRole('header', { name: t('appointments.videoVA.upcomingTitle') })).toBeTruthy()
      expect(screen.getByLabelText(a11yLabelVA(t('appointments.videoVA.upcomingTitle')))).toBeTruthy()
      expect(screen.getByText(t('appointments.videoVA.upcomingBody'))).toBeTruthy()
      expect(screen.getByLabelText(a11yLabelVA(t('appointments.videoVA.upcomingBody')))).toBeTruthy()

      expect(screen.getByRole('header', { name: 'Saturday, February 6, 2021\n11:53 AM PST' })).toBeTruthy()

      expect(screen.getByRole('link', { name: t('upcomingAppointments.addToCalendar') })).toBeTruthy()
      expect(screen.getByAccessibilityHint(t('upcomingAppointmentDetails.addToCalendarA11yHint'))).toBeTruthy()

      expect(screen.getByRole('header', { name: t('appointments.location.title') })).toBeTruthy()
      expect(
        screen.getByLabelText(a11yLabelVA(t('appointments.inPersonVA.missingAddress.noDirections.noAnything'))),
      ).toBeTruthy()
      expect(screen.getByText(t('appointments.inPersonVA.missingAddress.noDirections.noAnything'))).toBeTruthy()

      expect(screen.getByRole('link', { name: t('appointments.inPersonVA.missingAddress.goToVALink') })).toBeTruthy()
      expect(screen.getByLabelText(a11yLabelVA(t('appointments.inPersonVA.missingAddress.goToVALink')))).toBeTruthy()
      expect(screen.getByAccessibilityHint(t('upcomingAppointmentDetails.findYourVAFacility.a11yHint'))).toBeTruthy()

      expect(screen.getByText(t('appointments.clinic', { clinicName: t('appointments.notAvailable') }))).toBeTruthy()
      expect(
        screen.getByText(t('appointments.physicalLocation', { physicalLocation: t('appointments.notAvailable') })),
      ).toBeTruthy()

      expect(screen.getByRole('header', { name: t('upcomingAppointmentDetails.sharedProvider') })).toBeTruthy()
      expect(
        screen.getByText(t('upcomingAppointmentDetails.reasonDetails', { reason: t('appointments.notAvailable') })),
      ).toBeTruthy()
      expect(
        screen.getByText(
          t('upcomingAppointmentDetails.reasonComment', {
            comment: 'Please arrive 20 minutes before the start of your appointment',
          }),
        ),
      ).toBeTruthy()

      expect(screen.getByRole('header', { name: t('appointmentsTab.medicationWording.title') })).toBeTruthy()
      expect(screen.getByRole('link', { name: t('appointmentsTab.medicationWording.whatToBringLink') })).toBeTruthy()

      expect(
        screen.getByRole('header', { name: t('upcomingAppointmentDetails.doYouNeedToCancelOrReschedule') }),
      ).toBeTruthy()
      expect(
        screen.getByText(t('upcomingAppointmentDetails.doYouNeedToCancelOrReschedule.noAppCancel.body')),
      ).toBeTruthy()

      expect(screen.getByRole('link', { name: t('upcomingAppointmentDetails.findYourVALocation') })).toBeTruthy()
      expect(screen.getByLabelText(a11yLabelVA(t('upcomingAppointmentDetails.findYourVALocation')))).toBeTruthy()
      expect(screen.getByAccessibilityHint(t('upcomingAppointmentDetails.findYourVALocation.a11yHint'))).toBeTruthy()
    })
  })

  describe('VideoVAAppointment Past', () => {
    it('renders correctly with no null data', () => {
      const attributes: AppointmentAttributes = {
        ...defaultAppointmentAttributes,
      }
      initializeTestInstance(attributes, AppointmentDetailsSubTypeConstants.Past)
      expect(
        screen.getByRole('header', {
          name: t('appointments.pastTitle', {
            appointmentType:
              t('appointments.videoVA.upcomingTitle').charAt(0).toLowerCase() +
              t('appointments.videoVA.upcomingTitle').slice(1),
          }),
        }),
      ).toBeTruthy()
      expect(screen.getByText(t('appointments.pastBody'))).toBeTruthy()

      expect(screen.getByRole('header', { name: 'Saturday, February 6, 2021\n11:53 AM PST' })).toBeTruthy()

      expect(screen.getByRole('header', { name: t('appointments.typeOfCare.title') })).toBeTruthy()
      expect(screen.getByText('General check up')).toBeTruthy()

      expect(screen.getByRole('header', { name: t('appointments.provider.title') })).toBeTruthy()
      expect(screen.getByText('Larry Bird')).toBeTruthy()

      expect(screen.getByRole('header', { name: t('appointments.location.title') })).toBeTruthy()
      expect(screen.getByText('VA Long Beach Healthcare System')).toBeTruthy()
      expect(screen.getByText('5901 East 7th Street')).toBeTruthy()
      expect(screen.getByText('Long Beach, CA 90822')).toBeTruthy()

      expect(screen.getByRole('link', { name: t('directions') })).toBeTruthy()
      expect(screen.getByAccessibilityHint(t('directions.a11yHint'))).toBeTruthy()

      expect(screen.getAllByRole('link', { name: '123-456-7890' })).toBeTruthy()
      expect(screen.getAllByLabelText('1 2 3 4 5 6 7 8 9 0')).toBeTruthy()
      expect(screen.getAllByRole('link', { name: t('contactVA.tty.displayText') })).toBeTruthy()
      expect(screen.getAllByLabelText(t('contactVA.tty.number.a11yLabel'))).toBeTruthy()

      expect(screen.getByText(t('appointments.clinic', { clinicName: 'Johnson Clinic suite 100' }))).toBeTruthy()
      expect(
        screen.getByText(
          t('appointments.physicalLocation', { physicalLocation: '123 San Jacinto Ave, San Jacinto, CA 92583' }),
        ),
      ).toBeTruthy()

      expect(screen.getByRole('header', { name: t('upcomingAppointmentDetails.sharedProvider') })).toBeTruthy()
      expect(
        screen.getByText(t('upcomingAppointmentDetails.reasonDetails', { reason: 'Running a Fever' })),
      ).toBeTruthy()
      expect(
        screen.getByText(
          t('upcomingAppointmentDetails.reasonComment', {
            comment: 'Please arrive 20 minutes before the start of your appointment',
          }),
        ),
      ).toBeTruthy()

      expect(screen.getByRole('header', { name: t('appointments.schedule.title') })).toBeTruthy()
      expect(screen.getByText(t('appointments.schedule.body'))).toBeTruthy()
      expect(screen.getByLabelText(a11yLabelVA(t('appointments.schedule.body')))).toBeTruthy()
      expect(screen.getByRole('link', { name: t('appointments.vaSchedule') })).toBeTruthy()
      expect(screen.getByLabelText(a11yLabelVA(t('appointments.vaSchedule')))).toBeTruthy()
    })

    it('renders correctly with null data', () => {
      const attributes: AppointmentAttributes = {
        ...defaultAppointmentAttributes,
        cancelId: undefined,
        friendlyLocationName: undefined,
        healthcareProvider: null,
        location: {
          name: '',
          address: undefined,
          phone: undefined,
          url: undefined,
          code: undefined,
        },
        physicalLocation: undefined,
        reason: null,
        typeOfCare: undefined,
      }
      initializeTestInstance(attributes, AppointmentDetailsSubTypeConstants.Past)
      expect(
        screen.getByRole('header', {
          name: t('appointments.pastTitle', {
            appointmentType:
              t('appointments.videoVA.upcomingTitle').charAt(0).toLowerCase() +
              t('appointments.videoVA.upcomingTitle').slice(1),
          }),
        }),
      ).toBeTruthy()
      expect(screen.getByText(t('appointments.pastBody'))).toBeTruthy()

      expect(screen.getByRole('header', { name: 'Saturday, February 6, 2021\n11:53 AM PST' })).toBeTruthy()

      expect(screen.getByRole('header', { name: t('appointments.location.title') })).toBeTruthy()
      expect(
        screen.getByLabelText(a11yLabelVA(t('appointments.inPersonVA.missingAddress.noDirections.noAnything'))),
      ).toBeTruthy()
      expect(screen.getByText(t('appointments.inPersonVA.missingAddress.noDirections.noAnything'))).toBeTruthy()

      expect(screen.getByRole('link', { name: t('appointments.inPersonVA.missingAddress.goToVALink') })).toBeTruthy()
      expect(screen.getByLabelText(a11yLabelVA(t('appointments.inPersonVA.missingAddress.goToVALink')))).toBeTruthy()
      expect(screen.getByAccessibilityHint(t('upcomingAppointmentDetails.findYourVAFacility.a11yHint'))).toBeTruthy()

      expect(screen.getByText(t('appointments.clinic', { clinicName: t('appointments.notAvailable') }))).toBeTruthy()
      expect(
        screen.getByText(t('appointments.physicalLocation', { physicalLocation: t('appointments.notAvailable') })),
      ).toBeTruthy()

      expect(screen.getByRole('header', { name: t('upcomingAppointmentDetails.sharedProvider') })).toBeTruthy()
      expect(
        screen.getByText(t('upcomingAppointmentDetails.reasonDetails', { reason: t('appointments.notAvailable') })),
      ).toBeTruthy()
      expect(
        screen.getByText(
          t('upcomingAppointmentDetails.reasonComment', {
            comment: 'Please arrive 20 minutes before the start of your appointment',
          }),
        ),
      ).toBeTruthy()

      expect(screen.getByRole('header', { name: t('appointments.schedule.title') })).toBeTruthy()
      expect(screen.getByText(t('appointments.schedule.body'))).toBeTruthy()
      expect(screen.getByLabelText(a11yLabelVA(t('appointments.schedule.body')))).toBeTruthy()
      expect(screen.getByRole('link', { name: t('appointments.vaSchedule') })).toBeTruthy()
      expect(screen.getByLabelText(a11yLabelVA(t('appointments.vaSchedule')))).toBeTruthy()
    })
  })

  describe('VideoVAAppointment Canceled', () => {
    it('renders correctly with no null data', () => {
      const attributes: AppointmentAttributes = {
        ...defaultAppointmentAttributes,
        status: AppointmentStatusConstants.CANCELLED,
        statusDetail: AppointmentStatusDetailTypeConsts.PATIENT,
      }
      initializeTestInstance(attributes, AppointmentDetailsSubTypeConstants.Canceled)
      expect(
        screen.getByRole('header', {
          name: t('appointments.canceledTitle', {
            appointmentType:
              t('appointments.videoVA.upcomingTitle').charAt(0).toLowerCase() +
              t('appointments.videoVA.upcomingTitle').slice(1),
          }),
        }),
      ).toBeTruthy()
      expect(
        screen.getByText(
          t('appointments.pending.cancelled.theTimeAndDate', { who: t('appointments.canceled.whoCanceled.you') }),
        ),
      ).toBeTruthy()

      expect(screen.getByRole('header', { name: 'Saturday, February 6, 2021\n11:53 AM PST' })).toBeTruthy()

      expect(screen.getByRole('header', { name: t('appointments.typeOfCare.title') })).toBeTruthy()
      expect(screen.getByText('General check up')).toBeTruthy()

      expect(screen.getByRole('header', { name: t('appointments.provider.title') })).toBeTruthy()
      expect(screen.getByText('Larry Bird')).toBeTruthy()

      expect(screen.getByRole('header', { name: t('appointments.location.title') })).toBeTruthy()
      expect(screen.getByText('VA Long Beach Healthcare System')).toBeTruthy()
      expect(screen.getByText('5901 East 7th Street')).toBeTruthy()
      expect(screen.getByText('Long Beach, CA 90822')).toBeTruthy()

      expect(screen.getByRole('link', { name: t('directions') })).toBeTruthy()
      expect(screen.getByAccessibilityHint(t('directions.a11yHint'))).toBeTruthy()

      expect(screen.getAllByRole('link', { name: '123-456-7890' })).toBeTruthy()
      expect(screen.getAllByLabelText('1 2 3 4 5 6 7 8 9 0')).toBeTruthy()
      expect(screen.getAllByRole('link', { name: t('contactVA.tty.displayText') })).toBeTruthy()
      expect(screen.getAllByLabelText(t('contactVA.tty.number.a11yLabel'))).toBeTruthy()

      expect(screen.getByText(t('appointments.clinic', { clinicName: 'Johnson Clinic suite 100' }))).toBeTruthy()
      expect(
        screen.getByText(
          t('appointments.physicalLocation', { physicalLocation: '123 San Jacinto Ave, San Jacinto, CA 92583' }),
        ),
      ).toBeTruthy()

      expect(screen.getByRole('header', { name: t('upcomingAppointmentDetails.sharedProvider') })).toBeTruthy()
      expect(
        screen.getByText(t('upcomingAppointmentDetails.reasonDetails', { reason: 'Running a Fever' })),
      ).toBeTruthy()
      expect(
        screen.getByText(
          t('upcomingAppointmentDetails.reasonComment', {
            comment: 'Please arrive 20 minutes before the start of your appointment',
          }),
        ),
      ).toBeTruthy()

      expect(screen.getByRole('header', { name: t('appointmentsTab.medicationWording.title') })).toBeTruthy()
      expect(screen.getByRole('link', { name: t('appointmentsTab.medicationWording.whatToBringLink') })).toBeTruthy()

      expect(screen.getByRole('header', { name: t('appointments.reschedule.title') })).toBeTruthy()
      expect(screen.getByText(t('appointments.reschedule.body'))).toBeTruthy()
      expect(screen.getByLabelText(a11yLabelVA(t('appointments.reschedule.body')))).toBeTruthy()

      expect(screen.getByRole('link', { name: t('appointments.vaSchedule') })).toBeTruthy()
      expect(screen.getByLabelText(a11yLabelVA(t('appointments.vaSchedule')))).toBeTruthy()
    })

    it('renders correctly with null data', () => {
      const attributes: AppointmentAttributes = {
        ...defaultAppointmentAttributes,
        status: AppointmentStatusConstants.CANCELLED,
        statusDetail: AppointmentStatusDetailTypeConsts.PATIENT,
        cancelId: undefined,
        friendlyLocationName: undefined,
        healthcareProvider: null,
        location: {
          name: '',
          address: undefined,
          phone: undefined,
          url: undefined,
          code: undefined,
        },
        physicalLocation: undefined,
        reason: null,
        typeOfCare: undefined,
      }
      initializeTestInstance(attributes, AppointmentDetailsSubTypeConstants.Canceled)
      expect(
        screen.getByRole('header', {
          name: t('appointments.canceledTitle', {
            appointmentType:
              t('appointments.videoVA.upcomingTitle').charAt(0).toLowerCase() +
              t('appointments.videoVA.upcomingTitle').slice(1),
          }),
        }),
      ).toBeTruthy()
      expect(
        screen.getByText(
          t('appointments.pending.cancelled.theTimeAndDate', { who: t('appointments.canceled.whoCanceled.you') }),
        ),
      ).toBeTruthy()

      expect(screen.getByRole('header', { name: 'Saturday, February 6, 2021\n11:53 AM PST' })).toBeTruthy()

      expect(screen.getByRole('header', { name: t('appointments.location.title') })).toBeTruthy()
      expect(
        screen.getByLabelText(a11yLabelVA(t('appointments.inPersonVA.missingAddress.noDirections.noAnything'))),
      ).toBeTruthy()
      expect(screen.getByText(t('appointments.inPersonVA.missingAddress.noDirections.noAnything'))).toBeTruthy()

      expect(screen.getByRole('link', { name: t('appointments.inPersonVA.missingAddress.goToVALink') })).toBeTruthy()
      expect(screen.getByLabelText(a11yLabelVA(t('appointments.inPersonVA.missingAddress.goToVALink')))).toBeTruthy()
      expect(screen.getByAccessibilityHint(t('upcomingAppointmentDetails.findYourVAFacility.a11yHint'))).toBeTruthy()

      expect(screen.getByText(t('appointments.clinic', { clinicName: t('appointments.notAvailable') }))).toBeTruthy()
      expect(
        screen.getByText(t('appointments.physicalLocation', { physicalLocation: t('appointments.notAvailable') })),
      ).toBeTruthy()

      expect(screen.getByRole('header', { name: t('upcomingAppointmentDetails.sharedProvider') })).toBeTruthy()
      expect(
        screen.getByText(t('upcomingAppointmentDetails.reasonDetails', { reason: t('appointments.notAvailable') })),
      ).toBeTruthy()
      expect(
        screen.getByText(
          t('upcomingAppointmentDetails.reasonComment', {
            comment: 'Please arrive 20 minutes before the start of your appointment',
          }),
        ),
      ).toBeTruthy()

      expect(screen.getByRole('header', { name: t('appointmentsTab.medicationWording.title') })).toBeTruthy()
      expect(screen.getByRole('link', { name: t('appointmentsTab.medicationWording.whatToBringLink') })).toBeTruthy()

      expect(screen.getByRole('header', { name: t('appointments.reschedule.title') })).toBeTruthy()
      expect(screen.getByText(t('appointments.reschedule.body'))).toBeTruthy()
      expect(screen.getByLabelText(a11yLabelVA(t('appointments.reschedule.body')))).toBeTruthy()

      expect(screen.getByRole('link', { name: t('appointments.vaSchedule') })).toBeTruthy()
      expect(screen.getByLabelText(a11yLabelVA(t('appointments.vaSchedule')))).toBeTruthy()
    })
  })

  describe('VideoVAAppointment Pending', () => {
    it('renders correctly with no null data', () => {
      const attributes: AppointmentAttributes = {
        ...defaultAppointmentAttributes,
        bestTimeToCall: ['Morning'],
        patientEmail: 'test@test.com',
        patientPhoneNumber: '(666) 666-6666',
        proposedTimes: [
          {
            date: '10/01/2021',
            time: 'PM',
          },
          {
            date: '',
            time: 'AM',
          },
          {
            date: '11/03/2021',
            time: 'AM',
          },
        ],
      }
      initializeTestInstance(attributes, AppointmentDetailsSubTypeConstants.Pending)
      expect(screen.getByRole('header', { name: t('appointments.request.title') })).toBeTruthy()
      expect(screen.getByText(t('appointments.pending.body'))).toBeTruthy()

      expect(screen.getByRole('header', { name: t('appointments.pending.preferredDateAndTimeFrame') })).toBeTruthy()
      expect(screen.getByText('10/01/2021 in the afternoon')).toBeTruthy()
      expect(screen.getByText('11/03/2021 in the morning')).toBeTruthy()

      expect(screen.getByRole('header', { name: t('appointments.typeOfCare.pendingTitle') })).toBeTruthy()
      expect(screen.getByText('General check up')).toBeTruthy()

      expect(screen.getByRole('header', { name: t('appointments.pending.preferredModality') })).toBeTruthy()
      expect(screen.getByText(t('video'))).toBeTruthy()

      expect(screen.getByRole('header', { name: t('appointments.canceled.whoCanceled.facility') })).toBeTruthy()
      expect(screen.getByText('VA Long Beach Healthcare System')).toBeTruthy()
      expect(screen.getByText('5901 East 7th Street')).toBeTruthy()
      expect(screen.getByText('Long Beach, CA 90822')).toBeTruthy()

      expect(screen.getByRole('link', { name: t('directions') })).toBeTruthy()
      expect(screen.getByAccessibilityHint(t('directions.a11yHint'))).toBeTruthy()

      expect(screen.getByRole('link', { name: '123-456-7890' })).toBeTruthy()
      expect(screen.getByLabelText('1 2 3 4 5 6 7 8 9 0')).toBeTruthy()
      expect(screen.getByRole('link', { name: t('contactVA.tty.displayText') })).toBeTruthy()
      expect(screen.getByLabelText(t('contactVA.tty.number.a11yLabel'))).toBeTruthy()

      expect(screen.getByRole('header', { name: t('appointments.pending.reasonTitle') })).toBeTruthy()
      expect(
        screen.getByText(t('upcomingAppointmentDetails.reasonDetails', { reason: 'Running a Fever' })),
      ).toBeTruthy()

      expect(screen.getByRole('header', { name: t('appointments.pending.yourContactInfo') })).toBeTruthy()
      expect(screen.getByText(`${t('email')}: test@test.com`)).toBeTruthy()
      expect(screen.getByText(`${t('appointmentList.phoneOnly')}: (666) 666-6666`)).toBeTruthy()
      expect(screen.getByText(t('appointments.bestTimeToCall') + 'Morning')).toBeTruthy()

      expect(screen.getByRole('button', { name: t('cancelRequest') })).toBeTruthy()
      expect(screen.getByAccessibilityHint(t('appointments.pending.cancelRequest.a11yHint'))).toBeTruthy()
    })

    it('renders correctly with null data', () => {
      const attributes: AppointmentAttributes = {
        ...defaultAppointmentAttributes,
        cancelId: undefined,
        friendlyLocationName: undefined,
        healthcareProvider: null,
        location: {
          name: '',
          address: undefined,
          phone: undefined,
          url: undefined,
          code: undefined,
        },
        physicalLocation: undefined,
        reason: null,
        typeOfCare: undefined,
      }
      initializeTestInstance(attributes, AppointmentDetailsSubTypeConstants.Pending)
      expect(screen.getByRole('header', { name: t('appointments.request.title') })).toBeTruthy()
      expect(screen.getByText(t('appointments.pending.body'))).toBeTruthy()

      expect(screen.getByRole('header', { name: t('appointments.pending.preferredDateAndTimeFrame') })).toBeTruthy()

      expect(screen.getByRole('header', { name: t('appointments.pending.preferredModality') })).toBeTruthy()
      expect(screen.getByText(t('video'))).toBeTruthy()

      expect(screen.getByRole('header', { name: t('appointments.canceled.whoCanceled.facility') })).toBeTruthy()
      expect(
        screen.getByLabelText(a11yLabelVA(t('appointments.inPersonVA.missingAddress.noDirections.noAnything'))),
      ).toBeTruthy()
      expect(screen.getByText(t('appointments.inPersonVA.missingAddress.noDirections.noAnything'))).toBeTruthy()

      expect(screen.getByRole('link', { name: t('appointments.inPersonVA.missingAddress.goToVALink') })).toBeTruthy()
      expect(screen.getByLabelText(a11yLabelVA(t('appointments.inPersonVA.missingAddress.goToVALink')))).toBeTruthy()
      expect(screen.getByAccessibilityHint(t('upcomingAppointmentDetails.findYourVAFacility.a11yHint'))).toBeTruthy()

      expect(screen.getByRole('header', { name: t('appointments.pending.reasonTitle') })).toBeTruthy()
      expect(
        screen.getByText(t('upcomingAppointmentDetails.reasonDetails', { reason: t('appointments.notAvailable') })),
      ).toBeTruthy()

      expect(screen.queryByRole('button', { name: t('cancelRequest') })).toBeFalsy()
    })
  })

  describe('VideoVAAppointment canceled pending', () => {
    it('renders correctly with no null data', () => {
      const attributes: AppointmentAttributes = {
        ...defaultAppointmentAttributes,
        status: AppointmentStatusConstants.CANCELLED,
        statusDetail: AppointmentStatusDetailTypeConsts.PATIENT,
        bestTimeToCall: ['Morning'],
        patientEmail: 'test@test.com',
        patientPhoneNumber: '(666) 666-6666',
        proposedTimes: [
          {
            date: '10/01/2021',
            time: 'PM',
          },
          {
            date: '',
            time: 'AM',
          },
          {
            date: '11/03/2021',
            time: 'AM',
          },
        ],
      }
      initializeTestInstance(attributes, AppointmentDetailsSubTypeConstants.CanceledAndPending)
      expect(screen.getByRole('header', { name: t('appointments.request.canceledTitle') })).toBeTruthy()
      expect(
        screen.getByText(t('appointments.canceled.request', { who: t('appointments.canceled.whoCanceled.you') })),
      ).toBeTruthy()

      expect(screen.getByRole('header', { name: t('appointments.pending.preferredDateAndTimeFrame') })).toBeTruthy()
      expect(screen.getByText('10/01/2021 in the afternoon')).toBeTruthy()
      expect(screen.getByText('11/03/2021 in the morning')).toBeTruthy()

      expect(screen.getByRole('header', { name: t('appointments.typeOfCare.pendingTitle') })).toBeTruthy()
      expect(screen.getByText('General check up')).toBeTruthy()

      expect(screen.getByRole('header', { name: t('appointments.pending.preferredModality') })).toBeTruthy()
      expect(screen.getByText(t('video'))).toBeTruthy()

      expect(screen.getByRole('header', { name: t('appointments.canceled.whoCanceled.facility') })).toBeTruthy()
      expect(screen.getByText('VA Long Beach Healthcare System')).toBeTruthy()
      expect(screen.getByText('5901 East 7th Street')).toBeTruthy()
      expect(screen.getByText('Long Beach, CA 90822')).toBeTruthy()

      expect(screen.getByRole('link', { name: t('directions') })).toBeTruthy()
      expect(screen.getByAccessibilityHint(t('directions.a11yHint'))).toBeTruthy()

      expect(screen.getAllByRole('link', { name: '123-456-7890' })).toBeTruthy()
      expect(screen.getAllByLabelText('1 2 3 4 5 6 7 8 9 0')).toBeTruthy()
      expect(screen.getAllByRole('link', { name: t('contactVA.tty.displayText') })).toBeTruthy()
      expect(screen.getAllByLabelText(t('contactVA.tty.number.a11yLabel'))).toBeTruthy()

      expect(screen.getByRole('header', { name: t('appointments.pending.reasonTitle') })).toBeTruthy()
      expect(
        screen.getByText(t('upcomingAppointmentDetails.reasonDetails', { reason: 'Running a Fever' })),
      ).toBeTruthy()

      expect(screen.getByRole('header', { name: t('appointments.pending.yourContactInfo') })).toBeTruthy()
      expect(screen.getByText(`${t('email')}: test@test.com`)).toBeTruthy()
      expect(screen.getByText(`${t('appointmentList.phoneOnly')}: (666) 666-6666`)).toBeTruthy()
      expect(screen.getByText(t('appointments.bestTimeToCall') + 'Morning')).toBeTruthy()

      expect(screen.getByRole('header', { name: t('appointments.reschedule.pending.title') })).toBeTruthy()
      expect(screen.getByText(t('appointments.reschedule.pending.body'))).toBeTruthy()
      expect(screen.getByLabelText(a11yLabelVA(t('appointments.reschedule.pending.body')))).toBeTruthy()

      expect(screen.getByRole('link', { name: t('appointments.vaSchedule') })).toBeTruthy()
      expect(screen.getByLabelText(a11yLabelVA(t('appointments.vaSchedule')))).toBeTruthy()
    })

    it('renders correctly with null data', () => {
      const attributes: AppointmentAttributes = {
        ...defaultAppointmentAttributes,
        status: AppointmentStatusConstants.CANCELLED,
        statusDetail: AppointmentStatusDetailTypeConsts.PATIENT,
        cancelId: undefined,
        friendlyLocationName: undefined,
        healthcareProvider: null,
        location: {
          name: '',
          address: undefined,
          phone: undefined,
          url: undefined,
          code: undefined,
        },
        physicalLocation: undefined,
        reason: null,
        typeOfCare: undefined,
      }
      initializeTestInstance(attributes, AppointmentDetailsSubTypeConstants.CanceledAndPending)
      expect(screen.getByRole('header', { name: t('appointments.request.canceledTitle') })).toBeTruthy()
      expect(
        screen.getByText(t('appointments.canceled.request', { who: t('appointments.canceled.whoCanceled.you') })),
      ).toBeTruthy()

      expect(screen.getByRole('header', { name: t('appointments.pending.preferredDateAndTimeFrame') })).toBeTruthy()

      expect(screen.getByRole('header', { name: t('appointments.pending.preferredModality') })).toBeTruthy()
      expect(screen.getByText(t('video'))).toBeTruthy()

      expect(screen.getByRole('header', { name: t('appointments.canceled.whoCanceled.facility') })).toBeTruthy()
      expect(
        screen.getByLabelText(a11yLabelVA(t('appointments.inPersonVA.missingAddress.noDirections.noAnything'))),
      ).toBeTruthy()
      expect(screen.getByText(t('appointments.inPersonVA.missingAddress.noDirections.noAnything'))).toBeTruthy()

      expect(screen.getByRole('link', { name: t('appointments.inPersonVA.missingAddress.goToVALink') })).toBeTruthy()
      expect(screen.getByLabelText(a11yLabelVA(t('appointments.inPersonVA.missingAddress.goToVALink')))).toBeTruthy()
      expect(screen.getByAccessibilityHint(t('upcomingAppointmentDetails.findYourVAFacility.a11yHint'))).toBeTruthy()

      expect(screen.getByRole('header', { name: t('appointments.pending.reasonTitle') })).toBeTruthy()
      expect(
        screen.getByText(t('upcomingAppointmentDetails.reasonDetails', { reason: t('appointments.notAvailable') })),
      ).toBeTruthy()

      expect(screen.getByRole('header', { name: t('appointments.reschedule.pending.title') })).toBeTruthy()
      expect(screen.getByText(t('appointments.reschedule.pending.body'))).toBeTruthy()
      expect(screen.getByLabelText(a11yLabelVA(t('appointments.reschedule.pending.body')))).toBeTruthy()

      expect(screen.getByRole('link', { name: t('appointments.vaSchedule') })).toBeTruthy()
      expect(screen.getByLabelText(a11yLabelVA(t('appointments.vaSchedule')))).toBeTruthy()
    })
  })
  describe('VideoVAAppointment Canceled and Canceled Pending different cancel types that are not patient', () => {
    it('canceled - clinic cancel', () => {
      const attributes: AppointmentAttributes = {
        ...defaultAppointmentAttributes,
        status: AppointmentStatusConstants.CANCELLED,
        statusDetail: AppointmentStatusDetailTypeConsts.CLINIC,
      }
      initializeTestInstance(attributes, AppointmentDetailsSubTypeConstants.Canceled)
      expect(screen.getByText(t('appointments.pending.cancelled.theTimeAndDate', { who: 'Larry Bird' }))).toBeTruthy()
    })

    it('canceled pending - clinic cancel', () => {
      const attributes: AppointmentAttributes = {
        ...defaultAppointmentAttributes,
        status: AppointmentStatusConstants.CANCELLED,
        statusDetail: AppointmentStatusDetailTypeConsts.CLINIC,
      }
      initializeTestInstance(attributes, AppointmentDetailsSubTypeConstants.CanceledAndPending)
      expect(screen.getByText(t('appointments.canceled.request', { who: 'Larry Bird' }))).toBeTruthy()
    })

    it('canceled - clinic rebook', () => {
      const attributes: AppointmentAttributes = {
        ...defaultAppointmentAttributes,
        status: AppointmentStatusConstants.CANCELLED,
        statusDetail: AppointmentStatusDetailTypeConsts.CLINIC_REBOOK,
      }
      initializeTestInstance(attributes, AppointmentDetailsSubTypeConstants.Canceled)
      expect(screen.getByText(t('appointments.pending.cancelled.theTimeAndDate', { who: 'Larry Bird' }))).toBeTruthy()
    })

    it('canceled pending - clinic rebook', () => {
      const attributes: AppointmentAttributes = {
        ...defaultAppointmentAttributes,
        status: AppointmentStatusConstants.CANCELLED,
        statusDetail: AppointmentStatusDetailTypeConsts.CLINIC_REBOOK,
      }
      initializeTestInstance(attributes, AppointmentDetailsSubTypeConstants.CanceledAndPending)
      expect(screen.getByText(t('appointments.canceled.request', { who: 'Larry Bird' }))).toBeTruthy()
    })

    it('canceled - patient rebook', () => {
      const attributes: AppointmentAttributes = {
        ...defaultAppointmentAttributes,
        status: AppointmentStatusConstants.CANCELLED,
        statusDetail: AppointmentStatusDetailTypeConsts.PATIENT_REBOOK,
      }
      initializeTestInstance(attributes, AppointmentDetailsSubTypeConstants.Canceled)
      expect(
        screen.getByText(
          t('appointments.pending.cancelled.theTimeAndDate', { who: t('appointments.canceled.whoCanceled.you') }),
        ),
      ).toBeTruthy()
    })

    it('canceled pending - patient rebook', () => {
      const attributes: AppointmentAttributes = {
        ...defaultAppointmentAttributes,
        status: AppointmentStatusConstants.CANCELLED,
        statusDetail: AppointmentStatusDetailTypeConsts.PATIENT_REBOOK,
      }
      initializeTestInstance(attributes, AppointmentDetailsSubTypeConstants.CanceledAndPending)
      expect(
        screen.getByText(t('appointments.canceled.request', { who: t('appointments.canceled.whoCanceled.you') })),
      ).toBeTruthy()
    })
  })

  describe('Partial data examples for location', () => {
    it('has directions with address and no phone', () => {
      const attributes: AppointmentAttributes = {
        ...defaultAppointmentAttributes,
        location: {
          name: 'VA Long Beach Healthcare System',
          address: {
            street: '5901 East 7th Street',
            city: 'Long Beach',
            state: 'CA',
            zipCode: '90822',
          },
          phone: undefined,
          url: '',
          code: '123 code',
        },
      }
      initializeTestInstance(attributes, AppointmentDetailsSubTypeConstants.Upcoming)
      expect(screen.getByRole('header', { name: t('appointments.location.title') })).toBeTruthy()
      expect(screen.getByText('VA Long Beach Healthcare System')).toBeTruthy()
      expect(screen.getByText('5901 East 7th Street')).toBeTruthy()
      expect(screen.getByText('Long Beach, CA 90822')).toBeTruthy()

      expect(screen.getByRole('link', { name: t('directions') })).toBeTruthy()
      expect(screen.getByAccessibilityHint(t('directions.a11yHint'))).toBeTruthy()
    })

    it('has directions with lat long, no address, and has phone', () => {
      const attributes: AppointmentAttributes = {
        ...defaultAppointmentAttributes,
        location: {
          name: 'VA Long Beach Healthcare System',
          address: undefined,
          phone: {
            areaCode: '123',
            number: '456-7890',
            extension: '',
          },
          url: '',
          code: '123 code',
          lat: 33.33,
          long: 33.33,
        },
      }
      initializeTestInstance(attributes, AppointmentDetailsSubTypeConstants.Upcoming)
      expect(screen.getByRole('header', { name: t('appointments.location.title') })).toBeTruthy()
      expect(screen.getByText('VA Long Beach Healthcare System')).toBeTruthy()
      expect(screen.getByText(t('appointments.inPersonVA.missingAddress.hasDirections.noAddressOnly'))).toBeTruthy()

      expect(screen.getByRole('link', { name: t('directions') })).toBeTruthy()
      expect(screen.getByAccessibilityHint(t('directions.a11yHint'))).toBeTruthy()

      expect(screen.getAllByRole('link', { name: '123-456-7890' })).toBeTruthy()
      expect(screen.getAllByLabelText('1 2 3 4 5 6 7 8 9 0')).toBeTruthy()
      expect(screen.getAllByRole('link', { name: t('contactVA.tty.displayText') })).toBeTruthy()
      expect(screen.getAllByLabelText(t('contactVA.tty.number.a11yLabel'))).toBeTruthy()
    })

    it('has directions with lat long, no address, no phone', () => {
      const attributes: AppointmentAttributes = {
        ...defaultAppointmentAttributes,
        location: {
          name: 'VA Long Beach Healthcare System',
          address: undefined,
          phone: undefined,
          url: '',
          code: '123 code',
          lat: 33.33,
          long: 33.33,
        },
      }
      initializeTestInstance(attributes, AppointmentDetailsSubTypeConstants.Upcoming)
      expect(screen.getByRole('header', { name: t('appointments.location.title') })).toBeTruthy()
      expect(screen.getByText('VA Long Beach Healthcare System')).toBeTruthy()
      expect(screen.getByText(t('appointments.inPersonVA.missingAddress.hasDirections.noPhone'))).toBeTruthy()

      expect(screen.getByRole('link', { name: t('directions') })).toBeTruthy()
      expect(screen.getByAccessibilityHint(t('directions.a11yHint'))).toBeTruthy()

      expect(screen.getAllByRole('link', { name: t('appointments.inPersonVA.missingAddress.goToVALink') })).toBeTruthy()
    })

    it('no directions, no phone', () => {
      const attributes: AppointmentAttributes = {
        ...defaultAppointmentAttributes,
        location: {
          name: 'VA Long Beach Healthcare System',
          address: undefined,
          phone: undefined,
          url: '',
          code: '123 code',
        },
      }
      initializeTestInstance(attributes, AppointmentDetailsSubTypeConstants.Upcoming)
      expect(screen.getByRole('header', { name: t('appointments.location.title') })).toBeTruthy()
      expect(screen.getByText('VA Long Beach Healthcare System')).toBeTruthy()
      expect(screen.getByText(t('appointments.inPersonVA.missingAddress.noDirections.noPhone'))).toBeTruthy()
    })

    it('no directions, with phone', () => {
      const attributes: AppointmentAttributes = {
        ...defaultAppointmentAttributes,
        location: {
          name: 'VA Long Beach Healthcare System',
          address: undefined,
          phone: {
            areaCode: '123',
            number: '456-7890',
            extension: '',
          },
          url: '',
          code: '123 code',
        },
      }
      initializeTestInstance(attributes, AppointmentDetailsSubTypeConstants.Upcoming)
      expect(screen.getByRole('header', { name: t('appointments.location.title') })).toBeTruthy()
      expect(screen.getByText('VA Long Beach Healthcare System')).toBeTruthy()
      expect(screen.getByText(t('appointments.inPersonVA.missingAddress.noDirections.noAddressOnly'))).toBeTruthy()

      expect(screen.getAllByRole('link', { name: '123-456-7890' })).toBeTruthy()
      expect(screen.getAllByLabelText('1 2 3 4 5 6 7 8 9 0')).toBeTruthy()
      expect(screen.getAllByRole('link', { name: t('contactVA.tty.displayText') })).toBeTruthy()
      expect(screen.getAllByLabelText(t('contactVA.tty.number.a11yLabel'))).toBeTruthy()
    })
  })
})
