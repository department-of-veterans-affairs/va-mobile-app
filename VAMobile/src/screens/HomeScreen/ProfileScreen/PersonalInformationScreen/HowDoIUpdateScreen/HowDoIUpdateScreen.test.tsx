import React from 'react'
import { Alert } from 'react-native'

import { fireEvent, screen } from '@testing-library/react-native'

import { context, mockNavProps, render } from 'testUtils'

import HowDoIUpdateScreen from './HowDoIUpdateScreen'

context('HowDoIUpdateScreen', () => {
  const initializeTestInstance = (screenType = 'DOB'): void => {
    const props = mockNavProps(
      {},
      { setOptions: jest.fn(), navigate: jest.fn() },
      {
        params: {
          screenType: screenType,
        },
      },
    )

    render(<HowDoIUpdateScreen {...props} />)
  }

  it('initializes correctly for DOB', () => {
    initializeTestInstance('DOB')
    expect(screen.getByRole('header', { name: 'How to fix an error in your date of birth' })).toBeTruthy()
    expect(
      screen.getByText(
        "If our records have an error in your date of birth, you can request a correction. Here's how to request a correction:",
      ),
    ).toBeTruthy()
    expect(
      screen.getByText("If you're enrolled in the VA health care program, contact your nearest VA medical center."),
    ).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Find nearest VA medical center' })).toBeTruthy()
    expect(
      screen.getByText(
        "If you receive VA benefits but aren’t enrolled in VA health care, call us. We're here Monday through Friday, 8:00 AM to 9:00 PM ET.",
      ),
    ).toBeTruthy()
    expect(screen.getByRole('link', { name: '800-827-1000' })).toBeTruthy()
    expect(screen.getByRole('link', { name: 'TTY: 711' })).toBeTruthy()
  })

  it('initializes correctly for name', () => {
    initializeTestInstance('name')
    expect(screen.getByRole('header', { name: 'How to update or fix an error in your legal name' })).toBeTruthy()
    expect(
      screen.getByText(
        "If you've changed your legal name, you'll need to tell us so we can change your name in our records.",
      ),
    ).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Learn how to change your legal name on file with the VA' })).toBeTruthy()
    expect(
      screen.getByText(
        "If our records have a misspelling or other error in your name, you can request a correction. Here's how to request a correction:",
      ),
    ).toBeTruthy()
    expect(
      screen.getByText("If you're enrolled in the VA health care program, contact your nearest VA medical center."),
    ).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Find nearest VA medical center' })).toBeTruthy()
    expect(
      screen.getByText(
        "If you receive VA benefits but aren’t enrolled in VA health care, call us. We're here Monday through Friday, 8:00 AM to 9:00 PM ET.",
      ),
    ).toBeTruthy()
    expect(screen.getByRole('link', { name: '800-827-1000' })).toBeTruthy()
    expect(screen.getByRole('link', { name: 'TTY: 711' })).toBeTruthy()
  })

  describe('when the find VA location link is clicked', () => {
    it('should show alert', () => {
      initializeTestInstance('DOB')
      fireEvent.press(screen.getByRole('link', { name: 'Find nearest VA medical center' }))
      expect(Alert.alert).toBeCalled()
    })
  })
})
