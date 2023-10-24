import React from 'react'
import { fireEvent, screen } from '@testing-library/react-native'

import { context, render } from 'testUtils'
import ErrorAlert from './ErrorAlert'

context('ErrorAlert', () => {
  let onTryAgainSpy: jest.Mock

  beforeEach(async () => {
    onTryAgainSpy = jest.fn()

    render(<ErrorAlert onTryAgain={onTryAgainSpy} title={'Alert title'} text={'Alert text'} />)
  })

  describe('when the try again button is pressed', () => {
    it('calls the onTryAgain function', async () => {
      fireEvent.press(screen.getByRole('button', { name: 'Refresh screen' }))
      expect(onTryAgainSpy).toBeCalled()
    })
  })

  describe('when the title prop is passed', () => {
    it('shows the correct title', async () => {
      expect(screen.getByText('Alert title')).toBeTruthy()
    })
  })
})
