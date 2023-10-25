import 'react-native'
import React from 'react'
import { Pressable } from 'react-native'

import { screen, fireEvent } from '@testing-library/react-native'
import { context, mockNavProps, render } from 'testUtils'
import { ErrorsState, initialSecureMessagingState, initialErrorsState } from 'store/slices'
import Folder from './Folders'
import { SecureMessagingFolderList } from 'store/api/types'

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

context('Folder', () => {
  let props: any
  let mockNavigateToSpy: jest.Mock

  let listOfFolders: SecureMessagingFolderList = [
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

  const initializeTestInstance = (foldersList: SecureMessagingFolderList, loading = false, errorsState: ErrorsState = initialErrorsState) => {
    props = mockNavProps()
    mockNavigateToSpy = jest.fn()
    mockNavigationSpy.mockReturnValue(mockNavigateToSpy)

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
    it('should show loading screen', async () => {
      initializeTestInstance([], true)
      expect(screen.getByText('Loading your folders...')).toBeTruthy()
    })
  })

  describe('when system folders are visible', () => {
    it('should show the Drafts folder', async () => {
      expect(screen.getByText('Drafts (2)')).toBeTruthy()
    })
  })

  describe('when a folder is clicked', () => {
    it('should call useRouteNavigation', async () => {
      fireEvent.press(screen.getByText('Drafts (2)'))
      expect(mockNavigationSpy).toHaveBeenCalledWith('FolderMessages', { folderID: -2, folderName: 'Drafts' })
      expect(mockNavigateToSpy).toHaveBeenCalled()
    })
  })
})
