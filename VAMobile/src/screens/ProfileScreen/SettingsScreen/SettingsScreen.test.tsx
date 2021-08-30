import 'react-native'
import React from 'react'
import { Share } from 'react-native'
import { BIOMETRY_TYPE } from 'react-native-keychain'
// Note: test renderer must be required after react-native.
import { act, ReactTestInstance } from 'react-test-renderer'
import { context, findByTestID, findByOnPressFunction, mockNavProps, mockStore, renderWithProviders } from 'testUtils'

import SettingsScreen from './index'
import { InitialState } from 'store/reducers'
import { BaseListItem, TextView } from 'components'

jest.mock('react-native/Libraries/Share/Share', () => {
  return {
    share: jest.fn(() => {
      return Promise.resolve()
    }),
  }
})

let mockNavigationSpy = jest.fn()
const mockExternalLinkSpy = jest.fn()

jest.mock('../../../utils/hooks', () => {
  let original = jest.requireActual('../../../utils/hooks')
  let theme = jest.requireActual('../../../styles/themes/standardTheme').default
  return {
    ...original,
    useTheme: jest.fn(() => {
      return { ...theme }
    }),
    useRouteNavigation: () => mockNavigationSpy,
    useExternalLink: () => mockExternalLinkSpy,
  }
})

context('SettingsScreen', () => {
  let store: any
  let component: any
  let testInstance: ReactTestInstance

  const initializeTestInstance = (canStoreWithBiometric = false, supportedBiometric?: BIOMETRY_TYPE) => {
    const props = mockNavProps(
      undefined,
      {
        navigate: mockNavigationSpy,
      }
    )

    store = mockStore({
      ...InitialState,
      auth: {
        ...InitialState.auth,
        canStoreWithBiometric,
        supportedBiometric,
      },
    })

    act(() => {
      component = renderWithProviders(<SettingsScreen {...props} />, store)
    })

    testInstance = component.root
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
      findByOnPressFunction(testInstance, BaseListItem, 'onManage')?.props.onPress()
      expect(mockNavigationSpy).toHaveBeenCalledWith('ManageYourAccount')
    })
  })

  describe('when canStoreWithBiometric is true', () => {
    describe('when the biometry type is Face', () => {
      it('should display the text "Use face recognition"', async () => {
        initializeTestInstance(true, BIOMETRY_TYPE.FACE)
        expect(testInstance.findAllByType(TextView)[1].props.children).toEqual('Use Face Recognition')
      })
    })

    describe('when the biometry type is Fingerprint', () => {
      it('should display the text "Use fingerprint"', async () => {
        initializeTestInstance(true, BIOMETRY_TYPE.FINGERPRINT)
        expect(testInstance.findAllByType(TextView)[1].props.children).toEqual('Use Fingerprint')
      })
    })

    describe('when the biometry type is Iris', () => {
      it('should display the text "Use iris"', async () => {
        initializeTestInstance(true, BIOMETRY_TYPE.IRIS)
        expect(testInstance.findAllByType(TextView)[1].props.children).toEqual('Use Iris')
      })
    })

    describe('when the biometry type is Touch ID', () => {
      it('should display the text "Use Touch ID"', async () => {
        initializeTestInstance(true, BIOMETRY_TYPE.TOUCH_ID)
        expect(testInstance.findAllByType(TextView)[1].props.children).toEqual('Use Touch ID')
      })
    })

    describe('when the biometry type is Face ID', () => {
      it('should display the text "Use Face ID"', async () => {
        initializeTestInstance(true, BIOMETRY_TYPE.FACE_ID)
        expect(testInstance.findAllByType(TextView)[1].props.children).toEqual('Use Face ID')
      })
    })
  })
})
