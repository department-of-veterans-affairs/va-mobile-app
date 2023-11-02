import React from 'react'
import { screen } from '@testing-library/react-native'

import { context, mockNavProps, render } from 'testUtils'
import ManageYourAccount from './ManageYourAccount'

context('ManageYourAccount', () => {
  beforeEach(() => {
    const props = mockNavProps(undefined, { setOptions: jest.fn() })
    render(<ManageYourAccount {...props} />)
  })

  it('initializes correctly', () => {
    expect(screen.getByText('Manage account')).toBeTruthy()
    expect(screen.getByText('To confirm or update your sign-in email, go to the website where you manage your account information.')).toBeTruthy()
  })
})
