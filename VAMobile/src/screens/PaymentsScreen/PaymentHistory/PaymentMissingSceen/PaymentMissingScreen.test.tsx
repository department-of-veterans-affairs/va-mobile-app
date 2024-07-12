import React from 'react'
import { Linking } from 'react-native'

import { fireEvent, screen } from '@testing-library/react-native'

import { context, mockNavProps, render } from 'testUtils'

import PaymentMissing from './PaymentMissingScreen'

context('PaymentMissing', () => {
  beforeEach(() => {
    const props = mockNavProps({}, { setOptions: jest.fn(), navigate: jest.fn() })
    render(<PaymentMissing {...props} />)
  })

  it('initializes correctly', () => {
    expect(screen.getByRole('header', { name: "What if I'm missing a payment?" })).toBeTruthy()
    expect(
      screen.getByText(
        'VA pays benefits on the first day of the month for the previous month. Please wait at least 3 business days (Monday through Friday) before reporting non-receipt of a payment.',
      ),
    ).toBeTruthy()
  })

  describe('when the help phone number link is clicked', () => {
    it('should call Linking open url with the parameter tel:8008271000', () => {
      fireEvent.press(screen.getByRole('link', { name: '800-827-1000' }))
      expect(Linking.openURL).toBeCalledWith('tel:8008271000')
    })
  })

  describe('when the call TTY phone link is clicked', () => {
    it('should call Linking open url with the parameter tel:711', () => {
      fireEvent.press(screen.getByRole('link', { name: 'TTY: 711' }))
      expect(Linking.openURL).toBeCalledWith('tel:711')
    })
  })
})
