import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import {act, ReactTestInstance} from 'react-test-renderer'
import {context, renderWithProviders} from 'testUtils'
import WebviewControlButton from './WebviewControlButton'

import Mock = jest.Mock

context('WebviewControlButton', () => {
  let component:any
  let testInstance: ReactTestInstance
  let onPressSpy: Mock

  beforeEach(() => {
    onPressSpy = jest.fn(() => {})

    act(() => {
      component = renderWithProviders(
        <WebviewControlButton onPress={onPressSpy} icon={'WebviewRefresh'} />
      )
    })

    testInstance = component.root
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  it('should call onPress when pressed', async () => {
    testInstance.findByType(WebviewControlButton).props.onPress()
    expect(onPressSpy).toBeCalled()
  })
})
