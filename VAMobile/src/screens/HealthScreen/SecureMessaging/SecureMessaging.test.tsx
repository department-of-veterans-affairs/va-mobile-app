import React from 'react'
import { screen, fireEvent } from '@testing-library/react-native'

import * as api from 'store/api'
import { context, mockNavProps, render, waitFor, when } from 'testUtils'
import SecureMessaging from './SecureMessaging'
import { ErrorsState, InitialState, initialErrorsState, initializeErrorsByScreenID, updateSecureMessagingTab } from 'store/slices'
import { ScreenIDTypesConstants } from 'store/api/types'
import { SecureMessagingSystemFolderIdConstants } from 'store/api/types'
import { CommonErrorTypesConstants } from 'constants/errors'

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
    resetSaveDraftComplete: jest.fn(() => {
      return {
        type: '',
        payload: '',
      }
    }),
    resetSaveDraftFailed: jest.fn(() => {
      return {
        type: '',
        payload: '',
      }
    }),
    fetchInboxMessages: jest.fn(() => {
      return {
        type: '',
        payload: '',
      }
    }),
    listFolders: jest.fn(() => {
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
  const initializeTestInstance = (errorsState = initialErrorsState) => {
    render(<SecureMessaging {...mockNavProps()} />, {
      preloadedState: {
        ...InitialState,
        errors: errorsState,
      },
    })
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
        .calledWith(`/v0/messaging/health/folders/${SecureMessagingSystemFolderIdConstants.INBOX}/messages`, expect.anything())
        .mockRejectedValue({ networkError: true } as api.APIError)
        .calledWith(`/v0/messaging/health/folders`, expect.anything())
        .mockRejectedValue({ networkError: true } as api.APIError)
      const errorsByScreenID = initializeErrorsByScreenID()
      errorsByScreenID[ScreenIDTypesConstants.SECURE_MESSAGING_SCREEN_ID] = CommonErrorTypesConstants.NETWORK_CONNECTION_ERROR

      const errorState: ErrorsState = {
        ...initialErrorsState,
        errorsByScreenID,
      }
      await waitFor(() => {
        initializeTestInstance(errorState)
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
      const errorsByScreenID = initializeErrorsByScreenID()
      errorsByScreenID[ScreenIDTypesConstants.SECURE_MESSAGING_SCREEN_ID] = CommonErrorTypesConstants.APP_LEVEL_ERROR_HEALTH_LOAD

      const errorState: ErrorsState = {
        ...initialErrorsState,
        errorsByScreenID,
      }
      await waitFor(() => {
        initializeTestInstance(errorState)
      })
      expect(screen.getByText("We're sorry. Something went wrong on our end. Please refresh this screen or try again later.")).toBeTruthy()
      expect(screen.getByText('877-327-0022')).toBeTruthy()
    })
  })

  describe('on click of a segmented control tab', () => {
    it('should call updateSecureMessagingTab', () => {
      initializeTestInstance()
      fireEvent.press(screen.getByText('Folders'))
      expect(updateSecureMessagingTab).toHaveBeenCalled()
    })
  })
})
