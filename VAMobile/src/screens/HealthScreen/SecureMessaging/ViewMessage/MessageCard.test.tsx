import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'
import { DateTime } from 'luxon'

import { CategoryTypeFields, SecureMessagingAttachment, SecureMessagingMessageAttributes } from 'store/api/types'
import { downloadFileAttachment } from 'store/slices'
import { context, render } from 'testUtils'
import { getFormattedDateAndTimeZone } from 'utils/formattingUtils'

import MessageCard from './MessageCard'

const mockNavigationSpy = jest.fn()
jest.mock('utils/hooks', () => ({
  ...jest.requireActual<typeof import('utils/hooks')>('utils/hooks'),
  useRouteNavigation: () => mockNavigationSpy,
}))

jest.mock('store/slices', () => ({
  ...jest.requireActual<typeof import('store/slices')>('store/slices'),
  downloadFileAttachment: jest.fn(() => ({ type: '', payload: '' })),
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

  it('clicking on attachment should call onPressAttachment(), which calls downloadFileAttachment() from store/actions', () => {
    fireEvent.press(screen.getByRole('link', { name: 'testAttachment (1 MB)' }))
    expect(downloadFileAttachment).toBeCalledWith(listOfAttachments[0], 'attachment-1')
  })
})
