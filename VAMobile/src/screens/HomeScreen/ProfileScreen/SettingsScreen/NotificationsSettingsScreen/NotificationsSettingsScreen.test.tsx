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

    render(<NotificationsSettingsScreen {...props} />, { queriesData: notificationQueriesData })
  }

  describe('when system notifications havent been requested', () => {
    it('hides the notification switches', async () => {
      renderWithProps(true, true, [apptPrefOff])
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
    renderWithProps(true, true, [])
    await waitFor(() => expect(screen.getByText(t('errors.callHelpCenter.sorryWithRefresh'))).toBeTruthy())
  })
})
