import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { fireEvent, screen } from '@testing-library/react-native'

import { context, render } from 'testUtils'
import NoFolderMessages from './NoFolderMessages'
import { updateSecureMessagingTab } from 'store/slices'
import { when } from 'jest-when'

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

  it('should render text fields correctly', async () => {
    expect(screen.getByText("You don't have any messages in this folder")).toBeTruthy()
  })

  describe('on click of the go to inbox button', () => {
    it('should call updateSecureMessagingTab and useRouteNavigation', async () => {
      fireEvent.press(screen.getByText('Go to inbox'))
      expect(updateSecureMessagingTab).toHaveBeenCalled()
      expect(mockNavigationSpy).toHaveBeenCalled()
    })
  })
})
