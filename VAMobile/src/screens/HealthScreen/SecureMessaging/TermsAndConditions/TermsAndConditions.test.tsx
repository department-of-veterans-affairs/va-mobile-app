import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance, act } from 'react-test-renderer'

import {context, renderWithProviders} from 'testUtils'
import TermsAndConditions from './TermsAndConditions'
import {Linking, TouchableWithoutFeedback} from "react-native";

context('TermsAndConditions', () => {
  let component: any
  let testInstance: ReactTestInstance

  beforeEach(() => {

    act(() => {
      component = renderWithProviders(<TermsAndConditions />)
    })

    testInstance = component.root
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  describe('when Go to My HealtheVet link is clicked', () => {
    it('should call Linking open url', async () => {
      testInstance.findByType(TouchableWithoutFeedback).props.onPress()
      expect(Linking.openURL).toBeCalledWith('https://www.myhealth.va.gov/mhv-portal-web/user-login?redirect=/mhv-portal-web/web/myhealthevet/secure-messaging')
    })
  })
})
