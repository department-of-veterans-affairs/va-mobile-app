import 'react-native'
import React from 'react'
import { Linking, Pressable, Share } from 'react-native'
// Note: test renderer must be required after react-native.
import { act, ReactTestInstance } from 'react-test-renderer'
import { context, mockNavProps, mockStore, renderWithProviders } from 'testUtils'

import SettingsScreen from './index'

jest.mock('react-native/Libraries/Share/Share', () => {
  return {
    share: jest.fn(() => {
      return Promise.resolve()
    })
  }
})

context('SettingsScreen', () => {
  let store: any
  let component: any
  let testInstance: ReactTestInstance

  beforeEach(() => {
    const props = mockNavProps()

    store = mockStore({
      auth: { initializing: true, loggedIn: false, loading: false },
    })

    act(() => {
      component = renderWithProviders(<SettingsScreen {...props} />, store)
    })

    testInstance = component.root
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  describe('when privacy policy is clicked', () => {
    it('should call Linking openURL', async () => {
      testInstance.findAllByType(Pressable)[2].props.onPress()
      expect(Linking.openURL).toHaveBeenCalled()
    })
  })

  describe('when "Share the app" is clicked', () => {
    it('should call Share.share', async () => {
      testInstance.findAllByType(Pressable)[1].props.onPress()
      expect(Share.share).toBeCalledWith({"message": "Download the VA mobile app on the App Store: com.your.app.id.mobapp.at or on Google Play: http://play.google.com/store/apps/details?id=com.your.app.id"})
    })
  })
})
