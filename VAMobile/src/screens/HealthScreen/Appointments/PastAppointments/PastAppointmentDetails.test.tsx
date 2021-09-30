import 'react-native'
import React from 'react'

// Note: test renderer must be required after react-native.
import { context, findByTypeWithSubstring, mockNavProps, mockStore, renderWithProviders } from 'testUtils'
import { act, ReactTestInstance } from 'react-test-renderer'

import { InitialState } from 'store/reducers'
import PastAppointmentDetails from './PastAppointmentDetails'
import {
  AppointmentType,
  AppointmentStatus,
  AppointmentTypeConstants,
  AppointmentStatusConstants,
  AppointmentStatusDetailType,
  AppointmentStatusDetailTypeConsts,
} from 'store/api/types'
import { Box, TextView } from 'components'
import { defaultAppoinment, defaultAppointmentAttributes } from 'utils/tests/appointments'
import { InteractionManager } from 'react-native'

context('PastAppointmentDetails', () => {
  let store: any
  let component: any
  let testInstance: ReactTestInstance
  let props: any

  const runAfterTransition = (testToRun: () => void) => {
    InteractionManager.runAfterInteractions(() => {
      testToRun()
    })
    jest.runAllTimers()
  }

  const initializeTestInstance = (
    appointmentType: AppointmentType = AppointmentTypeConstants.VA,
    status: AppointmentStatus = AppointmentStatusConstants.BOOKED,
    statusDetail: AppointmentStatusDetailType | null = null,
    covidVaccination?: boolean,
  ): void => {
    store = mockStore({
      ...InitialState,
      appointments: {
        ...InitialState.appointments,
        appointment: {
          ...defaultAppoinment,
          attributes: {
            ...defaultAppointmentAttributes,
            status,
            statusDetail,
            appointmentType,
            covidVaccination,
          },
        },
      },
    })

    props = mockNavProps(undefined, undefined, { params: { appointmentID: '1' } })

    act(() => {
      component = renderWithProviders(<PastAppointmentDetails {...props} />, store)
    })

    testInstance = component.root
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  describe('when the appointment type is VA_VIDEO_CONNECT_GFE or VA_VIDEO_CONNECT_HOME', () => {
    it('should render only 4 TextViews to display appointment type, date information, and the schedule text', async () => {
      initializeTestInstance(AppointmentTypeConstants.VA_VIDEO_CONNECT_GFE)
      let allTextViews: ReactTestInstance[]
      runAfterTransition(() => {
        allTextViews = testInstance.findAllByType(TextView)
        expect(allTextViews.length).toEqual(4)
        expect(allTextViews[0].props.children).toEqual('VA Video Connect\r\nusing a VA device')
      })

      initializeTestInstance(AppointmentTypeConstants.VA_VIDEO_CONNECT_HOME)
      runAfterTransition(() => {
        allTextViews = testInstance.findAllByType(TextView)
        expect(allTextViews.length).toEqual(4)
        expect(allTextViews[0].props.children).toEqual('VA Video Connect\r\nhome')
      })
    })
  })

  describe('when the appointment type is VA_VIDEO_CONNECT_ONSITE', () => {
    describe('when the practitioner object exists', () => {
      it('should render a TextView with the practitioners full name', async () => {
        initializeTestInstance(AppointmentTypeConstants.VA_VIDEO_CONNECT_ONSITE)
        runAfterTransition(() => {
          expect(testInstance.findAllByType(TextView)[4].props.children).toEqual('Larry TestDoctor')
        })
      })
    })
  })

  describe('when the appointment is canceled', () => {
    it('should show if you cancelled', async () => {
      initializeTestInstance(undefined, AppointmentStatusConstants.CANCELLED, AppointmentStatusDetailTypeConsts.PATIENT)
      runAfterTransition(() => {
        expect(findByTypeWithSubstring(testInstance, TextView, 'You canceled')).toBeTruthy()
      })
    })

    it('should show if you cancelled (rebook)', async () => {
      initializeTestInstance(undefined, AppointmentStatusConstants.CANCELLED, AppointmentStatusDetailTypeConsts.PATIENT_REBOOK)
      runAfterTransition(() => {
        expect(findByTypeWithSubstring(testInstance, TextView, 'You canceled')).toBeTruthy()
      })
    })

    it('should show if facility cancelled', async () => {
      initializeTestInstance(undefined, AppointmentStatusConstants.CANCELLED, AppointmentStatusDetailTypeConsts.CLINIC)
      runAfterTransition(() => {
        expect(findByTypeWithSubstring(testInstance, TextView, 'Facility canceled')).toBeTruthy()
      })
    })

    it('should show if facility cancelled (rebook)', async () => {
      initializeTestInstance(undefined, AppointmentStatusConstants.CANCELLED, AppointmentStatusDetailTypeConsts.CLINIC_REBOOK)
      runAfterTransition(() => {
        expect(findByTypeWithSubstring(testInstance, TextView, 'Facility canceled')).toBeTruthy()
      })
    })
  })

  describe('when navigating to past appointment details page', () => {
    it('should show loading component', async () => {
      expect(testInstance.findByType(TextView).props.children).toEqual("We're loading your appointment details")
    })
  })

  describe('when the appointment type is covid vaccine', () => {
    beforeEach(() => {
      initializeTestInstance(undefined, undefined, undefined, true)
      runAfterTransition(() => {
        expect(testInstance.findAllByType(TextView)[0].props.children).toEqual('COVID-19 vaccine')
      })
    })
    it('should display the name of the facility location', async () => {
      runAfterTransition(() => {
        expect(testInstance.findAllByType(TextView)[3].props.children).toEqual('COVID-19 vaccine')
      })
    })
  })
})
