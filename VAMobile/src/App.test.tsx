import React from 'react'
import { Linking } from 'react-native'

import { screen } from '@testing-library/react-native'

import { authKeys } from 'api/auth'
import { QueriesData, context, render } from 'testUtils'

import { AuthGuard } from './App'

jest.mock('./utils/remoteConfig', () => ({
  activateRemoteConfig: jest.fn(() => Promise.resolve()),
  featureEnabled: jest.fn(() => false),
}))

jest.mock('react-native-keyboard-manager', () => ({
  setEnable: jest.fn(() => {}),
  setKeyboardDistanceFromTextField: jest.fn(() => {}),
  setEnableAutoToolbar: jest.fn(() => {}),
}))

jest.mock('react-native/Libraries/Linking/Linking', () => ({
  getInitialURL: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
}))

context('App', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('AuthGuard', () => {
    it('should render loading spinner while initializing', () => {
      render(<AuthGuard />, {
        preloadedState: {
          settings: {
            loadingRemoteConfig: true,
          },
        },
      })

      expect(screen.getByTestId('Splash-page')).toBeTruthy()
    })

    it('should render Login when not authorized', () => {
      const queriesData: QueriesData = [
        {
          queryKey: authKeys.settings,
          data: {
            canStoreWithBiometric: false,
            displayBiometricsPreferenceScreen: false,
            firstTimeLogin: false,
            loading: false,
            loggedIn: false,
            loggingOut: false,
            shouldStoreWithBiometric: false,
            supportedBiometric: undefined,
            syncing: false,
          },
        },
      ]
      render(<AuthGuard />, {
        preloadedState: {
          settings: {
            loadingRemoteConfig: false,
          },
        },
        queriesData: queriesData,
      })
      expect(Linking.addEventListener).toHaveBeenCalled()
      expect(screen.queryByText('Profile')).toBeFalsy()
      expect(screen.queryByText('Home')).toBeFalsy()
      expect(screen.queryByText('Benefits')).toBeFalsy()
      expect(screen.queryByText('Health')).toBeFalsy()
      expect(screen.queryByText('Payments')).toBeFalsy()
    })

    it('should render AuthedApp when authorized', () => {
      const queriesData: QueriesData = [
        {
          queryKey: authKeys.settings,
          data: {
            canStoreWithBiometric: false,
            displayBiometricsPreferenceScreen: false,
            firstTimeLogin: false,
            loading: false,
            loggedIn: true,
            loggingOut: false,
            shouldStoreWithBiometric: false,
            supportedBiometric: undefined,
            syncing: false,
          },
        },
      ]
      render(<AuthGuard />, {
        preloadedState: {
          settings: {
            remoteConfigActivated: true,
          },
        },
        queriesData: queriesData,
      })

      expect(screen.getByText('Profile')).toBeTruthy()
      expect(screen.getByText('Home')).toBeTruthy()
      expect(screen.getByText('Benefits')).toBeTruthy()
      expect(screen.getByText('Health')).toBeTruthy()
      expect(screen.getByText('Payments')).toBeTruthy()
    })
  })
})
