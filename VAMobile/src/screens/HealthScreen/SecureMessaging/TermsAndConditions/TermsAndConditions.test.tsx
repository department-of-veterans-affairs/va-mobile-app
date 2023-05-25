import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance, act } from 'react-test-renderer'

import { context, render, RenderAPI } from 'testUtils'
import TermsAndConditions from './TermsAndConditions'
import { TouchableWithoutFeedback } from 'react-native'
import * as hooks from 'utils/hooks'

const mockExternalLinkSpy = jest.fn()

context('TermsAndConditions', () => {
  let component: RenderAPI
  let testInstance: ReactTestInstance

  beforeEach(() => {
    jest.spyOn(hooks, 'useExternalLink').mockReturnValue((url) => mockExternalLinkSpy(url))
    component = render(<TermsAndConditions />)
    testInstance = component.UNSAFE_root
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  describe('when Go to My HealtheVet link is clicked', () => {
    it('should launch external link', async () => {
      testInstance.findByType(TouchableWithoutFeedback).props.onPress()
      expect(mockExternalLinkSpy).toBeCalledWith('https://www.myhealth.va.gov/mhv-portal-web/user-login?redirect=/mhv-portal-web/web/myhealthevet/secure-messaging')
    })
  })
})
