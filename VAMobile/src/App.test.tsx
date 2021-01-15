import 'react-native'
import React from 'react'

import renderer, { act } from 'react-test-renderer'

import { TestProviders, context, mockStore } from 'testUtils'

import { LOGIN_PROMPT_TYPE } from 'store/types'
import { Linking } from 'react-native'
import { handleTokenCallbackUrl } from 'store/actions/auth'
import App, { AuthGuard, AuthedApp } from './App'
import LoginScreen from 'screens/auth/LoginScreen'
import UnlockScreen from 'screens/auth/UnlockScreen'
import {initialAuthState} from "./store/reducers";

jest.mock('./store/actions/auth', () => ({
  handleTokenCallbackUrl: jest.fn(() => ({ type: 'FOO' })),
  initializeAuth: jest.fn(() => ({ type: 'FOO' })),
}))

context('App', () => {
  it('initializes correctly', async () => {
    jest.mock('./store', () => ({
      ...(jest.requireActual('./store') as any),
      configureStore: () => ({
        subscribe: jest.fn(),
        dispatch: jest.fn(),
        getState: jest.fn(),
      }),
    }))

    let component: any
    act(() => {
      component = renderer.create(<App />)
    })
    expect(component).toBeTruthy()
  })

  describe('AuthGuard', () => {
    it('should render loading spinner while initializing', async () => {
      const store = mockStore({
        auth: {...initialAuthState},
      })
      let component: any
      act(() => {
        component = renderer.create(
          <TestProviders store={store}>
            <AuthGuard />
          </TestProviders>,
        )
      })
      expect(component).toBeTruthy()
      expect(() => component.root.findByType(LoginScreen)).toThrow()
      expect(() => component.root.findByType(AuthedApp)).toThrow()
    })

    it('should initilize by registering for linking', async () => {
      const store = mockStore({
        auth: {...initialAuthState},
      })
      let component: any
      act(() => {
        component = renderer.create(
          <TestProviders store={store}>
            <AuthGuard />
          </TestProviders>,
        )
      })
      expect(component).toBeTruthy()
      expect(Linking.addEventListener).toHaveBeenCalled()
    })

    it('should dispatch handleTokenCallbackUrl when auth token result comes back', async () => {
      let component: any

      const store = mockStore({
        auth: { initializing: false, loggedIn: false, loading: false, syncing: false },
      })
      act(() => {
        component = renderer.create(
          <TestProviders store={store}>
            <AuthGuard />
          </TestProviders>,
        )
        expect(component).toBeTruthy()
      })
      expect(Linking.addEventListener).toHaveBeenCalled()
      const spy = Linking.addEventListener as jest.Mock
      const listeners = spy.mock.calls

      act(() => {
        listeners.forEach((k) => {
          const listener = k[1]
          listener({ url: 'vamobile://login-success?code=123&state=5434' })
        })
      })

      expect(handleTokenCallbackUrl).toHaveBeenCalled()
    })

    it('should not dispatch handleTokenCallbackUrl when not an auth result url', async () => {
      let component: any

      const store = mockStore({
        auth: { initializing: false, loggedIn: false, loading: false, syncing: false },
      })
      act(() => {
        component = renderer.create(
          <TestProviders store={store}>
            <AuthGuard />
          </TestProviders>,
        )
        expect(component).toBeTruthy()
      })
      expect(Linking.addEventListener).toHaveBeenCalled()
      const spy = Linking.addEventListener as jest.Mock
      const listeners = spy.mock.calls

      act(() => {
        listeners.forEach((k) => {
          const listener = k[1]
          listener({ url: 'vamobile://foo?code=123&state=5434' })
        })
      })

      expect(handleTokenCallbackUrl).not.toHaveBeenCalled()
    })

    it('should render Login when not authorized', async () => {
      const store = mockStore({
        auth: { initializing: false, loggedIn: false, loading: false, syncing: false },
      })
      let component: any
      act(() => {
        component = renderer.create(
          <TestProviders store={store}>
            <AuthGuard />
          </TestProviders>,
        )
      })
      expect(component).toBeTruthy()
      expect(component.root.findByType(LoginScreen)).toBeTruthy()
    })

    it('should render AuthedApp when authorized', async () => {
      const store = mockStore({
        auth: { initializing: false, loggedIn: true, loading: false, syncing: false },
      })
      let component: any
      act(() => {
        component = renderer.create(
          <TestProviders store={store}>
            <AuthGuard />
          </TestProviders>,
        )
      })
      expect(component.root.findByType(AuthedApp)).toBeTruthy()
    })
  })
})
