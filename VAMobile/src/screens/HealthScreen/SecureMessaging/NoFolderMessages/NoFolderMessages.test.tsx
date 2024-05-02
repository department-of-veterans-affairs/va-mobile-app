import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'
import { when } from 'jest-when'

import { context, render } from 'testUtils'

import NoFolderMessages from './NoFolderMessages'

const mockNavigationSpy = jest.fn()
jest.mock('utils/hooks', () => {
  const original = jest.requireActual('utils/hooks')
  return {
    ...original,
    useRouteNavigation: () => {
      return mockNavigationSpy
    },
  }
})

context('NoFolderMessages', () => {
  const initializeTestInstance = () => {
    when(mockNavigationSpy)
      .mockReturnValue(() => {})
      .calledWith('SecureMessaging')
      .mockReturnValue(jest.fn())
    render(<NoFolderMessages />)
  }

  describe('should render correctly', () => {
    it('on click of the go to inbox button should call updateSecureMessagingTab and useRouteNavigation', () => {
      initializeTestInstance()
      expect(screen.getByText("You don't have any messages in this folder")).toBeTruthy()
      fireEvent.press(screen.getByRole('link', { name: 'Go to inbox' }))
      expect(mockNavigationSpy).toHaveBeenCalled()
    })
  })
})
