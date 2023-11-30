import React from 'react'
import { fireEvent, screen } from '@testing-library/react-native'
import { DateTime } from 'luxon'

import { context, render } from 'testUtils'
import { downloadFileAttachment } from 'store/slices'
import { CategoryTypeFields, SecureMessagingAttachment, SecureMessagingMessageAttributes } from 'store/api/types'
import CollapsibleMessage from './CollapsibleMessage'
import { getFormattedDateAndTimeZone } from 'utils/formattingUtils'
import Mock = jest.Mock

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

const mockDateISO = DateTime.local().toISO()

context('CollapsibleMessage', () => {
  let onPressSpy: Mock
  let listOfAttachments: Array<SecureMessagingAttachment> = [
    {
      id: 1,
      filename: 'testAttachment',
      size: 1048576, // Converts to 1 MB
      link: 'key',
    },
  ]

  const initializeTestInstance = (isInitialMessage: boolean = false) => {
    onPressSpy = jest.fn(() => {})

    let messageAttributes: SecureMessagingMessageAttributes = {
      messageId: 1,
      category: CategoryTypeFields.education,
      subject: 'Test Message Subject',
      body: 'Test Message Body',
      hasAttachments: true,
      attachment: true,
      attachments: listOfAttachments,
      sentDate: mockDateISO,
      senderId: 11,
      senderName: 'John Smith',
      recipientId: 2,
      recipientName: 'Jane Smith',
    }
    let mockProps = {
      message: messageAttributes,
      isInitialMessage: isInitialMessage,
    }

    render(<CollapsibleMessage {...mockProps} />)
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  it('renders CollapsibleMessage when it is not the initialMessage', () => {
    expect(screen.getByText('John Smith')).toBeTruthy()
    expect(screen.getByText(getFormattedDateAndTimeZone(mockDateISO))).toBeTruthy()
    expect(screen.getByText('Test Message Body')).toBeTruthy()
  })

  it('does not render CollapsibleMessage when it is the initialMessage', () => {
    initializeTestInstance(true)
    expect(screen.queryByText('John Smith')).toBeFalsy()
  })

  it('should render AttachmentLink content correctly when collapsibleMessage is expanded and should call onPressAttachment(), which calls downloadFileAttachment() from store/actions', () => {
    fireEvent.press(screen.getByText('John Smith'))
    expect(screen.getByText('testAttachment (1 MB)')).toBeTruthy()
    fireEvent.press(screen.getByText('testAttachment (1 MB)'))
    expect(downloadFileAttachment).toBeCalledWith(listOfAttachments[0], 'attachment-1')
  })
})
