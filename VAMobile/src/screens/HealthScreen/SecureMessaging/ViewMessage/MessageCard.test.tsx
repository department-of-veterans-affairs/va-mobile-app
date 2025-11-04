import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'
import { t } from 'i18next'
import { DateTime } from 'luxon'

import {
  CategoryTypeFields,
  SecureMessagingAttachment,
  SecureMessagingMessageAttributes,
  SecureMessagingSystemFolderIdConstants,
} from 'api/types'
import { READ } from 'constants/secureMessaging'
import MessageCard from 'screens/HealthScreen/SecureMessaging/ViewMessage/MessageCard'
import { context, render } from 'testUtils'
import { getFormattedDateAndTimeZone } from 'utils/formattingUtils'

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
  readReceipt: READ,
}

context('MessageCard', () => {
  it('renders MessageCard correctly', () => {
    render(<MessageCard message={messageAttributes} folderId={SecureMessagingSystemFolderIdConstants.INBOX} />)
    expect(screen.getByText('Education: Test Message Subject')).toBeTruthy()
    expect(screen.getByText('John Smith')).toBeTruthy()
    expect(screen.getByText(getFormattedDateAndTimeZone(mockDateISO!))).toBeTruthy()
    expect(screen.getByText('Test Message Body')).toBeTruthy()
    expect(screen.getByLabelText(t('secureMessaging.replyHelp.onlyUseMessages'))).toBeTruthy()
    expect(screen.queryByText(t('secureMessaging.viewMessage.opened'))).toBeFalsy()
  })

  it('clicking on Only use messages for non-urgent needs should open largePanel', () => {
    render(<MessageCard message={messageAttributes} folderId={SecureMessagingSystemFolderIdConstants.INBOX} />)
    fireEvent.press(screen.getByLabelText('Only use messages for non-urgent needs'))
    expect(mockNavigationSpy).toHaveBeenCalled()
  })

  it('renders read receipt when READ and in sent folder', () => {
    render(<MessageCard message={messageAttributes} folderId={SecureMessagingSystemFolderIdConstants.SENT} />)
    expect(screen.getByText(t('secureMessaging.viewMessage.opened'))).toBeTruthy()
    expect(mockNavigationSpy).toHaveBeenCalled()
  })
})
