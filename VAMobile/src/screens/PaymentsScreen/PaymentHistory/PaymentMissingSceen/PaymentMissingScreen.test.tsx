import 'react-native'
import React from 'react'

import { context, mockNavProps, render } from 'testUtils'
import { fireEvent, screen } from '@testing-library/react-native'
import PaymentMissing from './PaymentMissingScreen'
import { Linking } from 'react-native'

context('PaymentMissing', () => {
  beforeEach(() => {
    const props = mockNavProps({}, { setOptions: jest.fn(), navigate: jest.fn() })
    render(<PaymentMissing {...props} />)
  })

  it('initializes correctly', async () => {
    expect(screen.getByText("What if I'm missing a payment?")).toBeTruthy()
    expect(screen.getByText('VA pays benefits on the first day of the month for the previous month. Please wait at least 3 business days (Monday through Friday) before reporting non-receipt of a payment.')).toBeTruthy()
  })

  describe('when the help phone number link is clicked', () => {
    it('should call Linking open url with the parameter tel:8008271000', async () => {
      fireEvent.press(screen.getByText('800-827-1000'))
      expect(Linking.openURL).toBeCalledWith('tel:8008271000')
    })
  })

  describe('when the call TTY phone link is clicked', () => {
    it('should call Linking open url with the parameter tel:711', async () => {
      fireEvent.press(screen.getByText('TTY: 711'))
      expect(Linking.openURL).toBeCalledWith('tel:711')
    })
  })
})
