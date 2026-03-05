import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'
import { when } from 'jest-when'

import NoFolderMessages from 'screens/HealthScreen/SecureMessaging/NoFolderMessages/NoFolderMessages'
import { context, render } from 'testUtils'

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
  const initializeTestInstance = (noRecipientsError = false) => {
    when(mockNavigationSpy)
      .mockReturnValue(() => {})
      .calledWith('SecureMessaging')
      .mockReturnValue(jest.fn())
    render(<NoFolderMessages noRecipientsError={noRecipientsError} />)
  }

  describe('should render correctly', () => {
    it('on click of the go to inbox button should call updateSecureMessagingTab and useRouteNavigation', () => {
      initializeTestInstance()
      expect(screen.getByText("You don't have any messages in this folder")).toBeTruthy()
      fireEvent.press(screen.getByRole('link', { name: 'Go to inbox' }))
      expect(mockNavigationSpy).toHaveBeenCalled()
    })
  })

  describe('start new message button visibility', () => {
    it('should show the button when noRecipientsError is false', () => {
      initializeTestInstance(false)
      expect(screen.getByTestId('startNewMessageButtonTestID')).toBeTruthy()
    })

    it('should hide the button when noRecipientsError is true', () => {
      initializeTestInstance(true)
      expect(screen.queryByTestId('startNewMessageButtonTestID')).toBeNull()
    })
  })
})
