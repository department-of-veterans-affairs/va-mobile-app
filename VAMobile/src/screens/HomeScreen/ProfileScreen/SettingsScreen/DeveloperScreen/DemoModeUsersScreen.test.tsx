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

let goBack: jest.Mock

context('DemoModeUsersScreen', () => {
  const getItem = AsyncStorage.getItem as jest.Mock
  const initializeTestInstance = (fromLogin = false) => {
    goBack = jest.fn()
    const props = mockNavProps(
      undefined,
      { setOptions: jest.fn(), navigate: mockNavigationSpy, goBack },
      { params: { fromLogin } },
    )

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

    it('from the login page should go back instead of log out', async () => {
      getItem.mockResolvedValueOnce('benjaminAdams')
      const logoutSpy = jest.spyOn(AuthSlice, 'logout').mockImplementationOnce((): AppThunk => async () => {})

      initializeTestInstance(true)
      const radioButton = screen.getByRole('radio', { selected: false, name: 'Clara Jefferson' })
      expect(radioButton).toBeDefined()
      fireEvent.press(radioButton)

      const saveButton = screen.getByRole('button', { name: 'Save' })
      expect(saveButton).toBeDefined()
      fireEvent.press(saveButton)

      await waitFor(() => {
        expect(AsyncStorage.setItem).toBeCalledWith(DEMO_USER, 'claraJefferson')
        expect(logoutSpy).not.toHaveBeenCalled()
        expect(goBack).toHaveBeenCalled()
      })
    })
  })
})
