import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'
import { DateTime } from 'luxon'

import { CategoryTypeFields, SecureMessagingAttachment, SecureMessagingMessageAttributes } from 'api/types'
import { context, render } from 'testUtils'
import { getFormattedDateAndTimeZone } from 'utils/formattingUtils'

import CollapsibleMessage from './CollapsibleMessage'

jest.mock('store/slices', () => {
  const actual = jest.requireActual('store/slices')
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
  const listOfAttachments: Array<SecureMessagingAttachment> = [
    {
      id: 1,
      filename: 'testAttachment',
      size: 1048576, // Converts to 1 MB
      link: 'key',
    },
  ]

  const initializeTestInstance = (isInitialMessage = false, body = 'Test Message Body') => {
    const messageAttributes: SecureMessagingMessageAttributes = {
      messageId: 1,
      category: CategoryTypeFields.education,
      subject: 'Test Message Subject',
      body: body,
      hasAttachments: true,
      attachment: true,
      attachments: listOfAttachments,
      sentDate: mockDateISO,
      senderId: 11,
      senderName: 'John Smith',
      recipientId: 2,
      recipientName: 'Jane Smith',
    }
    const mockProps = {
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

  it('linkifies email addresses properly', () => {
    initializeTestInstance(false, 'test@va.gov or mailto:test@va.gov')
    fireEvent.press(screen.getByText('John Smith'))
    expect(screen.getByRole('link', { name: 'test@va.gov' })).toBeTruthy()
    expect(screen.getByRole('link', { name: 'mailto:test@va.gov' })).toBeTruthy()
  })

  it('does not linkify improper email addresses', () => {
    initializeTestInstance(false, 'test @va.gov or mail to:test@va.gov')
    fireEvent.press(screen.getByText('John Smith'))
    expect(screen.queryByRole('link', { name: 'test@va.gov' })).toBeFalsy()
    expect(screen.queryByRole('link', { name: 'mailto:test@va.gov' })).toBeFalsy()
  })

  it('linkifies phone numbers properly', () => {
    initializeTestInstance(
      false,
      '8006982411 or 800-698-2411 or (800)698-2411 or (800)-698-2411 or 800 698 2411 or +8006982411 or +18006982411 or 1-800-698-2411',
    )
    fireEvent.press(screen.getByText('John Smith'))
    expect(screen.getByRole('link', { name: '8006982411' })).toBeTruthy()
    expect(screen.getByRole('link', { name: '800-698-2411' })).toBeTruthy()
    expect(screen.getByRole('link', { name: '(800)698-2411' })).toBeTruthy()
    expect(screen.getByRole('link', { name: '(800)-698-2411' })).toBeTruthy()
    expect(screen.getByRole('link', { name: '800 698 2411' })).toBeTruthy()
    expect(screen.getByRole('link', { name: '+8006982411' })).toBeTruthy()
    expect(screen.getByRole('link', { name: '+18006982411' })).toBeTruthy()
    expect(screen.getByRole('link', { name: '1-800-698-2411' })).toBeTruthy()
  })

  it('does not linkify improper phone numbers', () => {
    initializeTestInstance(false, '800698241 or 800&698&2411 or 800 698 411')
    fireEvent.press(screen.getByText('John Smith'))
    expect(screen.queryByRole('link', { name: '800698241' })).toBeFalsy()
    expect(screen.queryByRole('link', { name: '800&698&2411' })).toBeFalsy()
    expect(screen.queryByRole('link', { name: '800 698 411' })).toBeFalsy()
  })

  it('linkifies web address and maps properly', () => {
    initializeTestInstance(
      false,
      'https://www.va.gov/ or https://rb.gy/riwea or https://va.gov or http://www.va.gov/ or https://www.va.gov/education/about-gi-bill-benefits/ or www.va.gov or www.google.com or google.com or http://maps.apple.com/?q=Mexican+Restaurant&sll=50.894967,4.341626&z=10&t=s or http://maps.google.com/?q=50.894967,4.341626',
    )
    fireEvent.press(screen.getByText('John Smith'))
    expect(screen.getByRole('link', { name: 'https://www.va.gov/' })).toBeTruthy()
    expect(screen.getByRole('link', { name: 'https://rb.gy/riwea' })).toBeTruthy()
    expect(screen.getByRole('link', { name: 'https://va.gov' })).toBeTruthy()
    expect(screen.getByRole('link', { name: 'http://www.va.gov/' })).toBeTruthy()
    expect(screen.getByRole('link', { name: 'https://www.va.gov/education/about-gi-bill-benefits/' })).toBeTruthy()
    expect(screen.getByRole('link', { name: 'www.va.gov' })).toBeTruthy()
    expect(screen.getByRole('link', { name: 'www.google.com' })).toBeTruthy()
    expect(screen.getByRole('link', { name: 'google.com' })).toBeTruthy()
    expect(
      screen.getByRole('link', { name: 'http://maps.apple.com/?q=Mexican+Restaurant&sll=50.894967,4.341626&z=10&t=s' }),
    ).toBeTruthy()
    expect(screen.getByRole('link', { name: 'http://maps.google.com/?q=50.894967,4.341626' })).toBeTruthy()
  })

  it('does not linkify improper web address and maps', () => {
    initializeTestInstance(false, 'ftp://www.va.gov/ or www. va .gov or htttps://va.gov')
    fireEvent.press(screen.getByText('John Smith'))
    expect(screen.queryByRole('link', { name: 'ftp://www.va.gov/' })).toBeFalsy()
    expect(screen.queryByRole('link', { name: 'www. va .gov' })).toBeFalsy()
    expect(screen.queryByRole('link', { name: 'htttps://va.gov' })).toBeFalsy()
  })
})
