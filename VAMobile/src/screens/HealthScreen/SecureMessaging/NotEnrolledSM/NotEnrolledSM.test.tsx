import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance, act } from 'react-test-renderer'

import {context, findByTestID, renderWithProviders} from 'testUtils'
import NotEnrolledSM from './NotEnrolledSM'
import {Linking} from "react-native";

context('NotEnrolledSM', () => {
  let component: any
  let testInstance: ReactTestInstance

  beforeEach(() => {

    act(() => {
      component = renderWithProviders(<NotEnrolledSM />)
    })

    testInstance = component.root
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  describe('when Learn how to upgrade link is clicked', () => {
    it('should call Linking open url', async () => {
      findByTestID(testInstance, 'Learn how to upgrade').props.onPress()
      expect(Linking.openURL).toBeCalledWith('https://www.myhealth.va.gov/web/myhealthevet/upgrading-your-my-healthevet-account-through-in-person-or-online-authentication')
    })
  })
})
