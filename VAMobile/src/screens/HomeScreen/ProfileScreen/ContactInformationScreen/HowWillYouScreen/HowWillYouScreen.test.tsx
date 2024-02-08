import React from 'react'

import { screen } from '@testing-library/react-native'

import { context, mockNavProps, render } from 'testUtils'

import HowWillYouScreen from './HowWillYouScreen'

context('HowWillYouScreen', () => {
  beforeEach(() => {
    const props = mockNavProps({}, { setOptions: jest.fn(), navigate: jest.fn() })
    render(<HowWillYouScreen {...props} />)
  })

  it('initializes correctly', () => {
    expect(screen.getByText('How we use your contact information')).toBeTruthy()
    expect(
      screen.getByText(
        'We’ll use this information to contact you about certain benefits and services, like disability compensation, pension benefits, and claims and appeals.',
      ),
    ).toBeTruthy()
    expect(
      screen.getByText(
        'If you’re enrolled in VA health care, we’ll send your prescriptions to your mailing address. Your health care team may also use this information to contact you.',
      ),
    ).toBeTruthy()
  })
})
