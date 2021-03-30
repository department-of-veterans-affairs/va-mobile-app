import 'react-native'
import { BottomTabNavigationEventMap } from '@react-navigation/bottom-tabs/src/types'
import { NavigationHelpers, ParamListBase, TabNavigationState } from '@react-navigation/native'
import { TouchableWithoutFeedback } from 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance, act } from 'react-test-renderer'
import Mock = jest.Mock

import {context, renderWithProviders} from 'testUtils'
import NavigationTabBar from './NavigationTabBar'

context('NavigationTabBar', () => {
  let component: any
  let testInstance: ReactTestInstance
  let emitSpy: Mock
  let navigateSpy: Mock
  const t = jest.fn(() => {})

  let routes = [
    { name: 'Home', key: 'Home-1' },
    { name: 'Claims', key: 'Claims-1' },
    { name: 'Health', key: 'Health-1' },
    { name: 'Profile', key: 'Profile-1' },
  ]

  const initializeTestInstance = (index = 0, routesList = routes) => {
    emitSpy = jest.fn(() => {})
    navigateSpy = jest.fn(() => {})



    act(() => {
      component = renderWithProviders(
        <NavigationTabBar
          state={({ index, routes: routesList } as unknown) as TabNavigationState<ParamListBase>}
          navigation={({ emit: emitSpy, navigate: navigateSpy } as unknown) as NavigationHelpers<ParamListBase, BottomTabNavigationEventMap>}
          translation={t}
      />)
    })

    testInstance = component.root
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  describe('when a tab option is pressed', () => {
    it('should call the navigation emit spy', async () => {
      testInstance.findAllByType(TouchableWithoutFeedback)[0].props.onPress()
      expect(emitSpy).toBeCalled()
    })

    describe('when isFocused is false and navigation emit returns false for defaultPrevented', () => {
      it('should call navigation emit and navigate spy', async () => {
        emitSpy.mockReturnValue({ defaultPrevented: false })
        testInstance.findAllByType(TouchableWithoutFeedback)[1].props.onPress()
        expect(emitSpy).toBeCalled()
        expect(navigateSpy).toBeCalled()
      })
    })
  })

  describe('when a tab option is long pressed', () => {
    it('should call the navigation emit spy', async () => {
      testInstance.findAllByType(TouchableWithoutFeedback)[0].props.onLongPress()
      expect(emitSpy).toBeCalled()
    })
  })

  describe('when the focused tab name is Home', () => {
    it('should return the Home Selected component', async () => {

      const homeSelected = testInstance.findByProps({ id: 'homeSelected' })
      expect(homeSelected).toBeTruthy()
    })
  })

  describe('when the focused tab name is Claims', () => {
    it('should return the Claims Selected component', async () => {
      initializeTestInstance(1)
      const claimsSelected = testInstance.findByProps({ id: 'claimsSelected' })
      expect(claimsSelected).toBeTruthy()
    })
  })

  describe('when the focused tab name is Health', () => {
    it('should return the Health Selected component', async () => {
      initializeTestInstance(2)
      const appointmentsSelected = testInstance.findByProps({ id: 'healthSelected' })
      expect(appointmentsSelected).toBeTruthy()
    })
  })

  describe('when the focused tab name is Profile', () => {
    it('should return the Profile Selected component', async () => {
      initializeTestInstance(3)
      const profileSelected = testInstance.findByProps({ id: 'profileSelected' })
      expect(profileSelected).toBeTruthy()
    })
  })

  describe('when the focused tab name does not exist', () => {
    it('should return an empty string for that icon', async () => {
      const updatedRoutes = [
        { name: 'Home', key: 'Home-1' },
        { name: 'Claims', key: 'Claims-1' },
        { name: 'Appointments', key: 'Appointments-1' },
        { name: 'Random field', key: 'Random-1' },
      ]

      initializeTestInstance(3, updatedRoutes)
      const icon = component.toJSON().children[0].children[3].children[0].children[0]
      expect(icon).toBe('')
    })
  })
})
