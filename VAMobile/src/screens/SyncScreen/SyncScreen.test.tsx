import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import {context, mockStore, renderWithProviders} from 'testUtils'
import {act, ReactTestInstance} from 'react-test-renderer'

import {
  initialAuthorizedServicesState,
  initialAuthState,
  initialDisabilityRatingState,
  initialMilitaryServiceState,
  initialPersonalInformationState
} from 'store/reducers'
import {SyncScreen} from './index'
import TextView from '../../components/TextView'
import {completeSync, getDisabilityRating, getProfileInfo, getServiceHistory } from '../../store/actions'

jest.mock('../../store/actions', () => {
  let actual = jest.requireActual('../../store/actions')
  return {
    ...actual,
    completeSync: jest.fn(() => {
      return {
        type: '',
        payload: ''
      }
    }),
    getProfileInfo: jest.fn(() => {
      return {
        type: '',
        payload: ''
      }
    }),
    getServiceHistory: jest.fn(() => {
      return {
        type: '',
        payload: ''
      }
    }),
    getDisabilityRating: jest.fn(() => {
      return {
        type: '',
        payload: ''
      }
    }),
  }
})

context('SyncScreen', () => {
  let store: any
  let component: any
  let testInstance: ReactTestInstance

  const initializeTestInstance = (militaryLoading = true, profileLoading = true, disabilityRatingLoading = true, loggedIn = false, loggingOut = false): void => {
    store = mockStore({
      auth: {...initialAuthState, loggedIn, loggingOut},
      disabilityRating: {...initialDisabilityRatingState, preloadComplete: !disabilityRatingLoading},
      militaryService: { ...initialMilitaryServiceState, preloadComplete: !militaryLoading },
      personalInformation: {...initialPersonalInformationState, preloadComplete: !profileLoading },
      authorizedServices: {
        ...initialAuthorizedServicesState,
        militaryServiceHistory: true,
        hasLoaded: true,
      },   
    })

    act(() => {
      component = renderWithProviders(<SyncScreen/>, store)
    })

    testInstance = component.root
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
      expect(testInstance.findByType(TextView).props.children).toEqual('Signing in...')
    })

    it('should show loading the profile text', async () => {
      initializeTestInstance(true, true, true, true, false)
      expect(testInstance.findByType(TextView).props.children).toEqual('Loading your profile...')
    })

    it('should show loading military info text', async () => {
      initializeTestInstance(true, false, true, true, false)
      expect(testInstance.findByType(TextView).props.children).toEqual('Retrieving your military history...')
    })

    it('should show loading military info text', async () => {
      initializeTestInstance(false, false, true, true, false)
      expect(testInstance.findByType(TextView).props.children).toEqual('Retrieving your disability ratings...')
    })
  })

  describe('sign out', () => {
    it('should show sign out text', async () => {
      initializeTestInstance(false, false, false, true, true)
      expect(testInstance.findByType(TextView).props.children).toEqual('Signing out...')
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
