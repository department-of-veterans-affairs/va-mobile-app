import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'

import { SecureMessagingFolderList } from 'store/api/types'
import { initialSecureMessagingState } from 'store/slices'
import { context, mockNavProps, render } from 'testUtils'

import Folder from './Folders'

const mockNavigationSpy = jest.fn()
jest.mock('utils/hooks', () => {
  const original = jest.requireActual('utils/hooks')
  return {
    ...original,
    useRouteNavigation: () => mockNavigationSpy,
  }
})

context('Folder', () => {
  const listOfFolders: SecureMessagingFolderList = [
    {
      type: 'folders',
      id: '-2',
      attributes: {
        folderId: -2,
        name: 'Drafts',
        count: 2,
        unreadCount: 2,
        systemFolder: true,
      },
    },
    {
      type: 'folders',
      id: '-1',
      attributes: {
        folderId: -1,
        name: 'Sent',
        count: 32,
        unreadCount: 0,
        systemFolder: true,
      },
    },
    {
      type: 'folders',
      id: '-3',
      attributes: {
        folderId: -3,
        name: 'Deleted',
        count: 24,
        unreadCount: 0,
        systemFolder: true,
      },
    },
    {
      type: 'folders',
      id: '100',
      attributes: {
        folderId: 100,
        name: 'test 1',
        count: 3,
        unreadCount: 0,
        systemFolder: true,
      },
    },
    {
      type: 'folders',
      id: '101',
      attributes: {
        folderId: 101,
        name: 'test 2',
        count: 12,
        unreadCount: 0,
        systemFolder: true,
      },
    },
  ]

  const initializeTestInstance = (foldersList: SecureMessagingFolderList, loading = false) => {
    const props = mockNavProps()

    render(<Folder {...props} />, {
      preloadedState: {
        secureMessaging: {
          ...initialSecureMessagingState,
          loadingFolders: loading,
          folders: foldersList,
        },
      },
    })
  }

  beforeEach(() => {
    initializeTestInstance(listOfFolders)
  })

  describe('when loading is set to true', () => {
    it('should show loading screen', () => {
      initializeTestInstance([], true)
      expect(screen.getByText('Loading your folders...')).toBeTruthy()
    })
  })

  describe('when system folders are visible', () => {
    it('should show the Drafts folder', () => {
      expect(screen.getByRole('button', { name: 'Drafts (2)' })).toBeTruthy()
    })
  })

  describe('when a folder is clicked', () => {
    it('should call useRouteNavigation', () => {
      fireEvent.press(screen.getByRole('button', { name: 'Drafts (2)' }))
      expect(mockNavigationSpy).toHaveBeenCalledWith('FolderMessages', { folderID: -2, folderName: 'Drafts' })
    })
  })
})
