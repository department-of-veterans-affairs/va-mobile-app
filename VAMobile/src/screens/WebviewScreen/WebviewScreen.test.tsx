import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import {act, ReactTestInstance} from 'react-test-renderer'
import {context, findByTestID, renderWithProviders} from 'testUtils'

import WebviewScreen from './WebviewScreen'

context('WebviewScreen', () => {
  let component:any
  let testInstance: ReactTestInstance

  const createTestProps = (props: any) => ({
    navigation: {
      navigate: jest.fn(),
      setOptions: jest.fn(),
    },
    route: {
      params: {
        url: 'http://www.google.com',
        displayTitle: 'test title'
      }
    },
    ...props
  });


  beforeEach(() => {
    const props = createTestProps({})

    act(() => {
      component = renderWithProviders(
          <WebviewScreen {...props} />
      )
    })

    testInstance = component.root
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  it('should create the webview', async () => {
    const webview = findByTestID(testInstance,'Webview-web')

    expect(webview).toBeTruthy()
    expect(webview.props.source.uri).toBe('http://www.google.com')
  })

})
