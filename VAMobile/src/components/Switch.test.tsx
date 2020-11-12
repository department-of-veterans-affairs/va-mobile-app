import 'react-native'
import { Switch as RNSwitch } from 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance, act } from 'react-test-renderer'
import Mock = jest.Mock

import { context, renderWithProviders } from 'testUtils'
import Switch from './Switch'

context('Switch', () => {
  let component: any
  let testInstance: ReactTestInstance
  let onPressSpy: Mock

  beforeEach(() => {
    onPressSpy = jest.fn(() => {})

    act(() => {
      component = renderWithProviders(<Switch onPress={onPressSpy}/>)
    })

    testInstance = component.root
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  describe('when the switch is clicked', () => {
    it('should call the onPress function', async () => {
      testInstance.findByType(RNSwitch).props.onValueChange()
      expect(onPressSpy).toBeCalled()
    })
  })
})
