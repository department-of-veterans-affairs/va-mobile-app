import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { TestProviders, context, mockStore } from 'testUtils'
import renderer, { act } from 'react-test-renderer'

import LoginScreen from './LoginScreen'
import { initialAuthState } from '../../../store/reducers'
context('LoginScreen', () => {
  let store: any
  let component: any

  beforeEach(() => {
    store = mockStore({
      auth: { ...initialAuthState },
    })

    act(() => {
      component = renderer.create(
        <TestProviders store={store}>
          <LoginScreen />
        </TestProviders>,
      )
    })
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })
})
