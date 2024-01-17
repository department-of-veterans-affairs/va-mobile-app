import React from 'react'
import { fireEvent, screen } from '@testing-library/react-native'

import { context, render } from 'testUtils'
import ReplyMessageButton from './ReplyMessageButton'

let mockNavigationSpy = jest.fn()
jest.mock('utils/hooks', () => {
  let original = jest.requireActual('utils/hooks')
  return {
    ...original,
    useRouteNavigation: () => mockNavigationSpy,
  }
})

context('ReplyMessageButton', () => {

  beforeEach(() => {
    render(<ReplyMessageButton messageID={1} />)
  })

  describe('on click of the footer button', () => {
    it('should call useRouteNavigation', () => {
      fireEvent.press(screen.getByRole('button', { name: 'Reply' }))
      expect(mockNavigationSpy).toHaveBeenCalledWith('ReplyMessage', { attachmentFileToAdd: {}, attachmentFileToRemove: {}, messageID: 1 })
    })
  })
})
