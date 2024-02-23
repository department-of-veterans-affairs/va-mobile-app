import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'

import { secureMessagingKeys } from 'api/secureMessaging'
import { SecureMessagingSystemFolderIdConstants } from 'api/types'
import * as api from 'store/api'
import { QueriesData, context, mockNavProps, render, waitFor, when } from 'testUtils'

import SecureMessaging from './SecureMessaging'

jest.mock('../../../api/authorizedServices/getAuthorizedServices', () => {
  const original = jest.requireActual('../../../api/authorizedServices/getAuthorizedServices')
  return {
    ...original,
    useAuthorizedServices: jest
      .fn()
      .mockReturnValue({
        status: 'success',
        data: {
          appeals: true,
          appointments: true,
          claims: true,
          decisionLetters: true,
          directDepositBenefits: true,
          directDepositBenefitsUpdate: true,
          disabilityRating: true,
          genderIdentity: true,
          lettersAndDocuments: true,
          militaryServiceHistory: true,
          paymentHistory: true,
          preferredName: true,
          prescriptions: true,
          scheduleAppointments: true,
          secureMessaging: true,
          userProfileUpdate: true,
        },
      })
      .mockReturnValueOnce({
        status: 'success',
        data: {
          appeals: true,
          appointments: true,
          claims: true,
          decisionLetters: true,
          directDepositBenefits: true,
          directDepositBenefitsUpdate: true,
          disabilityRating: true,
          genderIdentity: true,
          lettersAndDocuments: true,
          militaryServiceHistory: true,
          paymentHistory: true,
          preferredName: true,
          prescriptions: true,
          scheduleAppointments: true,
          secureMessaging: false,
          userProfileUpdate: true,
        },
      }),
  }
})

context('SecureMessaging', () => {
  const initializeTestInstance = (queriesData?: QueriesData) => {
    render(<SecureMessaging {...mockNavProps()} />, { queriesData: queriesData })
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  describe('when user is not authorized for secure messaging', () => {
    it('should display NotEnrolledSM component', () => {
      expect(screen.getByText("You're not currently enrolled to use Secure Messaging")).toBeTruthy()
    })
  })

  describe('when common error occurs', () => {
    it('should render the error component', async () => {
      when(api.get as jest.Mock)
        .calledWith(
          `/v0/messaging/health/folders/${SecureMessagingSystemFolderIdConstants.INBOX}/messages`,
          expect.anything(),
        )
        .mockRejectedValue({ networkError: true } as api.APIError)
        .calledWith(`/v0/messaging/health/folders`, expect.anything())
        .mockRejectedValue({ networkError: true } as api.APIError)

      await waitFor(() => {
        initializeTestInstance()
      })
      expect(screen.getByText("The app can't be loaded.")).toBeTruthy()
    })
  })

  describe('when loading messages error occurs', () => {
    it('should render the loading messages error component', async () => {
      when(api.get as jest.Mock)
        .calledWith(
          `/v0/messaging/health/folders/${SecureMessagingSystemFolderIdConstants.INBOX}/messages`,
          expect.anything(),
        )
        .mockRejectedValue({ networkError: false, status: 500 } as api.APIError)
        .calledWith(`/v0/messaging/health/folders`, expect.anything())
        .mockRejectedValue({ networkError: false, status: 500 } as api.APIError)

      await waitFor(() => {
        initializeTestInstance()
      })
      expect(
        screen.getByText(
          "We're sorry. Something went wrong on our end. Please refresh this screen or try again later.",
        ),
      ).toBeTruthy()
      expect(screen.getByText('877-327-0022')).toBeTruthy()
    })
  })

  describe('on click of a segmented control tab', () => {
    it('should call updateSecureMessagingTab', () => {
      const queriesData: QueriesData = [
        {
          queryKey: secureMessagingKeys.folders,
          data: [
            {
              attributes: {
                folderId: 0,
                name: 'Inbox',
                count: 12,
                unreadCount: 3,
                systemFolder: true,
              },
            },
            {
              attributes: {
                folderId: -2,
                name: 'Drafts',
                count: 3,
                unreadCount: 0,
                systemFolder: true,
              },
            },
            {
              attributes: {
                folderId: -1,
                name: 'Sent',
                count: 5,
                unreadCount: 0,
                systemFolder: true,
              },
            },
            {
              attributes: {
                folderId: -3,
                name: 'Deleted',
                count: 1,
                unreadCount: 0,
                systemFolder: true,
              },
            },
          ],
        },
      ]
      initializeTestInstance(queriesData)
      fireEvent.press(screen.getByText('Folders'))
      expect(screen.getByText('Drafts')).toBeTruthy()
      expect(screen.getByText('Sent')).toBeTruthy()
      expect(screen.getByText('Trash')).toBeTruthy()
    })
  })
})
