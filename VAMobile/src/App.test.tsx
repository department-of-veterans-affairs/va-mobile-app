import React from 'react'

import { context, render } from 'testUtils'
import { screen } from '@testing-library/react-native'
import { Linking } from 'react-native'
import { AuthGuard } from './App'
import { handleTokenCallbackUrl, initialAuthState, initialSnackBarState } from 'store/slices'

jest.mock('./utils/remoteConfig', () => ({
  activateRemoteConfig: jest.fn(() => Promise.resolve()),
  featureEnabled: jest.fn(() => false),
}))

jest.mock('./store/slices', () => {
  let original = jest.requireActual('./store/slices')
  return {
    ...original,
    handleTokenCallbackUrl: jest.fn(() => ({ type: 'FOO' })),
    initializeAuth: jest.fn(() => ({ type: 'FOO' })),
  }
})

jest.mock('react-native-keyboard-manager', () => ({
  setEnable: jest.fn(() => {}),
  setKeyboardDistanceFromTextField: jest.fn(() => {}),
  setEnableAutoToolbar: jest.fn(() => {}),
}))

jest.mock('react-native/Libraries/Linking/Linking', () => ({
  getInitialURL: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
}));

context('App', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('AuthGuard', () => {
    it('should render loading spinner while initializing', async () => {
      render(<AuthGuard />, {
        preloadedState: {
          auth: { ...initialAuthState, initializing: true },
        },
      })

      expect(screen.getByTestId('Splash-page')).toBeTruthy()
    })

    it('should initilize by registering for linking', async () => {
      render(<AuthGuard />, {
        preloadedState: {
          auth: { ...initialAuthState },
        },
      })
      expect(Linking.addEventListener).toHaveBeenCalled()
    })

    it('should dispatch handleTokenCallbackUrl when auth token result comes back', async () => {
      render(<AuthGuard />, {
        preloadedState: {
          auth: { ...initialAuthState, initializing: false },
        },
      })

      const spy = Linking.addEventListener as jest.Mock
      const listeners = spy.mock.calls
      listeners.forEach((k) => {
        const listener = k[1]
        listener({ url: 'vamobile://login-success?code=123&state=5434' })
      })
      expect(Linking.addEventListener).toHaveBeenCalled()
      expect(handleTokenCallbackUrl).toHaveBeenCalled()
    })

    it('should not dispatch handleTokenCallbackUrl when not an auth result url', async () => {
      render(<AuthGuard />, {
        preloadedState: {
          auth: { ...initialAuthState, initializing: false },
        },
      })

      expect(Linking.addEventListener).toHaveBeenCalled()
      const spy = Linking.addEventListener as jest.Mock
      const listeners = spy.mock.calls
      listeners.forEach((k) => {
        const listener = k[1]
        listener({ url: 'vamobile://foo?code=123&state=5434' })
      })

      expect(handleTokenCallbackUrl).not.toHaveBeenCalled()
    })

    it('should render Login when not authorized', async () => {
      render(<AuthGuard />, {
        preloadedState: {
          auth: { ...initialAuthState, initializing: false },
        },
      })
      expect(screen.queryByText('Profile')).toBeFalsy()
      expect(screen.queryByText('Home')).toBeFalsy()
      expect(screen.queryByText('Benefits')).toBeFalsy()
      expect(screen.queryByText('Health')).toBeFalsy()
      expect(screen.queryByText('Payments')).toBeFalsy()
    })

    it('should render AuthedApp when authorized', async () => {
      render(<AuthGuard />, {
        preloadedState: {
          auth: {
            ...initialAuthState,
            initializing: false,
            loggedIn: true,
          },
          snackBar: {
            ...initialSnackBarState,
          },
          settings: {
            remoteConfigActivated: true,
          },
        },
      })

      expect(screen.getByText('Profile')).toBeTruthy()
      expect(screen.getByText('Home')).toBeTruthy()
      expect(screen.getByText('Benefits')).toBeTruthy()
      expect(screen.getByText('Health')).toBeTruthy()
      expect(screen.getByText('Payments')).toBeTruthy()
    })
  })
})
