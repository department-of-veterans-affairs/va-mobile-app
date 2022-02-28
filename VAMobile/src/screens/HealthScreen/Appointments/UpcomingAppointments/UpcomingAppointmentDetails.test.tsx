import 'react-native'
import React from 'react'
import { InteractionManager, Linking, Pressable } from 'react-native'

// Note: test renderer must be required after react-native.
import { context, mockNavProps, mockStore, render, findByTypeWithSubstring, findByTypeWithText, RenderAPI, waitFor } from 'testUtils'
import { act } from 'react-test-renderer'

import { forEach } from 'underscore'

import { initialAppointmentsState, InitialState } from 'store/slices'
import UpcomingAppointmentDetails from './UpcomingAppointmentDetails'
import {
  AppointmentPhone,
  AppointmentStatus,
  AppointmentType,
  AppointmentCancellationStatusConstants,
  AppointmentCancellationStatusTypes,
  AppointmentStatusDetailType,
  AppointmentTypeConstants,
  AppointmentStatusConstants,
  AppointmentStatusDetailTypeConsts,
} from 'store/api/types'
import { AlertBox, ClickForActionLink, TextView, VAButton } from 'components'
import { isAndroid } from 'utils/platform'
import { defaultAppoinment, defaultAppointmentAttributes, defaultAppointmentLocation } from 'utils/tests/appointments'
import { bookedAppointmentsList, canceledAppointmentList } from 'store/slices/appointmentsSlice.test'

context('UpcomingAppointmentDetails', () => {
  let component: RenderAPI
  let testInstance: any
  let props: any
  let goBackSpy = jest.fn()
  let navigateSpy = jest.fn()

  const runAfterTransition = (testToRun: () => void) => {
    InteractionManager.runAfterInteractions(() => {
      testToRun()
    })
    jest.runAllTimers()
  }

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
  ): void => {
    props = mockNavProps(undefined, { setOptions: jest.fn(), goBack: goBackSpy, navigate: navigateSpy }, { params: { appointmentID: '1' } })

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

    testInstance = component.container
  }

  beforeEach(async () => {
    await waitFor(() => {
      initializeTestInstance()
    })
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
      expect(testInstance.findAllByType(TextView)[0].props.children).toEqual('VA Video Connect\r\nATLAS location')
    })

    it('should display the appointment code', async () => {
      expect(testInstance.findAllByType(TextView)[8].props.children).toEqual('Appointment code: 654321')
    })
  })

  describe('when the appointment type is at home', () => {
    beforeEach(async () => {
      await waitFor(() => {
        initializeTestInstance(AppointmentTypeConstants.VA_VIDEO_CONNECT_HOME)
      })
    })
    it('should display the appointment title', async () => {
      expect(testInstance.findAllByType(TextView)[0].props.children).toEqual('VA Video Connect\r\nhome')
    })
    it('should display the how to join your virtual session text', async () => {
      expect(testInstance.findAllByType(TextView)[4].props.children).toEqual('How to join your virtual session')
      expect(testInstance.findAllByType(TextView)[5].props.children).toEqual('You can join VA Video Connect 30 minutes prior to the start time')
    })

    it('should display the join session button', async () => {
      const buttons = testInstance.findAllByType(VAButton)

      expect(buttons.length).toEqual(1)
      expect(buttons[0].props.testID).toEqual('Join session')
    })

    it('should call Linking openURL on Android', async () => {
      const isAndroidMock = isAndroid as jest.Mock
      isAndroidMock.mockReturnValue(true)
      const buttons = testInstance.findAllByType(Pressable)

      await waitFor(() => {
        buttons[0].props.onPress()
      })

      await waitFor(() => {
        expect(Linking.openURL).toHaveBeenCalled()
      })
    })
  })

  describe('when the appointment type is onsite', () => {
    beforeEach(async () => {
      await waitFor(() => {
        initializeTestInstance(AppointmentTypeConstants.VA_VIDEO_CONNECT_ONSITE)
      })
    })

    it('should display the appointment title', async () => {
      expect(testInstance.findAllByType(TextView)[0].props.children).toEqual('VA Video Connect\r\nVA location')
    })

    it('should state that the video meeting must be joined from the listed location', async () => {
      expect(testInstance.findAllByType(TextView)[5].props.children).toEqual('You must join this video meeting from the VA location listed below.')
    })

    it('should display the provider', async () => {
      expect(testInstance.findAllByType(TextView)[7].props.children).toEqual('Larry R. TestDoctor')
    })
  })

  describe('when the appointment type is gfe', () => {
    beforeEach(async () => {
      await waitFor(() => {
        initializeTestInstance(AppointmentTypeConstants.VA_VIDEO_CONNECT_GFE)
      })
    })
    it('should display the appointment title', async () => {
      expect(testInstance.findAllByType(TextView)[0].props.children).toEqual('VA Video Connect\r\nusing a VA device')
    })

    it('should state that the video meeting must be joined using a VA device', async () => {
      expect(testInstance.findAllByType(TextView)[5].props.children).toEqual("To join this video appointment, you'll need to use a device we provide.")
    })
  })

  describe('when the appointment type is community care', () => {
    beforeEach(async () => {
      await waitFor(() => {
        initializeTestInstance(AppointmentTypeConstants.COMMUNITY_CARE)
      })
    })

    it('should display the appointment title', async () => {
      expect(testInstance.findAllByType(TextView)[0].props.children).toEqual('Community care')
    })
    it('should display a special instructions section to display the comment field', async () => {
      expect(testInstance.findAllByType(TextView)[11].props.children).toEqual('Special instructions')
      expect(testInstance.findAllByType(TextView)[12].props.children).toEqual('Please arrive 20 minutes before the start of your appointment')
    })
  })

  describe('when the appointment type is va', () => {
    it('should display the name of the facility location', async () => {
      expect(testInstance.findAllByType(TextView)[0].props.children).toEqual('VA appointment')
      expect(testInstance.findAllByType(TextView)[4].props.children).toEqual('Blind Rehabilitation Center')
    })
  })

  describe('when the appointment type is covid vaccine', () => {
    beforeEach(async () => {
      await waitFor(() => {
        initializeTestInstance(undefined, undefined, undefined, true)
      })
    })

    it('should display the appointment title', async () => {
      expect(testInstance.findAllByType(TextView)[0].props.children).toEqual('COVID-19 vaccine')
    })
    it('should display the name of the facility location', async () => {
      expect(testInstance.findAllByType(TextView)[4].props.children).toEqual('COVID-19 vaccine')
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

  describe('when the appointment cancellation is successful', () => {
    beforeEach(async () => {
      await waitFor(() => {
        initializeTestInstance(AppointmentTypeConstants.VA_VIDEO_CONNECT_GFE, undefined, undefined, undefined, AppointmentCancellationStatusConstants.SUCCESS)
      })
    })
    it('should display alert', async () => {
      expect(testInstance.findByType(AlertBox)).toBeTruthy()
    })
  })

  describe('when the appointment cancellation is unsuccessful', () => {
    beforeEach(async () => {
      await waitFor(() => {
        initializeTestInstance(AppointmentTypeConstants.VA_VIDEO_CONNECT_GFE, undefined, undefined, undefined, AppointmentCancellationStatusConstants.FAIL)
      })
    })

    it('should display alert', async () => {
      expect(testInstance.findByType(AlertBox)).toBeTruthy()
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

      expect(findByTypeWithSubstring(testInstance, TextView, 'Facility canceled')).toBeTruthy()
    })

    it('should show if facility cancelled (rebook)', async () => {
      await waitFor(() => {
        initializeTestInstance(undefined, AppointmentStatusConstants.CANCELLED, undefined, undefined, undefined, AppointmentStatusDetailTypeConsts.CLINIC_REBOOK)
      })
      expect(findByTypeWithSubstring(testInstance, TextView, 'Facility canceled')).toBeTruthy()
    })
  })

  describe('when navigating to upcoming appointment details page', () => {
    it('should show loading component', async () => {
      await waitFor(() => {
        initializeTestInstance()
        expect(testInstance.findByType(TextView).props.children).toEqual("We're loading your appointment details")
      })
    })
  })
})
