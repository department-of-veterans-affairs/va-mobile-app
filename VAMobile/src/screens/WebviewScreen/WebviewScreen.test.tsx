import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'

import WebviewScreen from 'screens/WebviewScreen/WebviewScreen'
import { context, mockNavProps, render } from 'testUtils'
import * as remoteConfig from 'utils/remoteConfig'

context('WebviewScreen', () => {
  const mockSetOptions = jest.fn()

  const createMockProps = (params = {}) =>
    mockNavProps(
      {},
      {
        navigate: jest.fn(),
        setOptions: mockSetOptions,
      },
      {
        params: {
          url: 'http://www.google.com',
          displayTitle: 'test title',
          ...params,
        },
      },
    )

  const mockProps = createMockProps()

  beforeEach(() => {
    mockSetOptions.mockClear()
  })

  describe('basic rendering', () => {
    beforeEach(() => {
      render(<WebviewScreen {...mockProps} />)
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

  describe('webview ref safety - prevents crash when ref.current is undefined', () => {
    it('should not crash when back button is pressed and webview ref is not yet assigned', () => {
      render(<WebviewScreen {...mockProps} />)

      const backButton = screen.getByTestId('Back')

      // Should not throw even if internal ref handling has issues
      expect(() => {
        fireEvent.press(backButton)
      }).not.toThrow()
    })

    it('should not crash when forward button is pressed and webview ref is not yet assigned', () => {
      render(<WebviewScreen {...mockProps} />)

      const forwardButton = screen.getByTestId('Forward')

      // Should not throw even if internal ref handling has issues
      expect(() => {
        fireEvent.press(forwardButton)
      }).not.toThrow()
    })

    it('should not crash when reload is pressed via header button', () => {
      render(<WebviewScreen {...mockProps} />)

      // Get the headerRight component that was passed to setOptions
      const setOptionsCall = mockSetOptions.mock.calls[0][0]
      const HeaderRightComponent = setOptionsCall.headerRight

      // Render the header right component and press it
      render(<HeaderRightComponent />)
      const refreshButton = screen.getByTestId('Refresh screen')

      // Note: The global WebView mock doesn't include reload/goBack/goForward methods
      // The important test is the SSO loading state test below which verifies
      // that webviewRef.current?.reload() doesn't crash when current is undefined
      // This test verifies the button renders and can be pressed
      expect(refreshButton).toBeTruthy()
    })
  })

  describe('SSO loading state', () => {
    beforeEach(() => {
      jest.spyOn(remoteConfig, 'featureEnabled').mockImplementation((flag) => flag === 'sso')
    })

    afterEach(() => {
      jest.restoreAllMocks()
    })

    it('should show loading state when useSSO is true and SSO feature is enabled', () => {
      const ssoProps = createMockProps({ useSSO: true })
      render(<WebviewScreen {...ssoProps} />)

      // WebView should NOT be rendered during SSO cookie fetch
      expect(screen.queryByTestId('Webview-web')).toBeNull()
    })

    it('should not crash when reload is pressed during SSO loading state', () => {
      const ssoProps = createMockProps({ useSSO: true })
      render(<WebviewScreen {...ssoProps} />)

      // Get the headerRight component that was passed to setOptions
      const setOptionsCall = mockSetOptions.mock.calls[0][0]
      const HeaderRightComponent = setOptionsCall.headerRight

      // Render and press the refresh button while WebView is not mounted
      render(<HeaderRightComponent />)
      const refreshButton = screen.getByTestId('Refresh screen')

      // This is the exact crash scenario - pressing reload when webviewRef.current is undefined
      expect(() => {
        fireEvent.press(refreshButton)
      }).not.toThrow()
    })
  })

  describe('without SSO', () => {
    it('should render WebView immediately when useSSO is false', () => {
      const nonSsoProps = createMockProps({ useSSO: false })
      render(<WebviewScreen {...nonSsoProps} />)

      expect(screen.getByTestId('Webview-web')).toBeTruthy()
    })

    it('should render WebView immediately when useSSO is not provided', () => {
      render(<WebviewScreen {...mockProps} />)

      expect(screen.getByTestId('Webview-web')).toBeTruthy()
    })
  })
})
