import 'react-native'
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

  it('initializes correctly', async () => {
    expect(screen.getByText('Talk to the Veterans Crisis Line now')).toBeTruthy()
    expect(screen.getByText('About VA')).toBeTruthy()
    expect(screen.getByText('Contact VA')).toBeTruthy()
    expect(screen.getByText('Find a VA location')).toBeTruthy()
    expect(screen.getByText('COVID-19 updates')).toBeTruthy()
  })

  describe('when VA COVID-19 updates is pressed', () => {
    it('should navigate to https://www.va.gov/coronavirus-veteran-frequently-asked-questions', async () => {
      fireEvent.press(screen.getByTestId('COVID-19 updates'))
      const expectNavArgs = {
        url: 'https://www.va.gov/coronavirus-veteran-frequently-asked-questions',
        displayTitle: 'va.gov',
        loadingMessage: 'Loading VA COVID-19 updates...',
      }
      expect(mockNavigationSpy).toHaveBeenCalledWith('Webview', expectNavArgs)
    })
  })

  describe('when the find VA location link is clicked', () => {
    it('should call useRouteNavigation', async () => {
      fireEvent.press(screen.getByText('Find a VA location'))
      expect(mockNavigationSpy).toBeCalledWith('Webview', { displayTitle: 'va.gov', url: 'https://www.va.gov/find-locations/', loadingMessage: 'Loading VA location finder...' })
    })
  })
})
