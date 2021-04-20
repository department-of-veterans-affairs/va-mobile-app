import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance, act } from 'react-test-renderer'

import {context, mockNavProps, renderWithProviders, mockStore } from 'testUtils'
import FolderMessages from './FolderMessages'
import {Pressable} from 'react-native'
import {InitialState} from 'store/reducers'
import {LoadingComponent} from 'components'
import NoFolderMessages from '../NoFolderMessages/NoFolderMessages'
import {CategoryTypeFields} from "store/api/types";

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

context('FolderMessages', () => {
  let component: any
  let testInstance: ReactTestInstance
  let props: any
  let store: any

  const initializeTestInstance = (loading = false, noMessages = false) => {
    props = mockNavProps(undefined, undefined, { params: { folderID: 'id', folderName: 'Custom' }})

    const messages = {
      'id': {
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
          sentDate: '03-12-2021'
        }
      }
    }

    store = mockStore({
      ...InitialState,
      secureMessaging: {
        ...InitialState.secureMessaging,
        messagesByFolderId: noMessages ? {} : messages,
        loading
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
})
