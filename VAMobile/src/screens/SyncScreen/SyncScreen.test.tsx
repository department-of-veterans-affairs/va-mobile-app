import React from 'react'

import { screen } from '@testing-library/react-native'

import { completeSync, initialAuthState } from 'store/slices'
import { context, render, waitFor } from 'testUtils'
import { initialAuthState, initialDisabilityRatingState, initialMilitaryServiceState, initialPrescriptionState } from 'store/slices'
import { SyncScreen } from './index'
import { completeSync, getDisabilityRating, getServiceHistory, loadAllPrescriptions } from 'store/slices'

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
    loadAllPrescriptions: jest.fn(() => {
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

  const initializeTestInstance = (militaryLoading = true, disabilityRatingLoading = true, prescriptionsLoading = true, loggedIn = false, loggingOut = false, syncing = true): void => {
    store = {
      auth: { ...initialAuthState, loggedIn, loggingOut, syncing },
      disabilityRating: { ...initialDisabilityRatingState, preloadComplete: !disabilityRatingLoading },
      militaryService: { ...initialMilitaryServiceState, preloadComplete: !militaryLoading },
      prescriptions: { ...initialPrescriptionState, prescriptionsNeedLoad: prescriptionsLoading }
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
    initializeTestInstance(false, false, false, true, true)
    expect(screen.getByText('Signing you out...')).toBeTruthy()
  })

  it('shows "Signing you out" text when logging out and data is not loaded', () => {
    initializeTestInstance(true, true, true, true, true)
    expect(screen.getByText('Signing you out...')).toBeTruthy()
  })

  it('loads military history before loading disability ratings', () => {
    initializeTestInstance(true, true, true, true, false)
    expect(getServiceHistory).toHaveBeenCalled()
    expect(getDisabilityRating).not.toHaveBeenCalled()
  })

  it('loads disability ratings after military history has loaded', () => {
    initializeTestInstance(false, true, true, true, false)
    expect(getServiceHistory).not.toHaveBeenCalled()
    expect(getDisabilityRating).toHaveBeenCalled()
  })

  it('loads prescriptions', () => {
    initializeTestInstance(false, false, true, true, false)
    expect(loadAllPrescriptions).toHaveBeenCalled()
  })

  describe('sync completion', () => {
    it('should complete the sync when all loading is finished', async () => {
      initializeTestInstance(false, false, false, true, false)
      await waitFor(() => {
        expect(completeSync).toHaveBeenCalled()
      })
    })
  })
})
