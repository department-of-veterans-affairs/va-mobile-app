import 'react-native'
import React from 'react'

import { context, render, RenderAPI } from 'testUtils'

import NoPaymentsScreen from './NoPaymentsScreen'
import { Linking, TouchableWithoutFeedback } from 'react-native'

context('NoPaymentsScreen', () => {
  let component: RenderAPI
  let testInstance: any

  beforeEach(() => {
    component = render(<NoPaymentsScreen />)

    testInstance = component.UNSAFE_root
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  describe('when the help phone number link is clicked', () => {
    it('should call Linking open url with the parameter tel:8008271000', async () => {
      testInstance.findAllByType(TouchableWithoutFeedback)[0].props.onPress()
      expect(Linking.openURL).toBeCalledWith('tel:8008271000')
    })
  })

  describe('when the call TTY phone link is clicked', () => {
    it('should call Linking open url with the parameter tel:711', async () => {
      testInstance.findAllByType(TouchableWithoutFeedback)[1].props.onPress()
      expect(Linking.openURL).toBeCalledWith('tel:711')
    })
  })
})
