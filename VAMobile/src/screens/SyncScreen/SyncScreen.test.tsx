import React from 'react'

import { screen } from '@testing-library/react-native'
import { t } from 'i18next'

import { authKeys } from 'api/auth'
import * as api from 'store/api'
import { QueriesData, context, render, when } from 'testUtils'

import { SyncScreen } from './index'

context('SyncScreen', () => {
  const initializeTestInstance = (loggedIn = false, loggingOut = false, syncing = true): void => {
    const queriesData: QueriesData = [
      {
        queryKey: authKeys.settings,
        data: {
          firstTimeLogin: false,
        },
      },
    ]
    render(<SyncScreen />, {
      preloadedState: {
        auth: {
          loggedIn: loggedIn,
          loggingOut: loggingOut,
          syncing: syncing,
        },
      },
      queriesData: queriesData,
    })
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
})
