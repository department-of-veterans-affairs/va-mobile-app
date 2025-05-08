import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'
import { t } from 'i18next'

import { CategoryTypeFields, SecureMessagingMessageGetData, SecureMessagingThreadGetData } from 'api/types'
import * as api from 'store/api'
import { context, mockNavProps, render, waitFor, when } from 'testUtils'

import { isIOS } from '../../../../utils/platform'
import ReplyMessage from './ReplyMessage'

const mockNavigationSpy = jest.fn()
jest.mock('utils/hooks', () => {
  const original = jest.requireActual('utils/hooks')
  return {
    ...original,
    useRouteNavigation: () => {
      return mockNavigationSpy
    },
  }
})

const mockUseComposeCancelConfirmationSpy = jest.fn()
jest.mock('../CancelConfirmations/ComposeCancelConfirmation', () => {
  const original = jest.requireActual('utils/hooks')
  return {
    ...original,
    useComposeCancelConfirmation: () => [false, mockUseComposeCancelConfirmationSpy],
  }
})

const mockIsIOS = jest.fn()
jest.mock('utils/platform', () => ({
  isIOS: jest.fn(() => mockIsIOS),
}))

// Contains message attributes mapped to their ids
const thread: SecureMessagingThreadGetData = {
  data: [
    {
      id: 1,
      type: '1',
      attributes: {
        messageId: 1,
        category: CategoryTypeFields.other,
        subject: 'mock subject 1: The initial message sets the overall thread subject header',
        body: 'message 1 body text',
        hasAttachments: false,
        attachment: false,
        sentDate: '1',
        senderId: 2,
        senderName: 'mock sender 1',
        recipientId: 3,
        recipientName: 'mock recipient name 1',
        readReceipt: 'mock read receipt 1',
      },
    },
    {
      id: 2,
      type: '1',
      attributes: {
        messageId: 2,
        category: CategoryTypeFields.other,
        subject: '',
        body: 'test 2',
        hasAttachments: false,
        attachment: false,
        sentDate: '2',
        senderId: 2,
        senderName: 'mock sender 2',
        recipientId: 3,
        recipientName: 'mock recipient name 2',
        readReceipt: 'mock read receipt 2',
      },
    },
    {
      id: 3,
      type: '3',
      attributes: {
        messageId: 3,
        category: CategoryTypeFields.other,
        subject: '',
        body: 'Last accordion collapsible should be open, so the body text of this message should display',
        hasAttachments: false,
        attachment: false,
        sentDate: '3',
        senderId: 2,
        senderName: 'mock sender 3',
        recipientId: 3,
        recipientName: 'mock recipient name 3',
        readReceipt: 'mock read receipt',
      },
    },
  ],
}

const message: SecureMessagingMessageGetData = {
  data: {
    id: 3,
    type: '3',
    attributes: {
      messageId: 3,
      category: CategoryTypeFields.other,
      subject: '',
      body: 'Last accordion collapsible should be open, so the body text of this message should display',
      hasAttachments: false,
      attachment: false,
      sentDate: '3',
      senderId: 2,
      senderName: 'mock sender 3',
      recipientId: 3,
      recipientName: 'mock recipient name 3',
      readReceipt: 'mock read receipt',
    },
  },
  included: [],
}

context('ReplyMessage', () => {
  const isIOSMock = isIOS as jest.Mock

  const initializeTestInstance = () => {
    isIOSMock.mockReturnValue(false)

    const props = mockNavProps(
      undefined,
      {
        addListener: mockUseComposeCancelConfirmationSpy,
        goBack: jest.fn(),
        navigate: jest.fn(),
        setOptions: () => {},
      },
      { params: { messageID: 3, attachmentFileToAdd: {} } },
    )

    when(api.get as jest.Mock)
      .calledWith(`/v1/messaging/health/messages/3/thread?excludeProvidedMessage=${false}`, {
        useCache: 'false',
      })
      .mockResolvedValue(thread)
      .calledWith(`/v0/messaging/health/messages/3`)
      .mockResolvedValue(message)
    render(<ReplyMessage {...props} />)
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  describe('render correctly', () => {
    it('should also navigate on click of Only use messages for non-urgent needs', async () => {
      expect(screen.getByText(t('secureMessaging.viewMessage.loading'))).toBeTruthy()
      await waitFor(() =>
        expect(screen.getByText(`${t('secureMessaging.formMessage.message')} ${t('required')}`)).toBeTruthy(),
      )
      expect(screen.getAllByRole('tab').length).toBe(3)
      expect(screen.getByText('mock sender 1')).toBeTruthy()
      expect(screen.getByText('mock sender 2')).toBeTruthy()
      expect(screen.getAllByText('mock sender 3').length).toBe(2)
      expect(screen.queryByText('mock sender 45')).toBeFalsy()
      fireEvent.press(screen.getByLabelText(t('secureMessaging.replyHelp.onlyUseMessages')))
      await waitFor(() => expect(mockNavigationSpy).toHaveBeenCalled())
    })
  })

  describe('on click of save (draft)', () => {
    describe('when a required field is not filled', () => {
      it('should display a field error for that field and an AlertBox', async () => {
        await waitFor(() => fireEvent.press(screen.getByText(t('save'))))
        await waitFor(() =>
          expect(screen.getAllByText(t('secureMessaging.formMessage.message.fieldError'))).toBeTruthy(),
        )
        expect(screen.getAllByText(t('secureMessaging.formMessage.weNeedMoreInfo'))).toBeTruthy()
        expect(screen.getAllByText(t('secureMessaging.formMessage.saveDraft.validation.text'))).toBeTruthy()
      })
    })
  })

  describe('on click of send', () => {
    describe('when a required field is not filled', () => {
      it('should display a field error for that field and an AlertBox', async () => {
        await waitFor(() => fireEvent.press(screen.getByText(t('secureMessaging.formMessage.send'))))
        await waitFor(() =>
          expect(screen.getAllByText(t('secureMessaging.formMessage.message.fieldError'))).toBeTruthy(),
        )
        expect(screen.getAllByText(t('secureMessaging.formMessage.weNeedMoreInfo'))).toBeTruthy()
        expect(screen.getAllByText(t('secureMessaging.formMessage.sendMessage.validation.text'))).toBeTruthy()
      })
    })
  })

  describe('on click of add files button', () => {
    it('should call useRouteNavigation', async () => {
      await waitFor(() => fireEvent.press(screen.getByLabelText(t('secureMessaging.formMessage.addFiles'))))
      await waitFor(() => expect(mockNavigationSpy).toHaveBeenCalled())
    })
  })
})
