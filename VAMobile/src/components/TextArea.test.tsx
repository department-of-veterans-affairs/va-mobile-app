import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance, act } from 'react-test-renderer'
import Mock = jest.Mock

import { context, renderWithProviders } from 'testUtils'
import TextArea from './TextArea'

context('TextArea', () => {
  let component: any
  let testInstance: ReactTestInstance
  let onPressSpy: Mock

  beforeEach(() => {
    onPressSpy = jest.fn(() => {})
    act(() => {
      component = renderWithProviders(<TextArea />)
    })
    testInstance = component.root
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })
})
