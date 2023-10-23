import 'react-native'
import React from 'react'

import { screen } from '@testing-library/react-native'
import { render, context } from 'testUtils'
import LoginScreen from './LoginScreen'

context('LoginScreen', () => {

  beforeEach(() => {
    render(<LoginScreen />)
  })

  it('initializes correctly', async () => {
    expect(screen.getByText('Sign in')).toBeTruthy()
    expect(screen.getByText('Find a VA location')).toBeTruthy()
    expect(screen.getByTestId('AppVersionTestID')).toBeTruthy()
  })
})
