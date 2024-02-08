import React from 'react'

import { screen } from '@testing-library/react-native'

import { CommonErrorTypesConstants } from 'constants/errors'
import { PushPreference } from 'store/api'
import { ScreenIDTypesConstants } from 'store/api/types'
import { ErrorsState, InitialState, initialErrorsState, initializeErrorsByScreenID } from 'store/slices'
import { context, mockNavProps, render } from 'testUtils'

import NotificationsSettingsScreen from './NotificationsSettingsScreen'

let mockPushEnabled = false
jest.mock('utils/notifications', () => {
  return {
    notificationsEnabled: jest.fn(() => {
      return Promise.resolve(mockPushEnabled)
    }),
  }
})

jest.mock('store/slices/', () => {
  const actual = jest.requireActual('store/slices')
  const notification = jest.requireActual('store/slices').initialNotificationsState
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
  const apptPrefOn: PushPreference = {
    preferenceId: 'appointment_reminders',
    preferenceName: 'Upcoming appointments',
    value: true,
  }

  const apptPrefOff: PushPreference = {
    preferenceId: 'appointment_reminders',
    preferenceName: 'Upcoming appointments',
    value: false,
  }

  const renderWithProps = (
    notificationsEnabled: boolean,
    systemNotificationsOn: boolean,
    preferences: PushPreference[],
    errorsState: ErrorsState = initialErrorsState,
  ) => {
    const props = mockNavProps()
    mockPushEnabled = notificationsEnabled

    render(<NotificationsSettingsScreen {...props} />, {
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
  }

  describe('appointment reminders switch', () => {
    it('value should be true when pref is set to true', () => {
      renderWithProps(false, true, [apptPrefOn])
      expect(screen.getByRole('switch', { name: 'Upcoming appointments' }).props.accessibilityState.checked).toEqual(
        true,
      )
    })

    it('value should be false when pref is set to true', () => {
      renderWithProps(false, true, [apptPrefOff])
      expect(screen.getByRole('switch', { name: 'Upcoming appointments' }).props.accessibilityState.checked).toEqual(
        false,
      )
    })
  })

  describe('when system notifications are disabled', () => {
    it('hides the notification switches', () => {
      renderWithProps(false, false, [apptPrefOff])
      expect(screen.queryByRole('switch', { name: 'Upcoming appointments' })).toBeFalsy()
      expect(
        screen.getByText(
          "To get notifications from the VA mobile app, you'll need to turn them on in your system settings.",
        ),
      ).toBeTruthy()
    })
  })

  describe('when common error occurs', () => {
    it('should render error component when the stores screenID matches the components screenID', () => {
      const errorsByScreenID = initializeErrorsByScreenID()
      errorsByScreenID[ScreenIDTypesConstants.NOTIFICATIONS_SETTINGS_SCREEN] =
        CommonErrorTypesConstants.NETWORK_CONNECTION_ERROR

      const errorState: ErrorsState = {
        ...initialErrorsState,
        errorsByScreenID,
      }

      renderWithProps(false, true, [apptPrefOn], errorState)
      expect(screen.getByText("The app can't be loaded.")).toBeTruthy()
    })

    it('should not render error component when the stores screenID does not match the components screenID', () => {
      const errorsByScreenID = initializeErrorsByScreenID()
      errorsByScreenID[ScreenIDTypesConstants.ASK_FOR_CLAIM_DECISION_SCREEN_ID] =
        CommonErrorTypesConstants.NETWORK_CONNECTION_ERROR

      const errorState: ErrorsState = {
        ...initialErrorsState,
        errorsByScreenID,
      }

      renderWithProps(false, true, [apptPrefOn], errorState)
      expect(screen.queryByText("The app can't be loaded.")).toBeFalsy()
    })
  })
})
