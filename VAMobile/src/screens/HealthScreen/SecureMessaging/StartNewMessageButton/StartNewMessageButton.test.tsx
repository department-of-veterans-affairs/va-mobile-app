import React from 'react'
import { fireEvent, screen } from '@testing-library/react-native'

import { context, render } from 'testUtils'
import StartNewMessageButton from './StartNewMessageButton'

let mockNavigationSpy = jest.fn()
jest.mock('@react-navigation/native', () => {
  let actual = jest.requireActual('@react-navigation/native')
  return {
    ...actual,
    useNavigation: () => ({
      navigate: mockNavigationSpy,
    }),
  }
})

context('StartNewMessageFooter', () => {
  beforeEach(() => {
    render(<StartNewMessageButton />)
  })

  describe('on click of the footer button', () => {
    it('should call useRouteNavigation', () => {
      fireEvent.press(screen.getByRole('button', { name: 'Start new message' }))
      expect(mockNavigationSpy).toHaveBeenCalledWith('StartNewMessage', { attachmentFileToAdd: {}, attachmentFileToRemove: {} })
    })
  })
})
