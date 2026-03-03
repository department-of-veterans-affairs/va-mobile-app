import React from 'react'

import AsyncStorage from '@react-native-async-storage/async-storage'

import { fireEvent, screen, waitFor } from '@testing-library/react-native'
import { t } from 'i18next'

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
    expect(screen.findByText(t('ohAlert.duplicatedRecord.title'))).toBeTruthy()
  })

  it('does not render the alert when displayDuplicateRecordAlert is false', () => {
    renderWithSettings(false)
    expect(screen.queryByText(t('ohAlert.duplicatedRecord.title'))).toBeFalsy()
  })

  it('renders a dismiss button', () => {
    renderWithSettings(true)
    expect(screen.findByRole('button', { name: 'Dismiss' })).toBeTruthy()
  })

  it('persists dismissal to AsyncStorage when dismiss is pressed', async () => {
    const setItemMock = AsyncStorage.setItem as jest.Mock
    renderWithSettings(true)
    const dismissButton = await screen.findByRole('button', { name: 'Dismiss' })
    fireEvent.press(dismissButton)
    await waitFor(() => {
      expect(setItemMock).toHaveBeenCalledWith(DUPLICATE_RECORD_ALERT_DISMISSED, 'true')
      expect(screen.queryByText(t('ohAlert.duplicatedRecord.title'))).toBeFalsy()
    })
  })

  it('checks AsyncStorage on mount and shows alert if not dismissed', async () => {
    const getItemMock = AsyncStorage.getItem as jest.Mock
    getItemMock.mockResolvedValueOnce(null)
    renderWithSettings(false)
    await waitFor(() => {
      expect(getItemMock).toHaveBeenCalledWith(DUPLICATE_RECORD_ALERT_DISMISSED)
      expect(screen.findByText(t('ohAlert.duplicatedRecord.title'))).toBeTruthy()
    })
  })

  it('does not show alert if previously dismissed in AsyncStorage', async () => {
    const getItemMock = AsyncStorage.getItem as jest.Mock
    getItemMock.mockResolvedValueOnce('true')
    renderWithSettings(false)
    await waitFor(() => {
      expect(getItemMock).toHaveBeenCalledWith(DUPLICATE_RECORD_ALERT_DISMISSED)
    })
    expect(screen.queryByText(t('ohAlert.duplicatedRecord.title'))).toBeFalsy()
  })
})
