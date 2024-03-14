import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'
import { when } from 'jest-when'

import { updateSecureMessagingTab } from 'store/slices'
import { context, render } from 'testUtils'

import NoFolderMessages from './NoFolderMessages'

jest.mock('store/slices', () => {
  const actual = jest.requireActual('store/slices')
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

  describe('on click of the go to inbox link', () => {
    it('should call updateSecureMessagingTab and useRouteNavigation', () => {
      fireEvent.press(screen.getByRole('link', { name: 'Go to inbox' }))
      expect(updateSecureMessagingTab).toHaveBeenCalled()
      expect(mockNavigationSpy).toHaveBeenCalled()
    })
  })
})
