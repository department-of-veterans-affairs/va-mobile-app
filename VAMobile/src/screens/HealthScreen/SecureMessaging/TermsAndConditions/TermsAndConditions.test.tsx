import 'react-native'
import React from 'react'

import { screen, fireEvent } from '@testing-library/react-native'
import { context, render } from 'testUtils'
import TermsAndConditions from './TermsAndConditions'

const mockExternalLinkSpy = jest.fn()

jest.mock('utils/hooks', () => {
  const original = jest.requireActual('utils/hooks')

  return {
    ...original,
    useExternalLink: () => mockExternalLinkSpy,
  }
})

context('TermsAndConditions', () => {
  beforeEach(() => {
    render(<TermsAndConditions />)
  })

  it('initializes correctly', async () => {
    expect(screen.getByText("You’re required to accept the current terms and conditions")).toBeTruthy()
    expect(screen.getByText('To accept the current terms and conditions, please go to the My HealtheVet website:  ')).toBeTruthy()
    expect(screen.getByText('Go to My HealtheVet')).toBeTruthy()
    expect(screen.getByText('Note: Do not use Secure Messaging if you have a medical emergency or an urgent need. It may take a few days for you to get a reply.')).toBeTruthy()
  })

  describe('when Go to My HealtheVet link is clicked', () => {
    it('should launch external link', async () => {
      fireEvent.press(screen.getByText('Go to My HealtheVet'))
      expect(mockExternalLinkSpy).toBeCalledWith('https://www.myhealth.va.gov/mhv-portal-web/user-login?redirect=/mhv-portal-web/web/myhealthevet/secure-messaging')
    })
  })
})
