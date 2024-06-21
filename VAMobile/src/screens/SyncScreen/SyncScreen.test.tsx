import React from 'react'

import { screen } from '@testing-library/react-native'

import { completeSync, initialAuthState } from 'store/slices'
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

  describe('sync completion', () => {
    it('should complete the sync when all loading is finished', async () => {
      initializeTestInstance(true, false, false)
      await waitFor(() => {
        expect(completeSync).toHaveBeenCalled()
      })
    })
  })
})
