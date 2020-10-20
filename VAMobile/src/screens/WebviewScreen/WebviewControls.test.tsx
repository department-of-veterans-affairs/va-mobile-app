import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { ReactTestInstance, act } from 'react-test-renderer'
import { context, findByTestID, renderWithProviders } from 'testUtils'

import WebviewControls from './WebviewControls'
import Mock = jest.Mock

context('WebviewControls', () => {
  let component: any
  let testInstance: ReactTestInstance
  let onBackSpy: Mock
  let onForwardSpy: Mock
  let onOpenSpy: Mock

  beforeEach(() => {
    onBackSpy = jest.fn(() => {})
    onForwardSpy = jest.fn(() => {})
    onOpenSpy = jest.fn(() => {})

    const props = {
      onBackPressed: onBackSpy,
      onForwardPressed: onForwardSpy,
      onOpenPressed: onOpenSpy,
      canGoBack: true,
      canGoForward: true,
    }

    act(() => {
      component = renderWithProviders(<WebviewControls {...props} />)
    })

    testInstance = component.root
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  it('should call onBackPressed on back', async () => {
    expect(findByTestID(testInstance, 'WebviewControl-back').props.onPress())
    expect(onBackSpy).toBeCalled()
  })

  it('should call onForwardPressed on forward', async () => {
    expect(findByTestID(testInstance, 'WebviewControl-forward').props.onPress())
    expect(onForwardSpy).toBeCalled()
  })

  it('should call onOpenPressed on open', async () => {
    expect(findByTestID(testInstance, 'WebviewControl-open').props.onPress())
    expect(onOpenSpy).toBeCalled()
  })
})
