import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'

import { context, render } from 'testUtils'

import WebviewControls from './WebviewControls'

import Mock = jest.Mock

context('WebviewControls', () => {
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

    render(<WebviewControls {...props} />)
  })

  it('initializes correctly', () => {
    expect(screen.getByTestId('Back')).toBeTruthy()
    expect(screen.getByTestId('Forward')).toBeTruthy()
    expect(screen.getByTestId('Open in browser')).toBeTruthy()
  })

  it('should call onBackPressed on back', () => {
    fireEvent.press(screen.getByTestId('Back'))
    expect(onBackSpy).toBeCalled()
  })

  it('should call onForwardPressed on forward', () => {
    fireEvent.press(screen.getByTestId('Forward'))
    expect(onForwardSpy).toBeCalled()
  })

  it('should call onOpenPressed on open', () => {
    fireEvent.press(screen.getByTestId('Open in browser'))
    expect(onOpenSpy).toBeCalled()
  })
})
