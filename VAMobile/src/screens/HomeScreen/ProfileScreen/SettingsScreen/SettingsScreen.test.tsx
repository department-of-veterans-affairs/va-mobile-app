import 'react-native'
import React from 'react'
import { Share } from 'react-native'
import { BIOMETRY_TYPE } from 'react-native-keychain'

import { fireEvent, screen } from '@testing-library/react-native'
import { context, mockNavProps, render } from 'testUtils'
import SettingsScreen from './index'
import { InitialState } from 'store/slices'

jest.mock('react-native/Libraries/Share/Share', () => {
  return {
    share: jest.fn(() => {
      return Promise.resolve()
    }),
  }
})

const mockExternalLinkSpy = jest.fn()

jest.mock('../../../../utils/hooks', () => {
  let original = jest.requireActual('../../../../utils/hooks')
  return {
    ...original,
    useRouteNavigation: () => jest.fn(),
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
  let navigateSpy: jest.Mock

  const initializeTestInstance = (canStoreWithBiometric = false, supportedBiometric?: BIOMETRY_TYPE, demoMode = false) => {
    navigateSpy = jest.fn()
    const props = mockNavProps(undefined, {
      navigate: navigateSpy,
    })

    render(<SettingsScreen {...props} />, {
      preloadedState: {
        ...InitialState,
        auth: {
          ...InitialState.auth,
          canStoreWithBiometric,
          supportedBiometric,
        },
        demo: {
          demoMode,
        },
      },
    })
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  it('initializes correctly', async () => {
    expect(screen.getByText('Manage account')).toBeTruthy()
    expect(screen.getByText('Notifications')).toBeTruthy()
    expect(screen.getByText('Share the app')).toBeTruthy()
    expect(screen.getByText('Privacy policy')).toBeTruthy()
    expect(screen.getByText('Developer Screen')).toBeTruthy()
    expect(screen.getByText('Sign out')).toBeTruthy()
  })

  describe('when privacy policy is clicked', () => {
    it('should launch external link', async () => {
      fireEvent.press(screen.getByTestId('privacy-policy'))
      expect(mockExternalLinkSpy).toHaveBeenCalled()
    })
  })

  describe('when "Share the app" is clicked', () => {
    it('should call Share.share', async () => {
      fireEvent.press(screen.getByTestId('share-the-app'))
      expect(Share.share).toBeCalledWith({
        message:
          'Download the VA: Health and Benefits on the App Store: https://apps.apple.com/us/app/va-health-and-benefits/id1559609596 or on Google Play: https://play.google.com/store/apps/details?id=gov.va.mobileapp',
      })
    })
  })

  describe('on manage your account click', () => {
    it('should call useRouteNavigation', async () => {
      fireEvent.press(screen.getByTestId('manage-account'))
      expect(navigateSpy).toHaveBeenCalledWith('ManageYourAccount')
    })
  })

  describe('when canStoreWithBiometric is true', () => {
    describe('when the biometry type is Face', () => {
      it('should display the text "Use face recognition"', async () => {
        initializeTestInstance(true, BIOMETRY_TYPE.FACE)
        expect(screen.getByText('Use Face Recognition')).toBeTruthy()
      })
    })

    describe('when the biometry type is Fingerprint', () => {
      it('should display the text "Use fingerprint"', async () => {
        initializeTestInstance(true, BIOMETRY_TYPE.FINGERPRINT)
        expect(screen.getByText('Use Fingerprint')).toBeTruthy()
      })
    })

    describe('when the biometry type is Iris', () => {
      it('should display the text "Use iris"', async () => {
        initializeTestInstance(true, BIOMETRY_TYPE.IRIS)
        expect(screen.getByText('Use Iris')).toBeTruthy()
      })
    })

    describe('when the biometry type is Touch ID', () => {
      it('should display the text "Use Touch ID"', async () => {
        initializeTestInstance(true, BIOMETRY_TYPE.TOUCH_ID)
        expect(screen.getByText('Use Touch ID')).toBeTruthy()
      })
    })

    describe('when the biometry type is Face ID', () => {
      it('should display the text "Use Face ID"', async () => {
        initializeTestInstance(true, BIOMETRY_TYPE.FACE_ID)
        expect(screen.getByText('Use Face ID')).toBeTruthy()
      })
    })
  })
})
