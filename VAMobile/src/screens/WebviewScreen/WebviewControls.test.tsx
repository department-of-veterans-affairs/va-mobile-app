import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { ReactTestInstance } from 'react-test-renderer'
import { context, findByTestID, render, RenderAPI } from 'testUtils'

import WebviewControls from './WebviewControls'
import Mock = jest.Mock

context('WebviewControls', () => {
  let component: RenderAPI
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

    component = render(<WebviewControls {...props} />)

    testInstance = component.UNSAFE_root
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  it('should call onBackPressed on back', async () => {
    expect(findByTestID(testInstance, 'Back').props.onPress())
    expect(onBackSpy).toBeCalled()
  })

  it('should call onForwardPressed on forward', async () => {
    expect(findByTestID(testInstance, 'Forward').props.onPress())
    expect(onForwardSpy).toBeCalled()
  })

  it('should call onOpenPressed on open', async () => {
    expect(findByTestID(testInstance, 'Open in browser').props.onPress())
    expect(onOpenSpy).toBeCalled()
  })
})
