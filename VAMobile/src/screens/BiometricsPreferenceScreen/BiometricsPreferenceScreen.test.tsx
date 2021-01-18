import 'react-native'
import React from 'react'

// Note: test renderer must be required after react-native.
import {context, mockStore, renderWithProviders} from 'testUtils'
import { act } from 'react-test-renderer'

import BiometricsPreferenceScreen from './BiometricsPreferenceScreen'
import {InitialState} from 'store/reducers'

context('BiometricsPreferenceScreen', () => {
  let store: any
  let component: any
  let testInstance: any

  const initializeTestInstance = () => {
    store = mockStore({
      ...InitialState,
      auth:{
        ...InitialState.auth,
        supportedBiometric: 'Touch ID'
      }
    })

    act(() => {
      component = renderWithProviders(<BiometricsPreferenceScreen />, store)
    })

    testInstance = component.root
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })
})
