import 'react-native'
import React from 'react'
import { Linking } from 'react-native'

import { context, mockNavProps, render, RenderAPI } from 'testUtils'
import { fireEvent, screen } from '@testing-library/react-native'
import PaymentIssue from './PaymentIssueScreen'

context('PaymentIssueScreen', () => {
  let component: RenderAPI
  let testInstance: any

  beforeEach(() => {
    const props = mockNavProps({}, { setOptions: jest.fn(), navigate: jest.fn() })
    component = render(<PaymentIssue {...props} />)

    testInstance = component.UNSAFE_root
  })

  it('initializes correctly', async () => {
    expect(screen.getByText("What if my payment information doesn't look right?")).toBeTruthy()
    expect(screen.getByText("If there is an error with your payment, or if you have questions about your payment, please call the Veterans Help Line. We’re here Monday through Friday, 8:00 a.m. to 9:00 p.m. ET.")).toBeTruthy()
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
