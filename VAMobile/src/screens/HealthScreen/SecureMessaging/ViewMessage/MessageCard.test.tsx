import 'react-native'
import React from 'react'
import { fireEvent, screen } from '@testing-library/react-native'
// Note: test renderer must be required after react-native.
import { context, render } from 'testUtils'
import { downloadFileAttachment } from 'store/slices'
import { ErrorsState, initialErrorsState, InitialState } from 'store/slices'
import { CategoryTypeFields, SecureMessagingAttachment, SecureMessagingMessageAttributes } from 'store/api/types'
import MessageCard from './MessageCard'
import Mock = jest.Mock
import { getFormattedDateAndTimeZone } from 'utils/formattingUtils'
import { DateTime } from 'luxon'

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

    const initializeTestInstance = (errorsState: ErrorsState = initialErrorsState, isInitialMessage: boolean = false) => {
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

      render(<MessageCard {...mockProps} />, {
        preloadedState: {
          ...InitialState,
          errors: errorsState,
        },
      })
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

    it('clicking on Only use messages for non-urgent needs should open largePanel', async () => {
        fireEvent.press(screen.getByLabelText('Only use messages for non-urgent needs'))
        expect(mockNavigationSpy).toHaveBeenCalled()
      })

    it('clicking on attachment should call onPressAttachment(), which calls downloadFileAttachment() from store/actions', async () => {
      fireEvent.press(screen.getByText('testAttachment (1 MB)'))
      expect(downloadFileAttachment).toBeCalledWith(listOfAttachments[0], 'attachment-1')
    })
  })