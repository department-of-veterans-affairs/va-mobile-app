import React from 'react'

import { screen } from '@testing-library/react-native'

import { context, render } from 'testUtils'

import LoginScreen from './LoginScreen'

context('LoginScreen', () => {
  beforeEach(() => {
    render(<LoginScreen />)
  })

  it('initializes correctly', () => {
    expect(screen.getByRole('button', { name: 'Sign in' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Find a VA location' })).toBeTruthy()
    expect(screen.getByTestId('AppVersionTestID')).toBeTruthy()
  })
})
