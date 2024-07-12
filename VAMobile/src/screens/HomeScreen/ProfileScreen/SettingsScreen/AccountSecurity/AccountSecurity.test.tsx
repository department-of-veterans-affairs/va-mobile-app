import React from 'react'

import { screen } from '@testing-library/react-native'

import { context, mockNavProps, render } from 'testUtils'

import AccountSecurity from './AccountSecurity'

context('AccountSecurity', () => {
  beforeEach(() => {
    const props = mockNavProps(undefined, { setOptions: jest.fn() })
    render(<AccountSecurity {...props} />)
  })

  it('initializes correctly', () => {
    expect(screen.getByText('Sign-in information')).toBeTruthy()
    expect(
      screen.getByText(
        'To access or update your sign-in information, go to the website where you manage your account information. Any updates you make there will automatically update on the mobile app.',
      ),
    ).toBeTruthy()
  })
})
