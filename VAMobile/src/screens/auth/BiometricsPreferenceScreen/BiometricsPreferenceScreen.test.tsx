import React from 'react'
import { BIOMETRY_TYPE } from 'react-native-keychain'

import { fireEvent, screen } from '@testing-library/react-native'
import { t } from 'i18next'

import { InitialState, setBiometricsPreference, setDisplayBiometricsPreferenceScreen } from 'store/slices'
import { context, render } from 'testUtils'
import { getSupportedBiometricText } from 'utils/formattingUtils'

import BiometricsPreferenceScreen from './BiometricsPreferenceScreen'

jest.mock('store/slices', () => {
  const actual = jest.requireActual('store/slices')
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
  const initializeTestInstance = (biometric = BIOMETRY_TYPE.TOUCH_ID) => {
    render(<BiometricsPreferenceScreen />, {
      preloadedState: {
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

  it('initializes correctly', () => {
    expect(
      screen.getByRole('header', {
        name: t('biometricsPreference.doYouWantToAllow', {
          biometricsText: t('biometric.touchID'),
        }),
      }),
    ).toBeTruthy()
    expect(screen.getByText(t('biometricsPreference.bodyText.touchID'))).toBeTruthy()
    expect(screen.getByText(t('biometricsPreference.youCanAlwaysChangeThis'))).toBeTruthy()
    initializeTestInstance(BIOMETRY_TYPE.FACE_ID)
    expect(
      screen.getByRole('header', {
        name: t('biometricsPreference.doYouWantToAllow', {
          biometricsText: t('biometric.faceID'),
        }),
      }),
    ).toBeTruthy()
    expect(screen.getByText(t('biometricsPreference.bodyText.faceID'))).toBeTruthy()
    expect(screen.getByText(t('biometricsPreference.youCanAlwaysChangeThis'))).toBeTruthy()
    initializeTestInstance(BIOMETRY_TYPE.FACE)
    expect(
      screen.getByRole('header', {
        name: t('biometricsPreference.doYouWantToAllow', {
          biometricsText: t('biometric.faceRecognition'),
        }),
      }),
    ).toBeTruthy()
    expect(screen.getByText(t('biometricsPreference.bodyText.faceRecognition'))).toBeTruthy()
    expect(screen.getByText(t('biometricsPreference.youCanAlwaysChangeThis'))).toBeTruthy()
    initializeTestInstance(BIOMETRY_TYPE.FINGERPRINT)
    expect(
      screen.getByRole('header', {
        name: t('biometricsPreference.doYouWantToAllow', {
          biometricsText: t('biometric.fingerPrint'),
        }),
      }),
    ).toBeTruthy()
    expect(screen.getByText(t('biometricsPreference.bodyText.fingerPrint'))).toBeTruthy()
    expect(screen.getByText(t('biometricsPreference.youCanAlwaysChangeThis'))).toBeTruthy()
    initializeTestInstance(BIOMETRY_TYPE.IRIS)
    expect(
      screen.getByRole('header', {
        name: t('biometricsPreference.doYouWantToAllow', {
          biometricsText: t('biometric.iris'),
        }),
      }),
    ).toBeTruthy()
    expect(screen.getByText(t('biometricsPreference.bodyText.iris'))).toBeTruthy()
    expect(screen.getByText(t('biometricsPreference.youCanAlwaysChangeThis'))).toBeTruthy()
  })

  describe('on click of the use biometric button', () => {
    it('should call setBiometricsPreference and setDisplayBiometricsPreferenceScreen', () => {
      fireEvent.press(
        screen.getByRole('button', {
          name: t('biometricsPreference.useBiometric', {
            biometricsText: getSupportedBiometricText(BIOMETRY_TYPE.TOUCH_ID || '', t),
          }),
        }),
      )
      expect(setBiometricsPreference).toHaveBeenCalledWith(true)
      expect(setDisplayBiometricsPreferenceScreen).toHaveBeenCalledWith(false)
    })
  })

  describe('on click of the skip button button', () => {
    it('should call setDisplayBiometricsPreferenceScreen', () => {
      fireEvent.press(screen.getByRole('button', { name: t('biometricsPreference.skip') }))
      expect(setDisplayBiometricsPreferenceScreen).toHaveBeenCalledWith(false)
    })
  })
})
