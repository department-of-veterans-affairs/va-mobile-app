import React from 'react'

import { context, fireEvent, render, screen } from 'testUtils'

import BasicError from './BasicError'

import Mock = jest.Mock

context('BasicError', () => {
  let onTryAgainSpy: Mock
  beforeEach(() => {
    onTryAgainSpy = jest.fn(() => {})
    render(<BasicError onTryAgain={onTryAgainSpy} messageText={'message body'} />)
  })

  describe('when the try again button is clicked', () => {
    it('should call the onTryAgain function', () => {
      fireEvent.press(screen.getByRole('button', { name: 'Try again' }))
      expect(onTryAgainSpy).toBeCalled()
    })
  })
})
