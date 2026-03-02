import React from 'react'

import AsyncStorage from '@react-native-async-storage/async-storage'

import { fireEvent, screen, waitFor } from '@testing-library/react-native'

import DuplicateRecordAlert, { DUPLICATE_RECORD_ALERT_DISMISSED } from 'components/DuplicateRecordAlert'
import { initialSettingsState } from 'store/slices/settingsSlice'
import { context, render } from 'testUtils'

context('DuplicateRecordAlert', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  const renderWithSettings = (displayDuplicateRecordAlert: boolean) => {
    return render(<DuplicateRecordAlert />, {
      preloadedState: {
        settings: {
          ...initialSettingsState,
          displayDuplicateRecordAlert,
        },
      },
    })
  }

  it('renders the alert when displayDuplicateRecordAlert is true', () => {
    renderWithSettings(true)
    expect(screen.getByText('You may notice duplicate records for a time')).toBeTruthy()
  })

  it('does not render the alert when displayDuplicateRecordAlert is false', () => {
    renderWithSettings(false)
    expect(screen.queryByText('You may notice duplicate records for a time')).toBeFalsy()
  })

  it('renders a dismiss button', () => {
    renderWithSettings(true)
    expect(screen.getByRole('button', { name: 'Dismiss' })).toBeTruthy()
  })

  it('persists dismissal to AsyncStorage when dismiss is pressed', async () => {
    const setItemMock = AsyncStorage.setItem as jest.Mock
    renderWithSettings(true)
    const dismissButton = screen.getByRole('button', { name: 'Dismiss' })
    fireEvent.press(dismissButton)
    await waitFor(() => {
      expect(setItemMock).toHaveBeenCalledWith(DUPLICATE_RECORD_ALERT_DISMISSED, 'true')
    })
  })

  it('checks AsyncStorage on mount and shows alert if not dismissed', async () => {
    const getItemMock = AsyncStorage.getItem as jest.Mock
    getItemMock.mockResolvedValueOnce(null)
    renderWithSettings(false)
    await waitFor(() => {
      expect(getItemMock).toHaveBeenCalledWith(DUPLICATE_RECORD_ALERT_DISMISSED)
    })
  })

  it('does not show alert if previously dismissed in AsyncStorage', async () => {
    const getItemMock = AsyncStorage.getItem as jest.Mock
    getItemMock.mockResolvedValueOnce('true')
    renderWithSettings(false)
    await waitFor(() => {
      expect(getItemMock).toHaveBeenCalledWith(DUPLICATE_RECORD_ALERT_DISMISSED)
    })
    expect(screen.queryByText('You may notice duplicate records for a time')).toBeFalsy()
  })

  it('does not show alert when Redux setting is true but previously dismissed in AsyncStorage', async () => {
    const getItemMock = AsyncStorage.getItem as jest.Mock
    getItemMock.mockResolvedValueOnce('true')
    renderWithSettings(true)
    await waitFor(() => {
      expect(getItemMock).toHaveBeenCalledWith(DUPLICATE_RECORD_ALERT_DISMISSED)
    })
    expect(screen.queryByText('You may notice duplicate records for a time')).toBeFalsy()
  })
})
