import React from 'react'

import { screen } from '@testing-library/react-native'

import { context, render } from 'testUtils'

import NoClaimLettersScreen from './NoClaimLettersScreen'

context('NoClaimLettersScreen', () => {
  it('Renders NoClaimLettersScreen', () => {
    render(<NoClaimLettersScreen />)
    expect(screen.getByText('No claim letters')).toBeTruthy()
    expect(screen.getByText("You don't have any claim letters yet.")).toBeTruthy()
  })
})
