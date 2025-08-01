import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'
import { t } from 'i18next'

import RemoteConfigScreen from 'screens/HomeScreen/ProfileScreen/SettingsScreen/DeveloperScreen/RemoteConfigScreen'
import { logout } from 'store/slices'
import { QueriesData, context, mockNavProps, render } from 'testUtils'
import { waitFor } from 'testUtils'
import { devConfig, setDebugConfig } from 'utils/remoteConfig'

jest.mock('store/slices/authSlice', () => {
  const actual = jest.requireActual('store/slices/authSlice')
  return {
    ...actual,
    logout: jest.fn(() => {
      return {
        type: '',
        payload: '',
      }
    }),
  }
})

const mockOverrides = {
  ...devConfig,
  haptics: false,
}

context('RemoteConfigScreen', () => {
  const initializeTestInstance = (queriesData?: QueriesData) => {
    const props = mockNavProps(
      {},
      {
        navigate: jest.fn(),
        goBack: jest.fn(),
      },
    )
    setDebugConfig(mockOverrides)
    render(<RemoteConfigScreen {...props} />, { queriesData })
  }

  it('renders correctly', () => {
    initializeTestInstance()
    expect(screen.getByRole('header', { name: t('remoteConfig.title') })).toBeTruthy()

    for (const [key, value] of Object.entries(mockOverrides)) {
      expect(screen.getByRole('switch', { name: key }).props.accessibilityState.checked).toBe(value)
    }
  })

  it('shows a snackbar if no values changed', async () => {
    initializeTestInstance()

    const applyOverridesButton = screen.getByRole('button', { name: 'Apply Overrides' })
    expect(applyOverridesButton).toBeDefined()
    fireEvent.press(applyOverridesButton)

    await waitFor(() => expect(screen.getByText('No values changed')).toBeTruthy())
  })

  it('logs out after overriding remote config', () => {
    initializeTestInstance()

    // Toggle an item to enable override button
    fireEvent.press(screen.getByText('useOldLinkComponent'))

    const applyOverridesButton = screen.getByRole('button', { name: 'Apply Overrides' })
    expect(applyOverridesButton).toBeDefined()
    fireEvent.press(applyOverridesButton)

    expect(logout).toHaveBeenCalled()
  })
})
