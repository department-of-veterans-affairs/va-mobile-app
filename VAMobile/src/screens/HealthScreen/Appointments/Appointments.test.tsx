import 'react-native'
import React from 'react'

import { context, mockNavProps, render, RenderAPI, waitFor, when } from 'testUtils'
import { TouchableOpacity } from 'react-native'

import * as api from 'store/api'
import Appointments from './Appointments'
import { InitialState, AppointmentsState, initialAppointmentsState, ErrorsState, initialErrorsState, initializeErrorsByScreenID } from 'store/slices'
import { CommonErrorTypesConstants } from 'constants/errors'
import { AlertBox, ErrorComponent } from 'components'
import { AppointmentsErrorServiceTypesConstants } from 'store/api/types'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import NoMatchInRecords from './NoMatchInRecords/NoMatchInRecords'
import { featureEnabled } from 'utils/remoteConfig'

type mockAppointmentServiceErrors = {
  pastVaServiceError?: boolean
  pastCcServiceError?: boolean
  upcomingVaServiceError?: boolean
  upcomingCcServiceError?: boolean
}

jest.mock('utils/remoteConfig')

context('AppointmentsScreen', () => {
  let component: RenderAPI
  let testInstance: any

  const initializeTestInstance = (
    errorsState: ErrorsState = initialErrorsState,
    serviceErrors: mockAppointmentServiceErrors = {},
    appointmentsAuthorized = true,
    requestsEnabled: boolean = false,
  ) => {
    const appointments: AppointmentsState = {
      ...initialAppointmentsState,
      ...serviceErrors,
    }

    let mockFeatureEnabled = featureEnabled as jest.Mock
    when(mockFeatureEnabled).calledWith('appointmentRequests').mockReturnValue(requestsEnabled)

    const props = mockNavProps()

    component = render(<Appointments {...props} />, {
      preloadedState: {
        ...InitialState,
        appointments,
        errors: errorsState,
        authorizedServices: {
          ...InitialState.authorizedServices,
          appointments: appointmentsAuthorized,
        },
      },
    })

    testInstance = component.UNSAFE_root
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  it('initializes correctly', async () => {
    await waitFor(() => {
      expect(component).toBeTruthy()
    })
  })

  describe('when the user clicks the upcoming appointments segmented tab', () => {
    it('should update the upcoming appointments to be selected', async () => {
      await waitFor(() => {
        const upcomingButton = testInstance.findAllByType(TouchableOpacity)[0]
        upcomingButton.props.onPress()
        expect(upcomingButton.props.isSelected).toEqual(true)
      })
    })
  })

  describe('when the user clicks the past appointments segmented tab', () => {
    it('should update the past appointments tab to be selected', async () => {
      await waitFor(() => {
        const pastButton = testInstance.findAllByType(TouchableOpacity)[1]
        pastButton.props.onPress()
        expect(pastButton.props.isSelected).toEqual(true)
      })
    })
  })

  describe('when upcomingVaServiceError exist for upcoming appointments', () => {
    describe('while on upcoming appointments tab', () => {
      it('should display an alertbox specifying some appointments are not available', async () => {
        await waitFor(() => {
          initializeTestInstance(undefined, { upcomingVaServiceError: true })
          expect(testInstance.findAllByType(AlertBox).length).toEqual(1)
        })
      })
    })

    describe('while on past appointments tab', () => {
      it('should not display an alertbox', async () => {
        initializeTestInstance(undefined, { upcomingVaServiceError: true })
        await waitFor(() => {
          const pastButton = testInstance.findAllByType(TouchableOpacity)[1]
          pastButton.props.onPress()
        })
        expect(testInstance.findAllByType(AlertBox).length).toEqual(0)
      })
    })
  })

  describe('when upcomingCcServiceError exist for upcoming appointments', () => {
    describe('while on upcoming appointments tab', () => {
      it('should display an alertbox specifying some appointments are not available', async () => {
        initializeTestInstance(undefined, { upcomingCcServiceError: true })
        await waitFor(() => {
          expect(testInstance.findAllByType(AlertBox).length).toEqual(1)
        })
      })
    })
  })

  describe('when pastVaServiceError exist for past appointments', () => {
    describe('while on past appointments tab', () => {
      it('should display an AlertBox specifying some appointments are not available', async () => {
        await waitFor(() => {
          when(api.get as jest.Mock)
            .calledWith(`/v0/appointments`, expect.anything())
            .mockResolvedValue({
              data: [],
              meta: {
                errors: [{ source: AppointmentsErrorServiceTypesConstants.VA }],
              },
            })
          initializeTestInstance(undefined, { pastVaServiceError: true })
        })

        await waitFor(() => {
          const pastButton = testInstance.findAllByType(TouchableOpacity)[1]
          pastButton.props.onPress()
          expect(testInstance.findAllByType(AlertBox).length).toEqual(1)
        })
      })
    })

    describe('while on upcoming appointments tab', () => {
      it('should not display an alertbox', async () => {
        initializeTestInstance(undefined, { pastVaServiceError: true })
        await waitFor(() => {
          expect(testInstance.findAllByType(AlertBox).length).toEqual(0)
        })
      })
    })

    describe('when pastCcServiceError exist for past appointments', () => {
      describe('while on past appointments tab', () => {
        it('should display an AlertBox specifying some appointments are not available', async () => {
          await waitFor(() => {
            when(api.get as jest.Mock)
              .calledWith(`/v0/appointments`, expect.anything())
              .mockResolvedValue({
                data: [],
                meta: {
                  errors: [{ source: AppointmentsErrorServiceTypesConstants.COMMUNITY_CARE }],
                },
              })
            initializeTestInstance(undefined, { pastCcServiceError: true })
          })

          await waitFor(() => {
            const pastButton = testInstance.findAllByType(TouchableOpacity)[1]
            pastButton.props.onPress()
            expect(testInstance.findAllByType(AlertBox).length).toEqual(1)
          })
        })
      })
    })

    describe('when appointments is not authorized', () => {
      it('should display the NoMatchInRecords component', async () => {
        initializeTestInstance(undefined, undefined, false)
        await waitFor(() => {
          expect(testInstance.findAllByType(NoMatchInRecords).length).toEqual(1)
        })
      })
    })

    describe('when common error occurs', () => {
      it('should render error component when the stores screenID matches the components screenID', async () => {
        const errorsByScreenID = initializeErrorsByScreenID()
        errorsByScreenID[ScreenIDTypesConstants.APPOINTMENTS_SCREEN_ID] = CommonErrorTypesConstants.NETWORK_CONNECTION_ERROR

        const errorState: ErrorsState = {
          ...initialErrorsState,
          errorsByScreenID,
        }

        await waitFor(() => {
          when(api.get as jest.Mock)
            .calledWith(`/v0/appointments`, expect.anything())
            .mockRejectedValue({ networkError: true } as api.APIError)
          initializeTestInstance(errorState)
        })

        expect(testInstance.findAllByType(ErrorComponent)).toHaveLength(1)
      })

      it('should not render error component when the stores screenID does not match the components screenID', async () => {
        const errorsByScreenID = initializeErrorsByScreenID()
        errorsByScreenID[ScreenIDTypesConstants.ASK_FOR_CLAIM_DECISION_SCREEN_ID] = CommonErrorTypesConstants.NETWORK_CONNECTION_ERROR

        const errorState: ErrorsState = {
          ...initialErrorsState,
          errorsByScreenID,
        }

        initializeTestInstance(errorState)
        await waitFor(() => {
          expect(testInstance.findAllByType(ErrorComponent)).toHaveLength(0)
        })
      })
    })

    describe('when loading appointment error occurs', () => {
      it('should render loading error component when the stores screenID matches the components screenID and when errorType matches', async () => {
        const errorsByScreenID = initializeErrorsByScreenID()
        errorsByScreenID[ScreenIDTypesConstants.APPOINTMENTS_SCREEN_ID] = CommonErrorTypesConstants.APP_LEVEL_ERROR_HEALTH_LOAD

        const errorState: ErrorsState = {
          ...initialErrorsState,
          errorsByScreenID,
        }

        await waitFor(() => {
          when(api.get as jest.Mock)
            .calledWith(`/v0/appointments`, expect.anything())
            .mockRejectedValue({ networkError: true } as api.APIError)
          initializeTestInstance(errorState)
        })

        expect(testInstance.findAllByType(ErrorComponent)).toHaveLength(1)
        expect(testInstance.findByProps({ phone: '877-327-0022' })).toBeTruthy()
      })

      it('should not render error component when the stores screenID does not match the components screenID', async () => {
        const errorsByScreenID = initializeErrorsByScreenID()
        errorsByScreenID[ScreenIDTypesConstants.CLAIM_DETAILS_SCREEN_ID] = CommonErrorTypesConstants.APP_LEVEL_ERROR_HEALTH_LOAD

        const errorState: ErrorsState = {
          ...initialErrorsState,
          errorsByScreenID,
        }

        initializeTestInstance(errorState)
        await waitFor(() => {
          expect(testInstance.findAllByType(ErrorComponent)).toHaveLength(0)
        })
      })
    })
  })

  describe('Appointment Requessts', () => {
    it('does not display prescriptions button if feature toggle disabled', async () => {
      await waitFor(() => {
        expect(() => component.getByText('Request appointment')).toThrow()
      })
    })

    it('does not display prescriptions button if feature toggle enabled', async () => {
      initializeTestInstance(undefined, undefined, true, true)
      await waitFor(() => {
        expect(() => component.getByText('Request appointment')).not.toThrow()
        expect(component.getByText('Request appointment')).toBeDefined()
      })
    })
  })
})
