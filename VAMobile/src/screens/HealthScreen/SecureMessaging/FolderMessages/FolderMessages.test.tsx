import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance } from 'react-test-renderer'

import { context, mockNavProps, render, findByTestID, findByTypeWithText, findByTypeWithSubstring, findByTypeWithName, waitFor } from 'testUtils'
import FolderMessages from './FolderMessages'
import { Pressable } from 'react-native'
import { InitialState, listFolderMessages } from 'store/slices'
import { LoadingComponent, Pagination, TextView, VAIcon, AlertBox } from 'components'
import NoFolderMessages from '../NoFolderMessages/NoFolderMessages'
import { CategoryTypeFields, SecureMessagingSystemFolderIdConstants } from 'store/api/types'
import { FolderNameTypeConstants } from 'constants/secureMessaging'
import { StackNavigationOptions } from '@react-navigation/stack'
import { RenderAPI } from '@testing-library/react-native'

const mockNavigationSpy = jest.fn()
jest.mock('/utils/hooks', () => {
  const original = jest.requireActual('/utils/hooks')
  const theme = jest.requireActual('/styles/themes/standardTheme').default
  return {
    ...original,
    useTheme: jest.fn(() => {
      return { ...theme }
    }),
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
  let component: RenderAPI
  let testInstance: ReactTestInstance
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

    component = render(<FolderMessages {...props} />, {
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

    testInstance = component.container
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  it('initializes correctly', async () => {
    await waitFor(() => {
      expect(component).toBeTruthy()
    })
  })

  describe('when a message is pressed', () => {
    it('should call navigate', async () => {
      await waitFor(() => {
        testInstance.findAllByType(Pressable)[0].props.onPress()
        expect(mockNavigationSpy).toHaveBeenCalled()
      })
    })
  })

  describe('when loading is true', () => {
    it('should render the LoadingComponent', async () => {
      await waitFor(() => {
        initializeTestInstance(true)
        expect(testInstance.findAllByType(LoadingComponent).length).toEqual(1)
      })
    })
  })

  describe('when there are no messages', () => {
    it('should render the NoFolderMessages', async () => {
      await waitFor(() => {
        initializeTestInstance(false, true)
        expect(testInstance.findAllByType(NoFolderMessages).length).toEqual(1)
      })
    })
  })

  describe('pagination', () => {
    it('should call listFolderMessages for previous arrow', async () => {
      await waitFor(() => {
        findByTestID(testInstance, 'previous-page').props.onPress()
        // was 2 now 1
      })
      expect(listFolderMessages).toHaveBeenCalledWith(-1, 1, expect.anything())
    })

    it('should call listFolderMessages for next arrow', async () => {
      await waitFor(() => {
        findByTestID(testInstance, 'next-page').props.onPress()
        // was 2 now 3
      })
      expect(listFolderMessages).toHaveBeenCalledWith(-1, 3, expect.anything())
    })

    it('should show pagination if it is not a system folder', async () => {
      await waitFor(() => {
        initializeTestInstance(false, false, 1)
      })
      expect(testInstance.findAllByType(Pagination).length).toEqual(1)
    })
  })

  describe('drafts', () => {
    it('should mark messages as a draft', async () => {
      await waitFor(() => {
        initializeTestInstance(false, false, SecureMessagingSystemFolderIdConstants.DRAFTS)
        expect(findByTypeWithSubstring(testInstance, TextView, 'DRAFT - ')).toBeTruthy()
      })
    })

    it('should not show unread icons', async () => {
      await waitFor(() => {
        initializeTestInstance(false, false, SecureMessagingSystemFolderIdConstants.DRAFTS)
        expect(findByTypeWithName(testInstance, VAIcon, 'Unread')).toBeFalsy()
      })
    })

    it('should show attachment icons', async () => {
      await waitFor(() => {
        initializeTestInstance(false, false, SecureMessagingSystemFolderIdConstants.DRAFTS)
        expect(findByTypeWithName(testInstance, VAIcon, 'PaperClip')).toBeTruthy()
      })
    })

    it('should show pagination', async () => {
      await waitFor(() => {
        initializeTestInstance(false, false, SecureMessagingSystemFolderIdConstants.DRAFTS)
        expect(testInstance.findAllByType(Pagination).length).toBeGreaterThan(0)
      })
    })
  })
})
