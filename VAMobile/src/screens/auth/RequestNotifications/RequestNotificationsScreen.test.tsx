import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'
import { t } from 'i18next'

import { InitialState, setNotificationsPreferenceScreen, setRequestNotifications } from 'store/slices'
import { context, render } from 'testUtils'

import RequestNotificationsScreen from './RequestNotificationsScreen'

jest.mock('store/slices', () => {
  const actual = jest.requireActual('store/slices')
  return {
    ...actual,
    completeRequestNotifications: jest.fn(() => {
      return {
        type: '',
        payload: '',
      }
    }),
    setNotificationsPreferenceScreen: jest.fn(() => {
      return {
        type: '',
        payload: '',
      }
    }),
    setRequestNotifications: jest.fn(() => {
      return {
        type: '',
        payload: '',
      }
    }),
  }
})

context('BiometricsPreferenceScreen', () => {
  const initializeTestInstance = () => {
    render(<RequestNotificationsScreen />, {
      preloadedState: {
        auth: {
          ...InitialState.auth,
        },
      },
    })
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  it('initializes correctly', () => {
    expect(screen.getByRole('header', { name: t('requestNotifications.stayUpdated') })).toBeTruthy()
    expect(screen.getByText(t('requestNotifications.getNotified'))).toBeTruthy()
    expect(screen.getByText(t('requestNotifications.youCanChange'))).toBeTruthy()
  })

  describe('on click of the turn on notifications button', () => {
    it('should call setNotificationsPreferenceScreen and setRequestNotifications', () => {
      fireEvent.press(screen.getByRole('button', { name: t('requestNotifications.turnOn') }))
      expect(setNotificationsPreferenceScreen).toHaveBeenCalledWith(false)
      expect(setRequestNotifications).toHaveBeenCalledWith(true)
    })
  })

  describe('on click of skip notifications for now button', () => {
    it('should call setNotificationsPreferenceScreen', () => {
      fireEvent.press(screen.getByRole('button', { name: t('requestNotifications.turnOn') }))
      expect(setNotificationsPreferenceScreen).toHaveBeenCalledWith(false)
    })
  })
})
