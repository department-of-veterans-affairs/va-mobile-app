import React from 'react'
import { Alert } from 'react-native'

import { context, fireEvent, render, screen } from 'testUtils'

import NoAccessSM from './NoAccessSM'

context('NoAccessSM', () => {
  beforeEach(() => {
    render(<NoAccessSM />)
  })

  describe('when Learn how to upgrade link is clicked', () => {
    it('should launch external link', () => {
      fireEvent.press(screen.getByRole('link', { name: 'Find out how to apply for VA health care' }))
      expect(Alert.alert).toBeCalled()
    })
  })
})
