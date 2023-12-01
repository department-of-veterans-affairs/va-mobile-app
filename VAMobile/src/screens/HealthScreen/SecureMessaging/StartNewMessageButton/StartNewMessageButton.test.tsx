import React from 'react'
import 'jest-styled-components'
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

context('StartNewMessageFooter', () => {
  describe('on click of the footer button', () => {
    it('should call useRouteNavigation', async () => {
      const mockNavigateToSpy = jest.fn()
      mockNavigationSpy.mockReturnValue(mockNavigateToSpy)
      render(<StartNewMessageButton />)

      fireEvent.press(screen.getByText('Start new message'))
      expect(mockNavigationSpy).toHaveBeenCalledWith('StartNewMessage', { attachmentFileToAdd: {}, attachmentFileToRemove: {} })
      expect(mockNavigateToSpy).toHaveBeenCalled()
    })
  })
})
