import 'react-native'
import React from 'react'
import {Linking, Pressable, Share} from 'react-native'
import {BIOMETRY_TYPE} from 'react-native-keychain'
// Note: test renderer must be required after react-native.
import {act, ReactTestInstance} from 'react-test-renderer'
import {context, findByTestID, mockNavProps, mockStore, renderWithProviders} from 'testUtils'

import SettingsScreen from './index'
import {InitialState} from 'store/reducers'
import {TextView} from 'components'

jest.mock('react-native/Libraries/Share/Share', () => {
  return {
    share: jest.fn(() => {
      return Promise.resolve()
    })
  }
})

let mockNavigationSpy = jest.fn()
jest.mock('../../../utils/hooks', () => {
  let original = jest.requireActual("../../../utils/hooks")
  let theme = jest.requireActual("../../../styles/themes/standardTheme").default
  return {
    ...original,
    useTheme: jest.fn(()=> {
      return {...theme}
    }),
    useRouteNavigation: () => mockNavigationSpy,
  }
})

context('SettingsScreen', () => {
  let store: any
  let component: any
  let testInstance: ReactTestInstance

  const initializeTestInstance = (canStoreWithBiometric?: boolean, supportedBiometric?: BIOMETRY_TYPE) => {
    const props = mockNavProps()

    store = mockStore({
      ...InitialState,
      auth:{
        ...InitialState.auth,
        canStoreWithBiometric,
        supportedBiometric
      }
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
    it('should call Linking openURL', async () => {
      findByTestID(testInstance, 'privacy-policy').props.onPress()
      expect(Linking.openURL).toHaveBeenCalled()
    })
  })

  // TODO: put back in when store links are added
  // describe('when "Share the app" is clicked', () => {
  //   it('should call Share.share', async () => {
  //     findByTestID(testInstance, 'share-the-app').props.onPress()
  //     expect(Share.share).toBeCalledWith({"message": "Download the app on the App Store: com.your.app.id.mobapp.at or on Google Play: http://play.google.com/store/apps/details?id=com.your.app.id"})
  //   })
  // })

  describe('on manage your account click', () => {
    it('should call useRouteNavigation', async () => {
      testInstance.findAllByType(Pressable)[0].props.onPress()
      expect(mockNavigationSpy).toHaveBeenCalled()
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

  describe('on notifications click', () => {
    it('should call useRouteNavigation', async () => {
      testInstance.findAllByType(Pressable)[2].props.onPress()
      expect(mockNavigationSpy).toHaveBeenCalled()
      expect(mockNavigationSpy).toHaveBeenCalledWith('NotificationSettings')
    })
  })
})
