import React from 'react'

import AsyncStorage from '@react-native-async-storage/async-storage'

import { fireEvent, screen, waitFor } from '@testing-library/react-native'
import { t } from 'i18next'

import DeveloperScreen from 'screens/HomeScreen/ProfileScreen/SettingsScreen/DeveloperScreen'
import { context, mockNavProps, render, when } from 'testUtils'
import { FeatureConstants, overrideLocalVersion, setVersionSkipped } from 'utils/homeScreenAlerts'
import { resetReviewActionCount } from 'utils/inAppReviews'

const mockNavigationSpy = jest.fn()
const mockDispatchSpy = jest.fn()
const mockAlertSpy = jest.fn()
const mockGiveFeedbackSpy = jest.fn()

jest.mock('utils/homeScreenAlerts', () => {
  const original = jest.requireActual('utils/homeScreenAlerts')
  return {
    ...original,
    overrideLocalVersion: jest.fn(),
    setVersionSkipped: jest.fn(),
  }
})

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  clear: jest.fn(),
}))

jest.mock('utils/inAppReviews', () => {
  const original = jest.requireActual('utils/inAppReviews')
  return {
    ...original,
    resetReviewActionCount: jest.fn(),
  }
})

jest.mock('utils/hooks', () => {
  const original = jest.requireActual('utils/hooks')

  return {
    ...original,
    useRouteNavigation: () => mockNavigationSpy,
    useAlert: () => mockAlertSpy,
    useAppDispatch: () => mockDispatchSpy,
    useGiveFeedback: () => mockGiveFeedbackSpy,
  }
})

context('DeveloperScreen', () => {
  const initializeTestInstance = () => {
    const props = mockNavProps(undefined, { setOptions: jest.fn(), navigate: mockNavigationSpy })
    render(<DeveloperScreen {...props} />)
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('when "Reset first time login" button is pressed', () => {
    it('should display the reset first time login alert', async () => {
      initializeTestInstance()
      fireEvent.press(screen.getByRole('button', { name: 'Reset first time login' }))
      expect(mockAlertSpy).toHaveBeenCalledWith({
        title: t('areYouSure'),
        message: 'This will clear all session activity and redirect you back to the login screen.',
        buttons: expect.any(Array),
      })
    })
    it('should logout when "Reset" button is pressed', async () => {
      initializeTestInstance()
      fireEvent.press(screen.getByRole('button', { name: 'Reset first time login' }))

      /**
       * Simulate pressing 'Reset' button on Native Alert:
       * - Get the latest call to Alert.alert (`calls.at(-1)[0]`)
       * - Call the onPress of the second button in the button config array
       */
      const latestAlertMockCall = mockAlertSpy.mock.calls.at(-1)[0]
      latestAlertMockCall.buttons[1].onPress()

      await waitFor(() => expect(mockDispatchSpy).toHaveBeenCalled())
    })
  })

  describe('when "Reset async storage" button is pressed', () => {
    it('should display the reset async storage alert', async () => {
      initializeTestInstance()
      fireEvent.press(screen.getByRole('button', { name: 'Reset async storage' }))
      expect(mockAlertSpy).toHaveBeenCalledWith({
        title: t('areYouSure'),
        message: 'This will clear all local data saved to async storage and redirect you back to the login screen.',
        buttons: expect.any(Array),
      })
    })

    it('should clear async storage when "Reset" button is pressed', async () => {
      initializeTestInstance()
      fireEvent.press(screen.getByRole('button', { name: 'Reset async storage' }))

      /**
       * Simulate pressing 'Reset' button on Native Alert:
       * - Get the latest call to Alert.alert (`calls.at(-1)[0]`)
       * - Call the onPress of the second button in the button config array
       */
      const latestAlertMockCall = mockAlertSpy.mock.calls.at(-1)[0]
      latestAlertMockCall.buttons[1].onPress()

      await waitFor(() => expect(AsyncStorage.clear).toHaveBeenCalled())
      expect(mockDispatchSpy).toHaveBeenCalled()
    })
  })

  describe('when "Reset in-app review actions" button is pressed', () => {
    it('should display alert that in app review actions reset', async () => {
      initializeTestInstance()
      fireEvent.press(screen.getByRole('button', { name: 'Reset in-app review actions' }))
      await waitFor(() => expect(screen.getByText('In app review actions reset')).toBeTruthy())
      expect(resetReviewActionCount).toHaveBeenCalled()
    })

    it('should display alert that in app review actions failed to reset when there is an error', async () => {
      when(resetReviewActionCount).mockRejectedValue(new Error('Error'))
      initializeTestInstance()
      fireEvent.press(screen.getByRole('button', { name: 'Reset in-app review actions' }))
      await waitFor(() => expect(screen.getByText('Failed to reset in app review actions')).toBeTruthy())
    })
  })

  describe('when "In App Feedback Screen" button is pressed', () => {
    it('should display the feedback alert', async () => {
      initializeTestInstance()
      fireEvent.press(screen.getByRole('button', { name: 'In App Feedback Screen' }))
      expect(mockGiveFeedbackSpy).toHaveBeenCalled()
    })
  })

  describe('Firebase section', () => {
    it('should dispatch toggleFirebaseDebugMode action when pressed', async () => {
      initializeTestInstance()
      fireEvent.press(screen.getByRole('switch', { name: 'Firebase debug mode' }))
      expect(mockDispatchSpy).toHaveBeenCalled() //TODO
    })

    it('should navigate to Remote Config Screen', async () => {
      initializeTestInstance()
      fireEvent.press(screen.getByRole('link', { name: 'Remote Config' }))
      expect(mockNavigationSpy).toHaveBeenCalledWith('RemoteConfig')
    })
  })

  describe('Console Warnings section', () => {
    it('should toggle the hide-warnings preference', async () => {
      when(AsyncStorage.getItem as jest.Mock)
        .calledWith('@hide_warnings')
        .mockResolvedValue(null)
      initializeTestInstance()
      fireEvent.press(screen.getByRole('switch', { name: 'Hide warnings' }))
      await waitFor(() => expect(AsyncStorage.setItem as jest.Mock).toHaveBeenCalledWith('@hide_warnings', 'false'))
    })
  })

  describe('when "Override Api Calls" button is pressed', () => {
    it('should navigate to Override API screen when pressed', async () => {
      initializeTestInstance()
      fireEvent.press(screen.getByRole('button', { name: 'Override Api Calls' }))
      expect(mockNavigationSpy).toHaveBeenCalledWith('OverrideAPI')
    })
  })

  describe('Override Encourage Update Local Version section', () => {
    it('should call overrideLocalVersion when the user enters a version', async () => {
      initializeTestInstance()
      const encourageUpdateInput = screen.getByTestId('overrideEncourageUpdateTestID')
      fireEvent.changeText(encourageUpdateInput, '2.0')
      await waitFor(() => expect(overrideLocalVersion).toHaveBeenCalledWith(FeatureConstants.ENCOURAGEUPDATE, '2.0'))
    })
    it('should call overrideLocalVersion with undefined when the field is cleared', async () => {
      initializeTestInstance()
      const encourageUpdateInput = screen.getByTestId('overrideEncourageUpdateTestID')
      fireEvent.changeText(encourageUpdateInput, '')
      await waitFor(() =>
        expect(overrideLocalVersion).toHaveBeenCalledWith(FeatureConstants.ENCOURAGEUPDATE, undefined),
      )
    })
  })

  describe('Override Whats New Local Version section', () => {
    it('should call overrideLocalVersion when the user enters a version', async () => {
      initializeTestInstance()
      const encourageUpdateInput = screen.getByTestId('overrideWhatsNewTestID')
      fireEvent.changeText(encourageUpdateInput, '2.0')
      await waitFor(() => expect(overrideLocalVersion).toHaveBeenCalledWith(FeatureConstants.WHATSNEW, '2.0'))
    })
    it('should call overrideLocalVersion with undefined when the field is cleared', async () => {
      initializeTestInstance()
      const encourageUpdateInput = screen.getByTestId('overrideWhatsNewTestID')
      fireEvent.changeText(encourageUpdateInput, '')
      await waitFor(() => expect(overrideLocalVersion).toHaveBeenCalledWith(FeatureConstants.WHATSNEW, undefined))
    })
  })

  describe('when "Reset Versions" button is pressed', () => {
    it('should reset the Whats New and Encourage Update versions', async () => {
      initializeTestInstance()
      fireEvent.press(screen.getByRole('button', { name: 'Reset Versions' }))

      // Verify setSkippedVersion was called
      expect(setVersionSkipped).toHaveBeenCalledWith(FeatureConstants.ENCOURAGEUPDATE, '0.0')
      expect(setVersionSkipped).toHaveBeenCalledWith(FeatureConstants.WHATSNEW, '0.0')

      // Verify that overrideLocalVersion was called
      expect(overrideLocalVersion).toHaveBeenCalledWith(FeatureConstants.ENCOURAGEUPDATE, undefined)
      expect(overrideLocalVersion).toHaveBeenCalledWith(FeatureConstants.WHATSNEW, undefined)
    })
  })
})
