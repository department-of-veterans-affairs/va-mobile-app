import React from 'react'
import { fireEvent, screen } from '@testing-library/react-native'

import { context, mockNavProps, render } from 'testUtils'
import HowDoIUpdateScreen from './HowDoIUpdateScreen'

let mockNavigationSpy = jest.fn()
jest.mock('../../../../../utils/hooks', () => {
  let original = jest.requireActual('../../../../../utils/hooks')
  return {
    ...original,
    useRouteNavigation: () => mockNavigationSpy,
  }
})

jest.mock('@react-navigation/native', () => {
  const original = jest.requireActual('@react-navigation/native')
  return {
    ...original,
    useFocusEffect: () => jest.fn(),
  }
})

context('HowDoIUpdateScreen', () => {
  let mockNavigationToSpy: jest.Mock
  const initializeTestInstance = ( screenType = 'DOB'): void => {
    const props = mockNavProps(
      {},
      { setOptions: jest.fn(), navigate: jest.fn() },
      {
        params: {
          screenType: screenType,
        },
      },
    )

    mockNavigationToSpy = jest.fn()
    mockNavigationSpy.mockReturnValue(mockNavigationToSpy)

    render(<HowDoIUpdateScreen {...props} />)
  }

  it('initializes correctly for DOB', () => {
    initializeTestInstance('DOB')
    expect(screen.getByRole('header', { name: 'How to fix an error in your date of birth' })).toBeTruthy()
    expect(screen.getByText("If our records have an error in your date of birth, you can request a correction. Here's how to request a correction:")).toBeTruthy()
    expect(screen.getByText("If you're enrolled in the VA health care program, contact your nearest VA medical center.")).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Find nearest VA medical center' })).toBeTruthy()
    expect(screen.getByText("If you receive VA benefits but aren’t enrolled in VA health care, call us. We're here Monday through Friday, 8:00 AM to 9:00 PM ET.")).toBeTruthy()
    expect(screen.getByRole('link', { name: '800-827-1000' })).toBeTruthy()
    expect(screen.getByRole('link', { name: 'TTY: 711' })).toBeTruthy()
  })

  it('initializes correctly for name', () => {
    initializeTestInstance('name')
    expect(screen.getByRole('header', { name: 'How to update or fix an error in your legal name' })).toBeTruthy()
    expect(screen.getByText("If you've changed your legal name, you'll need to tell us so we can change your name in our records.")).toBeTruthy()
    expect(screen.getByText('Learn how to change your legal name on file with the VA')).toBeTruthy()
    expect(screen.getByText("If our records have a misspelling or other error in your name, you can request a correction. Here's how to request a correction:")).toBeTruthy()
    expect(screen.getByText("If you're enrolled in the VA health care program, contact your nearest VA medical center.")).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Find nearest VA medical center' })).toBeTruthy()
    expect(screen.getByText("If you receive VA benefits but aren’t enrolled in VA health care, call us. We're here Monday through Friday, 8:00 AM to 9:00 PM ET.")).toBeTruthy()
    expect(screen.getByRole('link', { name: '800-827-1000' })).toBeTruthy()
    expect(screen.getByRole('link', { name: 'TTY: 711' })).toBeTruthy()
  })

  describe('when the find VA location link is clicked', () => {
    it('should call useRouteNavigation', () => {
      initializeTestInstance('DOB')
      fireEvent.press(screen.getByRole('link', { name: 'Find nearest VA medical center' }))
      expect(mockNavigationSpy).toBeCalledWith('Webview', { displayTitle: 'va.gov', url: 'https://www.va.gov/find-locations/', loadingMessage: 'Loading VA location finder...' })
      expect(mockNavigationToSpy).toBeCalled()
    })
  })
})
