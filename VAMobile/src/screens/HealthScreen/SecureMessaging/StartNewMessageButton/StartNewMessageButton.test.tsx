import React from 'react'
import { fireEvent, screen } from '@testing-library/react-native'

import { context, render } from 'testUtils'
import StartNewMessageButton from './StartNewMessageButton'

let mockNavigationSpy = jest.fn()
jest.mock('utils/hooks', () => {
  let original = jest.requireActual('utils/hooks')
  return {
    ...original,
    useRouteNavigation: () => {
      return mockNavigationSpy
    },
  }
})

context('StartNewMessageButton', () => {
  describe('on click of the footer button', () => {
    it('should call useRouteNavigation', () => {
      const mockNavigateToSpy = jest.fn()
      mockNavigationSpy.mockReturnValue(mockNavigateToSpy)
      render(<StartNewMessageButton />)

      fireEvent.press(screen.getByRole('button', { name: 'Start new message' }))
      expect(mockNavigationSpy).toHaveBeenCalledWith('StartNewMessage', { attachmentFileToAdd: {}, attachmentFileToRemove: {} })
    })
  })
})
