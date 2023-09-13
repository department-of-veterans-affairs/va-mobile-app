import 'react-native'
import React from 'react'

import { context, render, waitFor } from 'testUtils'
import { screen } from '@testing-library/react-native'
import { initialAuthState, initialDisabilityRatingState, initialMilitaryServiceState, initialPersonalInformationState } from 'store/slices'
import { SyncScreen } from './index'
import { completeSync, getDisabilityRating, getProfileInfo, getServiceHistory } from 'store/slices'

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
    getProfileInfo: jest.fn(() => {
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

  const initializeTestInstance = (militaryLoading = true, profileLoading = true, disabilityRatingLoading = true, loggedIn = false, loggingOut = false, syncing = true): void => {
    store = {
      auth: { ...initialAuthState, loggedIn, loggingOut, syncing },
      disabilityRating: { ...initialDisabilityRatingState, preloadComplete: !disabilityRatingLoading },
      militaryService: { ...initialMilitaryServiceState, preloadComplete: !militaryLoading },
      personalInformation: { ...initialPersonalInformationState, preloadComplete: !profileLoading },
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
      initializeTestInstance(false, false, false, true, true)
      expect(screen.getByText('Signing you out...')).toBeTruthy()
    })

    it('should show sign out text even if data is not loaded', async () => {
      initializeTestInstance(true, true, true, true, true)
      expect(screen.getByText('Signing you out...')).toBeTruthy()
    })
  })

  describe('loading sequence', () => {
    it('should load profile first if the user is logged in', async () => {
      initializeTestInstance(true, true, true, true, false)
      expect(getProfileInfo).toHaveBeenCalled()
      expect(getServiceHistory).not.toHaveBeenCalled()
      expect(getDisabilityRating).not.toHaveBeenCalled()
    })

    it('should load military history after profile has loaded', async () => {
      initializeTestInstance(true, false, true, true, false)
      expect(getProfileInfo).not.toHaveBeenCalled()
      expect(getServiceHistory).toHaveBeenCalled()
      expect(getDisabilityRating).not.toHaveBeenCalled()
    })

    it('should load disability ratings after military history has loaded', async () => {
      initializeTestInstance(false, false, true, true, false)
      expect(getProfileInfo).not.toHaveBeenCalled()
      expect(getServiceHistory).not.toHaveBeenCalled()
      expect(getDisabilityRating).toHaveBeenCalled()
    })
  })

  describe('sync completion', () => {
    it('should complete the sync when all loading is finished', async () => {
      jest.mock('../../api/demographics/getDemographics', () => {
        let original = jest.requireActual('../../api/demographics/getDemographics')
        return {
          ...original,
          useDemographics: () => ({
            status: "success",
            data: {
              genderIdentity: '',
              preferredName: '',
            }
          }),
        }
      })

      initializeTestInstance(false, false, false, true, false)
      await waitFor(async () => {
        expect(completeSync).toHaveBeenCalled()
      })
    })
  })
})
