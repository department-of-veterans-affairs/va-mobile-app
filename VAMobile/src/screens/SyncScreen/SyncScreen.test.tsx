import 'react-native'
import React from 'react'

import { context, render, waitFor } from 'testUtils'
import { screen } from '@testing-library/react-native'
import { initialAuthState, initialDisabilityRatingState, initialMilitaryServiceState } from 'store/slices'
import { SyncScreen } from './index'
import { completeSync, getDisabilityRating, getServiceHistory } from 'store/slices'

jest.mock('store/slices', () => {
  let actual = jest.requireActual('store/slices')
  return {
    ...actual,
    completeSync: jest.fn(() => {
      return {
        type: '',
        payload: '',
      }
    }),
    getServiceHistory: jest.fn(() => {
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
  let original = jest.requireActual('../../api/authorizedServices/getAuthorizedServices')
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
    })
  }
})

context('SyncScreen', () => {
  let store: any

  const initializeTestInstance = (militaryLoading = true, disabilityRatingLoading = true, loggedIn = false, loggingOut = false, syncing = true): void => {
    store = {
      auth: { ...initialAuthState, loggedIn, loggingOut, syncing },
      disabilityRating: { ...initialDisabilityRatingState, preloadComplete: !disabilityRatingLoading },
      militaryService: { ...initialMilitaryServiceState, preloadComplete: !militaryLoading },
    }

    render(<SyncScreen />, { preloadedState: store })
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('loading text', () => {
    it('should show the signing in text', async () => {
      initializeTestInstance()
      expect(screen.getByText('Signing you in...')).toBeTruthy()
    })
  })

  describe('sign out', () => {
    it('should show sign out text', async () => {
      initializeTestInstance(false, false, true, true)
      expect(screen.getByText('Signing you out...')).toBeTruthy()
    })

    it('should show sign out text even if data is not loaded', async () => {
      initializeTestInstance(true, true, true, true)
      expect(screen.getByText('Signing you out...')).toBeTruthy()
    })
  })

  describe('loading sequence', () => {
    it('should load military history first', async () => {
      initializeTestInstance(true, true, true, false)
      expect(getServiceHistory).toHaveBeenCalled()
      expect(getDisabilityRating).not.toHaveBeenCalled()
    })

    it('should load disability ratings after military history has loaded', async () => {
      initializeTestInstance(false, true, true, false)
      expect(getServiceHistory).not.toHaveBeenCalled()
      expect(getDisabilityRating).toHaveBeenCalled()
    })
  })

  describe('sync completion', () => {
    it('should complete the sync when all loading is finished', async () => {
      initializeTestInstance(false, false, true, false)
      await waitFor(async () => {
        expect(completeSync).toHaveBeenCalled()
      })
    })
  })
})
