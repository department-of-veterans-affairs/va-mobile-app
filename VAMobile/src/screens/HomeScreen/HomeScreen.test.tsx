import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'

import { context, mockNavProps, render } from 'testUtils'

import { HomeScreen } from './HomeScreen'

const mockNavigationSpy = jest.fn()
jest.mock('utils/hooks', () => {
  const original = jest.requireActual('utils/hooks')

  return {
    ...original,
    useRouteNavigation: () => mockNavigationSpy,
  }
})

jest.mock('utils/remoteConfig')

context('HomeScreen', () => {
  const initializeTestInstance = () => {
    const props = mockNavProps(undefined, { setOptions: jest.fn(), navigate: mockNavigationSpy })
    render(<HomeScreen {...props} />)
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  it('initializes correctly', () => {
    expect(screen.getByRole('button', { name: 'Talk to the Veterans Crisis Line now' })).toBeTruthy()
    expect(screen.getByText('About VA')).toBeTruthy()
    expect(screen.getByText('Contact VA')).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Find a VA location' })).toBeTruthy()
  })

  describe('when the find VA location link is clicked', () => {
    it('should call useRouteNavigation', () => {
      fireEvent.press(screen.getByRole('button', { name: 'Find a VA location' }))
      expect(mockNavigationSpy).toBeCalledWith('Webview', {
        displayTitle: 'va.gov',
        url: 'https://www.va.gov/find-locations/',
        loadingMessage: 'Loading VA location finder...',
      })
    })
  })
})
