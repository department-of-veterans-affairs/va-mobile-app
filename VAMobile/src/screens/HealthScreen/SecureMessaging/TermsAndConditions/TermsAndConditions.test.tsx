import React from 'react'
import { Alert } from 'react-native'

import { fireEvent, screen } from '@testing-library/react-native'

import { context, render } from 'testUtils'

import TermsAndConditions from './TermsAndConditions'

context('TermsAndConditions', () => {
  beforeEach(() => {
    render(<TermsAndConditions />)
  })

  it('initializes correctly', () => {
    expect(screen.getByText('You’re required to accept the current terms and conditions')).toBeTruthy()
    expect(
      screen.getByText('To accept the current terms and conditions, please go to the My HealtheVet website:  '),
    ).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Go to My HealtheVet' })).toBeTruthy()
    expect(
      screen.getByText(
        'Note: Do not use Secure Messaging if you have a medical emergency or an urgent need. It may take a few days for you to get a reply.',
      ),
    ).toBeTruthy()
  })

  describe('when Go to My HealtheVet link is clicked', () => {
    it('should launch external link', () => {
      fireEvent.press(screen.getByRole('link', { name: 'Go to My HealtheVet' }))
      expect(Alert.alert).toBeCalled()
    })
  })
})
