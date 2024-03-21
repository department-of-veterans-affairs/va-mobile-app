import React from 'react'
import { BIOMETRY_TYPE } from 'react-native-keychain'

import { fireEvent, screen } from '@testing-library/react-native'

import { context, render } from 'testUtils'

import BiometricsPreferenceScreen from './BiometricsPreferenceScreen'

context('BiometricsPreferenceScreen', () => {
  const initializeTestInstance = (biometric = BIOMETRY_TYPE.TOUCH_ID) => {
    render(<BiometricsPreferenceScreen />)
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  it('initializes correctly', () => {
    expect(screen.getByRole('header', { name: 'Do you want to allow us to use Touch ID for sign in?' })).toBeTruthy()
    expect(
      screen.getByText(
        'Touch ID lets you use your fingerprint to sign in to this app.\nYou can always change this later in your app settings.',
      ),
    ).toBeTruthy()
    initializeTestInstance(BIOMETRY_TYPE.FACE_ID)
    expect(screen.getByRole('header', { name: 'Do you want to allow us to use Face ID for sign in?' })).toBeTruthy()
    expect(
      screen.getByText(
        'Face ID lets us recognize an image of your face to sign you in to this app.\nYou can always change this later in your app settings.',
      ),
    ).toBeTruthy()
    initializeTestInstance(BIOMETRY_TYPE.FACE)
    expect(
      screen.getByRole('header', { name: 'Do you want to allow us to use Face Recognition for sign in?' }),
    ).toBeTruthy()
    expect(
      screen.getByText(
        'Face recognition lets you use facial recognition to sign into this app.\nYou can always change this later in your app settings.',
      ),
    ).toBeTruthy()
    initializeTestInstance(BIOMETRY_TYPE.FINGERPRINT)
    expect(screen.getByRole('header', { name: 'Do you want to allow us to use Fingerprint for sign in?' })).toBeTruthy()
    expect(
      screen.getByText(
        'Fingerprint lets you use your fingerprint to sign into this app.\nYou can always change this later in your app settings.',
      ),
    ).toBeTruthy()
    initializeTestInstance(BIOMETRY_TYPE.IRIS)
    expect(screen.getByRole('header', { name: 'Do you want to allow us to use Iris for sign in?' })).toBeTruthy()
    expect(
      screen.getByText(
        'Iris lets us recognize a video image of your eyes to sign you in to this app.\nYou can always change this later in your app settings.',
      ),
    ).toBeTruthy()
  })
})
