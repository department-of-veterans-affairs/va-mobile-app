import React from 'react'

import { screen } from '@testing-library/react-native'

import { context, render } from 'testUtils'

import LoaGate from './LoaGate'

context('LoaGate', () => {
  beforeEach(() => {
    render(<LoaGate />)
  })

  it('initializes correctly', () => {
    expect(screen.getByRole('header', { name: 'Sign in' })).toBeTruthy()
    expect(
      screen.getByText(
        'Before we give you access to your VA claim and health care information, we need to make sure you’re you. This helps us protect you from fraud and identity theft.',
      ),
    ).toBeTruthy()
    expect(
      screen.getByText(
        'If you haven’t yet verified your identity, we’ll help you complete the process when you sign in.',
      ),
    ).toBeTruthy()
    expect(screen.getByRole('tab', { name: "Read more if you haven't yet verified" })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Continue to sign in' })).toBeTruthy()
  })
})
