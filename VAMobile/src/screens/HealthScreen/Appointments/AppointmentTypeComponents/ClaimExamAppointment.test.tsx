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

import ClaimExamAppointment from './ClaimExamAppointment'

context('ClaimExamAppointment', () => {
  const defaultAppointmentAttributes: AppointmentAttributes = {
    //appointmentType and Status not used at this point in the logic, those are used in the upcoming appointments details
    appointmentType: AppointmentTypeConstants.VA,
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
      <ClaimExamAppointment
        appointmentID={'1'}
        attributes={attributes}
        subType={subType}
        goBack={jest.fn}
        cancelAppointment={jest.fn}
      />,
    )
  }

  describe('ClaimExamAppointment Upcoming', () => {
    it('renders correctly with no null data', () => {
      const attributes: AppointmentAttributes = {
        ...defaultAppointmentAttributes,
      }
      initializeTestInstance(attributes, AppointmentDetailsSubTypeConstants.Upcoming)
      expect(screen.getByRole('header', { name: 'Claim exam' })).toBeTruthy()
      expect(
        screen.getByText(
          "This appointment is for disability rating purposes only. It doesn't include treatment. If you have medical evidence to support your claim, bring copies to this appointment.",
        ),
      ).toBeTruthy()
      expect(screen.getByText('VA Long Beach Healthcare System')).toBeTruthy()

      expect(screen.getByRole('header', { name: 'Saturday, February 6, 2021\n11:53 AM PST' })).toBeTruthy()

      expect(screen.getByRole('link', { name: 'Add to calendar' })).toBeTruthy()
      expect(screen.getByAccessibilityHint("Add this appointment to your device's calendar")).toBeTruthy()

      expect(screen.getByRole('header', { name: 'Where to attend' })).toBeTruthy()
      expect(screen.getByText('VA Long Beach Healthcare System')).toBeTruthy()
      expect(screen.getByText('5901 East 7th Street')).toBeTruthy()
      expect(screen.getByText('Long Beach, CA 90822')).toBeTruthy()

      expect(screen.getByRole('link', { name: 'Get directions' })).toBeTruthy()
      expect(screen.getByAccessibilityHint('Opens the maps application to get directions')).toBeTruthy()

      expect(screen.getAllByRole('link', { name: '123-456-7890' })).toBeTruthy()
      expect(screen.getAllByLabelText('1 2 3 4 5 6 7 8 9 0')).toBeTruthy()
      expect(screen.getAllByRole('link', { name: 'TTY: 711' })).toBeTruthy()
      expect(screen.getAllByLabelText('TTY: 7 1 1')).toBeTruthy()

      expect(screen.getByText('Clinic: Johnson Clinic suite 100')).toBeTruthy()
      expect(screen.getByText('Location: 123 San Jacinto Ave, San Jacinto, CA 92583')).toBeTruthy()

      expect(screen.getByRole('header', { name: t('appointmentsTab.medicationWording.title') })).toBeTruthy()
      expect(screen.getByText(t('appointmentsTab.medicationWording.claimExam.bullet1'))).toBeTruthy()
      expect(screen.getByText(t('appointmentsTab.medicationWording.claimExam.bullet2'))).toBeTruthy()
      expect(screen.getByRole('link', { name: t('appointmentsTab.medicationWording.claimExam.webLink') })).toBeTruthy()

      expect(screen.getByRole('header', { name: 'Need to reschedule or cancel?' })).toBeTruthy()
      expect(
        screen.getByText('Call the compensation and pension office at VA Long Beach Healthcare System.'),
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
      expect(screen.getByRole('header', { name: 'Claim exam' })).toBeTruthy()
      expect(
        screen.getByText(
          "This appointment is for disability rating purposes only. It doesn't include treatment. If you have medical evidence to support your claim, bring copies to this appointment.",
        ),
      ).toBeTruthy()

      expect(screen.getByRole('header', { name: 'Saturday, February 6, 2021\n11:53 AM PST' })).toBeTruthy()

      expect(screen.getByRole('link', { name: 'Add to calendar' })).toBeTruthy()
      expect(screen.getByAccessibilityHint("Add this appointment to your device's calendar")).toBeTruthy()

      expect(screen.getByRole('header', { name: 'Where to attend' })).toBeTruthy()
      expect(
        screen.getByLabelText(
          "We can't show the health care facility's information right now. Try again later. Or go to  V-A .gov to find your facility's information.",
        ),
      ).toBeTruthy()
      expect(
        screen.getByText(
          "We can't show the health care facility's information right now. Try again later. Or go to VA.gov to find your facility's information.",
        ),
      ).toBeTruthy()

      expect(screen.getByRole('link', { name: 'Go to VA.gov to find your VA facility' })).toBeTruthy()
      expect(screen.getByLabelText('Go to  V-A .gov to find your  V-A  facility')).toBeTruthy()
      expect(screen.getByAccessibilityHint("This page will open in your device's browser")).toBeTruthy()

      expect(screen.getByText('Clinic: Not available')).toBeTruthy()
      expect(screen.getByText('Location: Not available')).toBeTruthy()

      expect(screen.getByRole('header', { name: t('appointmentsTab.medicationWording.title') })).toBeTruthy()
      expect(screen.getByText(t('appointmentsTab.medicationWording.claimExam.bullet1'))).toBeTruthy()
      expect(screen.getByText(t('appointmentsTab.medicationWording.claimExam.bullet2'))).toBeTruthy()
      expect(screen.getByRole('link', { name: t('appointmentsTab.medicationWording.claimExam.webLink') })).toBeTruthy()

      expect(screen.getByRole('header', { name: 'Need to reschedule or cancel?' })).toBeTruthy()
      expect(screen.getByText('Call the compensation and pension office at VA facility.')).toBeTruthy()
    })
  })

  describe('ClaimExamAppointment Past', () => {
    it('renders correctly with no null data', () => {
      const attributes: AppointmentAttributes = {
        ...defaultAppointmentAttributes,
      }
      initializeTestInstance(attributes, AppointmentDetailsSubTypeConstants.Past)
      expect(screen.getByRole('header', { name: 'Past claim exam' })).toBeTruthy()
      expect(screen.getByText('This appointment happened in the past.')).toBeTruthy()

      expect(screen.getByRole('header', { name: 'Saturday, February 6, 2021\n11:53 AM PST' })).toBeTruthy()

      expect(screen.getByRole('header', { name: 'Where to attend' })).toBeTruthy()
      expect(screen.getByText('VA Long Beach Healthcare System')).toBeTruthy()
      expect(screen.getByText('5901 East 7th Street')).toBeTruthy()
      expect(screen.getByText('Long Beach, CA 90822')).toBeTruthy()

      expect(screen.getByRole('link', { name: 'Get directions' })).toBeTruthy()
      expect(screen.getByAccessibilityHint('Opens the maps application to get directions')).toBeTruthy()

      expect(screen.getAllByRole('link', { name: '123-456-7890' })).toBeTruthy()
      expect(screen.getAllByLabelText('1 2 3 4 5 6 7 8 9 0')).toBeTruthy()
      expect(screen.getAllByRole('link', { name: 'TTY: 711' })).toBeTruthy()
      expect(screen.getAllByLabelText('TTY: 7 1 1')).toBeTruthy()

      expect(screen.getByText('Clinic: Johnson Clinic suite 100')).toBeTruthy()
      expect(screen.getByText('Location: 123 San Jacinto Ave, San Jacinto, CA 92583')).toBeTruthy()
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
      expect(screen.getByRole('header', { name: 'Past claim exam' })).toBeTruthy()
      expect(screen.getByText('This appointment happened in the past.')).toBeTruthy()

      expect(screen.getByRole('header', { name: 'Saturday, February 6, 2021\n11:53 AM PST' })).toBeTruthy()

      expect(screen.getByRole('header', { name: 'Where to attend' })).toBeTruthy()
      expect(
        screen.getByLabelText(
          "We can't show the health care facility's information right now. Try again later. Or go to  V-A .gov to find your facility's information.",
        ),
      ).toBeTruthy()
      expect(
        screen.getByText(
          "We can't show the health care facility's information right now. Try again later. Or go to VA.gov to find your facility's information.",
        ),
      ).toBeTruthy()

      expect(screen.getByRole('link', { name: 'Go to VA.gov to find your VA facility' })).toBeTruthy()
      expect(screen.getByLabelText('Go to  V-A .gov to find your  V-A  facility')).toBeTruthy()
      expect(screen.getByAccessibilityHint("This page will open in your device's browser")).toBeTruthy()

      expect(screen.getByText('Clinic: Not available')).toBeTruthy()
      expect(screen.getByText('Location: Not available')).toBeTruthy()
    })
  })

  describe('ClaimExamAppointment Canceled', () => {
    it('renders correctly with no null data', () => {
      const attributes: AppointmentAttributes = {
        ...defaultAppointmentAttributes,
        status: AppointmentStatusConstants.CANCELLED,
        statusDetail: AppointmentStatusDetailTypeConsts.PATIENT,
      }
      initializeTestInstance(attributes, AppointmentDetailsSubTypeConstants.Canceled)
      expect(screen.getByRole('header', { name: 'Canceled claim exam' })).toBeTruthy()
      expect(screen.getByText('You canceled this appointment.')).toBeTruthy()

      expect(screen.getByRole('header', { name: 'Saturday, February 6, 2021\n11:53 AM PST' })).toBeTruthy()

      expect(screen.getByRole('header', { name: 'Where to attend' })).toBeTruthy()
      expect(screen.getByText('VA Long Beach Healthcare System')).toBeTruthy()
      expect(screen.getByText('5901 East 7th Street')).toBeTruthy()
      expect(screen.getByText('Long Beach, CA 90822')).toBeTruthy()

      expect(screen.getByRole('link', { name: 'Get directions' })).toBeTruthy()
      expect(screen.getByAccessibilityHint('Opens the maps application to get directions')).toBeTruthy()

      expect(screen.getAllByRole('link', { name: '123-456-7890' })).toBeTruthy()
      expect(screen.getAllByLabelText('1 2 3 4 5 6 7 8 9 0')).toBeTruthy()
      expect(screen.getAllByRole('link', { name: 'TTY: 711' })).toBeTruthy()
      expect(screen.getAllByLabelText('TTY: 7 1 1')).toBeTruthy()

      expect(screen.getByText('Clinic: Johnson Clinic suite 100')).toBeTruthy()
      expect(screen.getByText('Location: 123 San Jacinto Ave, San Jacinto, CA 92583')).toBeTruthy()

      expect(screen.getByRole('header', { name: t('appointmentsTab.medicationWording.title') })).toBeTruthy()
      expect(screen.getByText(t('appointmentsTab.medicationWording.claimExam.bullet1'))).toBeTruthy()
      expect(screen.getByText(t('appointmentsTab.medicationWording.claimExam.bullet2'))).toBeTruthy()
      expect(screen.getByRole('link', { name: t('appointmentsTab.medicationWording.claimExam.webLink') })).toBeTruthy()

      expect(screen.getByRole('header', { name: 'Need to reschedule?' })).toBeTruthy()
      expect(
        screen.getByLabelText('Call the compensation and pension office at V-A Long Beach Healthcare System.'),
      ).toBeTruthy()
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
      expect(screen.getByRole('header', { name: 'Canceled claim exam' })).toBeTruthy()
      expect(screen.getByText('You canceled this appointment.')).toBeTruthy()

      expect(screen.getByRole('header', { name: 'Saturday, February 6, 2021\n11:53 AM PST' })).toBeTruthy()

      expect(screen.getByRole('header', { name: 'Where to attend' })).toBeTruthy()
      expect(
        screen.getByLabelText(
          "We can't show the health care facility's information right now. Try again later. Or go to  V-A .gov to find your facility's information.",
        ),
      ).toBeTruthy()
      expect(
        screen.getByText(
          "We can't show the health care facility's information right now. Try again later. Or go to VA.gov to find your facility's information.",
        ),
      ).toBeTruthy()

      expect(screen.getByRole('link', { name: 'Go to VA.gov to find your VA facility' })).toBeTruthy()
      expect(screen.getByLabelText('Go to  V-A .gov to find your  V-A  facility')).toBeTruthy()
      expect(screen.getByAccessibilityHint("This page will open in your device's browser")).toBeTruthy()

      expect(screen.getByText('Clinic: Not available')).toBeTruthy()
      expect(screen.getByText('Location: Not available')).toBeTruthy()

      expect(screen.getByRole('header', { name: t('appointmentsTab.medicationWording.title') })).toBeTruthy()
      expect(screen.getByText(t('appointmentsTab.medicationWording.claimExam.bullet1'))).toBeTruthy()
      expect(screen.getByText(t('appointmentsTab.medicationWording.claimExam.bullet2'))).toBeTruthy()
      expect(screen.getByRole('link', { name: t('appointmentsTab.medicationWording.claimExam.webLink') })).toBeTruthy()

      expect(screen.getByRole('header', { name: 'Need to reschedule?' })).toBeTruthy()
      expect(screen.getByText('Call the compensation and pension office at VA facility.')).toBeTruthy()
    })
  })

  describe('ClaimExamAppointment Pending', () => {
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
      expect(screen.getByRole('header', { name: 'Request for appointment' })).toBeTruthy()
      expect(
        screen.getByText(
          "We'll try to schedule your appointment in the next 2 business days. Check back here or call your facility for updates.",
        ),
      ).toBeTruthy()

      expect(screen.getByRole('header', { name: 'Preferred date and timeframe' })).toBeTruthy()
      expect(screen.getByText('10/01/2021 in the afternoon')).toBeTruthy()
      expect(screen.getByText('11/03/2021 in the morning')).toBeTruthy()

      expect(screen.getByRole('header', { name: 'Type of care' })).toBeTruthy()
      expect(screen.getByText('General check up')).toBeTruthy()

      expect(screen.getByRole('header', { name: 'How you prefer to attend' })).toBeTruthy()
      expect(screen.getByText('Office visit')).toBeTruthy()

      expect(screen.getByRole('header', { name: 'Facility' })).toBeTruthy()
      expect(screen.getByText('VA Long Beach Healthcare System')).toBeTruthy()
      expect(screen.getByText('5901 East 7th Street')).toBeTruthy()
      expect(screen.getByText('Long Beach, CA 90822')).toBeTruthy()

      expect(screen.getByRole('link', { name: 'Get directions' })).toBeTruthy()
      expect(screen.getByAccessibilityHint('Opens the maps application to get directions')).toBeTruthy()

      expect(screen.getByRole('link', { name: '123-456-7890' })).toBeTruthy()
      expect(screen.getByLabelText('1 2 3 4 5 6 7 8 9 0')).toBeTruthy()
      expect(screen.getByRole('link', { name: 'TTY: 711' })).toBeTruthy()
      expect(screen.getByLabelText('TTY: 7 1 1')).toBeTruthy()

      expect(screen.getByRole('header', { name: 'Details you’d like to share with your provider' })).toBeTruthy()
      expect(screen.getByText('Reason: Running a Fever')).toBeTruthy()

      expect(screen.getByRole('header', { name: 'Your contact information' })).toBeTruthy()
      expect(screen.getByText('Email: test@test.com')).toBeTruthy()
      expect(screen.getByText('Phone: (666) 666-6666')).toBeTruthy()
      expect(screen.getByText('Best time to call: Morning')).toBeTruthy()

      expect(screen.getByRole('button', { name: 'Cancel request' })).toBeTruthy()
      expect(screen.getByAccessibilityHint('Cancel this appointment request')).toBeTruthy()
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
      expect(screen.getByRole('header', { name: 'Request for appointment' })).toBeTruthy()
      expect(
        screen.getByText(
          "We'll try to schedule your appointment in the next 2 business days. Check back here or call your facility for updates.",
        ),
      ).toBeTruthy()

      expect(screen.getByRole('header', { name: 'Preferred date and timeframe' })).toBeTruthy()

      expect(screen.getByRole('header', { name: 'How you prefer to attend' })).toBeTruthy()
      expect(screen.getByText('Office visit')).toBeTruthy()

      expect(screen.getByRole('header', { name: 'Facility' })).toBeTruthy()
      expect(
        screen.getByLabelText(
          "We can't show the health care facility's information right now. Try again later. Or go to  V-A .gov to find your facility's information.",
        ),
      ).toBeTruthy()
      expect(
        screen.getByText(
          "We can't show the health care facility's information right now. Try again later. Or go to VA.gov to find your facility's information.",
        ),
      ).toBeTruthy()

      expect(screen.getByRole('link', { name: 'Go to VA.gov to find your VA facility' })).toBeTruthy()
      expect(screen.getByLabelText('Go to  V-A .gov to find your  V-A  facility')).toBeTruthy()
      expect(screen.getByAccessibilityHint("This page will open in your device's browser")).toBeTruthy()

      expect(screen.getByRole('header', { name: 'Details you’d like to share with your provider' })).toBeTruthy()
      expect(screen.getByText('Reason: Not available')).toBeTruthy()

      expect(screen.queryByRole('button', { name: 'Cancel request' })).toBeFalsy()
    })
  })

  describe('ClaimExamAppointment canceled pending', () => {
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
      expect(screen.getByRole('header', { name: 'Canceled request for appointment' })).toBeTruthy()
      expect(screen.getByText('You canceled this request.')).toBeTruthy()

      expect(screen.getByRole('header', { name: 'Preferred date and timeframe' })).toBeTruthy()
      expect(screen.getByText('10/01/2021 in the afternoon')).toBeTruthy()
      expect(screen.getByText('11/03/2021 in the morning')).toBeTruthy()

      expect(screen.getByRole('header', { name: 'Type of care' })).toBeTruthy()
      expect(screen.getByText('General check up')).toBeTruthy()

      expect(screen.getByRole('header', { name: 'How you prefer to attend' })).toBeTruthy()
      expect(screen.getByText('Office visit')).toBeTruthy()

      expect(screen.getByRole('header', { name: 'Facility' })).toBeTruthy()
      expect(screen.getByText('VA Long Beach Healthcare System')).toBeTruthy()
      expect(screen.getByText('5901 East 7th Street')).toBeTruthy()
      expect(screen.getByText('Long Beach, CA 90822')).toBeTruthy()

      expect(screen.getByRole('link', { name: 'Get directions' })).toBeTruthy()
      expect(screen.getByAccessibilityHint('Opens the maps application to get directions')).toBeTruthy()

      expect(screen.getAllByRole('link', { name: '123-456-7890' })).toBeTruthy()
      expect(screen.getAllByLabelText('1 2 3 4 5 6 7 8 9 0')).toBeTruthy()
      expect(screen.getAllByRole('link', { name: 'TTY: 711' })).toBeTruthy()
      expect(screen.getAllByLabelText('TTY: 7 1 1')).toBeTruthy()

      expect(screen.getByRole('header', { name: 'Details you’d like to share with your provider' })).toBeTruthy()
      expect(screen.getByText('Reason: Running a Fever')).toBeTruthy()

      expect(screen.getByRole('header', { name: 'Your contact information' })).toBeTruthy()
      expect(screen.getByText('Email: test@test.com')).toBeTruthy()
      expect(screen.getByText('Phone: (666) 666-6666')).toBeTruthy()
      expect(screen.getByText('Best time to call: Morning')).toBeTruthy()

      expect(screen.getByRole('header', { name: 'Need to request another appointment?' })).toBeTruthy()
      expect(
        screen.getByText('If you still need an appointment, call us or request a new appointment on VA.gov.'),
      ).toBeTruthy()
      expect(
        screen.getByLabelText('If you still need an appointment, call us or request a new appointment on  V-A .gov .'),
      ).toBeTruthy()

      expect(screen.getByRole('link', { name: 'Go to VA.gov to schedule' })).toBeTruthy()
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
      expect(screen.getByRole('header', { name: 'Canceled request for appointment' })).toBeTruthy()
      expect(screen.getByText('You canceled this request.')).toBeTruthy()

      expect(screen.getByRole('header', { name: 'Preferred date and timeframe' })).toBeTruthy()

      expect(screen.getByRole('header', { name: 'How you prefer to attend' })).toBeTruthy()
      expect(screen.getByText('Office visit')).toBeTruthy()

      expect(screen.getByRole('header', { name: 'Facility' })).toBeTruthy()
      expect(screen.getByRole('header', { name: 'Preferred date and timeframe' })).toBeTruthy()

      expect(screen.getByRole('header', { name: 'How you prefer to attend' })).toBeTruthy()
      expect(screen.getByText('Office visit')).toBeTruthy()

      expect(screen.getByRole('header', { name: 'Facility' })).toBeTruthy()
      expect(
        screen.getByLabelText(
          "We can't show the health care facility's information right now. Try again later. Or go to  V-A .gov to find your facility's information.",
        ),
      ).toBeTruthy()
      expect(
        screen.getByText(
          "We can't show the health care facility's information right now. Try again later. Or go to VA.gov to find your facility's information.",
        ),
      ).toBeTruthy()

      expect(screen.getByRole('link', { name: 'Go to VA.gov to find your VA facility' })).toBeTruthy()
      expect(screen.getByLabelText('Go to  V-A .gov to find your  V-A  facility')).toBeTruthy()
      expect(screen.getByAccessibilityHint("This page will open in your device's browser")).toBeTruthy()

      expect(screen.getByRole('header', { name: 'Details you’d like to share with your provider' })).toBeTruthy()
      expect(screen.getByText('Reason: Not available')).toBeTruthy()

      expect(screen.getByRole('header', { name: 'Need to request another appointment?' })).toBeTruthy()
      expect(
        screen.getByText('If you still need an appointment, call us or request a new appointment on VA.gov.'),
      ).toBeTruthy()
      expect(
        screen.getByLabelText('If you still need an appointment, call us or request a new appointment on  V-A .gov .'),
      ).toBeTruthy()

      expect(screen.getByRole('link', { name: 'Go to VA.gov to schedule' })).toBeTruthy()
      expect(screen.getByLabelText('Go to  V-A .gov to schedule')).toBeTruthy()
    })
  })
  describe('ClaimExamAppointment Canceled and Canceled Pending different cancel types that are not patient', () => {
    it('canceled - clinic cancel', () => {
      const attributes: AppointmentAttributes = {
        ...defaultAppointmentAttributes,
        status: AppointmentStatusConstants.CANCELLED,
        statusDetail: AppointmentStatusDetailTypeConsts.CLINIC,
      }
      initializeTestInstance(attributes, AppointmentDetailsSubTypeConstants.Canceled)
      expect(screen.getByText('Larry Bird canceled this appointment.')).toBeTruthy()
    })

    it('canceled pending - clinic cancel', () => {
      const attributes: AppointmentAttributes = {
        ...defaultAppointmentAttributes,
        status: AppointmentStatusConstants.CANCELLED,
        statusDetail: AppointmentStatusDetailTypeConsts.CLINIC,
      }
      initializeTestInstance(attributes, AppointmentDetailsSubTypeConstants.CanceledAndPending)
      expect(screen.getByText('Larry Bird canceled this request.')).toBeTruthy()
    })

    it('canceled - clinic rebook', () => {
      const attributes: AppointmentAttributes = {
        ...defaultAppointmentAttributes,
        status: AppointmentStatusConstants.CANCELLED,
        statusDetail: AppointmentStatusDetailTypeConsts.CLINIC_REBOOK,
      }
      initializeTestInstance(attributes, AppointmentDetailsSubTypeConstants.Canceled)
      expect(screen.getByText('Larry Bird canceled this appointment.')).toBeTruthy()
    })

    it('canceled pending - clinic rebook', () => {
      const attributes: AppointmentAttributes = {
        ...defaultAppointmentAttributes,
        status: AppointmentStatusConstants.CANCELLED,
        statusDetail: AppointmentStatusDetailTypeConsts.CLINIC_REBOOK,
      }
      initializeTestInstance(attributes, AppointmentDetailsSubTypeConstants.CanceledAndPending)
      expect(screen.getByText('Larry Bird canceled this request.')).toBeTruthy()
    })

    it('canceled - patient rebook', () => {
      const attributes: AppointmentAttributes = {
        ...defaultAppointmentAttributes,
        status: AppointmentStatusConstants.CANCELLED,
        statusDetail: AppointmentStatusDetailTypeConsts.PATIENT_REBOOK,
      }
      initializeTestInstance(attributes, AppointmentDetailsSubTypeConstants.Canceled)
      expect(screen.getByText('You canceled this appointment.')).toBeTruthy()
    })

    it('canceled pending - patient rebook', () => {
      const attributes: AppointmentAttributes = {
        ...defaultAppointmentAttributes,
        status: AppointmentStatusConstants.CANCELLED,
        statusDetail: AppointmentStatusDetailTypeConsts.PATIENT_REBOOK,
      }
      initializeTestInstance(attributes, AppointmentDetailsSubTypeConstants.CanceledAndPending)
      expect(screen.getByText('You canceled this request.')).toBeTruthy()
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
      expect(screen.getByRole('header', { name: 'Where to attend' })).toBeTruthy()
      expect(screen.getByText('VA Long Beach Healthcare System')).toBeTruthy()
      expect(screen.getByText('5901 East 7th Street')).toBeTruthy()
      expect(screen.getByText('Long Beach, CA 90822')).toBeTruthy()

      expect(screen.getByRole('link', { name: 'Get directions' })).toBeTruthy()
      expect(screen.getByAccessibilityHint('Opens the maps application to get directions')).toBeTruthy()
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
      expect(screen.getByRole('header', { name: 'Where to attend' })).toBeTruthy()
      expect(screen.getByText('VA Long Beach Healthcare System')).toBeTruthy()
      expect(
        screen.getByText(
          "We can't show your health care facility's address right now. But you can still get directions to the facility. You can also call your facility to get the address.",
        ),
      ).toBeTruthy()

      expect(screen.getByRole('link', { name: 'Get directions' })).toBeTruthy()
      expect(screen.getByAccessibilityHint('Opens the maps application to get directions')).toBeTruthy()

      expect(screen.getAllByRole('link', { name: '123-456-7890' })).toBeTruthy()
      expect(screen.getAllByLabelText('1 2 3 4 5 6 7 8 9 0')).toBeTruthy()
      expect(screen.getAllByRole('link', { name: 'TTY: 711' })).toBeTruthy()
      expect(screen.getAllByLabelText('TTY: 7 1 1')).toBeTruthy()
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
      expect(screen.getByRole('header', { name: 'Where to attend' })).toBeTruthy()
      expect(screen.getByText('VA Long Beach Healthcare System')).toBeTruthy()
      expect(
        screen.getByText(
          "We can't show your health care facility's address or phone number right now. But you can still get directions to the facility. You can also find your facility's information on VA.gov.",
        ),
      ).toBeTruthy()

      expect(screen.getByRole('link', { name: 'Get directions' })).toBeTruthy()
      expect(screen.getByAccessibilityHint('Opens the maps application to get directions')).toBeTruthy()

      expect(screen.getAllByRole('link', { name: 'Go to VA.gov to find your VA facility' })).toBeTruthy()
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
      expect(screen.getByRole('header', { name: 'Where to attend' })).toBeTruthy()
      expect(screen.getByText('VA Long Beach Healthcare System')).toBeTruthy()
      expect(
        screen.getByText(
          "We can't show your health care facility's address or phone number right now. Try again later. Or go to VA.gov to find your facility's information.",
        ),
      ).toBeTruthy()
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
      expect(screen.getByRole('header', { name: 'Where to attend' })).toBeTruthy()
      expect(screen.getByText('VA Long Beach Healthcare System')).toBeTruthy()
      expect(
        screen.getByText(
          "We can't show your health care facility's address right now. Try again later. Or call your facility to get the address.",
        ),
      ).toBeTruthy()

      expect(screen.getAllByRole('link', { name: '123-456-7890' })).toBeTruthy()
      expect(screen.getAllByLabelText('1 2 3 4 5 6 7 8 9 0')).toBeTruthy()
      expect(screen.getAllByRole('link', { name: 'TTY: 711' })).toBeTruthy()
      expect(screen.getAllByLabelText('TTY: 7 1 1')).toBeTruthy()
    })
  })
})
