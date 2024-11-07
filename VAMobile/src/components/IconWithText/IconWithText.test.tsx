import React from 'react'

import { screen } from '@testing-library/react-native'

import { context, render } from 'testUtils'

import IconWithText from './IconWithText'

context('VAIconWithText', () => {
  beforeEach(() => {
    render(<IconWithText name="Home" label="Home" labelA11y="A11y label" testID="HomeSelected" />)
  })

  it('renders label, a11yLabel, and icon', () => {
    expect(screen.getByText('Home')).toBeTruthy()
    expect(screen.getByLabelText('A11y label')).toBeTruthy()
    expect(screen.getByTestId('HomeSelected')).toBeTruthy()
  })
})
