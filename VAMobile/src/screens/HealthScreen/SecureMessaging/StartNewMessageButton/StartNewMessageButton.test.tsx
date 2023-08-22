import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
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
    it('should call useRouteNavigation', async () => {
      fireEvent.press(screen.getByText('Start new message'))
      expect(mockNavigationSpy).toHaveBeenCalledWith('StartNewMessage', { attachmentFileToAdd: {}, attachmentFileToRemove: {} })
    })
  })
})
