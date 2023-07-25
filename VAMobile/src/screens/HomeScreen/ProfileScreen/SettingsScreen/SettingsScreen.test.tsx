import 'react-native'
import React from 'react'
import { Share } from 'react-native'
import { BIOMETRY_TYPE } from 'react-native-keychain'
// Note: test renderer must be required after react-native.
import { ReactTestInstance } from 'react-test-renderer'
import { context, findByTestID, findByTypeWithText, mockNavProps, render, RenderAPI } from 'testUtils'
import SettingsScreen from './index'
import { InitialState } from 'store/slices'
import { TextView } from 'components'
import getEnv from 'utils/env'

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

const envMock = getEnv as jest.Mock

const defaultEnvVars = {
  SHOW_DEBUG_MENU: true,
  APPLE_STORE_LINK: 'https://apps.apple.com/us/app/va-health-and-benefits/id1559609596',
  GOOGLE_PLAY_LINK: 'https://play.google.com/store/apps/details?id=gov.va.mobileapp',
}

jest.mock('utils/env', () => jest.fn(() => defaultEnvVars))

context('SettingsScreen', () => {
  let component: RenderAPI
  let testInstance: ReactTestInstance
  let navigateSpy: jest.Mock

  const initializeTestInstance = (canStoreWithBiometric = false, supportedBiometric?: BIOMETRY_TYPE, demoMode = false) => {
    navigateSpy = jest.fn()
    const props = mockNavProps(undefined, {
      navigate: navigateSpy,
    })

    component = render(<SettingsScreen {...props} />, {
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

    testInstance = component.UNSAFE_root
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  describe('when privacy policy is clicked', () => {
    it('should launch external link', async () => {
      findByTestID(testInstance, 'privacy-policy').props.onPress()
      expect(mockExternalLinkSpy).toHaveBeenCalled()
    })
  })

  describe('when "Share the app" is clicked', () => {
    it('should call Share.share', async () => {
      findByTestID(testInstance, 'share-the-app').props.onPress()
      expect(Share.share).toBeCalledWith({
        message:
          'Download the VA: Health and Benefits on the App Store: https://apps.apple.com/us/app/va-health-and-benefits/id1559609596 or on Google Play: https://play.google.com/store/apps/details?id=gov.va.mobileapp',
      })
    })
  })

  describe('on manage your account click', () => {
    it('should call useRouteNavigation', async () => {
      findByTestID(testInstance, 'manage-account').props.onPress()
      expect(navigateSpy).toHaveBeenCalledWith('ManageYourAccount')
    })
  })

  describe('when canStoreWithBiometric is true', () => {
    describe('when the biometry type is Face', () => {
      it('should display the text "Use face recognition"', async () => {
        initializeTestInstance(true, BIOMETRY_TYPE.FACE)
        expect(testInstance.findAllByType(TextView)[4].props.children).toEqual('Use Face Recognition')
      })
    })

    describe('when the biometry type is Fingerprint', () => {
      it('should display the text "Use fingerprint"', async () => {
        initializeTestInstance(true, BIOMETRY_TYPE.FINGERPRINT)
        expect(testInstance.findAllByType(TextView)[4].props.children).toEqual('Use Fingerprint')
      })
    })

    describe('when the biometry type is Iris', () => {
      it('should display the text "Use iris"', async () => {
        initializeTestInstance(true, BIOMETRY_TYPE.IRIS)
        expect(testInstance.findAllByType(TextView)[4].props.children).toEqual('Use Iris')
      })
    })

    describe('when the biometry type is Touch ID', () => {
      it('should display the text "Use Touch ID"', async () => {
        initializeTestInstance(true, BIOMETRY_TYPE.TOUCH_ID)
        expect(testInstance.findAllByType(TextView)[4].props.children).toEqual('Use Touch ID')
      })
    })

    describe('when the biometry type is Face ID', () => {
      it('should display the text "Use Face ID"', async () => {
        initializeTestInstance(true, BIOMETRY_TYPE.FACE_ID)
        expect(testInstance.findAllByType(TextView)[4].props.children).toEqual('Use Face ID')
      })
    })

    describe('developer screen / debug menu', () => {
      it('should display the Developer Screen button if SHOW_DEBUG_MENU is true', async () => {
        envMock.mockReturnValue(defaultEnvVars)
        initializeTestInstance(true, BIOMETRY_TYPE.FACE_ID)
        expect(findByTypeWithText(testInstance, TextView, 'Developer Screen')).toBeTruthy()
      })

      it('should not display the Developer Screen button if SHOW_DEBUG_MENU is false and demo mode is false', async () => {
        envMock.mockReturnValue({ ...defaultEnvVars, SHOW_DEBUG_MENU: false })
        initializeTestInstance(true, BIOMETRY_TYPE.FACE_ID, false)
        expect(findByTypeWithText(testInstance, TextView, 'Developer Screen')).toBeTruthy()
      })

      it('should display the Developer Screen button if SHOW_DEBUG_MENU is false and demo mode is true', async () => {
        envMock.mockReturnValue({ ...defaultEnvVars, SHOW_DEBUG_MENU: false })
        initializeTestInstance(true, BIOMETRY_TYPE.FACE_ID, true)
        expect(findByTypeWithText(testInstance, TextView, 'Developer Screen')).toBeTruthy()
      })
    })
  })
})
