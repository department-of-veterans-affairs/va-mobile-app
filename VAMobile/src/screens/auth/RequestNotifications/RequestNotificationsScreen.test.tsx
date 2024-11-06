import React from 'react'

import { screen } from '@testing-library/react-native'
import { t } from 'i18next'

import { context, render } from 'testUtils'

import RequestNotificationsScreen from './RequestNotificationsScreen'

context('BiometricsPreferenceScreen', () => {
  const initializeTestInstance = () => {
    render(<RequestNotificationsScreen />)
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  it('initializes correctly', () => {
    expect(screen.getByRole('header', { name: t('requestNotifications.stayUpdated') })).toBeTruthy()
    expect(screen.getByText(t('requestNotifications.getNotified'))).toBeTruthy()
    expect(screen.getByText(t('requestNotifications.youCanChange'))).toBeTruthy()
  })
})
