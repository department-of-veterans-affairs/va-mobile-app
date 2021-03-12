import 'react-native'
import React from 'react'

// Note: test renderer must be required after react-native.
import {context, mockStore, renderWithProviders} from 'testUtils'
import {act, ReactTestInstance} from 'react-test-renderer'

import BiometricsPreferenceScreen from './BiometricsPreferenceScreen'
import {InitialState} from 'store/reducers'
import {setBiometricsPreference, setDisplayBiometricsPreferenceScreen} from '../../store/actions'
import {VAButton} from 'components'

jest.mock('../../store/actions', () => {
  let actual = jest.requireActual('../../store/actions')
  return {
    ...actual,
    setBiometricsPreference: jest.fn(() => {
      return {
        type: '',
        payload: ''
      }
    }),
    setDisplayBiometricsPreferenceScreen: jest.fn(() => {
      return {
        type: '',
        payload: ''
      }
    })
  }
})

context('BiometricsPreferenceScreen', () => {
  let store: any
  let component: any
  let testInstance: ReactTestInstance

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

  describe('on click of the use biometric button', () => {
    it('should call setBiometricsPreference and setDisplayBiometricsPreferenceScreen', async () => {
      testInstance.findAllByType(VAButton)[0].props.onPress()
      expect(setBiometricsPreference).toHaveBeenCalledWith(true)
      expect(setDisplayBiometricsPreferenceScreen).toHaveBeenCalledWith(false)
    })
  })

  describe('on click of the skip button button', () => {
    it('should call setDisplayBiometricsPreferenceScreen', async () => {
      testInstance.findAllByType(VAButton)[1].props.onPress()
      expect(setDisplayBiometricsPreferenceScreen).toHaveBeenCalledWith(false)
    })
  })
})
