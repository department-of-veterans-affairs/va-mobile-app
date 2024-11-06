import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'
import { t } from 'i18next'

import NotificationManager, { useNotificationContext } from 'components/NotificationManager'
import { context, render } from 'testUtils'

import RequestNotificationsScreen from './RequestNotificationsScreen'

context('BiometricsPreferenceScreen', () => {
  const setRequestNotifications = jest.fn()
  const setNotificationsPreferenceScreen = jest.fn()
  const initializeTestInstance = () => {
    const notificationContext = useNotificationContext()
    notificationContext.setRequestNotifications = setRequestNotifications
    notificationContext.setRequestNotificationPreferenceScreen = setNotificationsPreferenceScreen
    render(
      <NotificationManager {...notificationContext}>
        <RequestNotificationsScreen />
      </NotificationManager>,
    )
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
