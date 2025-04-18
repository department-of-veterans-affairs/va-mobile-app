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
import { AppointmentDetailsSubType, AppointmentDetailsSubTypeConstants } from 'utils/appointments'

import CommunityCareAppointment from './CommunityCareAppointment'

context('CommunityCareAppointment', () => {
  const defaultAppointmentAttributes: AppointmentAttributes = {
    //appointmentType and Status not used at this point in the logic, those are used in the upcoming appointments details
    appointmentType: AppointmentTypeConstants.COMMUNITY_CARE,
    status: AppointmentStatusConstants.BOOKED,
    //fields below are used in the subcomponents
    bestTimeToCall: undefined, //pending appointments
    cancelId: '12',
    comment: 'Please arrive 20 minutes before the start of your appointment',
    friendlyLocationName: 'Johnson Clinic suite 100',
    healthcareProvider: 'Larry Bird',
    location: {
      name: 'Community Clinic Association',
      address: {
        street: '1412 East Cesar Ave',
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
      <CommunityCareAppointment
        appointmentID={'1'}
        attributes={attributes}
        subType={subType}
        goBack={jest.fn}
        cancelAppointment={jest.fn}
      />,
    )
  }

  describe('CommunityCareAppointment Upcoming', () => {
    it('renders correctly with no null data', () => {
      const attributes: AppointmentAttributes = {
        ...defaultAppointmentAttributes,
      }
      initializeTestInstance(attributes, AppointmentDetailsSubTypeConstants.Upcoming)
      expect(screen.getByRole('header', { name: t('appointments.communityCare.upcomingTitle') })).toBeTruthy()
      expect(screen.getByText(t('appointments.communityCare.upcomingBody'))).toBeTruthy()
      expect(screen.getByLabelText(t('appointments.communityCare.upcomingBody'))).toBeTruthy()

      expect(screen.getByRole('header', { name: 'Saturday, February 6, 2021\n11:53 AM PST' })).toBeTruthy()

      expect(screen.getByRole('link', { name: t('upcomingAppointments.addToCalendar') })).toBeTruthy()
      expect(screen.getByAccessibilityHint(t('upcomingAppointmentDetails.addToCalendarA11yHint'))).toBeTruthy()

      expect(screen.getByRole('header', { name: t('appointments.typeOfCare.title') })).toBeTruthy()
      expect(screen.getByText('General check up')).toBeTruthy()

      expect(screen.getByRole('header', { name: t('providerInformation') })).toBeTruthy()
      expect(screen.getByText('Community Clinic Association')).toBeTruthy()
      expect(screen.getByText('1412 East Cesar Ave')).toBeTruthy()
      expect(screen.getByText('Long Beach, CA 90822')).toBeTruthy()

      expect(screen.getByRole('link', { name: t('directions') })).toBeTruthy()
      expect(screen.getByAccessibilityHint(t('directions.a11yHint'))).toBeTruthy()

      expect(screen.getAllByRole('link', { name: '123-456-7890' })).toBeTruthy()
      expect(screen.getAllByLabelText('1 2 3 4 5 6 7 8 9 0')).toBeTruthy()
      expect(screen.getAllByRole('link', { name: t('contactVA.tty.displayText') })).toBeTruthy()
      expect(screen.getAllByLabelText('TTY: 7 1 1')).toBeTruthy()

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
        screen.getByText(t('upcomingAppointmentDetails.doYouNeedToCancelOrReschedule.noAppCancelCommunityCare.body')),
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
      expect(screen.getByRole('header', { name: t('appointments.communityCare.upcomingTitle') })).toBeTruthy()
      expect(screen.getByText(t('appointments.communityCare.upcomingBody'))).toBeTruthy()
      expect(screen.getByLabelText(t('appointments.communityCare.upcomingBody'))).toBeTruthy()

      expect(screen.getByRole('header', { name: 'Saturday, February 6, 2021\n11:53 AM PST' })).toBeTruthy()

      expect(screen.getByRole('link', { name: t('upcomingAppointments.addToCalendar') })).toBeTruthy()
      expect(screen.getByAccessibilityHint(t('upcomingAppointmentDetails.addToCalendarA11yHint'))).toBeTruthy()

      expect(screen.getByRole('header', { name: t('providerInformation') })).toBeTruthy()
      expect(
        screen.getByLabelText(
          "We can't show your provider's information right now. Try again later. Or go to  V-A .gov to find your provider's information.",
        ),
      ).toBeTruthy()
      expect(
        screen.getByText(t('appointments.inPersonVA.missingAddress.noDirections.noAnything.communityCare')),
      ).toBeTruthy()

      expect(
        screen.getByRole('link', { name: t('appointments.inPersonVA.missingAddress.goToVALink.communityCare') }),
      ).toBeTruthy()
      expect(screen.getByLabelText("Go to  V-A .gov to find your provider's information")).toBeTruthy()
      expect(screen.getByAccessibilityHint(t('upcomingAppointmentDetails.findYourVAFacility.a11yHint'))).toBeTruthy()

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

      expect(
        screen.getByRole('header', { name: t('upcomingAppointmentDetails.doYouNeedToCancelOrReschedule') }),
      ).toBeTruthy()
      expect(
        screen.getByText(t('upcomingAppointmentDetails.doYouNeedToCancelOrReschedule.noAppCancelCommunityCare.body')),
      ).toBeTruthy()

      expect(screen.getByRole('header', { name: t('appointmentsTab.medicationWording.title') })).toBeTruthy()
      expect(screen.getByRole('link', { name: t('appointmentsTab.medicationWording.whatToBringLink') })).toBeTruthy()

      expect(screen.getByRole('link', { name: t('upcomingAppointmentDetails.findYourVALocation') })).toBeTruthy()
      expect(screen.getByLabelText('Find your  V-A  location')).toBeTruthy()
      expect(screen.getByAccessibilityHint(t('upcomingAppointmentDetails.findYourVALocation.a11yHint'))).toBeTruthy()
    })
  })

  describe('CommunityCareAppointment Past', () => {
    it('renders correctly with no null data', () => {
      const attributes: AppointmentAttributes = {
        ...defaultAppointmentAttributes,
      }
      initializeTestInstance(attributes, AppointmentDetailsSubTypeConstants.Past)
      expect(
        screen.getByRole('header', {
          name: t('appointments.pastTitle', {
            appointmentType: t('appointments.communityCare.upcomingTitle').toLowerCase(),
          }),
        }),
      ).toBeTruthy()
      expect(screen.getByText(t('appointments.pastBody'))).toBeTruthy()

      expect(screen.getByRole('header', { name: 'Saturday, February 6, 2021\n11:53 AM PST' })).toBeTruthy()

      expect(screen.getByRole('header', { name: t('appointments.typeOfCare.title') })).toBeTruthy()
      expect(screen.getByText('General check up')).toBeTruthy()

      expect(screen.getByRole('header', { name: t('providerInformation') })).toBeTruthy()
      expect(screen.getByText('Community Clinic Association')).toBeTruthy()
      expect(screen.getByText('1412 East Cesar Ave')).toBeTruthy()
      expect(screen.getByText('Long Beach, CA 90822')).toBeTruthy()

      expect(screen.getByRole('link', { name: t('directions') })).toBeTruthy()
      expect(screen.getByAccessibilityHint(t('directions.a11yHint'))).toBeTruthy()

      expect(screen.getAllByRole('link', { name: '123-456-7890' })).toBeTruthy()
      expect(screen.getAllByLabelText('1 2 3 4 5 6 7 8 9 0')).toBeTruthy()
      expect(screen.getAllByRole('link', { name: t('contactVA.tty.displayText') })).toBeTruthy()
      expect(screen.getAllByLabelText('TTY: 7 1 1')).toBeTruthy()

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
      expect(screen.getByText(t('appointments.scheduleCommunityCare.body'))).toBeTruthy()
      expect(
        screen.getByLabelText(
          'If you need to schedule another appointment, call your provider or schedule a new appointment on  V-A .gov .',
        ),
      ).toBeTruthy()
      expect(screen.getByRole('link', { name: t('appointments.vaSchedule') })).toBeTruthy()
      expect(screen.getByLabelText('Go to  V-A .gov to schedule')).toBeTruthy()
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
            appointmentType: t('appointments.communityCare.upcomingTitle').toLowerCase(),
          }),
        }),
      ).toBeTruthy()
      expect(screen.getByText(t('appointments.pastBody'))).toBeTruthy()

      expect(screen.getByRole('header', { name: 'Saturday, February 6, 2021\n11:53 AM PST' })).toBeTruthy()

      expect(screen.getByRole('header', { name: t('providerInformation') })).toBeTruthy()
      expect(
        screen.getByLabelText(
          "We can't show your provider's information right now. Try again later. Or go to  V-A .gov to find your provider's information.",
        ),
      ).toBeTruthy()
      expect(
        screen.getByText(t('appointments.inPersonVA.missingAddress.noDirections.noAnything.communityCare')),
      ).toBeTruthy()

      expect(
        screen.getByRole('link', { name: t('appointments.inPersonVA.missingAddress.goToVALink.communityCare') }),
      ).toBeTruthy()
      expect(screen.getByLabelText("Go to  V-A .gov to find your provider's information")).toBeTruthy()
      expect(screen.getByAccessibilityHint(t('upcomingAppointmentDetails.findYourVAFacility.a11yHint'))).toBeTruthy()

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
      expect(screen.getByText(t('appointments.scheduleCommunityCare.body'))).toBeTruthy()
      expect(
        screen.getByLabelText(
          'If you need to schedule another appointment, call your provider or schedule a new appointment on  V-A .gov .',
        ),
      ).toBeTruthy()
      expect(screen.getByRole('link', { name: t('appointments.vaSchedule') })).toBeTruthy()
      expect(screen.getByLabelText('Go to  V-A .gov to schedule')).toBeTruthy()
    })
  })

  describe('CommunityCareAppointment Canceled', () => {
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
            appointmentType: t('appointments.communityCare.upcomingTitle').toLowerCase(),
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

      expect(screen.getByRole('header', { name: t('providerInformation') })).toBeTruthy()
      expect(screen.getByText('Community Clinic Association')).toBeTruthy()
      expect(screen.getByText('1412 East Cesar Ave')).toBeTruthy()
      expect(screen.getByText('Long Beach, CA 90822')).toBeTruthy()

      expect(screen.getByRole('link', { name: t('directions') })).toBeTruthy()
      expect(screen.getByAccessibilityHint(t('directions.a11yHint'))).toBeTruthy()

      expect(screen.getAllByRole('link', { name: '123-456-7890' })).toBeTruthy()
      expect(screen.getAllByLabelText('1 2 3 4 5 6 7 8 9 0')).toBeTruthy()
      expect(screen.getAllByRole('link', { name: t('contactVA.tty.displayText') })).toBeTruthy()
      expect(screen.getAllByLabelText('TTY: 7 1 1')).toBeTruthy()

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
      expect(screen.getByText(t('appointments.rescheduleCommunityCare.body'))).toBeTruthy()
      expect(
        screen.getByLabelText(
          'If you need to reschedule this appointment, call your provider or schedule a new appointment on  V-A .gov .',
        ),
      ).toBeTruthy()

      expect(screen.getByRole('link', { name: t('appointments.vaSchedule') })).toBeTruthy()
      expect(screen.getByLabelText('Go to  V-A .gov to schedule')).toBeTruthy()
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
            appointmentType: t('appointments.communityCare.upcomingTitle').toLowerCase(),
          }),
        }),
      ).toBeTruthy()
      expect(
        screen.getByText(
          t('appointments.pending.cancelled.theTimeAndDate', { who: t('appointments.canceled.whoCanceled.you') }),
        ),
      ).toBeTruthy()

      expect(screen.getByRole('header', { name: 'Saturday, February 6, 2021\n11:53 AM PST' })).toBeTruthy()

      expect(screen.getByRole('header', { name: t('providerInformation') })).toBeTruthy()
      expect(
        screen.getByLabelText(
          "We can't show your provider's information right now. Try again later. Or go to  V-A .gov to find your provider's information.",
        ),
      ).toBeTruthy()
      expect(
        screen.getByText(t('appointments.inPersonVA.missingAddress.noDirections.noAnything.communityCare')),
      ).toBeTruthy()

      expect(
        screen.getByRole('link', { name: t('appointments.inPersonVA.missingAddress.goToVALink.communityCare') }),
      ).toBeTruthy()
      expect(screen.getByLabelText("Go to  V-A .gov to find your provider's information")).toBeTruthy()
      expect(screen.getByAccessibilityHint(t('upcomingAppointmentDetails.findYourVAFacility.a11yHint'))).toBeTruthy()

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

      expect(screen.getByRole('header', { name: t('appointments.reschedule.title') })).toBeTruthy()
      expect(screen.getByText(t('appointments.rescheduleCommunityCare.body'))).toBeTruthy()
      expect(
        screen.getByLabelText(
          'If you need to reschedule this appointment, call your provider or schedule a new appointment on  V-A .gov .',
        ),
      ).toBeTruthy()

      expect(screen.getByRole('header', { name: t('appointmentsTab.medicationWording.title') })).toBeTruthy()
      expect(screen.getByRole('link', { name: t('appointmentsTab.medicationWording.whatToBringLink') })).toBeTruthy()

      expect(screen.getByRole('link', { name: t('appointments.vaSchedule') })).toBeTruthy()
      expect(screen.getByLabelText('Go to  V-A .gov to schedule')).toBeTruthy()
    })
  })

  describe('CommunityCareAppointment Pending', () => {
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
      expect(screen.getByRole('header', { name: t('appointments.request.title.communityCare') })).toBeTruthy()
      expect(screen.getByText(t('appointments.pending.body'))).toBeTruthy()

      expect(screen.getByRole('header', { name: t('appointments.pending.preferredDateAndTimeFrame') })).toBeTruthy()
      expect(screen.getByText('10/01/2021 in the afternoon')).toBeTruthy()
      expect(screen.getByText('11/03/2021 in the morning')).toBeTruthy()

      expect(screen.getByRole('header', { name: t('appointments.typeOfCare.pendingTitle') })).toBeTruthy()
      expect(screen.getByText('General check up')).toBeTruthy()

      expect(screen.getByRole('header', { name: t('schedulingFacility') })).toBeTruthy()
      expect(screen.getByText(t('thisFacilityWillContactYou'))).toBeTruthy()
      expect(screen.getByText('Johnson Clinic suite 100')).toBeTruthy()

      expect(screen.getByRole('header', { name: t('preferredCommunityCareProvider') })).toBeTruthy()
      expect(screen.getByText('Community Clinic Association')).toBeTruthy()
      expect(screen.getByText('1412 East Cesar Ave')).toBeTruthy()
      expect(screen.getByText('Long Beach, CA 90822')).toBeTruthy()

      expect(screen.getByRole('header', { name: t('appointments.pending.reasonTitle') })).toBeTruthy()
      expect(
        screen.getByText(
          t('upcomingAppointmentDetails.reasonComment', {
            comment: 'Please arrive 20 minutes before the start of your appointment',
          }),
        ),
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
        comment: '',
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
      expect(screen.getByRole('header', { name: t('appointments.request.title.communityCare') })).toBeTruthy()
      expect(screen.getByText(t('appointments.pending.body'))).toBeTruthy()

      expect(screen.getByRole('header', { name: t('appointments.pending.preferredDateAndTimeFrame') })).toBeTruthy()

      expect(screen.getByRole('header', { name: t('appointments.pending.reasonTitle') })).toBeTruthy()
      expect(
        screen.getByText(t('upcomingAppointmentDetails.reasonComment', { comment: t('appointments.notAvailable') })),
      ).toBeTruthy()

      expect(screen.queryByRole('button', { name: t('cancelRequest') })).toBeFalsy()
    })
  })

  describe('CommunityCareAppointment canceled pending', () => {
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
      expect(screen.getByRole('header', { name: t('appointments.request.canceledTitle.communityCare') })).toBeTruthy()
      expect(
        screen.getByText(t('appointments.canceled.request', { who: t('appointments.canceled.whoCanceled.you') })),
      ).toBeTruthy()

      expect(screen.getByRole('header', { name: t('appointments.pending.preferredDateAndTimeFrame') })).toBeTruthy()
      expect(screen.getByText('10/01/2021 in the afternoon')).toBeTruthy()
      expect(screen.getByText('11/03/2021 in the morning')).toBeTruthy()

      expect(screen.getByRole('header', { name: t('appointments.typeOfCare.pendingTitle') })).toBeTruthy()
      expect(screen.getByText('General check up')).toBeTruthy()

      expect(screen.getByRole('header', { name: t('schedulingFacility') })).toBeTruthy()
      expect(screen.getByText(t('thisFacilityWillContactYou'))).toBeTruthy()
      expect(screen.getByText('Johnson Clinic suite 100')).toBeTruthy()

      expect(screen.getByRole('header', { name: t('preferredCommunityCareProvider') })).toBeTruthy()
      expect(screen.getByText('Community Clinic Association')).toBeTruthy()
      expect(screen.getByText('1412 East Cesar Ave')).toBeTruthy()
      expect(screen.getByText('Long Beach, CA 90822')).toBeTruthy()

      expect(screen.getByRole('header', { name: t('appointments.pending.reasonTitle') })).toBeTruthy()
      expect(
        screen.getByText(
          t('upcomingAppointmentDetails.reasonComment', {
            comment: 'Please arrive 20 minutes before the start of your appointment',
          }),
        ),
      ).toBeTruthy()

      expect(screen.getByRole('header', { name: t('appointments.pending.yourContactInfo') })).toBeTruthy()
      expect(screen.getByText(`${t('email')}: test@test.com`)).toBeTruthy()
      expect(screen.getByText(`${t('appointmentList.phoneOnly')}: (666) 666-6666`)).toBeTruthy()
      expect(screen.getByText(t('appointments.bestTimeToCall') + 'Morning')).toBeTruthy()

      expect(screen.getByRole('header', { name: t('appointments.reschedule.pending.title') })).toBeTruthy()
      expect(screen.getByText(t('appointments.reschedule.pending.body'))).toBeTruthy()
      expect(
        screen.getByLabelText('If you still need an appointment, call us or request a new appointment on  V-A .gov .'),
      ).toBeTruthy()

      expect(screen.getAllByRole('link', { name: '123-456-7890' })).toBeTruthy()
      expect(screen.getAllByLabelText('1 2 3 4 5 6 7 8 9 0')).toBeTruthy()
      expect(screen.getAllByRole('link', { name: t('contactVA.tty.displayText') })).toBeTruthy()
      expect(screen.getAllByLabelText('TTY: 7 1 1')).toBeTruthy()

      expect(screen.getByRole('link', { name: t('appointments.vaSchedule') })).toBeTruthy()
      expect(screen.getByLabelText('Go to  V-A .gov to schedule')).toBeTruthy()
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
      expect(screen.getByRole('header', { name: t('appointments.request.canceledTitle.communityCare') })).toBeTruthy()
      expect(
        screen.getByText(t('appointments.canceled.request', { who: t('appointments.canceled.whoCanceled.you') })),
      ).toBeTruthy()

      expect(screen.getByRole('header', { name: t('appointments.pending.preferredDateAndTimeFrame') })).toBeTruthy()

      expect(screen.queryByRole('header', { name: t('schedulingFacility') })).toBeFalsy()
      expect(screen.queryByRole('header', { name: t('preferredCommunityCareProvider') })).toBeFalsy()

      expect(screen.getByRole('header', { name: t('appointments.reschedule.pending.title') })).toBeTruthy()
      expect(screen.getByText(t('appointments.reschedule.pending.body'))).toBeTruthy()
      expect(
        screen.getByLabelText('If you still need an appointment, call us or request a new appointment on  V-A .gov .'),
      ).toBeTruthy()

      expect(screen.getByRole('link', { name: t('appointments.vaSchedule') })).toBeTruthy()
      expect(screen.getByLabelText('Go to  V-A .gov to schedule')).toBeTruthy()
    })
  })
  describe('CommunityCareAppointment Canceled and Canceled Pending different cancel types that are not patient', () => {
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
          name: 'Community Clinic Association',
          address: {
            street: '1412 East Cesar Ave',
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
      expect(screen.getByRole('header', { name: t('providerInformation') })).toBeTruthy()
      expect(screen.getByText('Community Clinic Association')).toBeTruthy()
      expect(screen.getByText('1412 East Cesar Ave')).toBeTruthy()
      expect(screen.getByText('Long Beach, CA 90822')).toBeTruthy()

      expect(screen.getByRole('link', { name: t('directions') })).toBeTruthy()
      expect(screen.getByAccessibilityHint(t('directions.a11yHint'))).toBeTruthy()
    })

    it('has directions with lat long, no address, and has phone', () => {
      const attributes: AppointmentAttributes = {
        ...defaultAppointmentAttributes,
        location: {
          name: 'Community Clinic Association',
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
      expect(screen.getByRole('header', { name: t('providerInformation') })).toBeTruthy()
      expect(screen.getByText('Community Clinic Association')).toBeTruthy()
      expect(
        screen.getByText(t('appointments.inPersonVA.missingAddress.hasDirections.noAddressOnly.communityCare')),
      ).toBeTruthy()

      expect(screen.getByRole('link', { name: t('directions') })).toBeTruthy()
      expect(screen.getByAccessibilityHint(t('directions.a11yHint'))).toBeTruthy()

      expect(screen.getAllByRole('link', { name: '123-456-7890' })).toBeTruthy()
      expect(screen.getAllByLabelText('1 2 3 4 5 6 7 8 9 0')).toBeTruthy()
      expect(screen.getAllByRole('link', { name: t('contactVA.tty.displayText') })).toBeTruthy()
      expect(screen.getAllByLabelText('TTY: 7 1 1')).toBeTruthy()
    })

    it('has directions with lat long, no address, no phone', () => {
      const attributes: AppointmentAttributes = {
        ...defaultAppointmentAttributes,
        location: {
          name: 'Community Clinic Association',
          address: undefined,
          phone: undefined,
          url: '',
          code: '123 code',
          lat: 33.33,
          long: 33.33,
        },
      }
      initializeTestInstance(attributes, AppointmentDetailsSubTypeConstants.Upcoming)
      expect(screen.getByRole('header', { name: t('providerInformation') })).toBeTruthy()
      expect(screen.getByText('Community Clinic Association')).toBeTruthy()
      expect(
        screen.getByText(t('appointments.inPersonVA.missingAddress.hasDirections.noPhone.communityCare')),
      ).toBeTruthy()

      expect(screen.getByRole('link', { name: t('directions') })).toBeTruthy()
      expect(screen.getByAccessibilityHint(t('directions.a11yHint'))).toBeTruthy()

      expect(
        screen.getAllByRole('link', { name: t('appointments.inPersonVA.missingAddress.goToVALink.communityCare') }),
      ).toBeTruthy()
    })

    it('no directions, no phone', () => {
      const attributes: AppointmentAttributes = {
        ...defaultAppointmentAttributes,
        location: {
          name: 'Community Clinic Association',
          address: undefined,
          phone: undefined,
          url: '',
          code: '123 code',
        },
      }
      initializeTestInstance(attributes, AppointmentDetailsSubTypeConstants.Upcoming)
      expect(screen.getByRole('header', { name: t('providerInformation') })).toBeTruthy()
      expect(screen.getByText('Community Clinic Association')).toBeTruthy()
      expect(
        screen.getByText(t('appointments.inPersonVA.missingAddress.noDirections.noPhone.communityCare')),
      ).toBeTruthy()
    })

    it('no directions, with phone', () => {
      const attributes: AppointmentAttributes = {
        ...defaultAppointmentAttributes,
        location: {
          name: 'Community Clinic Association',
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
      expect(screen.getByRole('header', { name: t('providerInformation') })).toBeTruthy()
      expect(screen.getByText('Community Clinic Association')).toBeTruthy()
      expect(
        screen.getByText(t('appointments.inPersonVA.missingAddress.noDirections.noAddressOnly.communityCare')),
      ).toBeTruthy()

      expect(screen.getAllByRole('link', { name: '123-456-7890' })).toBeTruthy()
      expect(screen.getAllByLabelText('1 2 3 4 5 6 7 8 9 0')).toBeTruthy()
      expect(screen.getAllByRole('link', { name: t('contactVA.tty.displayText') })).toBeTruthy()
      expect(screen.getAllByLabelText('TTY: 7 1 1')).toBeTruthy()
    })
  })
})
