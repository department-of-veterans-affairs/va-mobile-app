import React from 'react'
import { Alert } from 'react-native'

import { fireEvent, screen } from '@testing-library/react-native'

import {
  AppointmentPhone,
  AppointmentStatus,
  AppointmentStatusConstants,
  AppointmentStatusDetailType,
  AppointmentStatusDetailTypeConsts,
  AppointmentType,
  AppointmentTypeConstants,
} from 'api/types'
import { context, mockNavProps, render } from 'testUtils'
import { bookedAppointmentsList, canceledAppointmentList } from 'utils/tests/appointments'

import UpcomingAppointmentDetails from './UpcomingAppointmentDetails'

const mockNavigationSpy = jest.fn()
jest.mock('utils/hooks', () => {
  const original = jest.requireActual('utils/hooks')
  return {
    ...original,
    useRouteNavigation: () => mockNavigationSpy,
  }
})

context('UpcomingAppointmentDetails', () => {
  const goBackSpy = jest.fn()
  const navigateSpy = jest.fn()

  const apptPhoneData = {
    areaCode: '123',
    number: '456-7890',
    extension: '',
  }

  const initializeTestInstance = (
    appointmentType: AppointmentType = AppointmentTypeConstants.VA,
    status: AppointmentStatus = AppointmentStatusConstants.BOOKED,
    phoneData: AppointmentPhone | null = apptPhoneData,
    isCovid: boolean = false,
    statusDetail: AppointmentStatusDetailType | null = null,
    hasUrl: boolean = false,
  ): void => {
    const props = mockNavProps(
      undefined,
      { setOptions: jest.fn(), goBack: goBackSpy, navigate: navigateSpy },
      {
        params: {
          appointment:
            status === 'BOOKED'
              ? phoneData === null
                ? bookedAppointmentsList[8]
                : hasUrl
                  ? bookedAppointmentsList[9]
                  : bookedAppointmentsList.filter((obj) => {
                      return obj.attributes.appointmentType === appointmentType &&
                        obj.attributes.isCovidVaccine === isCovid
                        ? true
                        : false
                    })[0]
              : canceledAppointmentList.filter((obj) => {
                  return (
                    obj.attributes.appointmentType === appointmentType && obj.attributes.statusDetail === statusDetail
                  )
                })[0],
        },
      },
    )

    render(<UpcomingAppointmentDetails {...props} />)
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('when the appointment type is atlas', () => {
    it('should display the appointment details', () => {
      initializeTestInstance(AppointmentTypeConstants.VA_VIDEO_CONNECT_ATLAS)
      expect(screen.getByText('VA Video Connect\r\nATLAS location')).toBeTruthy()
      expect(screen.getByText('Appointment code: 654321')).toBeTruthy()
      expect(screen.getByText('Special instructions')).toBeTruthy()
      expect(screen.getByText('Please arrive 20 minutes before the start of your appointment')).toBeTruthy()
    })
  })

  describe('when the appointment type is at home', () => {
    it('should display the appointment details', () => {
      initializeTestInstance(AppointmentTypeConstants.VA_VIDEO_CONNECT_HOME)
      expect(screen.getByText('VA Video Connect\r\nHome')).toBeTruthy()
      expect(screen.getByText('How to join your virtual session')).toBeTruthy()
      expect(screen.getByText('You can join VA Video Connect 30 minutes prior to the start time.')).toBeTruthy()
      expect(screen.getByText('Join session')).toBeTruthy()
      expect(screen.getByText('Special instructions')).toBeTruthy()
      expect(screen.getByText('Please arrive 20 minutes before the start of your appointment')).toBeTruthy()
    })

    it('should prompt an alert for leaving the app when the URL is present', () => {
      initializeTestInstance(
        AppointmentTypeConstants.VA_VIDEO_CONNECT_HOME,
        undefined,
        undefined,
        undefined,
        undefined,
        true,
      )
      fireEvent.press(screen.getByText('Join session'))
      expect(Alert.alert).toHaveBeenCalled()
    })

    it('should navigate to the SessionNotStarted screen when the URL is empty', () => {
      initializeTestInstance(AppointmentTypeConstants.VA_VIDEO_CONNECT_HOME)
      fireEvent.press(screen.getByText('Join session'))
      expect(mockNavigationSpy).toHaveBeenCalledWith('SessionNotStarted')
    })
  })

  describe('when the appointment type is onsite', () => {
    it('should display the appointment details', () => {
      initializeTestInstance(AppointmentTypeConstants.VA_VIDEO_CONNECT_ONSITE)
      expect(screen.getByText('VA Video Connect\r\nVA location')).toBeTruthy()
      expect(screen.getByText('You must join this video meeting from the VA location listed below.')).toBeTruthy()
      expect(screen.getByText('Larry R. TestDoctor')).toBeTruthy()
      expect(screen.getByText('Special instructions')).toBeTruthy()
      expect(screen.getByText('Please arrive 20 minutes before the start of your appointment')).toBeTruthy()
    })
  })

  describe('when the appointment type is gfe', () => {
    it('should display the appointment details', () => {
      initializeTestInstance(AppointmentTypeConstants.VA_VIDEO_CONNECT_GFE)
      expect(screen.getByText('VA Video Connect\r\nusing a VA device')).toBeTruthy()
      expect(screen.getByText("To join this video appointment, you'll need to use a device we provide.")).toBeTruthy()
      expect(screen.getByText('Special instructions')).toBeTruthy()
      expect(screen.getByText('Please arrive 20 minutes before the start of your appointment')).toBeTruthy()
    })
  })

  describe('when the appointment type is community care', () => {
    it('should display the appointment details', () => {
      initializeTestInstance(AppointmentTypeConstants.COMMUNITY_CARE)
      expect(screen.getByText('Community care')).toBeTruthy()
      expect(screen.getByText('Special instructions')).toBeTruthy()
      expect(screen.getByText('Please arrive 20 minutes before the start of your appointment')).toBeTruthy()
    })
  })

  describe('when the appointment type is va', () => {
    it('should display the appointment details', () => {
      initializeTestInstance(AppointmentTypeConstants.VA)
      expect(screen.getByRole('header', { name: 'In-person appointment' })).toBeTruthy()
    })
  })

  describe('when the status is CANCELLED', () => {
    it('should display the schedule another appointment text', () => {
      initializeTestInstance(
        AppointmentTypeConstants.VA,
        AppointmentStatusConstants.CANCELLED,
        undefined,
        undefined,
        AppointmentStatusDetailTypeConsts.PATIENT,
      )
      expect(screen.getByRole('header', { name: 'Need to reschedule?' })).toBeTruthy()
    })
  })

  describe('when the status is not CANCELLED', () => {
    it('should display the add to calendar click for action link', () => {
      expect(screen.getByText('Add to calendar')).toBeTruthy()
    })
  })

  describe('when the appointment is canceled', () => {
    it('should show if you cancelled', () => {
      initializeTestInstance(
        undefined,
        AppointmentStatusConstants.CANCELLED,
        undefined,
        undefined,
        AppointmentStatusDetailTypeConsts.PATIENT,
      )
      expect(screen.getByText('You canceled this appointment.')).toBeTruthy()
    })

    it('should show if you cancelled (rebook)', () => {
      initializeTestInstance(
        undefined,
        AppointmentStatusConstants.CANCELLED,
        undefined,
        undefined,
        AppointmentStatusDetailTypeConsts.PATIENT_REBOOK,
      )
      expect(screen.getByText('You canceled this appointment.')).toBeTruthy()
    })

    it('should show if facility cancelled', () => {
      initializeTestInstance(
        undefined,
        AppointmentStatusConstants.CANCELLED,
        undefined,
        undefined,
        AppointmentStatusDetailTypeConsts.CLINIC,
      )
      expect(screen.getByText('VA Long Beach Healthcare System canceled this appointment.')).toBeTruthy()
    })

    it('should show if facility cancelled (rebook)', () => {
      initializeTestInstance(
        undefined,
        AppointmentStatusConstants.CANCELLED,
        undefined,
        undefined,
        AppointmentStatusDetailTypeConsts.CLINIC_REBOOK,
      )
      expect(screen.getByText('VA Long Beach Healthcare System canceled this appointment.')).toBeTruthy()
    })
  })
})
