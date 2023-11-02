import React from 'react'
import { fireEvent, screen } from '@testing-library/react-native'
import { DateTime } from 'luxon'

import { context, render } from 'testUtils'
import { downloadFileAttachment } from 'store/slices'
import { CategoryTypeFields, SecureMessagingAttachment, SecureMessagingMessageAttributes } from 'store/api/types'
import MessageCard from './MessageCard'
import { getFormattedDateAndTimeZone } from 'utils/formattingUtils'
import Mock = jest.Mock

let mockNavigationSpy = jest.fn()
jest.mock('@react-navigation/native', () => {
  let actual = jest.requireActual('@react-navigation/native')
  return {
    ...actual,
    useNavigation: () => ({
      navigate: mockNavigationSpy,
    }),
  }
})

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

const mockDateISO = DateTime.fromMillis(1643402338567).toISO()
context('MessageCard', () => {
  let onPressSpy: Mock
  let listOfAttachments: Array<SecureMessagingAttachment> = [
    {
      id: 1,
      filename: 'testAttachment',
      size: 1048576, // Converts to 1 MB
      link: 'key',
    },
  ]

  const initializeTestInstance = () => {
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
      isInitialMessage: false,
    }

    render(<MessageCard {...mockProps} />)
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  it('renders MessageCard correctly', () => {
    expect(screen.getByText('Education: Test Message Subject')).toBeTruthy()
    expect(screen.getByText('John Smith')).toBeTruthy()
    expect(screen.getByText(getFormattedDateAndTimeZone(mockDateISO))).toBeTruthy()
    expect(screen.getByText('Test Message Body')).toBeTruthy()
    expect(screen.getByLabelText('Only use messages for non-urgent needs')).toBeTruthy()
  })

  it('clicking on Only use messages for non-urgent needs should open largePanel', () => {
      fireEvent.press(screen.getByLabelText('Only use messages for non-urgent needs'))
      expect(mockNavigationSpy).toHaveBeenCalled()
    })

  it('clicking on attachment should call onPressAttachment(), which calls downloadFileAttachment() from store/actions', () => {
    fireEvent.press(screen.getByText('testAttachment (1 MB)'))
    expect(downloadFileAttachment).toBeCalledWith(listOfAttachments[0], 'attachment-1')
  })
})
