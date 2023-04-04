import 'react-native'
import { BottomTabNavigationEventMap } from '@react-navigation/bottom-tabs/src/types'
import { NavigationHelpers, ParamListBase, TabNavigationState } from '@react-navigation/native'
import { TouchableWithoutFeedback } from 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance } from 'react-test-renderer'
import Mock = jest.Mock

import { context, render, waitFor } from 'testUtils'
import NavigationTabBar from './NavigationTabBar'

context('NavigationTabBar', () => {
  let component: any
  let testInstance: ReactTestInstance
  let emitSpy: Mock
  let navigateSpy: Mock
  const t = jest.fn(() => {})

  let routes = [
    { name: 'Home', key: 'Home-1' },
    { name: 'Benefits', key: 'Benefits-1' },
    { name: 'Health', key: 'Health-1' },
    { name: 'Payments', key: 'Payments-1' },
  ]

  const initializeTestInstance = (index = 0, routesList = routes) => {
    emitSpy = jest.fn(() => {})
    navigateSpy = jest.fn(() => {})

    component = render(
      <NavigationTabBar
        state={{ index, routes: routesList } as unknown as TabNavigationState<ParamListBase>}
        navigation={{ emit: emitSpy, navigate: navigateSpy } as unknown as NavigationHelpers<ParamListBase, BottomTabNavigationEventMap>}
        translation={t}
      />,
    )

    testInstance = component.container
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  describe('when a tab option is pressed', () => {
    it('should call the navigation emit spy', async () => {
      await waitFor(() => {
        testInstance.findAllByType(TouchableWithoutFeedback)[0].props.onPress()
        expect(emitSpy).toBeCalled()
      })
    })

    describe('when isFocused is false and navigation emit returns false for defaultPrevented', () => {
      it('should call navigation emit and navigate spy', async () => {
        await waitFor(() => {
          emitSpy.mockReturnValue({ defaultPrevented: false })
          testInstance.findAllByType(TouchableWithoutFeedback)[1].props.onPress()
          expect(emitSpy).toBeCalled()
          expect(navigateSpy).toBeCalled()
        })
      })
    })
  })

  describe('when a tab option is long pressed', () => {
    it('should call the navigation emit spy', async () => {
      await waitFor(() => {
        testInstance.findAllByType(TouchableWithoutFeedback)[0].props.onLongPress()
        expect(emitSpy).toBeCalled()
      })
    })
  })

  describe('when the focused tab name is Home', () => {
    it('should return the Home Selected component', async () => {
      const homeSelected = testInstance.findByProps({ id: 'homeSelected' })
      expect(homeSelected).toBeTruthy()
    })
  })

  describe('when the focused tab name is Benefits', () => {
    it('should return the Benefits Selected component', async () => {
      initializeTestInstance(1)
      const benefitsSelected = testInstance.findByProps({ id: 'benefitsSelected' })
      expect(benefitsSelected).toBeTruthy()
    })
  })

  describe('when the focused tab name is Health', () => {
    it('should return the Health Selected component', async () => {
      initializeTestInstance(2)
      const appointmentsSelected = testInstance.findByProps({ id: 'healthSelected' })
      expect(appointmentsSelected).toBeTruthy()
    })
  })

  describe('when the focused tab name is Payments', () => {
    it('should return the Payments Selected component', async () => {
      initializeTestInstance(3)
      const paymentsSelected = testInstance.findByProps({ id: 'paymentsSelected' })
      expect(paymentsSelected).toBeTruthy()
    })
  })
})
