import 'react-native'
import React from 'react'

import { context, render } from 'testUtils'
import { screen, fireEvent } from '@testing-library/react-native'
import BiometricsPreferenceScreen from './BiometricsPreferenceScreen'
import { BIOMETRY_TYPE } from 'react-native-keychain'
import { InitialState, setBiometricsPreference, setDisplayBiometricsPreferenceScreen } from 'store/slices'

jest.mock('store/slices', () => {
  let actual = jest.requireActual('store/slices')
  return {
    ...actual,
    setBiometricsPreference: jest.fn(() => {
      return {
        type: '',
        payload: '',
      }
    }),
    setDisplayBiometricsPreferenceScreen: jest.fn(() => {
      return {
        type: '',
        payload: '',
      }
    }),
  }
})

context('BiometricsPreferenceScreen', () => {
  const initializeTestInstance = async (biometric = BIOMETRY_TYPE.TOUCH_ID) => {
    render(<BiometricsPreferenceScreen />, {
      preloadedState: {
        ...InitialState,
        auth: {
          ...InitialState.auth,
          supportedBiometric: biometric,
        },
      },
    })
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  it('initializes correctly', async () => {
    expect(screen.getByText('Do you want to allow us to use Touch ID for sign in?')).toBeTruthy()
    expect(screen.getByText('Touch ID lets you use your fingerprint to sign in to this app.\nYou can always change this later in your app settings.')).toBeTruthy()
    initializeTestInstance(BIOMETRY_TYPE.FACE_ID)
    expect(screen.getByText('Do you want to allow us to use Face ID for sign in?')).toBeTruthy()
    expect(screen.getByText('Face ID lets us recognize an image of your face to sign you in to this app.\nYou can always change this later in your app settings.')).toBeTruthy()
    initializeTestInstance(BIOMETRY_TYPE.FACE)
    expect(screen.getByText('Do you want to allow us to use Face Recognition for sign in?')).toBeTruthy()
    expect(screen.getByText('Face recognition lets you use facial recognition to sign into this app.\nYou can always change this later in your app settings.')).toBeTruthy()
    initializeTestInstance(BIOMETRY_TYPE.FINGERPRINT)
    expect(screen.getByText('Do you want to allow us to use Fingerprint for sign in?')).toBeTruthy()
    expect(screen.getByText('Fingerprint lets you use your fingerprint to sign into this app.\nYou can always change this later in your app settings.')).toBeTruthy()
    initializeTestInstance(BIOMETRY_TYPE.IRIS)
    expect(screen.getByText('Do you want to allow us to use Iris for sign in?')).toBeTruthy()
    expect(screen.getByText('Iris lets us recognize a video image of your eyes to sign you in to this app.\nYou can always change this later in your app settings.')).toBeTruthy()
  })

  describe('on click of the use biometric button', () => {
    it('should call setBiometricsPreference and setDisplayBiometricsPreferenceScreen', async () => {
      fireEvent.press(screen.getByText('Turn on Touch ID'))
      expect(setBiometricsPreference).toHaveBeenCalledWith(true)
      expect(setDisplayBiometricsPreferenceScreen).toHaveBeenCalledWith(false)
    })
  })

  describe('on click of the skip button button', () => {
    it('should call setDisplayBiometricsPreferenceScreen', async () => {
      fireEvent.press(screen.getByText('Skip'))
      expect(setDisplayBiometricsPreferenceScreen).toHaveBeenCalledWith(false)
    })
  })
})
