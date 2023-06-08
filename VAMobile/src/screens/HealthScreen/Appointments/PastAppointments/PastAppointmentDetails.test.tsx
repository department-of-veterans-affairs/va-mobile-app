import 'react-native'
import React from 'react'

// Note: test renderer must be required after react-native.
import { context, findByTypeWithSubstring, mockNavProps, waitFor, render, RenderAPI } from 'testUtils'
import { ReactTestInstance } from 'react-test-renderer'

import { initialAppointmentsState, InitialState } from 'store/slices'
import PastAppointmentDetails from './PastAppointmentDetails'
import {
  AppointmentType,
  AppointmentStatus,
  AppointmentTypeConstants,
  AppointmentStatusConstants,
  AppointmentStatusDetailType,
  AppointmentStatusDetailTypeConsts,
} from 'store/api/types'
import { TextView } from 'components'

import { InteractionManager } from 'react-native'
import { bookedAppointmentsList, canceledAppointmentList } from 'store/slices/appointmentsSlice.test'

context('PastAppointmentDetails', () => {
  let component: RenderAPI
  let testInstance: ReactTestInstance
  let props: any

  afterEach(() => {
    jest.clearAllMocks()
  })
  
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
    isCovid: boolean = false,
  ) => {
    props = mockNavProps(undefined, undefined, { params: { appointmentID: '1' } })

    component = render(<PastAppointmentDetails {...props} />, {
      preloadedState: {
        ...InitialState,
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

    testInstance = component.UNSAFE_root
  }

  it('initializes correctly', async () => {
    await waitFor(() => {
      initializeTestInstance()
      expect(component).toBeTruthy()
    })
  })

  describe('when the appointment type is VA_VIDEO_CONNECT_GFE or VA_VIDEO_CONNECT_HOME', () => {
    it('should render only 7 TextViews to display appointment type, date information, and the schedule text', async () => {
      await waitFor(() => {
        initializeTestInstance(AppointmentTypeConstants.VA_VIDEO_CONNECT_GFE)
      })

      let allTextViews: ReactTestInstance[]

      allTextViews = testInstance.findAllByType(TextView)
      expect(allTextViews.length).toEqual(6)
      expect(allTextViews[3].props.children).toEqual('VA Video Connect\r\nusing a VA device')

      await waitFor(() => {
        initializeTestInstance(AppointmentTypeConstants.VA_VIDEO_CONNECT_HOME)
      })

      allTextViews = testInstance.findAllByType(TextView)
      expect(allTextViews.length).toEqual(6)
      expect(allTextViews[3].props.children).toEqual('VA Video Connect\r\nHome')
    })
  })

  describe('when the appointment type is VA_VIDEO_CONNECT_ONSITE', () => {
    describe('when the practitioner object exists', () => {
      it('should render a TextView with the practitioners full name', async () => {
        await waitFor(() => {
          initializeTestInstance(AppointmentTypeConstants.VA_VIDEO_CONNECT_ONSITE)
        })

        expect(testInstance.findAllByType(TextView)[6].props.children).toEqual('Larry R. TestDoctor')
      })
    })
  })

  describe('when the appointment is canceled', () => {
    it('should show if you cancelled', async () => {
      await waitFor(() => {
        initializeTestInstance(undefined, AppointmentStatusConstants.CANCELLED, AppointmentStatusDetailTypeConsts.PATIENT)
      })

      expect(findByTypeWithSubstring(testInstance, TextView, 'You canceled')).toBeTruthy()
    })

    it('should show if you cancelled (rebook)', async () => {
      await waitFor(() => {
        initializeTestInstance(undefined, AppointmentStatusConstants.CANCELLED, AppointmentStatusDetailTypeConsts.PATIENT_REBOOK)
      })
      expect(findByTypeWithSubstring(testInstance, TextView, 'You canceled')).toBeTruthy()
    })

    it('should show if facility cancelled', async () => {
      await waitFor(() => {
        initializeTestInstance(undefined, AppointmentStatusConstants.CANCELLED, AppointmentStatusDetailTypeConsts.CLINIC)
      })
      expect(findByTypeWithSubstring(testInstance, TextView, 'VA Long Beach Healthcare System canceled this appointment.')).toBeTruthy()
    })

    it('should show if facility cancelled (rebook)', async () => {
      await waitFor(() => {
        initializeTestInstance(undefined, AppointmentStatusConstants.CANCELLED, AppointmentStatusDetailTypeConsts.CLINIC_REBOOK)
      })
      expect(findByTypeWithSubstring(testInstance, TextView, 'VA Long Beach Healthcare System canceled this appointment.')).toBeTruthy()
    })
  })

  describe('when the appointment type is covid vaccine', () => {
    beforeEach(async () => {
      await waitFor(() => {
        initializeTestInstance(undefined, undefined, undefined, true)
      })
    })

    it('should display the title name as covid', async () => {
      expect(testInstance.findAllByType(TextView)[3].props.children).toEqual('COVID-19 vaccine')
    })
    it('should display the name of the facility location', async () => {
      expect(testInstance.findAllByType(TextView)[5].props.children).toEqual('COVID-19 vaccine')
    })
  })
})
