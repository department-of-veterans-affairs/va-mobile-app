import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'
import { DateTime } from 'luxon'

import {
  CategoryTypeFields,
  SecureMessagingFolderMessagesGetData,
  SecureMessagingMessageGetData,
  SecureMessagingRecipients,
  SecureMessagingSystemFolderIdConstants,
  SecureMessagingThreadGetData,
} from 'api/types'
import { LARGE_PAGE_SIZE } from 'constants/common'
import EditDraft from 'screens/HealthScreen/SecureMessaging/EditDraft/EditDraft'
import * as api from 'store/api'
import { context, mockNavProps, render, waitFor, when } from 'testUtils'

const mockNavigationSpy = jest.fn()
jest.mock('utils/hooks', () => {
  const original = jest.requireActual('utils/hooks')
  return {
    ...original,
    useRouteNavigation: () => mockNavigationSpy,
  }
})

const mockUseComposeCancelConfirmationSpy = jest.fn()
const mockUseGoToDraftSpy = jest.fn()
jest.mock('../CancelConfirmations/ComposeCancelConfirmation', () => {
  const original = jest.requireActual('utils/hooks')
  return {
    ...original,
    useComposeCancelConfirmation: () => [false, mockUseComposeCancelConfirmationSpy],
    useGoToDrafts: () => mockUseGoToDraftSpy,
  }
})

context('EditDraft', () => {
  let goBack: jest.Mock
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
          sentDate: String(DateTime.now().toUTC()),
          senderId: 2,
          senderName: 'mock sender 3',
          recipientId: 3,
          recipientName: 'mock recipient name 3',
          readReceipt: 'mock read receipt',
        },
      },
    ],
  }
  const nonReplyDraftThread: SecureMessagingThreadGetData = {
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
    ],
  }
  const oldThread: SecureMessagingThreadGetData = {
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
  const recipients: SecureMessagingRecipients = {
    data: [
      {
        id: 'id',
        type: 'type',
        attributes: {
          triageTeamId: 0,
          name: 'Doctor 1',
          relationType: 'PATIENT',
          preferredTeam: true,
          stationNumber: '357',
          locationName: 'test_location',
          suggestedNameDisplay: 'test_suggested_name',
          healthCareSystemName: 'test_healthcare_system_name',
        },
      },
      {
        id: 'id2',
        type: 'type',
        attributes: {
          triageTeamId: 1,
          name: 'Doctor 2',
          relationType: 'PATIENT',
          preferredTeam: true,
          stationNumber: '357',
          locationName: 'test_location',
          suggestedNameDisplay: 'test_suggested_name',
          healthCareSystemName: 'test_healthcare_system_name',
        },
      },
    ],
    meta: {
      sort: {
        name: 'ASC',
      },
      careSystems: [
        {
          stationNumber: '357',
          healthCareSystemName: 'test_healthcare_system_name',
        },
        {
          healthCareSystemName: 'SM STAGING CARE SYSTEM',
          stationNumber: '989',
        },
      ],
    },
  }

  const folderMessages: SecureMessagingFolderMessagesGetData = {
    data: [
      {
        type: 'test',
        id: 1,
        attributes: {
          messageId: 1,
          category: CategoryTypeFields.other,
          subject: 'test',
          body: 'test',
          hasAttachments: false,
          attachment: false,
          sentDate: '1-1-21',
          senderId: 2,
          senderName: 'mock sender',
          recipientId: 3,
          recipientName: 'mock recipient name',
          readReceipt: 'mock read receipt',
        },
      },
    ],
    links: {
      self: '',
      first: '',
      prev: '',
      next: '',
      last: '',
    },
    meta: {
      sort: {
        sentDate: 'DESC',
      },
      pagination: {
        currentPage: 1,
        perPage: 1,
        totalPages: 3,
        totalEntries: 5,
      },
    },
  }

  const initializeTestInstance = () => {
    goBack = jest.fn()
    const props = mockNavProps(
      undefined,
      {
        addListener: mockUseComposeCancelConfirmationSpy,
        navigate: mockNavigationSpy,
        goBack,
        setOptions: jest.fn(),
      },
      { params: { attachmentFileToAdd: {}, messageID: 3 } },
    )
    render(<EditDraft {...props} />)
  }

  describe('when no recipients are returned', () => {
    it('should display an AlertBox and on click of Go to inbox it should navigate', async () => {
      when(api.get as jest.Mock)
        .calledWith(`/v1/messaging/health/messages/${3}/thread?excludeProvidedMessage=false`, {
          useCache: 'false',
        })
        .mockResolvedValue(thread)
        .calledWith(`/v0/messaging/health/messages/${3}`)
        .mockResolvedValue(message)
        .calledWith('/v0/messaging/health/allrecipients')
        .mockResolvedValue({
          data: [],
          meta: {
            sort: {
              name: 'ASC',
            },
          },
        })
        .calledWith(`/v0/messaging/health/folders/${SecureMessagingSystemFolderIdConstants.SENT}/messages`, {
          page: '1',
          per_page: LARGE_PAGE_SIZE.toString(),
          useCache: 'false',
        } as api.Params)
        .mockResolvedValue(folderMessages)
      initializeTestInstance()
      expect(screen.getByText('Loading your draft...')).toBeTruthy()
      await waitFor(() => expect(screen.getByText("We can't match you with a provider")).toBeTruthy())
      await waitFor(() => fireEvent.press(screen.getByRole('link', { name: 'Go to inbox' })))
      await waitFor(() => expect(mockNavigationSpy).toHaveBeenCalled())
    })
  })

  describe('when there is an error', () => {
    it('should display the ErrorComponent', async () => {
      when(api.get as jest.Mock)
        .calledWith(`/v1/messaging/health/messages/${3}/thread?excludeProvidedMessage=false`, {
          useCache: 'false',
        })
        .mockResolvedValue(thread)
        .calledWith(`/v0/messaging/health/messages/${3}`)
        .mockResolvedValue(message)
        .calledWith(`/v0/messaging/health/folders/${SecureMessagingSystemFolderIdConstants.SENT}/messages`, {
          page: '1',
          per_page: LARGE_PAGE_SIZE.toString(),
          useCache: 'false',
        } as api.Params)
        .mockResolvedValue(folderMessages)
        .calledWith('/v0/messaging/health/allrecipients')
        .mockRejectedValue({ networkError: true } as api.APIError)
      initializeTestInstance()
      await waitFor(() => expect(screen.getByRole('header', { name: "The app can't be loaded." })).toBeTruthy())
    })
  })

  describe('when there are no recent messages', () => {
    it('should display an alert and should hide the Add Files button and Send button', async () => {
      when(api.get as jest.Mock)
        .calledWith(`/v1/messaging/health/messages/${3}/thread?excludeProvidedMessage=false`, {
          useCache: 'false',
        })
        .mockResolvedValue(oldThread)
        .calledWith(`/v0/messaging/health/messages/${3}`)
        .mockResolvedValue(message)
        .calledWith('/v0/messaging/health/allrecipients')
        .mockResolvedValue(recipients)
        .calledWith(`/v0/messaging/health/folders/${SecureMessagingSystemFolderIdConstants.SENT}/messages`, {
          page: '1',
          per_page: LARGE_PAGE_SIZE.toString(),
          useCache: 'false',
        } as api.Params)
        .mockResolvedValue(folderMessages)
      initializeTestInstance()
      await waitFor(() =>
        expect(screen.getByRole('heading', { name: 'This conversation is too old for new replies' })).toBeTruthy(),
      )
      await waitFor(() => expect(screen.queryByRole('button', { name: 'Add Files' })).toBeFalsy())
      await waitFor(() => expect(screen.queryByRole('button', { name: 'Send' })).toBeFalsy())
    })
  })

  describe('on click of the collapsible view', () => {
    it('should show the Reply Help panel', async () => {
      when(api.get as jest.Mock)
        .calledWith(`/v1/messaging/health/messages/${3}/thread?excludeProvidedMessage=false`, {
          useCache: 'false',
        })
        .mockResolvedValue(thread)
        .calledWith(`/v0/messaging/health/messages/${3}`)
        .mockResolvedValue(message)
        .calledWith('/v0/messaging/health/allrecipients')
        .mockResolvedValue(recipients)
        .calledWith(`/v0/messaging/health/folders/${SecureMessagingSystemFolderIdConstants.SENT}/messages`, {
          page: '1',
          per_page: LARGE_PAGE_SIZE.toString(),
          useCache: 'false',
        } as api.Params)
        .mockResolvedValue(folderMessages)
      initializeTestInstance()
      await waitFor(() => fireEvent.press(screen.getByLabelText('Only use messages for non-urgent needs')))
      await waitFor(() => expect(mockNavigationSpy).toHaveBeenCalled())
    })
  })

  describe('when the user only has multiple facilities on record', () => {
    it('should display care systems selection box', async () => {
      when(api.get as jest.Mock)
        .calledWith(`/v1/messaging/health/messages/${3}/thread?excludeProvidedMessage=false`, {
          useCache: 'false',
        })
        .mockResolvedValue(nonReplyDraftThread)
        .calledWith(`/v0/messaging/health/messages/${3}`)
        .mockResolvedValue(message)
        .calledWith('/v0/messaging/health/allrecipients')
        .mockResolvedValue(recipients)
        .calledWith(`/v0/messaging/health/folders/${SecureMessagingSystemFolderIdConstants.SENT}/messages`, {
          page: '1',
          per_page: LARGE_PAGE_SIZE.toString(),
          useCache: 'false',
        } as api.Params)
        .mockResolvedValue(folderMessages)
      initializeTestInstance()
      await waitFor(() => expect(screen.queryAllByText('Pick a care system (Required)').length).toBe(1))
    })
  })

  describe('when the user only has one facility on record', () => {
    it('should hide care systems selection box', async () => {
      const mockSingleCareSystemRecipientsResponse = recipients
      mockSingleCareSystemRecipientsResponse.meta.careSystems = [
        {
          healthCareSystemName: '357',
          stationNumber: '357',
        },
      ]

      when(api.get as jest.Mock)
        .calledWith(`/v1/messaging/health/messages/${3}/thread?excludeProvidedMessage=false`, {
          useCache: 'false',
        })
        .mockResolvedValue(nonReplyDraftThread)
        .calledWith(`/v0/messaging/health/messages/${3}`)
        .mockResolvedValue(message)
        .calledWith('/v0/messaging/health/allrecipients')
        .mockResolvedValue(mockSingleCareSystemRecipientsResponse)
        .calledWith(`/v0/messaging/health/folders/${SecureMessagingSystemFolderIdConstants.SENT}/messages`, {
          page: '1',
          per_page: LARGE_PAGE_SIZE.toString(),
          useCache: 'false',
        } as api.Params)
        .mockResolvedValue(folderMessages)
      initializeTestInstance()
      await waitFor(() => expect(screen.queryAllByText('Pick a care system (Required)').length).toBe(0))
    })
  })

  describe('when pressing the back button', () => {
    it('should ask for confirmation if any field filled in', async () => {
      when(api.get as jest.Mock)
        .calledWith(`/v1/messaging/health/messages/${3}/thread?excludeProvidedMessage=false`, {
          useCache: 'false',
        })
        .mockResolvedValue(thread)
        .calledWith(`/v0/messaging/health/messages/${3}`)
        .mockResolvedValue(message)
        .calledWith('/v0/messaging/health/allrecipients')
        .mockResolvedValue(recipients)
        .calledWith(`/v0/messaging/health/folders/${SecureMessagingSystemFolderIdConstants.SENT}/messages`, {
          page: '1',
          per_page: LARGE_PAGE_SIZE.toString(),
          useCache: 'false',
        } as api.Params)
        .mockResolvedValue(folderMessages)
      initializeTestInstance()
      await waitFor(() => fireEvent.changeText(screen.getByTestId('messageText'), 'Random String'))
      await waitFor(() => fireEvent.press(screen.getByRole('button', { name: 'Cancel' })))
      await waitFor(() => expect(goBack).not.toHaveBeenCalled())
      await waitFor(() => expect(mockUseComposeCancelConfirmationSpy).toHaveBeenCalled())
    })
  })

  describe('on click of add files button', () => {
    it('should call useRouteNavigation', async () => {
      when(api.get as jest.Mock)
        .calledWith(`/v1/messaging/health/messages/${3}/thread?excludeProvidedMessage=false`, {
          useCache: 'false',
        })
        .mockResolvedValue(thread)
        .calledWith(`/v0/messaging/health/messages/${3}`)
        .mockResolvedValue(message)
        .calledWith('/v0/messaging/health/allrecipients')
        .mockResolvedValue(recipients)
        .calledWith(`/v0/messaging/health/folders/${SecureMessagingSystemFolderIdConstants.SENT}/messages`, {
          page: '1',
          per_page: LARGE_PAGE_SIZE.toString(),
          useCache: 'false',
        } as api.Params)
        .mockResolvedValue(folderMessages)
      initializeTestInstance()
      await waitFor(() => fireEvent.press(screen.getByRole('button', { name: 'Add Files' })))
      await waitFor(() => expect(mockNavigationSpy).toHaveBeenCalled())
    })
  })
})
