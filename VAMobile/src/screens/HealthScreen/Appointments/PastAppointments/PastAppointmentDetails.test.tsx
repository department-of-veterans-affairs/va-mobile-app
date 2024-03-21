import React from 'react'

import { screen } from '@testing-library/react-native'

import {
  AppointmentStatus,
  AppointmentStatusConstants,
  AppointmentStatusDetailType,
  AppointmentStatusDetailTypeConsts,
  AppointmentType,
  AppointmentTypeConstants,
} from 'store/api/types'
import { initialAppointmentsState } from 'store/slices'
import { bookedAppointmentsList, canceledAppointmentList } from 'store/slices/appointmentsSlice.test'
import { context, mockNavProps, render } from 'testUtils'

import PastAppointmentDetails from './PastAppointmentDetails'

context('PastAppointmentDetails', () => {
  const initializeTestInstance = (
    appointmentType: AppointmentType = AppointmentTypeConstants.VA,
    status: AppointmentStatus = AppointmentStatusConstants.BOOKED,
    statusDetail: AppointmentStatusDetailType | null = null,
    isCovid: boolean = false,
  ) => {
    const props = mockNavProps(undefined, undefined, { params: { appointmentID: '1' } })

    render(<PastAppointmentDetails {...props} />, {
      preloadedState: {
        appointments: {
          ...initialAppointmentsState,
          loading: false,
          loadingAppointmentCancellation: false,
          upcomingVaServiceError: false,
          upcomingCcServiceError: false,
          pastVaServiceError: false,
          pastCcServiceError: false,
          pastAppointmentsById:
            status === 'BOOKED'
              ? {
                  '1': bookedAppointmentsList.filter((obj) => {
                    return obj.attributes.appointmentType === appointmentType &&
                      obj.attributes.isCovidVaccine === isCovid
                      ? true
                      : false
                  })[0],
                }
              : {
                  '1': canceledAppointmentList.filter((obj) => {
                    return (
                      obj.attributes.appointmentType === appointmentType && obj.attributes.statusDetail === statusDetail
                    )
                  })[0],
                },
          loadedAppointmentsByTimeFrame: {
            upcoming: status === 'BOOKED' ? bookedAppointmentsList : canceledAppointmentList,
            pastThreeMonths: [],
            pastFiveToThreeMonths: [],
            pastEightToSixMonths: [],
            pastElevenToNineMonths: [],
            pastAllCurrentYear: [],
            pastAllLastYear: [],
          },
        },
      },
    })
  }

  it('initializes correctly', () => {
    initializeTestInstance()
    expect(screen.getByRole('header', { name: 'Past in-person appointment' })).toBeTruthy()
    expect(screen.getByText('This appointment happened in the past.')).toBeTruthy()
    expect(screen.getByText('Saturday, February 6, 2021\n11:53 AM PST')).toBeTruthy()
    expect(screen.getByRole('header', { name: 'Blind Rehabilitation Center' })).toBeTruthy()
    expect(screen.getByRole('header', { name: 'Provider' })).toBeTruthy()
    expect(screen.getByText('Provider not noted')).toBeTruthy()
    expect(screen.getAllByRole('header', { name: 'VA Long Beach Healthcare System' })).toBeTruthy()
    expect(screen.getByText('5901 East 7th Street')).toBeTruthy()
    expect(screen.getByText('Long Beach, CA 90822')).toBeTruthy()
    expect(screen.queryByText('Get directions')).toBeFalsy()
    expect(screen.getAllByRole('link', { name: '123-456-7890' })).toBeTruthy()
    expect(screen.getAllByRole('link', { name: 'TTY: 711' })).toBeTruthy()
  })

  describe('when the appointment type is VA_VIDEO_CONNECT_GFE or VA_VIDEO_CONNECT_HOME', () => {
    it('should render only 7 TextViews to display appointment type, date information, and the schedule text', () => {
      initializeTestInstance(AppointmentTypeConstants.VA_VIDEO_CONNECT_GFE)
      expect(screen.getByText('VA Video Connect\r\nusing a VA device')).toBeTruthy()

      initializeTestInstance(AppointmentTypeConstants.VA_VIDEO_CONNECT_HOME)
      expect(screen.getByText('VA Video Connect\r\nHome')).toBeTruthy()
    })
  })

  describe('when the appointment type is VA_VIDEO_CONNECT_ONSITE', () => {
    describe('when the practitioner object exists', () => {
      it('should render a TextView with the practitioners full name', () => {
        initializeTestInstance(AppointmentTypeConstants.VA_VIDEO_CONNECT_ONSITE)
        expect(screen.getByText('Larry R. TestDoctor')).toBeTruthy()
      })
    })
  })

  describe('when the appointment is canceled', () => {
    it('should show if you cancelled', () => {
      initializeTestInstance(undefined, AppointmentStatusConstants.CANCELLED, AppointmentStatusDetailTypeConsts.PATIENT)
      expect(screen.getByText('You canceled this appointment.')).toBeTruthy()
    })

    it('should show if you cancelled (rebook)', () => {
      initializeTestInstance(
        undefined,
        AppointmentStatusConstants.CANCELLED,
        AppointmentStatusDetailTypeConsts.PATIENT_REBOOK,
      )
      expect(screen.getByText('You canceled this appointment.')).toBeTruthy()
    })

    it('should show if facility cancelled', () => {
      initializeTestInstance(undefined, AppointmentStatusConstants.CANCELLED, AppointmentStatusDetailTypeConsts.CLINIC)
      expect(screen.getByText('VA Long Beach Healthcare System canceled this appointment.')).toBeTruthy()
    })

    it('should show if facility cancelled (rebook)', () => {
      initializeTestInstance(
        undefined,
        AppointmentStatusConstants.CANCELLED,
        AppointmentStatusDetailTypeConsts.CLINIC_REBOOK,
      )
      expect(screen.getByText('VA Long Beach Healthcare System canceled this appointment.')).toBeTruthy()
    })
  })
})
