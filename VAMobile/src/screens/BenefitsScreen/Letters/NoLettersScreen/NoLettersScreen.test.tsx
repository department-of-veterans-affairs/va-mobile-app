import 'react-native'
import React from 'react'

import { screen } from '@testing-library/react-native'
import { context, render } from 'testUtils'
import NoLettersScreen from './NoLettersScreen'

context('NoLettersScreen', () => {
  it('initializes correctly', async () => {
    render(<NoLettersScreen />)
    expect(screen.getByText("We couldn't find information about your VA letters")).toBeTruthy()
    expect(screen.getByText('If you think you should have access to this information, please call our VA benefits hotline.')).toBeTruthy()
    expect(screen.getByText('800-827-1000')).toBeTruthy()
    expect(screen.getByText('TTY: 711')).toBeTruthy()
  })
})
