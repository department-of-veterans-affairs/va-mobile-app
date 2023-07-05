import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance, act } from 'react-test-renderer'

import { context, render, RenderAPI } from 'testUtils'
import { downloadFileAttachment } from 'store/slices'
import { Pressable } from 'react-native'
import { ErrorsState, initialErrorsState, InitialState } from 'store/slices'
import { CategoryTypeFields, SecureMessagingAttachment, SecureMessagingMessageAttributes } from 'store/api/types'
import CollapsibleMessage from './CollapsibleMessage'
import Mock = jest.Mock
import { TextView } from 'components'
import { waitFor } from '@testing-library/react-native'

jest.mock('store/slices', () => {
  let actual = jest.requireActual('store/slices')
  return {
    ...actual,
    downloadFileAttachment: jest.fn(() => {
      return {
        type: '',
        payload: '',
      }
    }),
  }
})

context('CollapsibleMessage', () => {
  let component: RenderAPI
  let testInstance: ReactTestInstance
  let onPressSpy: Mock

  let listOfAttachments: Array<SecureMessagingAttachment> = [
    {
      id: 1,
      filename: 'testAttachment',
      size: 1048576, // Converts to 1 MB
      link: 'key',
    },
  ]
  let messageAttributes: SecureMessagingMessageAttributes = {
    messageId: 1,
    category: CategoryTypeFields.education,
    subject: 'Test Message Subject',
    body: 'Test Message Body',
    attachment: true,
    attachments: listOfAttachments,
    sentDate: '2013-06-06T04:00:00.000+00:00',
    senderId: 11,
    senderName: 'John Smith',
    recipientId: 2,
    recipientName: 'Jane Smith',
  }
  let mockProps = {
    message: messageAttributes,
    isInitialMessage: true,
  }

  const initializeTestInstance = (errorsState: ErrorsState = initialErrorsState) => {
    onPressSpy = jest.fn(() => {})

    component = render(<CollapsibleMessage {...mockProps} />, {
      preloadedState: {
        ...InitialState,
        errors: errorsState,
      },
    })

    testInstance = component.UNSAFE_root
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  it('does not render CollapsibleMessage when it is the initialMessage', () => {
    initializeTestInstance(initialErrorsState, true)
    expect(screen.queryByText('John Smith')).toBeFalsy()
  })

  it('should render AttachmentLink content correctly', async () => {
    const linkText = testInstance.findAllByType(Pressable)[1].findByType(TextView)
    expect(linkText.props.children).toBe('testAttachment (1 MB)')
  })

  describe('when an attachment link is clicked', () => {
    it('should call onPressAttachment(), which calls downloadFileAttachment() from store/actions', async () => {
      await waitFor(() => {
        testInstance.findAllByType(Pressable)[1].props.onPress()
        expect(downloadFileAttachment).toBeCalledWith(listOfAttachments[0], 'attachment-1')
      })
    })
  })
})
