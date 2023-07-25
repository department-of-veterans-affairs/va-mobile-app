import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { act, ReactTestInstance } from 'react-test-renderer'
import { Switch as RNSwitch } from 'react-native'

import { ErrorComponent } from 'components'
import { context, mockNavProps, render, RenderAPI } from 'testUtils'
import { ErrorsState, initialErrorsState, initializeErrorsByScreenID, InitialState } from 'store/slices'
import { PushPreference } from 'store/api'
import NotificationsSettingsScreen from './NotificationsSettingsScreen'
import { waitFor } from '@testing-library/react-native'
import { ScreenIDTypesConstants } from 'store/api/types'
import { CommonErrorTypesConstants } from 'constants/errors'

let mockPushEnabled = false
jest.mock('utils/notifications', () => {
  return {
    notificationsEnabled: jest.fn(() => {
      return Promise.resolve(mockPushEnabled)
    }),
  }
})

jest.mock('store/slices/', () => {
  let actual = jest.requireActual('store/slices')
  let notification = jest.requireActual('store/slices').initialNotificationsState
  return {
    ...actual,
    loadPushPreferences: jest.fn(() => {
      return {
        type: '',
        payload: {
          ...notification,
        },
      }
    }),
  }
})

context('NotificationsSettingsScreen', () => {
  let component: RenderAPI
  let testInstance: ReactTestInstance

  const apptPrefOn: PushPreference = {
    preferenceId: 'appointment_reminders',
    preferenceName: 'Appointment Reminders',
    value: true,
  }

  const apptPrefOff: PushPreference = {
    preferenceId: 'appointment_reminders',
    preferenceName: 'Appointment Reminders',
    value: false,
  }

  const initializeTestInstance = (notificationsEnabled: boolean, systemNotificationsOn: boolean, preferences: PushPreference[], errorsState: ErrorsState = initialErrorsState) => {
    const props = mockNavProps()
    mockPushEnabled = notificationsEnabled

    component = render(<NotificationsSettingsScreen {...props} />, {
      preloadedState: {
        ...InitialState,
        notifications: {
          ...InitialState.notifications,
          preferences,
          systemNotificationsOn,
        },
        errors: errorsState,
      },
    })

    testInstance = component.UNSAFE_root
  }
  beforeEach(async () => {
    initializeTestInstance(false, true, [apptPrefOn])
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  describe('appointment reminders switch', () => {
    it('value should be true when pref is set to true', async () => {
      await waitFor(() => {
        const rnSwitch = testInstance.findAllByType(RNSwitch)[0]
        expect(rnSwitch.props.value).toEqual(true)
      })
    })

    it('value should be false when pref is set to true', async () => {
      initializeTestInstance(false, true, [apptPrefOff])
      const rnSwitch = testInstance.findAllByType(RNSwitch)[0]
      expect(rnSwitch.props.value).toEqual(false)
    })
  })

  describe('when common error occurs', () => {
    it('should render error component when the stores screenID matches the components screenID', async () => {
      const errorsByScreenID = initializeErrorsByScreenID()
      errorsByScreenID[ScreenIDTypesConstants.NOTIFICATIONS_SETTINGS_SCREEN] = CommonErrorTypesConstants.NETWORK_CONNECTION_ERROR

      const errorState: ErrorsState = {
        ...initialErrorsState,
        errorsByScreenID,
      }

      initializeTestInstance(false, true, [apptPrefOn], errorState)
      expect(testInstance.findAllByType(ErrorComponent)).toHaveLength(1)
    })

    it('should not render error component when the stores screenID does not match the components screenID', async () => {
      const errorsByScreenID = initializeErrorsByScreenID()
      errorsByScreenID[ScreenIDTypesConstants.ASK_FOR_CLAIM_DECISION_SCREEN_ID] = CommonErrorTypesConstants.NETWORK_CONNECTION_ERROR

      const errorState: ErrorsState = {
        ...initialErrorsState,
        errorsByScreenID,
      }

      initializeTestInstance(false, true, [apptPrefOn], errorState)
      expect(testInstance.findAllByType(ErrorComponent)).toHaveLength(0)
    })
  })
})
