import React from 'react'

import AsyncStorage from '@react-native-async-storage/async-storage'

import { screen } from '@testing-library/react-native'
import { t } from 'i18next'

import { notificationKeys } from 'api/notifications'
import { GetPushPrefsResponse, PushPreference } from 'api/types'
import * as api from 'store/api'
import { QueriesData, context, mockNavProps, render, waitFor, when } from 'testUtils'

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
    requestNots: boolean,
    notificationsEnabled: boolean,
    systemNotificationsOn: boolean,
    preferences: PushPreference[],
  ) => {
    const props = mockNavProps()

    mockPushEnabled = notificationsEnabled

    const notificationQueriesData: QueriesData = [
      {
        queryKey: notificationKeys.pushPreferences,
        data: {
          preferences: preferences,
        },
      },
      {
        queryKey: notificationKeys.systemSettings,
        data: {
          systemNotificationsOn: systemNotificationsOn,
        },
      },
    ]

    render(<NotificationsSettingsScreen {...props} />, {
      queriesData: notificationQueriesData,
      preloadedState: { auth: { requestNotifications: requestNots } },
    })
  }

  describe('appointment reminders switch', () => {
    it('value should be true when pref is set to true', async () => {
      const prefMock = AsyncStorage.getItem as jest.Mock
      when(prefMock).calledWith('@store_device_endpoint_sid').mockResolvedValue('1')

      const responseData: GetPushPrefsResponse = {
        data: {
          type: 'string',
          id: 'string',
          attributes: {
            preferences: [apptPrefOn],
          },
        },
      }
      when(api.get as jest.Mock)
        .calledWith('/v0/push/prefs/1')
        .mockResolvedValue(responseData)
      renderWithProps(true, true, true, [apptPrefOn])
      await waitFor(() =>
        expect(screen.getByRole('switch', { name: 'Upcoming appointments' }).props.accessibilityState.checked).toEqual(
          true,
        ),
      )
    })

    it('value should be false when pref is set to true', async () => {
      const prefMock = AsyncStorage.getItem as jest.Mock
      when(prefMock).calledWith('@store_device_endpoint_sid').mockResolvedValue('1')

      const responseData: GetPushPrefsResponse = {
        data: {
          type: 'string',
          id: 'string',
          attributes: {
            preferences: [apptPrefOff],
          },
        },
      }
      when(api.get as jest.Mock)
        .calledWith('/v0/push/prefs/1')
        .mockResolvedValue(responseData)
      renderWithProps(true, true, true, [apptPrefOff])
      await waitFor(() =>
        expect(screen.getByRole('switch', { name: 'Upcoming appointments' }).props.accessibilityState.checked).toEqual(
          false,
        ),
      )
    })
  })

  describe('when system notifications are disabled', () => {
    it('hides the notification switches', async () => {
      const prefMock = AsyncStorage.getItem as jest.Mock
      when(prefMock).calledWith('@store_device_endpoint_sid').mockResolvedValue('1')

      const responseData: GetPushPrefsResponse = {
        data: {
          type: 'string',
          id: 'string',
          attributes: {
            preferences: [apptPrefOff],
          },
        },
      }
      when(api.get as jest.Mock)
        .calledWith('/v0/push/prefs/1')
        .mockResolvedValue(responseData)
      renderWithProps(true, false, false, [apptPrefOff])
      await waitFor(() => expect(screen.queryByRole('switch', { name: 'Upcoming appointments' })).toBeFalsy())
      await waitFor(() =>
        expect(screen.getByText('To get app notifications, turn them on in your device settings.')).toBeTruthy(),
      )
    })
  })
  describe('when system notifications havent been requested', () => {
    it('hides the notification switches', async () => {
      renderWithProps(false, true, true, [apptPrefOff])
      await waitFor(() => expect(screen.getByText(t('requestNotifications.getNotified'))).toBeTruthy())
    })
  })

  it("renders error component when preferences can't be loaded", async () => {
    const responseData: GetPushPrefsResponse = {
      data: {
        type: 'string',
        id: 'string',
        attributes: {
          preferences: [],
        },
      },
    }
    when(api.get as jest.Mock)
      .calledWith('/v0/push/prefs/1')
      .mockResolvedValue(responseData)
    renderWithProps(true, true, true, [])
    await waitFor(() =>
      expect(
        screen.getByText(
          "We're sorry. Something went wrong on our end. Please refresh this screen or try again later.",
        ),
      ).toBeTruthy(),
    )
  })
})
