import React from 'react'

import { screen } from '@testing-library/react-native'
import { t } from 'i18next'

import { authorizedServicesKeys } from 'api/authorizedServices/queryKeys'
import { SecureMessagingSystemFolderIdConstants } from 'api/types'
import { LARGE_PAGE_SIZE } from 'constants/common'
import SecureMessaging from 'screens/HealthScreen/SecureMessaging/SecureMessaging'
import * as api from 'store/api'
import { context, mockNavProps, render, waitFor, when } from 'testUtils'

context('SecureMessaging', () => {
  const initializeTestInstance = (authorized = true) => {
    render(
      <SecureMessaging
        {...mockNavProps(
          undefined,
          {
            navigate: jest.fn(),
            setOptions: jest.fn(),
            goBack: jest.fn(),
          },
          { params: { activeTab: 0 } },
        )}
      />,
      {
        queriesData: [
          {
            queryKey: authorizedServicesKeys.authorizedServices,
            data: {
              appeals: true,
              appointments: true,
              claims: true,
              decisionLetters: true,
              directDepositBenefits: true,
              directDepositBenefitsUpdate: true,
              disabilityRating: true,
              lettersAndDocuments: true,
              militaryServiceHistory: true,
              paymentHistory: true,
              preferredName: true,
              prescriptions: true,
              scheduleAppointments: true,
              secureMessaging: authorized,
              userProfileUpdate: true,
            },
          },
        ],
      },
    )
  }

  describe('when user is not authorized for secure messaging', () => {
    it('should display NoAccessSM component', async () => {
      initializeTestInstance(false)
      await waitFor(() => expect(screen.getByText(t('noAccessSM.cantAccess'))).toBeTruthy())
    })
  })

  describe('when common error occurs', () => {
    it('should render the error component', async () => {
      when(api.get as jest.Mock)
        .calledWith(`/v0/messaging/health/folders/${SecureMessagingSystemFolderIdConstants.INBOX}/messages`)
        .mockRejectedValue({ networkError: true } as api.APIError)
        .calledWith(`/v0/messaging/health/folders`)
        .mockRejectedValue({ networkError: true } as api.APIError)
      initializeTestInstance()
      await waitFor(() => expect(screen.getByText(t('secureMessaging.inbox.messageDownError.title'))).toBeTruthy())
    })
  })

  describe('when terms and conditions error occurs', () => {
    it('should render the terms and conditions component', async () => {
      when(api.get as jest.Mock)
        .calledWith(`/v0/messaging/health/folders/${SecureMessagingSystemFolderIdConstants.INBOX}/messages`, {
          page: '1',
          per_page: LARGE_PAGE_SIZE.toString(),
          useCache: 'false',
        })
        .mockRejectedValue({
          json: {
            errors: [
              {
                title: 'User is not eligible because they have not accepted terms and conditions or opted-in',
                detail: 'You have not accepted the MHV Terms and Conditions to use secure messaging',
                code: 'SM135',
                source: '',
              },
            ],
          },
        } as api.APIError)
        .calledWith(`/v0/messaging/health/folders`)
        .mockRejectedValue({ networkError: true } as api.APIError)
      initializeTestInstance()
      await waitFor(() =>
        expect(screen.getByText('You’re required to accept the current terms and conditions')).toBeTruthy(),
      )
    })
  })
  describe('start new message button visibility', () => {
    const mockRecipients = {
      data: [
        {
          id: '1',
          type: 'mock',
          attributes: {
            triageTeamId: 1,
            name: 'Test Team',
            relationType: 'PATIENT',
            preferredTeam: true,
            stationNumber: '123',
          },
        },
      ],
      meta: {
        sort: { name: 'ASC' as const },
        careSystems: [],
      },
    }

    const mockEmptyRecipients = {
      data: [],
      meta: {
        sort: { name: 'ASC' as const },
        careSystems: [],
      },
    }

    const mockFolders = {
      data: [],
      inboxUnreadCount: 0,
    }

    const mockInboxMessages = {
      data: [],
      meta: {
        pagination: {
          totalEntries: 0,
        },
      },
    }

    it('should show the start new message button when recipients are available', async () => {
      when(api.get as jest.Mock)
        .calledWith(`/v0/messaging/health/folders/${SecureMessagingSystemFolderIdConstants.INBOX}/messages`, {
          page: '1',
          per_page: LARGE_PAGE_SIZE.toString(),
          useCache: 'false',
        })
        .mockResolvedValue(mockInboxMessages)
        .calledWith('/v0/messaging/health/folders')
        .mockResolvedValue(mockFolders)
        .calledWith('/v0/messaging/health/allrecipients')
        .mockResolvedValue(mockRecipients)
      initializeTestInstance()
      await waitFor(() => expect(screen.getByTestId('startNewMessageButtonTestID')).toBeTruthy())
    })

    it('should hide the start new message button when no recipients are returned', async () => {
      when(api.get as jest.Mock)
        .calledWith(`/v0/messaging/health/folders/${SecureMessagingSystemFolderIdConstants.INBOX}/messages`, {
          page: '1',
          per_page: LARGE_PAGE_SIZE.toString(),
          useCache: 'false',
        })
        .mockResolvedValue(mockInboxMessages)
        .calledWith('/v0/messaging/health/folders')
        .mockResolvedValue(mockFolders)
        .calledWith('/v0/messaging/health/allrecipients')
        .mockResolvedValue(mockEmptyRecipients)
      initializeTestInstance()
      await waitFor(() => expect(screen.queryByTestId('startNewMessageButtonTestID')).toBeNull())
    })

    it('should hide the start new message button when recipients data is undefined', async () => {
      when(api.get as jest.Mock)
        .calledWith(`/v0/messaging/health/folders/${SecureMessagingSystemFolderIdConstants.INBOX}/messages`, {
          page: '1',
          per_page: LARGE_PAGE_SIZE.toString(),
          useCache: 'false',
        })
        .mockResolvedValue(mockInboxMessages)
        .calledWith('/v0/messaging/health/folders')
        .mockResolvedValue(mockFolders)
        .calledWith('/v0/messaging/health/allrecipients')
        .mockResolvedValue(undefined)
      initializeTestInstance()
      await waitFor(() => expect(screen.queryByTestId('startNewMessageButtonTestID')).toBeNull())
    })
  })

  describe('OH sync status alert', () => {
    const mockFolders = {
      data: [],
      inboxUnreadCount: 0,
    }

    const mockInboxMessages = {
      data: [],
      meta: {
        pagination: {
          totalEntries: 0,
        },
      },
    }

    const mockRecipients = {
      data: [
        {
          id: '1',
          type: 'mock',
          attributes: {
            triageTeamId: 1,
            name: 'Test Team',
            relationType: 'PATIENT',
            preferredTeam: true,
            stationNumber: '123',
          },
        },
      ],
      meta: {
        sort: { name: 'ASC' as const },
        careSystems: [],
      },
    }

    it('should show the loading alert when syncComplete is false', async () => {
      when(api.get as jest.Mock)
        .calledWith(`/v0/messaging/health/folders/${SecureMessagingSystemFolderIdConstants.INBOX}/messages`, {
          page: '1',
          per_page: LARGE_PAGE_SIZE.toString(),
          useCache: 'false',
        })
        .mockResolvedValue(mockInboxMessages)
        .calledWith('/v0/messaging/health/folders')
        .mockResolvedValue(mockFolders)
        .calledWith('/v0/messaging/health/allrecipients')
        .mockResolvedValue(mockRecipients)
        .calledWith('/v0/messaging/health/messages/oh_sync_status')
        .mockResolvedValue({ syncComplete: false })
      initializeTestInstance()
      await waitFor(() => expect(screen.getByText(t('secureMessaging.historicLoad.title'))).toBeTruthy())
    })

    it('should not show the loading alert when syncComplete is true', async () => {
      when(api.get as jest.Mock)
        .calledWith(`/v0/messaging/health/folders/${SecureMessagingSystemFolderIdConstants.INBOX}/messages`, {
          page: '1',
          per_page: LARGE_PAGE_SIZE.toString(),
          useCache: 'false',
        })
        .mockResolvedValue(mockInboxMessages)
        .calledWith('/v0/messaging/health/folders')
        .mockResolvedValue(mockFolders)
        .calledWith('/v0/messaging/health/allrecipients')
        .mockResolvedValue(mockRecipients)
        .calledWith('/v0/messaging/health/messages/oh_sync_status')
        .mockResolvedValue({ syncComplete: true })
      initializeTestInstance()
      await waitFor(() => expect(screen.queryByText(t('secureMessaging.historicLoad.title'))).toBeNull())
    })

    it('should not show the loading alert when sync status endpoint errors', async () => {
      when(api.get as jest.Mock)
        .calledWith(`/v0/messaging/health/folders/${SecureMessagingSystemFolderIdConstants.INBOX}/messages`, {
          page: '1',
          per_page: LARGE_PAGE_SIZE.toString(),
          useCache: 'false',
        })
        .mockResolvedValue(mockInboxMessages)
        .calledWith('/v0/messaging/health/folders')
        .mockResolvedValue(mockFolders)
        .calledWith('/v0/messaging/health/allrecipients')
        .mockResolvedValue(mockRecipients)
        .calledWith('/v0/messaging/health/messages/oh_sync_status')
        .mockRejectedValue({ networkError: true } as api.APIError)
      initializeTestInstance()
      await waitFor(() => expect(screen.queryByText(t('secureMessaging.historicLoad.title'))).toBeNull())
    })
  })
})
