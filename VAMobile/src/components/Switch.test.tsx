import 'react-native'
import { Switch as RNSwitch } from 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance, act } from 'react-test-renderer'
import Mock = jest.Mock

import { context, render, RenderAPI, waitFor } from 'testUtils'
import Switch from './Switch'

context('Switch', () => {
  let component: RenderAPI
  let testInstance: ReactTestInstance
  let onPressSpy: Mock

  beforeEach(() => {
    onPressSpy = jest.fn(() => {})

    component = render(<Switch onPress={onPressSpy} />)
    testInstance = component.UNSAFE_root
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  describe('when the switch is clicked', () => {
    it('should call the onPress function', async () => {
      await waitFor(() => {
        testInstance.findByType(RNSwitch).props.onValueChange()
        expect(onPressSpy).toBeCalled()
      })
    })
  })
})
