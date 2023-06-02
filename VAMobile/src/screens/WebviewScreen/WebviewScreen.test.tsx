import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { ReactTestInstance, act } from 'react-test-renderer'
import { context, findByTestID, mockNavProps, render, RenderAPI } from 'testUtils'

import WebviewScreen from './WebviewScreen'

context('WebviewScreen', () => {
  let component: RenderAPI
  let testInstance: ReactTestInstance

  const mockProps = mockNavProps(
    {},
    {
      navigate: jest.fn(),
      setOptions: jest.fn(),
    },
    {
      params: {
        url: 'http://www.google.com',
        displayTitle: 'test title',
      },
    },
  )

  beforeEach(() => {
    const props = mockProps

    component = render(<WebviewScreen {...props} />)

    testInstance = component.UNSAFE_root
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  it('should create the webview', async () => {
    const webview = findByTestID(testInstance, 'Webview-web')

    expect(webview).toBeTruthy()
    expect(webview.props.source.uri).toBe('http://www.google.com')
  })
})
