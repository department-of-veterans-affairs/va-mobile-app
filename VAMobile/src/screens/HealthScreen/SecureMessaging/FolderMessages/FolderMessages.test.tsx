import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance, act } from 'react-test-renderer'

import {context, mockNavProps, renderWithProviders, mockStore, findByTestID} from 'testUtils'
import FolderMessages from './FolderMessages'
import {Pressable} from 'react-native'
import {InitialState} from 'store/reducers'
import {LoadingComponent, Pagination} from 'components'
import NoFolderMessages from '../NoFolderMessages/NoFolderMessages'
import {CategoryTypeFields, SecureMessagingSystemFolderIdConstants} from 'store/api/types'
import {listFolderMessages} from 'store/actions'

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

jest.mock('../../../../store/actions', () => {
  let actual = jest.requireActual('../../../../store/actions')
  return {
    ...actual,
    listFolderMessages: jest.fn(() => {
      return {
        type: '',
        payload: {}
      }
    })
  }
})

context('FolderMessages', () => {
  let component: any
  let testInstance: ReactTestInstance
  let props: any
  let store: any

  const initializeTestInstance = (loading = false, noMessages = false, hidePagination = false) => {
    const sentFolderID = SecureMessagingSystemFolderIdConstants.SENT
    const folderID = hidePagination ? 1 : sentFolderID
    props = mockNavProps(undefined, undefined, { params: { folderID: folderID, folderName: 'Custom' }})

    const messages = {
      [folderID]: {
        data: [
          {
            type: 'type',
            id: 0,
            attributes: {
              messageId: 1,
              category: CategoryTypeFields.other,
              subject: '',
              attachment: false,
              sentDate: '03-12-2021',
              senderId: 0,
              senderName: 'name',
              recipientId: 1,
              recipientName: 'recipient'
            }
          }
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
            sentDate: "DESC"
          },
          pagination: {
            currentPage: 2,
            perPage: 1,
            totalPages: 3,
            totalEntries: 5
          }
        }
      }
    }

    store = mockStore({
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
            totalEntries: 5
          }
        }
      }
    })

    act(() => {
      component = renderWithProviders(<FolderMessages {...props} />, store)
    })

    testInstance = component.root
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  describe('when a message is pressed', () => {
    it('should call useRouteNavigation', async () => {
      testInstance.findAllByType(Pressable)[0].props.onPress()
      expect(mockNavigationSpy).toHaveBeenCalled()
    })
  })

  describe('when loading is true', () => {
    it('should render the LoadingComponent', async () => {
      initializeTestInstance(true)
      expect(testInstance.findAllByType(LoadingComponent).length).toEqual(1)
    })
  })

  describe('when there are no messages', () => {
    it('should render the NoFolderMessages', async () => {
      initializeTestInstance(false, true)
      expect(testInstance.findAllByType(NoFolderMessages).length).toEqual(1)
    })
  })

  describe('pagination', () => {
    it('should call listFolderMessages for previous arrow', async () => {
      findByTestID(testInstance, 'previous-page').props.onPress()
      // was 2 now 1
      expect(listFolderMessages).toHaveBeenCalledWith(-1, 1, expect.anything())
    })

    it('should call listFolderMessages for next arrow', async () => {
      findByTestID(testInstance, 'next-page').props.onPress()
      // was 2 now 3
      expect(listFolderMessages).toHaveBeenCalledWith(-1, 3, expect.anything())
    })

    it('should hide pagination if folderID is not SENT(-1)', async () => {
      initializeTestInstance(false, false, true)
      expect(testInstance.findAllByType(Pagination).length).toEqual(0)
    })
  })
})
