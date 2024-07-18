import React from 'react'
import { Linking } from 'react-native'

import { fireEvent, screen } from '@testing-library/react-native'

import { context, mockNavProps, render } from 'testUtils'

import HowToUpdateDirectDepositScreen from './HowToUpdateDirectDepositScreen'

context('HowToUpdateDirectDepositScreen', () => {
  beforeEach(() => {
    render(<HowToUpdateDirectDepositScreen {...mockNavProps()} />)
  })

  it('initializes correctly', () => {
    expect(screen.getByLabelText('Direct deposit')).toBeTruthy()
    expect(
      screen.getByRole('heading', {
        name: 'You’ll need to sign in with a verified ID.me or Login.gov account to update your direct deposit information',
      }),
    ).toBeTruthy()
    expect(screen.getByText('We require this to protect bank account information and prevent fraud.')).toBeTruthy()
    expect(
      screen.getByText(
        'If you have one, please sign out and sign back in using your verified ID.me or Login.gov account.',
      ),
    ).toBeTruthy()
    expect(screen.getByRole('header', { name: 'Call us to update your direct deposit information' })).toBeTruthy()
    expect(
      screen.getByText('You can call us. We’re here Monday through Friday, 8:00 a.m. to 9:00 p.m. ET.'),
    ).toBeTruthy()
    expect(screen.getByRole('link', { name: '800-827-1000' })).toBeTruthy()
    expect(screen.getByRole('link', { name: 'TTY: 711' })).toBeTruthy()
    fireEvent.press(screen.getByRole('link', { name: '800-827-1000' }))
    expect(Linking.openURL).toBeCalled()
  })
})
