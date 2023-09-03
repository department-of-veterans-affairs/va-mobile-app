import 'react-native'
import React from 'react'

import { context, fireEvent, render, screen } from 'testUtils'
import NotEnrolledSM from './NotEnrolledSM'

const mockExternalLinkSpy = jest.fn()

jest.mock('utils/hooks', () => {
  const original = jest.requireActual('utils/hooks')

  return {
    ...original,
    useExternalLink: () => mockExternalLinkSpy,
  }
})

context('NotEnrolledSM', () => {
  beforeEach(() => {
    render(<NotEnrolledSM />)
  })

  describe('when Learn how to upgrade link is clicked', () => {
    it('should launch external link', async () => {
      fireEvent.press(screen.getByTestId('Learn how to upgrade to a My HealtheVet Premium account'))
      expect(mockExternalLinkSpy).toBeCalledWith('https://www.myhealth.va.gov/web/myhealthevet/upgrading-your-my-healthevet-account-through-in-person-or-online-authentication')
    })
  })
})
