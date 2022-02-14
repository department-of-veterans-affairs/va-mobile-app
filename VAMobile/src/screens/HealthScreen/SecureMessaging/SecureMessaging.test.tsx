import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance, act } from 'react-test-renderer'

import { context, mockNavProps, render, RenderAPI, waitFor } from 'testUtils'
import SecureMessaging from './SecureMessaging'
import { updateSecureMessagingTab, ErrorsState, initialAuthorizedServicesState, initialErrorsState, initializeErrorsByScreenID, InitialState } from 'store/slices'
import { TouchableOpacity } from 'react-native'
import { CommonErrorTypesConstants } from 'constants/errors'
import { ScreenIDTypesConstants } from 'store/api/types'
import { ErrorComponent } from 'components/CommonErrorComponents'
import NotEnrolledSM from './NotEnrolledSM/NotEnrolledSM'

jest.mock('store/slices', () => {
  let actual = jest.requireActual('store/slices')
  return {
    ...actual,
    updateSecureMessagingTab: jest.fn(() => {
      return {
        type: '',
        payload: '',
      }
    }),
  }
})

context('SecureMessaging', () => {
  let component: RenderAPI
  let testInstance: ReactTestInstance
  let props: any

  const initializeTestInstance = (errorsState: ErrorsState = initialErrorsState, authorizedSM = true) => {
    props = mockNavProps()

    component = render(<SecureMessaging {...props} />, {
      preloadedState: {
        ...InitialState,
        errors: errorsState,
        authorizedServices: {
          ...initialAuthorizedServicesState,
          secureMessaging: authorizedSM,
        },
      },
    })

    testInstance = component.container
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  it('initializes correctly', async () => {
    await waitFor(() => {
      expect(component).toBeTruthy()
    })
  })

  describe('when user is not authorized for secure messaging', () => {
    it('should display NotEnrolledSM component', async () => {
      await waitFor(() => {
        initializeTestInstance(initialErrorsState, false)
        expect(testInstance.findAllByType(NotEnrolledSM).length).toEqual(1)
      })
    })
  })

  describe('when common error occurs', () => {
    it('should render the error component', async () => {
      const errorsByScreenID = initializeErrorsByScreenID()
      errorsByScreenID[ScreenIDTypesConstants.SECURE_MESSAGING_SCREEN_ID] = CommonErrorTypesConstants.NETWORK_CONNECTION_ERROR

      const errorState: ErrorsState = {
        ...initialErrorsState,
        errorsByScreenID,
      }

      await waitFor(() => {
        initializeTestInstance(errorState)
        expect(testInstance.findAllByType(ErrorComponent).length).toEqual(1)
      })
    })

    it('should not render error component when the stores screenID does not match the components screenID', async () => {
      const errorsByScreenID = initializeErrorsByScreenID()
      errorsByScreenID[ScreenIDTypesConstants.CLAIM_DETAILS_SCREEN_ID] = CommonErrorTypesConstants.NETWORK_CONNECTION_ERROR
      const errorState: ErrorsState = {
        ...initialErrorsState,
        errorsByScreenID,
      }

      await waitFor(() => {
        initializeTestInstance(errorState)
        expect(testInstance.findAllByType(ErrorComponent)).toHaveLength(0)
      })
    })
  })

  describe('when loading messages error occurs', () => {
    it('should render the loading messages error component', async () => {
      const errorsByScreenID = initializeErrorsByScreenID()
      errorsByScreenID[ScreenIDTypesConstants.SECURE_MESSAGING_SCREEN_ID] = CommonErrorTypesConstants.APP_LEVEL_ERROR_HEALTH_LOAD

      const errorState: ErrorsState = {
        ...initialErrorsState,
        errorsByScreenID,
      }

      await waitFor(() => {
        initializeTestInstance(errorState)
        expect(testInstance.findAllByType(ErrorComponent).length).toEqual(1)
        expect(testInstance.findByProps({ phone: '877-327-0022' })).toBeTruthy()
      })
    })

    it('should not render error component when the stores screenID does not match the components screenID', async () => {
      const errorsByScreenID = initializeErrorsByScreenID()
      errorsByScreenID[ScreenIDTypesConstants.CLAIM_DETAILS_SCREEN_ID] = CommonErrorTypesConstants.APP_LEVEL_ERROR_HEALTH_LOAD

      const errorState: ErrorsState = {
        ...initialErrorsState,
        errorsByScreenID,
      }

      await waitFor(() => {
        initializeTestInstance(errorState)
        expect(testInstance.findAllByType(ErrorComponent)).toHaveLength(0)
      })
    })
  })

  describe('on click of a segmented control tab', () => {
    it('should call updateSecureMessagingTab', async () => {
      await waitFor(() => {
        testInstance.findAllByType(TouchableOpacity)[0].props.onPress()
        expect(updateSecureMessagingTab).toHaveBeenCalled()
      })
    })
  })
})
