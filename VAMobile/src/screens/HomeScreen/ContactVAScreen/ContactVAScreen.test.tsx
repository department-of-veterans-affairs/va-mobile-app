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

  it('initializes correctly', () => {
    expect(screen.getByRole('link', { name: 'Talk to the Veterans Crisis Line now' })).toBeTruthy()
    expect(screen.getByRole('header', { name: 'Call MyVA411' })).toBeTruthy()
    expect(
      screen.getByText(
        'MyVA411 is our main VA information line. We can help connect you to any of our VA contact centers.',
      ),
    ).toBeTruthy()
    expect(screen.getByRole('link', { name: '800-698-2411' })).toBeTruthy()
    expect(screen.getByRole('link', { name: 'TTY: 711' })).toBeTruthy()
  })
})
