import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance, act } from 'react-test-renderer'

import { context, mockStore, renderWithProviders } from 'testUtils'
import Inbox from './Inbox'
import NoInboxMessages from '../NoInboxMessages/NoInboxMessages'
import { initialSecureMessagingState } from 'store'
import { SecureMessagingMessageData } from 'store/api/types'

const mockMessages: Array<SecureMessagingMessageData> = [
  {
    type: 'test',
    id: 1,
    attributes: {
      messageId: 1,
      category: 'mock category',
      subject: 'mock subject',
      body: 'test',
      attachment: false,
      sentDate: '1-1-21',
      senderId: 2,
      senderName: 'mock sender',
      recipientId: 3,
      recipientName: 'mock recipient name',
      readReceipt: 'mock read receipt'
    }
  }
]

context('Inbox', () => {
  let component: any
  let store: any
  let testInstance: ReactTestInstance

  const initializeTestInstance = () => {
    act(() => {
      component = renderWithProviders(
        <Inbox/>, store
      )
    })

    testInstance = component.root
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  describe('when there are no inbox messages', () => {
    it('should render NoInboxMessages', async () => {
      store = mockStore({
        secureMessaging: {
          ...initialSecureMessagingState,
          inboxMessages: []
        }
      })

      act(() => {
        component = renderWithProviders(
          <Inbox/>, store
        )
      })

      testInstance = component.root
      expect(testInstance.findByType(NoInboxMessages)).toBeTruthy()
    })
  })

  describe('when there are inbox messages', () => {
    it('should render NoInboxMessages', async () => {
      store = mockStore({
        secureMessaging: {
          ...initialSecureMessagingState,
          inboxMessages: [...mockMessages]
        }
      })

      act(() => {
        component = renderWithProviders(
          <Inbox/>, store
        )
      })

      testInstance = component.root
      expect(testInstance.findAllByType(NoInboxMessages)).toHaveLength(0)
    })
  })
})
