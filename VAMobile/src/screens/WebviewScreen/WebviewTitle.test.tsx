import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { ReactTestInstance, act } from 'react-test-renderer'
import { context, findByTestID, renderWithProviders } from 'testUtils'

import WebviewTitle from './WebviewTitle'

context('WebviewTitle', () => {
  let component: any
  let testInstance: ReactTestInstance

  beforeEach(() => {
    act(() => {
      component = renderWithProviders(<WebviewTitle title={'my title'} />)
    })

    testInstance = component.root
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  it('should have the correct title', async () => {
    expect(findByTestID(testInstance, 'Webview-title').props.children).toEqual('my title')
  })
})
