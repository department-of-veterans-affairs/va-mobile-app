import 'react-native'
import React from 'react'

import { screen } from '@testing-library/react-native'
import { context, mockNavProps, render } from 'testUtils'
import ContactVAScreen from './ContactVAScreen'

context('ContactVAScreen', () => {
  beforeEach(() => {
    const props = mockNavProps(
      {},
      {
        setOptions: () => {},
      },
    )
    render(<ContactVAScreen {...props} />)
  })

  it('initializes correctly', async () => {
    expect(screen.getByText('Talk to the Veterans Crisis Line now')).toBeTruthy()
    expect(screen.getByText('Call MyVA411')).toBeTruthy()
    expect(screen.getByText('MyVA411 is our main VA information line. We can help connect you to any of our VA contact centers.')).toBeTruthy()
    expect(screen.getByText('800-698-2411')).toBeTruthy()
    expect(screen.getByText('TTY: 711')).toBeTruthy()
  })
})
