import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { ReactTestInstance, act } from 'react-test-renderer'
import { context, render, RenderAPI } from 'testUtils'
import WebviewControlButton from './WebviewControlButton'

import Mock = jest.Mock

context('WebviewControlButton', () => {
  let component: RenderAPI
  let testInstance: ReactTestInstance
  let onPressSpy: Mock

  beforeEach(() => {
    onPressSpy = jest.fn(() => {})

    component = render(<WebviewControlButton onPress={onPressSpy} icon={'Redo'} />)

    testInstance = component.UNSAFE_root
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  it('should call onPress when pressed', async () => {
    testInstance.findByType(WebviewControlButton).props.onPress()
    expect(onPressSpy).toBeCalled()
  })
})
