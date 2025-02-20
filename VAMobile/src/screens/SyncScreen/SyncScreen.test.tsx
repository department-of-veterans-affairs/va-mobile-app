import React from 'react'

import { screen } from '@testing-library/react-native'
import { t } from 'i18next'

import * as api from 'store/api'
import { completeSync, initialAuthState } from 'store/slices'
import { context, render, waitFor, when } from 'testUtils'

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
  }
})

context('SyncScreen', () => {
  const initializeTestInstance = (loggedIn = false, loggingOut = false, syncing = true): void => {
    const store = {
      auth: { ...initialAuthState, loggedIn, loggingOut, syncing },
    }
    render(<SyncScreen />, { preloadedState: store })
  }

  beforeEach(() => {
    when(api.get as jest.Mock)
      .calledWith('/v0/user/authorized-services')
      .mockResolvedValue({
        data: {
          attributes: {
            authorizedServices: {
              appeals: true,
              appointments: true,
              claims: true,
              decisionLetters: true,
              directDepositBenefits: true,
              directDepositBenefitsUpdate: true,
              disabilityRating: true,
              lettersAndDocuments: true,
              militaryServiceHistory: true,
              paymentHistory: true,
              preferredName: true,
              prescriptions: true,
              scheduleAppointments: true,
              secureMessaging: true,
              userProfileUpdate: true,
            },
          },
        },
      })
    initializeTestInstance()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('shows "Signing you in" text', () => {
    initializeTestInstance()
    expect(screen.getByText(t('sync.progress.signin'))).toBeTruthy()
  })

  it('shows "Signing you out" text when logging out', () => {
    initializeTestInstance(false, true, true)
    expect(screen.getByText(t('sync.progress.signout'))).toBeTruthy()
  })

  it('shows "Signing you out" text when logging out and data is not loaded', () => {
    initializeTestInstance(true, true, true)
    expect(screen.getByText(t('sync.progress.signout'))).toBeTruthy()
  })

  describe('sync completion', () => {
    it('should complete the sync when all loading is finished', async () => {
      initializeTestInstance(true, false, false)
      await waitFor(() => {
        expect(completeSync).toHaveBeenCalled()
      })
    })
  })
})
