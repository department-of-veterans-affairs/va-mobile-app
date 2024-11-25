import React from 'react'

import { screen } from '@testing-library/react-native'

import { context, render } from 'testUtils'

import LoaGate from './LoaGate'

context('LoaGate', () => {
  beforeEach(() => {
    render(<LoaGate />)
  })

  it('initializes correctly', () => {
    expect(screen.getByRole('header', { name: 'Sign in with a verified account' })).toBeTruthy()
    expect(
      screen.getByText(
        'You’ll need to sign in with an identity-verified account through one of our account providers. Identity verification helps us protect all Veterans’ information and prevent scammers from stealing your benefits.',
      ),
    ).toBeTruthy()
    expect(
      screen.getByText(
        'Don’t yet have a verified account? Continue to the sign-in page. Follow the instructions to create a Login.gov or ID.me account. Then come back here and sign in. We’ll help you verify your identity for your account.',
      ),
    ).toBeTruthy()
    expect(
      screen.getByText('Not sure if your account is verified? Sign in now. We’ll tell you if you need to verify.'),
    ).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Continue to sign in' })).toBeTruthy()
  })
})
