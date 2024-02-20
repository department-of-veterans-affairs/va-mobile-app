import React from 'react'
import { Linking } from 'react-native'

import { fireEvent, screen } from '@testing-library/react-native'

import { context, render } from 'testUtils'

import NoPaymentsScreen from './NoPaymentsScreen'

context('NoPaymentsScreen', () => {
  beforeEach(() => {
    render(<NoPaymentsScreen />)
  })

  it('initializes correctly', () => {
    expect(screen.getByText("We don't have a record of VA payments for you")).toBeTruthy()
    expect(
      screen.getByText(
        "We can't find any VA payments made to you, or returned VA payments. Some details about payments may not be available.",
      ),
    ).toBeTruthy()
    expect(
      screen.getByText(
        'VA pays benefits on the first day of the month for the previous month. Please wait at least 3 business days (Monday through Friday) before reporting non-receipt of a payment.',
      ),
    ).toBeTruthy()
    expect(
      screen.getByText(
        'If you think this is an error, or if you have questions about your payment history, please call the Veterans Help Line. We’re here Monday through Friday, 8:00 a.m. to 9:00 p.m. ET.',
      ),
    ).toBeTruthy()
    expect(screen.getByRole('link', { name: '800-827-1000' })).toBeTruthy()
    expect(screen.getByRole('link', { name: 'TTY: 711' })).toBeTruthy()
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
