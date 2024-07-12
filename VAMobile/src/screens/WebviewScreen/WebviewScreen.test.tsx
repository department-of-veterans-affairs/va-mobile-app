import React from 'react'

import { screen } from '@testing-library/react-native'

import { context, mockNavProps, render } from 'testUtils'

import WebviewScreen from './WebviewScreen'

context('WebviewScreen', () => {
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
    render(<WebviewScreen {...props} />)
  })

  it('initializes correctly', () => {
    expect(screen.getByTestId('Webview-page')).toBeTruthy()
    expect(screen.getByTestId('Webview-web')).toBeTruthy()
    expect(screen.getByTestId('Back')).toBeTruthy()
    expect(screen.getByTestId('Forward')).toBeTruthy()
    expect(screen.getByTestId('Open in browser')).toBeTruthy()
    expect(screen.getByTestId('Webview-web').props.source.uri).toBe('http://www.google.com')
  })
})
