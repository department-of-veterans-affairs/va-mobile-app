import React from 'react'

import { screen } from '@testing-library/react-native'

import { context, render } from 'testUtils'

import NoLettersScreen from './NoLettersScreen'

context('NoLettersScreen', () => {
  it('initializes correctly', () => {
    render(<NoLettersScreen />)
    expect(screen.getByRole('header', { name: "We couldn't find information about your VA letters" })).toBeTruthy()
    expect(
      screen.getByText('If you think you should have access to this information, please call our VA benefits hotline.'),
    ).toBeTruthy()
    expect(screen.getByRole('link', { name: '800-827-1000' })).toBeTruthy()
    expect(screen.getByRole('link', { name: 'TTY: 711' })).toBeTruthy()
  })
})
