import React from 'react'
import { BIOMETRY_TYPE } from 'react-native-keychain'

import { screen } from '@testing-library/react-native'

import { authKeys } from 'api/auth'
import { QueriesData, context, render } from 'testUtils'

import BiometricsPreferenceScreen from './BiometricsPreferenceScreen'

context('BiometricsPreferenceScreen', () => {
  const initializeTestInstance = (biometric = BIOMETRY_TYPE.TOUCH_ID) => {
    const queriesData: QueriesData = [
      {
        queryKey: authKeys.settings,
        data: {
          canStoreWithBiometric: true,
          displayBiometricsPreferenceScreen: true,
          firstTimeLogin: false,
          loading: false,
          loggedIn: true,
          loggingOut: false,
          shouldStoreWithBiometric: true,
          supportedBiometric: biometric,
          syncing: false,
        },
      },
    ]
    render(<BiometricsPreferenceScreen />, { queriesData })
  }

  it('Touch ID renders correctly', () => {
    initializeTestInstance()
    expect(screen.getByRole('header', { name: 'Do you want to allow us to use Touch ID for sign in?' })).toBeTruthy()
    expect(
      screen.getByText(
        'Touch ID lets you use your fingerprint to sign in to this app.\nYou can always change this later in your app settings.',
      ),
    ).toBeTruthy()
  })

  it('Face ID renders correctly', () => {
    initializeTestInstance(BIOMETRY_TYPE.FACE_ID)
    expect(screen.getByRole('header', { name: 'Do you want to allow us to use Face ID for sign in?' })).toBeTruthy()
    expect(
      screen.getByText(
        'Face ID lets us recognize an image of your face to sign you in to this app.\nYou can always change this later in your app settings.',
      ),
    ).toBeTruthy()
  })

  it('Face renders correctly', () => {
    initializeTestInstance(BIOMETRY_TYPE.FACE)
    expect(
      screen.getByRole('header', { name: 'Do you want to allow us to use Face Recognition for sign in?' }),
    ).toBeTruthy()
    expect(
      screen.getByText(
        'Face recognition lets you use facial recognition to sign into this app.\nYou can always change this later in your app settings.',
      ),
    ).toBeTruthy()
  })

  it('Fingerprint renders correctly', () => {
    initializeTestInstance(BIOMETRY_TYPE.FINGERPRINT)
    expect(screen.getByRole('header', { name: 'Do you want to allow us to use Fingerprint for sign in?' })).toBeTruthy()
    expect(
      screen.getByText(
        'Fingerprint lets you use your fingerprint to sign into this app.\nYou can always change this later in your app settings.',
      ),
    ).toBeTruthy()
  })

  it('Iris renders correctly', () => {
    initializeTestInstance(BIOMETRY_TYPE.IRIS)
    expect(screen.getByRole('header', { name: 'Do you want to allow us to use Iris for sign in?' })).toBeTruthy()
    expect(
      screen.getByText(
        'Iris lets us recognize a video image of your eyes to sign you in to this app.\nYou can always change this later in your app settings.',
      ),
    ).toBeTruthy()
  })
})
