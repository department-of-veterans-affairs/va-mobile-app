import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'

import { SecureMessagingFoldersGetData } from 'api/types'
import * as api from 'store/api'
import { context, mockNavProps, render, waitFor, when } from 'testUtils'

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
  const listOfFolders: SecureMessagingFoldersGetData = {
    data: [
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
    ],
    links: {
      self: '',
      first: '',
      prev: '',
      next: '',
      last: '',
    },
    meta: {
      pagination: {
        currentPage: 1,
        perPage: 10,
        totalPages: 1,
        totalEntries: 5,
      },
    },
    inboxUnreadCount: 0,
  }

  const initializeTestInstance = () => {
    const props = mockNavProps()
    render(<Folder {...props} />)
  }

  describe('handles folders as expected', () => {
    it('should initially show loading component and then show a folder with drafts and when clicking it it should navigate you accordingly', async () => {
      when(api.get as jest.Mock)
        .calledWith('/v0/messaging/health/folders')
        .mockResolvedValue(listOfFolders)
      initializeTestInstance()
      expect(screen.getByText('Loading your folders...')).toBeTruthy()
      await waitFor(() => expect(screen.getByRole('button', { name: 'Drafts (2)' })).toBeTruthy())
      await waitFor(() => fireEvent.press(screen.getByRole('button', { name: 'Drafts (2)' })))
      await waitFor(() =>
        expect(mockNavigationSpy).toHaveBeenCalledWith('FolderMessages', { folderID: -2, folderName: 'Drafts' }),
      )
    })
  })
})
