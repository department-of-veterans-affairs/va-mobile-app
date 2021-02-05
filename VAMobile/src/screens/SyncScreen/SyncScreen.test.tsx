import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import {context, findByTestID, mockStore, renderWithProviders} from 'testUtils'
import {act, ReactTestInstance} from 'react-test-renderer'

import {initialAuthState, initialMilitaryServiceState, initialPersonalInformationState} from 'store/reducers'
import {SyncScreen} from './index'
import TextView from '../../components/TextView'
import {completeSync, getProfileInfo, getServiceHistory } from '../../store/actions'

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
  }
})

context('SyncScreen', () => {
  let store: any
  let component: any
  let testInstance: ReactTestInstance

  const initializeTestInstance = (militaryLoading = true, profileLoading = true, loggedIn = false): void => {
    store = mockStore({
      auth: {...initialAuthState, loggedIn},
      militaryService: { ...initialMilitaryServiceState, needsDataLoad: militaryLoading },
      personalInformation: {...initialPersonalInformationState, needsDataLoad: profileLoading }
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
      initializeTestInstance(true, true, true)
      expect(testInstance.findByType(TextView).props.children).toEqual('Loading your profile...')
    })

    it('should show loading military info text', async () => {
      initializeTestInstance(true, false, true)
      expect(testInstance.findByType(TextView).props.children).toEqual('Retrieving your military history...')
    })
  })

  describe('loading sequence', () => {
    it('should load profile first if the user is logged in', async () => {
      initializeTestInstance(true,true,true)
      expect(getProfileInfo).toHaveBeenCalled()
      expect(getServiceHistory).not.toHaveBeenCalled()
    })

    it('should load military history after profile has loaded', async () => {
      initializeTestInstance(true,false,true)
      expect(getProfileInfo).not.toHaveBeenCalled()
      expect(getServiceHistory).toHaveBeenCalled()
    })
  })

  describe('sync completion', () => {
    it('should complete the sync when all loading is finished', async () => {
      initializeTestInstance(false,false,true)
      expect(completeSync).toHaveBeenCalled()
    })
  })
})
