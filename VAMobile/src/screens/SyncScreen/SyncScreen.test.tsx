import React from 'react'

import { screen } from '@testing-library/react-native'

import { initialAuthState, initialDisabilityRatingState } from 'store/slices'
import { completeSync, getDisabilityRating } from 'store/slices'
import { context, render, waitFor } from 'testUtils'

import { SyncScreen } from './index'

jest.mock('store/slices', () => {
  const actual = jest.requireActual('store/slices')
  return {
    ...actual,
    completeSync: jest.fn(() => {
      return {
        type: '',
        payload: '',
      }
    }),
    getDisabilityRating: jest.fn(() => {
      return {
        type: '',
        payload: '',
      }
    }),
  }
})

jest.mock('../../api/authorizedServices/getAuthorizedServices', () => {
  const original = jest.requireActual('../../api/authorizedServices/getAuthorizedServices')
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

context('SyncScreen', () => {
  const initializeTestInstance = (
    disabilityRatingLoading = true,
    loggedIn = false,
    loggingOut = false,
    syncing = true,
  ): void => {
    const store = {
      auth: { ...initialAuthState, loggedIn, loggingOut, syncing },
      disabilityRating: { ...initialDisabilityRatingState, preloadComplete: !disabilityRatingLoading },
    }
    render(<SyncScreen />, { preloadedState: store })
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('shows "Signing you in" text', () => {
    initializeTestInstance()
    expect(screen.getByText('Signing you in...')).toBeTruthy()
  })

  it('shows "Signing you out" text when logging out', () => {
    initializeTestInstance(false, true, true)
    expect(screen.getByText('Signing you out...')).toBeTruthy()
  })

  it('shows "Signing you out" text when logging out and data is not loaded', () => {
    initializeTestInstance(true, true, true)
    expect(screen.getByText('Signing you out...')).toBeTruthy()
  })

  it('loads disability ratings', () => {
    initializeTestInstance(true, true, false)
    expect(getDisabilityRating).toHaveBeenCalled()
  })

  describe('sync completion', () => {
    it('should complete the sync when all loading is finished', async () => {
      initializeTestInstance(false, true, false)
      await waitFor(() => {
        expect(completeSync).toHaveBeenCalled()
      })
    })
  })
})
