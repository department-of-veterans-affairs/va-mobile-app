import React from 'react'
import { Share } from 'react-native'
import { BIOMETRY_TYPE } from 'react-native-keychain'

import { fireEvent, screen } from '@testing-library/react-native'

import { authKeys } from 'api/auth'
import { InitialState } from 'store/slices'
import { QueriesData, context, mockNavProps, render, when } from 'testUtils'
import { featureEnabled } from 'utils/remoteConfig'

import SettingsScreen from './index'

jest.mock('utils/remoteConfig')
when(featureEnabled as jest.Mock)
  .calledWith('inAppRecruitment')
  .mockReturnValue(true)

jest.mock('react-native/Libraries/Share/Share', () => {
  return {
    share: jest.fn(() => {
      return Promise.resolve()
    }),
  }
})

const mockNavigationSpy = jest.fn()
const mockExternalLinkSpy = jest.fn()

jest.mock('utils/hooks', () => {
  const original = jest.requireActual('utils/hooks')
  return {
    ...original,
    useRouteNavigation: () => mockNavigationSpy,
    useExternalLink: () => mockExternalLinkSpy,
  }
})

const defaultEnvVars = {
  SHOW_DEBUG_MENU: true,
  APPLE_STORE_LINK: 'https://apps.apple.com/us/app/va-health-and-benefits/id1559609596',
  GOOGLE_PLAY_LINK: 'https://play.google.com/store/apps/details?id=gov.va.mobileapp',
}

jest.mock('utils/env', () => jest.fn(() => defaultEnvVars))

context('SettingsScreen', () => {
  const initializeTestInstance = (
    canStoreWithBiometric = false,
    supportedBiometric?: BIOMETRY_TYPE,
    demoMode = false,
  ) => {
    const props = mockNavProps(undefined, {
      navigate: mockNavigationSpy,
    })
    const queriesData: QueriesData = [
      {
        queryKey: authKeys.settings,
        data: {
          firstTimeLogin: false,
          loading: false,
          loggedIn: true,
          loggingOut: false,
          syncing: false,
        },
      },
      {
        queryKey: authKeys.biometrics,
        data: {
          canStoreWithBiometric: canStoreWithBiometric,
          displayBiometricsPreferenceScreen: true,
          shouldStoreWithBiometric: true,
          supportedBiometric: supportedBiometric,
        },
      },
    ]

    render(<SettingsScreen {...props} />, {
      preloadedState: {
        ...InitialState,
        demo: {
          demoMode,
        },
      },
      queriesData: queriesData,
    })
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  it('initializes correctly', () => {
    expect(screen.getByRole('link', { name: 'Account security' })).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Notifications' })).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Share the app' })).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Privacy policy' })).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Developer Screen' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Sign out' })).toBeTruthy()
  })

  describe('when privacy policy is clicked', () => {
    it('should launch external link', () => {
      fireEvent.press(screen.getByRole('link', { name: 'Privacy policy' }))
      expect(mockExternalLinkSpy).toHaveBeenCalled()
    })
  })

  describe('when "Share the app" is clicked', () => {
    it('should call Share.share', () => {
      fireEvent.press(screen.getByRole('link', { name: 'Share the app' }))
      expect(Share.share).toBeCalledWith({
        message:
          'Download the VA: Health and Benefits on the App Store: https://apps.apple.com/us/app/va-health-and-benefits/id1559609596 or on Google Play: https://play.google.com/store/apps/details?id=gov.va.mobileapp',
      })
    })
  })

  describe('on account security click', () => {
    it('should call useRouteNavigation', () => {
      fireEvent.press(screen.getByRole('link', { name: 'Account security' }))
      expect(mockNavigationSpy).toHaveBeenCalledWith('AccountSecurity')
    })
  })

  describe('when canStoreWithBiometric is true', () => {
    describe('when the biometry type is Face', () => {
      it('should display the text "Use face recognition"', () => {
        initializeTestInstance(true, BIOMETRY_TYPE.FACE)
        expect(screen.getByRole('switch', { name: 'Use Face Recognition' })).toBeTruthy()
      })
    })

    describe('when the biometry type is Fingerprint', () => {
      it('should display the text "Use fingerprint"', () => {
        initializeTestInstance(true, BIOMETRY_TYPE.FINGERPRINT)
        expect(screen.getByRole('switch', { name: 'Use Fingerprint' })).toBeTruthy()
      })
    })

    describe('when the biometry type is Iris', () => {
      it('should display the text "Use iris"', () => {
        initializeTestInstance(true, BIOMETRY_TYPE.IRIS)
        expect(screen.getByRole('switch', { name: 'Use Iris' })).toBeTruthy()
      })
    })

    describe('when the biometry type is Touch ID', () => {
      it('should display the text "Use Touch ID"', () => {
        initializeTestInstance(true, BIOMETRY_TYPE.TOUCH_ID)
        expect(screen.getByRole('switch', { name: 'Use Touch ID' })).toBeTruthy()
      })
    })

    describe('when the biometry type is Face ID', () => {
      it('should display the text "Use Face ID"', () => {
        initializeTestInstance(true, BIOMETRY_TYPE.FACE_ID)
        expect(screen.getByRole('switch', { name: 'Use Face ID' })).toBeTruthy()
      })
    })
  })
})
