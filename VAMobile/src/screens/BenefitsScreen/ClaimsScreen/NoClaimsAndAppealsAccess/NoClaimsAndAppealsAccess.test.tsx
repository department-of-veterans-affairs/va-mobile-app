import React from 'react'

import { screen } from '@testing-library/react-native'

import { context, render } from 'testUtils'

import NoClaimsAndAppealsAccess from './NoClaimsAndAppealsAccess'

context('NoClaimsAndAppealsAccess', () => {
  beforeEach(() => {
    render(<NoClaimsAndAppealsAccess />)
  })

  it('Renders NoClaimsAndAppealsAccess', () => {
    expect(screen.getByText("We can't find any claims information for you")).toBeTruthy()
    expect(
      screen.getByText(
        "We're sorry. We can't find any claims for you in our records. If you think this is an error, call the VA benefits hotline.",
      ),
    ).toBeTruthy()
    expect(screen.getByRole('link', { name: '800-827-1000' })).toBeTruthy()
    expect(screen.getByRole('link', { name: 'TTY: 711' })).toBeTruthy()
  })
})
