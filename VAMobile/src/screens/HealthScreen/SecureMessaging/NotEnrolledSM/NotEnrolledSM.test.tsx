import React from 'react'
import { Alert } from 'react-native'

import { context, fireEvent, render, screen } from 'testUtils'

import NotEnrolledSM from './NotEnrolledSM'

context('NotEnrolledSM', () => {
  beforeEach(() => {
    render(<NotEnrolledSM />)
  })

  describe('when Learn how to upgrade link is clicked', () => {
    it('should launch external link', () => {
      fireEvent.press(screen.getByRole('link', { name: 'Learn how to upgrade to a My HealtheVet Premium account' }))
      expect(Alert.alert).toBeCalled()
    })
  })
})
