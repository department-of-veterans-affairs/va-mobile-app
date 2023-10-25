import 'react-native'
import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'
import { context, mockNavProps, render } from 'testUtils'
import HowToUpdateDirectDepositScreen from './HowToUpdateDirectDepositScreen'

const mockExternalLinkSpy = jest.fn()

jest.mock('utils/hooks', () => {
  const original = jest.requireActual('utils/hooks')
  return {
    ...original,
    useExternalLink: () => mockExternalLinkSpy,
  }
})

context('HowToUpdateDirectDepositScreen', () => {
  beforeEach(() => {
    render(<HowToUpdateDirectDepositScreen {...mockNavProps()} />)
  })

  it('initializes correctly', async () => {
    expect(screen.getByLabelText('Direct deposit')).toBeTruthy()
    expect(screen.getByText("You’ll need to sign in with a verified ID.me or Login.gov account to update your direct deposit information")).toBeTruthy()
    expect(screen.getByText('We require this to protect bank account information and prevent fraud.')).toBeTruthy()
    expect(screen.getByText('If you have one, please sign out and sign back in using your verified ID.me or Login.gov account.')).toBeTruthy()
    expect(screen.getByText('Call us to update your direct deposit information')).toBeTruthy()
    expect(screen.getByText("You can call us. We’re here Monday through Friday, 8:00 a.m. to 9:00 p.m. ET.")).toBeTruthy()
    expect(screen.getByText('800-827-1000')).toBeTruthy()
    expect(screen.getByText('TTY: 711')).toBeTruthy()
    fireEvent.press(screen.getByText('800-827-1000'))
    expect(mockExternalLinkSpy).toBeCalled()
  })
})
