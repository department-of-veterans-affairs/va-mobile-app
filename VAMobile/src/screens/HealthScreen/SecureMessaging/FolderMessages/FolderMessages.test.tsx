import 'react-native'
import React from 'react'
import { fireEvent, screen } from '@testing-library/react-native'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'

import { context, mockNavProps, render } from 'testUtils'
import FolderMessages from './FolderMessages'
import { InitialState, listFolderMessages } from 'store/slices'
import { CategoryTypeFields, SecureMessagingSystemFolderIdConstants } from 'store/api/types'
import { FolderNameTypeConstants } from 'constants/secureMessaging'
import { StackNavigationOptions } from '@react-navigation/stack'

const mockNavigationSpy = jest.fn()
jest.mock('/utils/hooks', () => {
  const original = jest.requireActual('/utils/hooks')
  const theme = jest.requireActual('/styles/themes/standardTheme').default
  return {
    ...original,
    useRouteNavigation: () => {
      return () => mockNavigationSpy
    },
  }
})

jest.mock('store/slices', () => {
  let actual = jest.requireActual('store/slices')
  return {
    ...actual,
    listFolderMessages: jest.fn(() => {
      return {
        type: '',
        payload: {},
      }
    }),
  }
})

context('FolderMessages', () => {
  let props: any
  let navHeaderSpy: any

  const initializeTestInstance = (loading = false, noMessages = false, folderID = SecureMessagingSystemFolderIdConstants.SENT, draftSaved = false) => {
    let folderName
    if (folderID > 0) folderName = 'Custom'
    else if (folderID === -1) folderName = FolderNameTypeConstants.sent
    else if (folderID === -2) folderName = FolderNameTypeConstants.drafts
    props = mockNavProps(
      undefined,
      {
        navigate: mockNavigationSpy,
        setOptions: (options: Partial<StackNavigationOptions>) => {
          navHeaderSpy = {
            back: options.headerLeft ? options.headerLeft({}) : undefined,
          }
        },
      },
      { params: { folderID: folderID, folderName: folderName, draftSaved: draftSaved } },
    )

    const messages = {
      [folderID]: {
        data: [
          {
            type: 'type',
            id: 0,
            attributes: {
              messageId: 1,
              category: CategoryTypeFields.other,
              subject: 'subject',
              hasAttachments: true,
              attachment: true,
              sentDate: '03-12-2021',
              senderId: 0,
              senderName: 'name',
              recipientId: 1,
              recipientName: 'recipient',
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
          sort: {
            sentDate: 'DESC',
          },
          pagination: {
            currentPage: 2,
            perPage: 1,
            totalPages: 3,
            totalEntries: 5,
          },
        },
      },
    }

    render(<FolderMessages {...props} />, {
      preloadedState: {
        ...InitialState,
        secureMessaging: {
          ...InitialState.secureMessaging,
          messagesByFolderId: noMessages ? {} : messages,
          loading,
          paginationMetaByFolderId: {
            [folderID]: {
              currentPage: 2,
              perPage: 1,
              totalPages: 3,
              totalEntries: 5,
            },
          },
        },
      },
    })
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  describe('when a message is pressed', () => {
    it('should call navigate', async () => {
      fireEvent.press(screen.getByTestId('Recipient Invalid DateTime Has attachment General: subject'))
      expect(mockNavigationSpy).toHaveBeenCalled()
    })
  })

  describe('when loading is true', () => {
    it('should render the LoadingComponent', async () => {
      initializeTestInstance(true)
      expect(screen.getByText('Loading your messages...')).toBeTruthy()
    })
  })

  describe('when there are no messages', () => {
    it('should render the NoFolderMessages', async () => {
      initializeTestInstance(false, true)
      expect(screen.getByText("You don't have any messages in this folder")).toBeTruthy()
    })
  })

  describe('pagination', () => {
    it('should call listFolderMessages for previous arrow', async () => {
      fireEvent.press(screen.getByTestId('previous-page'))
      expect(listFolderMessages).toHaveBeenCalledWith(-1, 1, expect.anything())
    })

    it('should call listFolderMessages for next arrow', async () => {
      fireEvent.press(screen.getByTestId('next-page'))
      expect(listFolderMessages).toHaveBeenCalledWith(-1, 3, expect.anything())
    })

    it('should show pagination if it is not a system folder', async () => {
      initializeTestInstance(false, false, 1)
      expect(screen.getByTestId('next-page')).toBeTruthy()
      expect(screen.getByTestId('previous-page')).toBeTruthy()
      expect(screen.getByText('2 to 2 of 5')).toBeTruthy()
    })
  })

  describe('drafts', () => {
    it('should mark messages as a draft', async () => {
      initializeTestInstance(false, false, SecureMessagingSystemFolderIdConstants.DRAFTS)
      expect(screen.getByText('DRAFT - Recipient')).toBeTruthy()
    })

    it('should show pagination', async () => {
      initializeTestInstance(false, false, SecureMessagingSystemFolderIdConstants.DRAFTS)
      expect(screen.getByTestId('next-page')).toBeTruthy()
      expect(screen.getByTestId('previous-page')).toBeTruthy()
      expect(screen.getByText('2 to 2 of 5')).toBeTruthy()
    })
  })
})
