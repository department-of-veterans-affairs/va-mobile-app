import React from 'react'

import { screen } from '@testing-library/react-native'
import { t } from 'i18next'

import { authorizedServicesKeys } from 'api/authorizedServices/queryKeys'
import { SecureMessagingSystemFolderIdConstants } from 'api/types'
import { LARGE_PAGE_SIZE } from 'constants/common'
import * as api from 'store/api'
import { context, mockNavProps, render, waitFor, when } from 'testUtils'

import SecureMessaging from './SecureMessaging'

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
    it('should display NotEnrolledSM component', async () => {
      initializeTestInstance(false)
      await waitFor(() =>
        expect(screen.getByText("You're not currently enrolled to use Secure Messaging")).toBeTruthy(),
      )
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
})
