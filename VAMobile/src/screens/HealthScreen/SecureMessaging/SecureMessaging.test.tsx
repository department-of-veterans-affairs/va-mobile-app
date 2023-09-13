import 'react-native'
import React from 'react'

import { screen, fireEvent } from '@testing-library/react-native'
import * as api from 'store/api'
import { context, mockNavProps, render, waitFor, when } from 'testUtils'
import SecureMessaging from './SecureMessaging'
import { updateSecureMessagingTab } from 'store/slices'
import { SecureMessagingSystemFolderIdConstants } from 'store/api/types'

jest.mock('store/slices', () => {
  let actual = jest.requireActual('store/slices')
  return {
    ...actual,
    updateSecureMessagingTab: jest.fn(() => {
      return {
        type: '',
        payload: '',
      }
    }),
  }
})

jest.mock('../../../api/authorizedServices/getAuthorizedServices', () => {
  let original = jest.requireActual('../../../api/authorizedServices/getAuthorizedServices')
  return {
    ...original,
    useAuthorizedServices: jest.fn().mockReturnValue({
      status: "success",
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
        userProfileUpdate: true
      }
    }).mockReturnValueOnce({
      status: "success",
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
        userProfileUpdate: true
      }
    })
  }
})

context('SecureMessaging', () => {
  const initializeTestInstance = () => {
    render(<SecureMessaging {...mockNavProps()} />)
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  describe('when user is not authorized for secure messaging', () => {
    it('should display NotEnrolledSM component', async () => {
      expect(screen.getByText("You're not currently enrolled to use Secure Messaging")).toBeTruthy()
    })
  })

  describe('when common error occurs', () => {
    it('should render the error component', async () => {
      when(api.get as jest.Mock)
        .calledWith(`/v0/messaging/health/folders/${SecureMessagingSystemFolderIdConstants.INBOX}/messages`, expect.anything())
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
        .calledWith(`/v0/messaging/health/folders/${SecureMessagingSystemFolderIdConstants.INBOX}/messages`, expect.anything())
        .mockRejectedValue({ networkError: false, status: 500 } as api.APIError)
        .calledWith(`/v0/messaging/health/folders`, expect.anything())
        .mockRejectedValue({ networkError: false, status: 500 } as api.APIError)

      await waitFor(() => {
        initializeTestInstance()
      })
      expect(screen.getByText("We're sorry. Something went wrong on our end. Please refresh this screen or try again later.")).toBeTruthy()
      expect(screen.getByText('877-327-0022')).toBeTruthy()
    })
  })

  describe('on click of a segmented control tab', () => {
    it('should call updateSecureMessagingTab', async () => {
      initializeTestInstance()
      fireEvent.press(screen.getByText('Folders'))
      expect(updateSecureMessagingTab).toHaveBeenCalled()
    })
  })
})
