import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'
import { DateTime } from 'luxon'

import { CategoryTypeFields, SecureMessagingAttachment, SecureMessagingMessageAttributes } from 'api/types'
import { context, render } from 'testUtils'
import { getFormattedDateAndTimeZone } from 'utils/formattingUtils'

import MessageCard from './MessageCard'

const mockNavigationSpy = jest.fn()
jest.mock('utils/hooks', () => ({
  ...jest.requireActual<typeof import('utils/hooks')>('utils/hooks'),
  useRouteNavigation: () => mockNavigationSpy,
}))

const mockDateISO = DateTime.fromMillis(1643402338567).toISO()
const listOfAttachments: Array<SecureMessagingAttachment> = [
  {
    id: 1,
    filename: 'testAttachment',
    size: 1048576, // Converts to 1 MB
    link: 'key',
  },
]
const messageAttributes: SecureMessagingMessageAttributes = {
  messageId: 1,
  category: CategoryTypeFields.education,
  subject: 'Test Message Subject',
  body: 'Test Message Body',
  hasAttachments: true,
  attachment: true,
  attachments: listOfAttachments,
  sentDate: mockDateISO!,
  senderId: 11,
  senderName: 'John Smith',
  recipientId: 2,
  recipientName: 'Jane Smith',
}

context('MessageCard', () => {
  beforeEach(() => {
    render(<MessageCard message={messageAttributes} />)
  })

  it('renders MessageCard correctly', () => {
    expect(screen.getByText('Education: Test Message Subject')).toBeTruthy()
    expect(screen.getByText('John Smith')).toBeTruthy()
    expect(screen.getByText(getFormattedDateAndTimeZone(mockDateISO!))).toBeTruthy()
    expect(screen.getByText('Test Message Body')).toBeTruthy()
    expect(screen.getByLabelText('Only use messages for non-urgent needs')).toBeTruthy()
  })

  it('clicking on Only use messages for non-urgent needs should open largePanel', () => {
    fireEvent.press(screen.getByLabelText('Only use messages for non-urgent needs'))
    expect(mockNavigationSpy).toHaveBeenCalled()
  })
})
