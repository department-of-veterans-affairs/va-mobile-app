import 'react-native'
import React from 'react'

// Note: test renderer must be required after react-native.
import {context, mockStore, renderWithProviders} from 'testUtils'
import {act, ReactTestInstance} from 'react-test-renderer'

import BiometricsPreferenceScreen from './BiometricsPreferenceScreen'
import {InitialState} from 'store/reducers'
import {setBiometricsPreference, setDisplayBiometricsPreferenceScreen} from '../../store/actions'
import {TextView, VAButton} from 'components'
import {BIOMETRY_TYPE} from "react-native-keychain";

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

  const initializeTestInstance = (biometric = BIOMETRY_TYPE.TOUCH_ID) => {
    store = mockStore({
      ...InitialState,
      auth:{
        ...InitialState.auth,
        supportedBiometric: biometric
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

  describe('body text', () => {
    it('should display the right text for Touch ID', async () => {
      expect(testInstance.findAllByType(TextView)[1].props.children[0]).toEqual('Touch ID lets you use your fingerprint to sign in to this app.')
    })

    it('should display the right text for Face ID', async () => {
      initializeTestInstance(BIOMETRY_TYPE.FACE_ID)
      expect(testInstance.findAllByType(TextView)[1].props.children[0]).toEqual('Face ID lets us recognize an image of your face to sign you in to this app.')
    })

    it('should display the right text for Face Recognition', async () => {
      initializeTestInstance(BIOMETRY_TYPE.FACE)
      expect(testInstance.findAllByType(TextView)[1].props.children[0]).toEqual('Face recognition lets you use facial recognition to sign into this app.')
    })

    it('should display the right text for Fingerprint', async () => {
      initializeTestInstance(BIOMETRY_TYPE.FINGERPRINT)
      expect(testInstance.findAllByType(TextView)[1].props.children[0]).toEqual('Fingerprint lets you use your fingerprint to sign into this app.')
    })

    it('should display the right text for Iris', async () => {
      initializeTestInstance(BIOMETRY_TYPE.IRIS)
      expect(testInstance.findAllByType(TextView)[1].props.children[0]).toEqual('Iris lets us recognize a video image of your eyes to sign you in to this app.')
    })
  })
})
