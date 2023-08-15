import React from 'react'

import { context, render, act, RenderAPI, waitFor } from 'testUtils'

import { Linking } from 'react-native'
import App, { AuthGuard, AuthedApp } from './App'
import LoginScreen from 'screens/auth/LoginScreen'
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
  
  it('initializes correctly', async () => {
    let component: any
    jest.mock('./store', () => ({
      ...(jest.requireActual('./store') as any),
      configureStore: () => ({
        subscribe: jest.fn(),
        dispatch: jest.fn(),
        getState: jest.fn(),
      }),
    }))

    component = render(<App />, { preloadedState: { auth: initialAuthState }, navigationProvided: true })

    expect(component).toBeTruthy()
  })

  describe('AuthGuard', () => {
    it('should render loading spinner while initializing', async () => {
      let component: any
      await waitFor(async () => {
        component = render(<AuthGuard />, {
          preloadedState: {
            auth: { ...initialAuthState, initializing: true },
          },
        })
      })

      expect(component).toBeTruthy()
      expect(() => component.UNSAFE_root.findByType(LoginScreen)).toThrow()
      expect(() => component.UNSAFE_root.findByType(AuthedApp)).toThrow()
    })

    it('should initilize by registering for linking', async () => {
      let component: any

      await waitFor(() => {
        component = render(<AuthGuard />, {
          preloadedState: {
            auth: { ...initialAuthState },
          },
        })
      })
      expect(component).toBeTruthy()
      expect(Linking.addEventListener).toHaveBeenCalled()
    })

    it('should dispatch handleTokenCallbackUrl when auth token result comes back', async () => {
      let component: any

      await waitFor(() => {
        component = render(<AuthGuard />, {
          preloadedState: {
            auth: { ...initialAuthState, initializing: false },
          },
        })
      })

      const spy = Linking.addEventListener as jest.Mock
      const listeners = spy.mock.calls

      await waitFor(() => {
        listeners.forEach((k) => {
          const listener = k[1]
          listener({ url: 'vamobile://login-success?code=123&state=5434' })
        })
      })
      expect(Linking.addEventListener).toHaveBeenCalled()
      expect(handleTokenCallbackUrl).toHaveBeenCalled()
    })

    it('should not dispatch handleTokenCallbackUrl when not an auth result url', async () => {
      let component: any

      await waitFor(() => {
        component = render(<AuthGuard />, {
          preloadedState: {
            auth: { ...initialAuthState, initializing: false },
          },
        })
      })

      expect(Linking.addEventListener).toHaveBeenCalled()
      const spy = Linking.addEventListener as jest.Mock
      const listeners = spy.mock.calls

      await waitFor(() => {
        listeners.forEach((k) => {
          const listener = k[1]
          listener({ url: 'vamobile://foo?code=123&state=5434' })
        })
      })

      expect(handleTokenCallbackUrl).not.toHaveBeenCalled()
    })

    it('should render Login when not authorized', async () => {
      await waitFor(() => {
        let { UNSAFE_root } = render(<AuthGuard />, {
          preloadedState: {
            auth: { ...initialAuthState, initializing: false },
          },
        })
        expect(UNSAFE_root).toBeTruthy()
        expect(UNSAFE_root.findByType(LoginScreen)).toBeTruthy()
      })
    })

    it('should render AuthedApp when authorized', async () => {
      await waitFor(() => {
        let { UNSAFE_root } = render(<AuthGuard />, {
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

        expect(UNSAFE_root.findByType(AuthedApp)).toBeTruthy()
      })
    })
  })
})
