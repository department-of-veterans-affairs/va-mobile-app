import 'react-native'
import React from 'react'

import { context, findByTypeWithText, mockNavProps, render, RenderAPI } from 'testUtils'

import PaymentMissing from './PaymentMissingScreen'
import { Linking, TouchableWithoutFeedback } from 'react-native'
import { TextView } from 'components'

context('PaymentMissing', () => {
  let component: RenderAPI
  let testInstance: any

  beforeEach(() => {
    const props = mockNavProps({}, { setOptions: jest.fn(), navigate: jest.fn() })
    component = render(<PaymentMissing {...props} />)

    testInstance = component.UNSAFE_root
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  describe('Should show help context', () => {
    it('should show title and body', async () => {
      expect(findByTypeWithText(testInstance, TextView, "What if I'm missing a payment?")).toBeTruthy()
      expect(
        findByTypeWithText(
          testInstance,
          TextView,
          'VA pays benefits on the first day of the month for the previous month. Please wait at least 3 business days (Monday through Friday) before reporting non-receipt of a payment.',
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
