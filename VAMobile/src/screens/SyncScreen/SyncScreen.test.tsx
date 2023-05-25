import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { context, render, RenderAPI } from 'testUtils'
import { ReactTestInstance } from 'react-test-renderer'

import { initialAuthorizedServicesState, initialAuthState, initialDisabilityRatingState, initialMilitaryServiceState, initialPersonalInformationState } from 'store/slices'
import { SyncScreen } from './index'
import TextView from '../../components/TextView'
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

context('SyncScreen', () => {
  let store: any
  let component: RenderAPI
  let testInstance: ReactTestInstance

  const initializeTestInstance = (militaryLoading = true, profileLoading = true, disabilityRatingLoading = true, loggedIn = false, loggingOut = false, syncing = true): void => {
    store = {
      auth: { ...initialAuthState, loggedIn, loggingOut, syncing },
      disabilityRating: { ...initialDisabilityRatingState, preloadComplete: !disabilityRatingLoading },
      militaryService: { ...initialMilitaryServiceState, preloadComplete: !militaryLoading },
      personalInformation: { ...initialPersonalInformationState, preloadComplete: !profileLoading },
      authorizedServices: {
        ...initialAuthorizedServicesState,
        militaryServiceHistory: true,
        hasLoaded: true,
      },
    }

    component = render(<SyncScreen />, { preloadedState: store })

    testInstance = component.UNSAFE_root
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  describe('loading text', () => {
    it('should show the signing in text', async () => {
      initializeTestInstance()
      expect(testInstance.findByType(TextView).props.children).toEqual('Signing you in...')
    })
  })

  describe('sign out', () => {
    it('should show sign out text', async () => {
      initializeTestInstance(false, false, false, true, true)
      expect(testInstance.findByType(TextView).props.children).toEqual('Signing you out...')
    })

    it('should show sign out text even if data is not loaded', async () => {
      initializeTestInstance(true, true, true, true, true)
      expect(testInstance.findByType(TextView).props.children).toEqual('Signing you out...')
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
      initializeTestInstance(false, false, false, true, false)
      expect(completeSync).toHaveBeenCalled()
    })
  })
})
