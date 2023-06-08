import 'react-native'
import React from 'react'
import { Alert, Pressable } from 'react-native'

// Note: test renderer must be required after react-native.
import { context, mockNavProps, render, findByTypeWithSubstring, findByTypeWithText, RenderAPI, waitFor } from 'testUtils'
import { when } from 'jest-when'

import { forEach } from 'underscore'

import { initialAppointmentsState, InitialState } from 'store/slices'
import UpcomingAppointmentDetails from './UpcomingAppointmentDetails'
import {
  AppointmentPhone,
  AppointmentStatus,
  AppointmentType,
  AppointmentCancellationStatusTypes,
  AppointmentStatusDetailType,
  AppointmentTypeConstants,
  AppointmentStatusConstants,
  AppointmentStatusDetailTypeConsts,
} from 'store/api/types'
import { ClickForActionLink, TextView, VAButton } from 'components'
import { bookedAppointmentsList, canceledAppointmentList } from 'store/slices/appointmentsSlice.test'

let mockNavigationSpy = jest.fn()
jest.mock('utils/hooks', () => {
  let original = jest.requireActual('utils/hooks')
  return {
    ...original,
    useRouteNavigation: () => {
      return mockNavigationSpy
    },
  }
})

context('UpcomingAppointmentDetails', () => {
  let component: RenderAPI
  let testInstance: any
  let props: any
  let goBackSpy = jest.fn()
  let navigateSpy = jest.fn()
  let navigateToSessionNotStartedSpy = jest.fn()

  let apptPhoneData = {
    areaCode: '123',
    number: '456-7890',
    extension: '',
  }

  const initializeTestInstance = (
    appointmentType: AppointmentType = AppointmentTypeConstants.VA,
    status: AppointmentStatus = AppointmentStatusConstants.BOOKED,
    phoneData: AppointmentPhone | null = apptPhoneData,
    isCovid: boolean = false,
    appointmentCancellationStatus?: AppointmentCancellationStatusTypes,
    statusDetail: AppointmentStatusDetailType | null = null,
    hasUrl: boolean = false,
  ): void => {
    props = mockNavProps(undefined, { setOptions: jest.fn(), goBack: goBackSpy, navigate: navigateSpy }, { params: { appointmentID: '1' } })

    when(mockNavigationSpy)
      .mockReturnValue(() => {})
      .calledWith('SessionNotStarted')
      .mockReturnValue(navigateToSessionNotStartedSpy)

    component = render(<UpcomingAppointmentDetails {...props} />, {
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
          upcomingAppointmentsById:
            status === 'BOOKED'
              ? phoneData === null
                ? { '1': bookedAppointmentsList[8] }
                : hasUrl
                ? { '1': bookedAppointmentsList[9] }
                : {
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
          appointmentCancellationStatus,
        },
      },
    })

    testInstance = component.UNSAFE_root
  }

  beforeEach(async () => {
    await waitFor(() => {
      initializeTestInstance()
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('initializes correctly', async () => {
    await waitFor(() => {
      expect(component).toBeTruthy()
    })
  })

  describe('when the appointment type is atlas', () => {
    beforeEach(async () => {
      await waitFor(() => {
        initializeTestInstance(AppointmentTypeConstants.VA_VIDEO_CONNECT_ATLAS)
      })
    })

    it('should display the appointment title', async () => {
      expect(testInstance.findAllByType(TextView)[3].props.children).toEqual('VA Video Connect\r\nATLAS location')
    })

    it('should display the appointment code', async () => {
      expect(testInstance.findAllByType(TextView)[11].props.children).toEqual('Appointment code: 654321')
    })

    it('should display a special instructions section to display the comment field', async () => {
      expect(testInstance.findAllByType(TextView)[13].props.children).toEqual('Special instructions')
      expect(testInstance.findAllByType(TextView)[14].props.children).toEqual('Please arrive 20 minutes before the start of your appointment')
    })
  })

  describe('when the appointment type is at home', () => {
    beforeEach(async () => {
      await waitFor(() => {
        initializeTestInstance(AppointmentTypeConstants.VA_VIDEO_CONNECT_HOME)
      })
    })
    it('should display the appointment title', async () => {
      expect(testInstance.findAllByType(TextView)[3].props.children).toEqual('VA Video Connect\r\nHome')
    })
    it('should display the how to join your virtual session text', async () => {
      expect(testInstance.findAllByType(TextView)[6].props.children).toEqual('How to join your virtual session')
      expect(testInstance.findAllByType(TextView)[7].props.children).toEqual('You can join VA Video Connect 30 minutes prior to the start time.')
    })

    it('should display the join session button', async () => {
      const buttons = testInstance.findAllByType(VAButton)

      expect(buttons.length).toEqual(1)
      expect(buttons[0].props.testID).toEqual('Join session')
    })

    it('should prompt an alert for leaving the app when the URL is present', async () => {
      await waitFor(() => {
        initializeTestInstance(AppointmentTypeConstants.VA_VIDEO_CONNECT_HOME, undefined, undefined, undefined, undefined, undefined, true)
      })

      jest.spyOn(Alert, 'alert')
      const buttons = testInstance.findAllByType(Pressable)

      await waitFor(() => {
        buttons[0].props.onPress()
      })

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalled()
      })
    })

    it('should navigate to the SessionNotStarted screen when the URL is empty', async () => {
      const buttons = testInstance.findAllByType(Pressable)

      await waitFor(() => {
        buttons[0].props.onPress()
      })

      await waitFor(() => {
        expect(navigateToSessionNotStartedSpy).toHaveBeenCalled()
      })
    })

    it('should display a special instructions section to display the comment field', async () => {
      expect(testInstance.findAllByType(TextView)[10].props.children).toEqual('Special instructions')
      expect(testInstance.findAllByType(TextView)[11].props.children).toEqual('Please arrive 20 minutes before the start of your appointment')
    })
  })

  describe('when the appointment type is onsite', () => {
    beforeEach(async () => {
      await waitFor(() => {
        initializeTestInstance(AppointmentTypeConstants.VA_VIDEO_CONNECT_ONSITE)
      })
    })

    it('should display the appointment title', async () => {
      expect(testInstance.findAllByType(TextView)[3].props.children).toEqual('VA Video Connect\r\nVA location')
    })

    it('should state that the video meeting must be joined from the listed location', async () => {
      expect(testInstance.findAllByType(TextView)[7].props.children).toEqual('You must join this video meeting from the VA location listed below.')
    })

    it('should display the provider', async () => {
      expect(testInstance.findAllByType(TextView)[9].props.children).toEqual('Larry R. TestDoctor')
    })

    it('should display a special instructions section to display the comment field', async () => {
      expect(testInstance.findAllByType(TextView)[17].props.children).toEqual('Special instructions')
      expect(testInstance.findAllByType(TextView)[18].props.children).toEqual('Please arrive 20 minutes before the start of your appointment')
    })
  })

  describe('when the appointment type is gfe', () => {
    beforeEach(async () => {
      await waitFor(() => {
        initializeTestInstance(AppointmentTypeConstants.VA_VIDEO_CONNECT_GFE)
      })
    })
    it('should display the appointment title', async () => {
      expect(testInstance.findAllByType(TextView)[3].props.children).toEqual('VA Video Connect\r\nusing a VA device')
    })

    it('should state that the video meeting must be joined using a VA device', async () => {
      expect(testInstance.findAllByType(TextView)[7].props.children).toEqual("To join this video appointment, you'll need to use a device we provide.")
    })

    it('should display a special instructions section to display the comment field', async () => {
      expect(testInstance.findAllByType(TextView)[8].props.children).toEqual('Special instructions')
      expect(testInstance.findAllByType(TextView)[9].props.children).toEqual('Please arrive 20 minutes before the start of your appointment')
    })
  })

  describe('when the appointment type is community care', () => {
    beforeEach(async () => {
      await waitFor(() => {
        initializeTestInstance(AppointmentTypeConstants.COMMUNITY_CARE)
      })
    })

    it('should display the appointment title', async () => {
      expect(testInstance.findAllByType(TextView)[3].props.children).toEqual('Community care')
    })

    it('should display a special instructions section to display the comment field', async () => {
      expect(testInstance.findAllByType(TextView)[12].props.children).toEqual('Special instructions')
      expect(testInstance.findAllByType(TextView)[13].props.children).toEqual('Please arrive 20 minutes before the start of your appointment')
    })
  })

  describe('when the appointment type is va', () => {
    it('should display the name of the facility location', async () => {
      expect(testInstance.findAllByType(TextView)[3].props.children).toEqual('VA appointment')
      expect(testInstance.findAllByType(TextView)[6].props.children).toEqual('Blind Rehabilitation Center')
    })

    it('should display a special instructions section to display the comment field', async () => {
      expect(testInstance.findAllByType(TextView)[13].props.children).toEqual('Special instructions')
      expect(testInstance.findAllByType(TextView)[14].props.children).toEqual('Please arrive 20 minutes before the start of your appointment')
    })
  })

  describe('when the appointment type is covid vaccine', () => {
    beforeEach(async () => {
      await waitFor(() => {
        initializeTestInstance(undefined, undefined, undefined, true)
      })
    })

    it('should display the appointment title', async () => {
      expect(testInstance.findAllByType(TextView)[3].props.children).toEqual('COVID-19 vaccine')
    })
    it('should display the name of the facility location', async () => {
      expect(testInstance.findAllByType(TextView)[6].props.children).toEqual('COVID-19 vaccine')
    })

    it('should display a special instructions section to display the comment field', async () => {
      expect(testInstance.findAllByType(TextView)[13].props.children).toEqual('Special instructions')
      expect(testInstance.findAllByType(TextView)[14].props.children).toEqual('Please arrive 20 minutes before the start of your appointment')
    })
  })

  describe('when there is no phone data', () => {
    it('should not display any click to call link', async () => {
      await waitFor(() => {
        initializeTestInstance(undefined, undefined, null) // force value of phone to null (undefined will use default arg value)
      })

      const allClickForActionLinks = testInstance.findAllByType(ClickForActionLink)

      forEach(allClickForActionLinks, (clickForActionLink) => {
        expect(clickForActionLink.props.linkType).not.toEqual('call')
      })
    })
  })

  describe('when the status is CANCELLED', () => {
    it('should display the schedule another appointment text', async () => {
      await waitFor(() => {
        initializeTestInstance(AppointmentTypeConstants.VA, AppointmentStatusConstants.CANCELLED, undefined, false, undefined, AppointmentStatusDetailTypeConsts.PATIENT)
      })

      expect(findByTypeWithText(testInstance, TextView, 'To schedule another appointment, please visit VA.gov or call your VA medical center.')).toBeTruthy()
    })
  })

  describe('when the status is not CANCELLED', () => {
    it('should display the add to calendar click for action link', async () => {
      expect(testInstance.findAllByType(ClickForActionLink)[0].props.displayedText).toEqual('Add to calendar')
    })
  })

  describe('when the appointment is canceled', () => {
    it('should show if you cancelled', async () => {
      await waitFor(() => {
        initializeTestInstance(undefined, AppointmentStatusConstants.CANCELLED, undefined, undefined, undefined, AppointmentStatusDetailTypeConsts.PATIENT)
      })

      expect(findByTypeWithSubstring(testInstance, TextView, 'You canceled')).toBeTruthy()
    })

    it('should show if you cancelled (rebook)', async () => {
      await waitFor(() => {
        initializeTestInstance(undefined, AppointmentStatusConstants.CANCELLED, undefined, undefined, undefined, AppointmentStatusDetailTypeConsts.PATIENT_REBOOK)
      })

      expect(findByTypeWithSubstring(testInstance, TextView, 'You canceled')).toBeTruthy()
    })

    it('should show if facility cancelled', async () => {
      await waitFor(() => {
        initializeTestInstance(undefined, AppointmentStatusConstants.CANCELLED, undefined, undefined, undefined, AppointmentStatusDetailTypeConsts.CLINIC)
      })

      expect(findByTypeWithSubstring(testInstance, TextView, 'VA Long Beach Healthcare System canceled this appointment.')).toBeTruthy()
    })

    it('should show if facility cancelled (rebook)', async () => {
      await waitFor(() => {
        initializeTestInstance(undefined, AppointmentStatusConstants.CANCELLED, undefined, undefined, undefined, AppointmentStatusDetailTypeConsts.CLINIC_REBOOK)
      })
      expect(findByTypeWithSubstring(testInstance, TextView, 'VA Long Beach Healthcare System canceled this appointment.')).toBeTruthy()
    })
  })
})
