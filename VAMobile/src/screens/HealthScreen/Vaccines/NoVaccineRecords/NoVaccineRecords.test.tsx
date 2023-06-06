import 'react-native'
import React from 'react'

import { context, render, RenderAPI } from 'testUtils'
import { act } from 'react-test-renderer'

import NoVaccineRecords from './NoVaccineRecords'
import { Linking, TouchableWithoutFeedback } from 'react-native'

context('NoVaccineRecords', () => {
  let component: RenderAPI
  let testInstance: any

  beforeEach(() => {
    component = render(<NoVaccineRecords />)

    testInstance = component.UNSAFE_root
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  describe('when the My HealtheVet phone number link is clicked', () => {
    it('should call Linking open url with the parameter tel:8006982411', async () => {
      testInstance.findAllByType(TouchableWithoutFeedback)[0].props.onPress()
      expect(Linking.openURL).toBeCalledWith('tel:8006982411')
    })
  })

  describe('when the call TTY phone link is clicked', () => {
    it('should call Linking open url with the parameter tel:711', async () => {
      testInstance.findAllByType(TouchableWithoutFeedback)[1].props.onPress()
      expect(Linking.openURL).toBeCalledWith('tel:711')
    })
  })
})
