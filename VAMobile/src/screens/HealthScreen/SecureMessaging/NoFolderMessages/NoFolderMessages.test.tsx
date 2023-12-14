import React from 'react'
import { fireEvent, screen } from '@testing-library/react-native'
import { when } from 'jest-when'

import { context, render } from 'testUtils'
import NoFolderMessages from './NoFolderMessages'
import { updateSecureMessagingTab } from 'store/slices'


jest.mock('store/slices', () => {
  let actual = jest.requireActual('store/slices')
  return {
    ...actual,
    updateSecureMessagingTab: jest.fn(() => {
      return {
        type: '',
        payload: '',
      }
    }),
  }
})

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

  beforeEach(() => {
    initializeTestInstance()
  })

  it('should render text fields correctly', () => {
    expect(screen.getByText("You don't have any messages in this folder")).toBeTruthy()
  })

  describe('on click of the go to inbox button', () => {
    it('should call updateSecureMessagingTab and useRouteNavigation', () => {
      fireEvent.press(screen.getByRole('button', { name: 'Go to inbox' }))
      expect(updateSecureMessagingTab).toHaveBeenCalled()
      expect(mockNavigationSpy).toHaveBeenCalled()
    })
  })
})
