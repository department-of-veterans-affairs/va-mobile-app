import React from 'react'

import AsyncStorage from '@react-native-async-storage/async-storage'

import { fireEvent, screen } from '@testing-library/react-native'

import DemoModeUsersScreen from 'screens/HomeScreen/ProfileScreen/SettingsScreen/DeveloperScreen/DemoModeUsersScreen'
import { DEMO_USER } from 'screens/HomeScreen/ProfileScreen/SettingsScreen/DeveloperScreen/DeveloperScreen'
import { AppThunk } from 'store'
import * as AuthSlice from 'store/slices/authSlice'
import { context, mockNavProps, render, waitFor } from 'testUtils'

const mockNavigationSpy = jest.fn()
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  clear: jest.fn(),
}))

context('DemoModeUsersScreen', () => {
  const getItem = AsyncStorage.getItem as jest.Mock
  const initializeTestInstance = () => {
    const props = mockNavProps(undefined, { setOptions: jest.fn(), navigate: mockNavigationSpy })

    render(<DemoModeUsersScreen {...props} />)
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('when the screen loads', () => {
    it('should get the current user from async storage', async () => {
      getItem.mockResolvedValueOnce('benjaminAdams')
      initializeTestInstance()
      await waitFor(() => {
        expect(screen.getByRole('radio', { selected: true, name: 'Benjamin Adams' })).toBeDefined()
      })
    })
  })

  describe('when selecting a new demo user', () => {
    it('should update async storage and logout', async () => {
      getItem.mockResolvedValueOnce('benjaminAdams')
      const logoutSpy = jest.spyOn(AuthSlice, 'logout').mockImplementationOnce((): AppThunk => async () => {})

      initializeTestInstance()
      const radioButton = screen.getByRole('radio', { selected: false, name: 'Clara Jefferson' })
      expect(radioButton).toBeDefined()
      fireEvent.press(radioButton)

      const saveButton = screen.getByRole('button', { name: 'Save and Logout' })
      expect(saveButton).toBeDefined()
      fireEvent.press(saveButton)

      await waitFor(() => {
        expect(AsyncStorage.setItem).toBeCalledWith(DEMO_USER, 'claraJefferson')
        expect(logoutSpy).toHaveBeenCalled()
      })
    })
  })
})
