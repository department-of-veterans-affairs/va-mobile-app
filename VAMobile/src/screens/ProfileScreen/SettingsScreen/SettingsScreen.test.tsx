import 'react-native'
import React from 'react'
import { Linking, Pressable } from 'react-native'
// Note: test renderer must be required after react-native.
import { act, ReactTestInstance } from 'react-test-renderer'
import { context, mockNavProps, mockStore, renderWithProviders } from 'testUtils'

import SettingsScreen from './index'

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
      testInstance.findByProps({ textLines: 'Privacy Policy' }).props.onPress()
      expect(Linking.openURL).toHaveBeenCalled()
    })
  })

  describe('on manage your account click', () => {
    it('should call useRouteNavigation', async () => {
      testInstance.findAllByType(Pressable)[0].props.onPress()
      expect(mockNavigationSpy).toHaveBeenCalled()
      expect(mockNavigationSpy).toHaveBeenCalledWith('ManageYourAccount')
    })
  })
})
