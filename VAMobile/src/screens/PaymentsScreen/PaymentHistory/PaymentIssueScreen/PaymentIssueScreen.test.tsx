import React from 'react'
import { Linking } from 'react-native'

import { fireEvent, screen } from '@testing-library/react-native'

import { context, mockNavProps, render } from 'testUtils'

import PaymentIssue from './PaymentIssueScreen'

context('PaymentIssueScreen', () => {
  beforeEach(() => {
    const props = mockNavProps({}, { setOptions: jest.fn(), navigate: jest.fn() })
    render(<PaymentIssue {...props} />)
  })

  it('initializes correctly', () => {
    expect(screen.getByRole('header', { name: "What if my payment information doesn't look right?" })).toBeTruthy()
    expect(
      screen.getByText(
        'If there is an error with your payment, or if you have questions about your payment, please call the Veterans Help Line. We’re here Monday through Friday, 8:00 a.m. to 9:00 p.m. ET.',
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
