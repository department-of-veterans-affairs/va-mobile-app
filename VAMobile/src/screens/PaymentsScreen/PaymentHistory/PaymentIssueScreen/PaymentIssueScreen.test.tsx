import 'react-native'
import React from 'react'
import { Linking, TouchableWithoutFeedback } from 'react-native'

import { context, findByTypeWithText, mockNavProps, render, RenderAPI } from 'testUtils'
import PaymentIssue from './PaymentIssueScreen'
import { TextView } from 'components'

context('PaymentIssueScreen', () => {
  let component: RenderAPI
  let testInstance: any

  beforeEach(() => {
    const props = mockNavProps({}, { setOptions: jest.fn(), navigate: jest.fn() })
    component = render(<PaymentIssue {...props} />)

    testInstance = component.UNSAFE_root
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  describe('Should show help context', () => {
    it('should show title and body', async () => {
      expect(findByTypeWithText(testInstance, TextView, "What if my payment information doesn't look right?")).toBeTruthy()
      expect(
        findByTypeWithText(
          testInstance,
          TextView,
          'If there is an error with your payment, or if you have questions about your payment, please call the Veterans Help Line. We’re here Monday through Friday, 8:00 a.m. to 9:00 p.m. ET.',
        ),
      ).toBeTruthy()
    })
  })

  describe('when the help phone number link is clicked', () => {
    it('should call Linking open url with the parameter tel:8008271000', async () => {
      testInstance.findAllByType(TouchableWithoutFeedback)[1].props.onPress()
      expect(Linking.openURL).toBeCalledWith('tel:8008271000')
    })
  })

  describe('when the call TTY phone link is clicked', () => {
    it('should call Linking open url with the parameter tel:711', async () => {
      testInstance.findAllByType(TouchableWithoutFeedback)[2].props.onPress()
      expect(Linking.openURL).toBeCalledWith('tel:711')
    })
  })
})
