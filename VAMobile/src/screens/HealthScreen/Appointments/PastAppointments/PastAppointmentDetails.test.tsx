import React from 'react'
import { screen } from '@testing-library/react-native'

import { context, mockNavProps, render } from 'testUtils'
import { initialAppointmentsState } from 'store/slices'
import PastAppointmentDetails from './PastAppointmentDetails'
import {
  AppointmentType,
  AppointmentStatus,
  AppointmentTypeConstants,
  AppointmentStatusConstants,
  AppointmentStatusDetailType,
  AppointmentStatusDetailTypeConsts,
} from 'store/api/types'
import { bookedAppointmentsList, canceledAppointmentList } from 'store/slices/appointmentsSlice.test'

context('PastAppointmentDetails', () => {
  let props: any

  const initializeTestInstance = (
    appointmentType: AppointmentType = AppointmentTypeConstants.VA,
    status: AppointmentStatus = AppointmentStatusConstants.BOOKED,
    statusDetail: AppointmentStatusDetailType | null = null,
    isCovid: boolean = false,
  ) => {
    props = mockNavProps(undefined, undefined, { params: { appointmentID: '1' } })

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
                    return obj.attributes.appointmentType === appointmentType && obj.attributes.isCovidVaccine === isCovid ? true : false
                  })[0],
                }
              : {
                  '1': canceledAppointmentList.filter((obj) => {
                    return obj.attributes.appointmentType === appointmentType && obj.attributes.statusDetail === statusDetail
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
    expect(screen.getByText('VA appointment')).toBeTruthy()
    expect(screen.getByText('Saturday, February 6, 2021\n11:53 AM PST')).toBeTruthy()
    expect(screen.getByText('Blind Rehabilitation Center')).toBeTruthy()
    expect(screen.getByText('VA Long Beach Healthcare System')).toBeTruthy()
    expect(screen.getByText('5901 East 7th Street')).toBeTruthy()
    expect(screen.getByText('Long Beach, CA 90822')).toBeTruthy()
    expect(screen.getByText('Get directions')).toBeTruthy()
    expect(screen.getByText('123-456-7890')).toBeTruthy()
    expect(screen.getByText('TTY: 711')).toBeTruthy()
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
      initializeTestInstance(undefined, AppointmentStatusConstants.CANCELLED, AppointmentStatusDetailTypeConsts.PATIENT_REBOOK)
      expect(screen.getByText('You canceled this appointment.')).toBeTruthy()
    })

    it('should show if facility cancelled', () => {
      initializeTestInstance(undefined, AppointmentStatusConstants.CANCELLED, AppointmentStatusDetailTypeConsts.CLINIC)
      expect(screen.getByText('VA Long Beach Healthcare System canceled this appointment.')).toBeTruthy()
    })

    it('should show if facility cancelled (rebook)', () => {
      initializeTestInstance(undefined, AppointmentStatusConstants.CANCELLED, AppointmentStatusDetailTypeConsts.CLINIC_REBOOK)
      expect(screen.getByText('VA Long Beach Healthcare System canceled this appointment.')).toBeTruthy()
    })
  })

  describe('when the appointment type is covid vaccine', () => {
    it('should display the title name as covid', () => {
      initializeTestInstance(undefined, undefined, undefined, true)
      expect(screen.getAllByText('COVID-19 vaccine')).toBeTruthy()
    })
  })
})
