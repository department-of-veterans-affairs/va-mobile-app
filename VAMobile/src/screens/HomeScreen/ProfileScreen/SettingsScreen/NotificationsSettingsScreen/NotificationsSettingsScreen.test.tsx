import React from 'react'

import { screen } from '@testing-library/react-native'

import { notificationKeys } from 'api/notifications'
import { PushPreference } from 'api/types'
import { QueriesData, context, mockNavProps, render } from 'testUtils'

import NotificationsSettingsScreen from './NotificationsSettingsScreen'

let mockPushEnabled = false
jest.mock('utils/notifications', () => {
  return {
    notificationsEnabled: jest.fn(() => {
      return Promise.resolve(mockPushEnabled)
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
  ) => {
    const props = mockNavProps()
    mockPushEnabled = notificationsEnabled

    const notificationQueriesData: QueriesData = [
      {
        queryKey: notificationKeys.settings,
        data: {
          preferences: preferences,
          systemNotificationsOn: systemNotificationsOn,
        },
      },
    ]

    render(<NotificationsSettingsScreen {...props} />, { queriesData: notificationQueriesData })
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
})
