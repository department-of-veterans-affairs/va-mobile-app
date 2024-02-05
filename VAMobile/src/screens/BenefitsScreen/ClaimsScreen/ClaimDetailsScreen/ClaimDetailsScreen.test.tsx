import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'

import * as api from 'store/api'
import { InitialState, initialClaimsAndAppealsState, initialErrorsState } from 'store/slices'
import { context, mockNavProps, render, waitFor, when } from 'testUtils'

import { claim } from '../claimData'
import ClaimDetailsScreen from './ClaimDetailsScreen'

jest.mock('@react-navigation/native', () => {
  const actual = jest.requireActual('@react-navigation/native')
  return {
    ...actual,
    useNavigation: () => ({
      setOptions: jest.fn(),
      goBack: jest.fn(),
    }),
  }
})

jest.mock('../../../../api/authorizedServices/getAuthorizedServices', () => {
  const original = jest.requireActual('../../../../api/authorizedServices/getAuthorizedServices')
  return {
    ...original,
    useAuthorizedServices: jest.fn().mockReturnValue({
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
    }),
  }
})

context('ClaimDetailsScreen', () => {
  const initializeTestInstance = () => {
    const props = mockNavProps(
      undefined,
      {
        navigate: jest.fn(),
        addListener: jest.fn(),
        setOptions: jest.fn(),
        goBack: jest.fn(),
      },
      { params: { claimID: '0', claimType: 'ACTIVE' } },
    )

    render(<ClaimDetailsScreen {...props} />, {
      preloadedState: {
        ...InitialState,
        claimsAndAppeals: {
          ...initialClaimsAndAppealsState,
          claim: claim,
        },
        errors: initialErrorsState,
      },
    })
  }

  describe('when loadingClaim is set to true', () => {
    it('should show loading screen', async () => {
      initializeTestInstance()
      expect(screen.getByText('Loading your claim details...')).toBeTruthy()
    })
  })

  describe('when the selected tab is status', () => {
    it('should display the ClaimStatus component', async () => {
      await waitFor(() => {
        when(api.get as jest.Mock)
          .calledWith(`/v0/claim/0`, {}, expect.anything())
          .mockResolvedValue({ data: claim })
        initializeTestInstance()
      })
      expect(screen.getByTestId('Step 1 of 5. completed. Claim received June 6, 2019')).toBeTruthy()
    })
  })

  describe('when the selected tab is status', () => {
    it('should display the ClaimDetails component', async () => {
      await waitFor(() => {
        when(api.get as jest.Mock)
          .calledWith(`/v0/claim/0`, {}, expect.anything())
          .mockResolvedValue({ data: claim })
        initializeTestInstance()
      })
      fireEvent.press(screen.getByText('Details'))
      fireEvent.press(screen.getByText('Details'))

      expect(screen.getByText('Claim type')).toBeTruthy()
    })
  })

  describe('when common error occurs', () => {
    it('should render error component when the stores screenID matches the components screenID', async () => {
      when(api.get as jest.Mock)
        .calledWith(`/v0/claim/0`, {}, expect.anything())
        .mockRejectedValue({ networkError: true } as api.APIError)

      await waitFor(() => {
        initializeTestInstance()
      })

      expect(screen.getByText("The app can't be loaded.")).toBeTruthy()
    })
  })
})
