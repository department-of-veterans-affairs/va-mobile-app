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
import VAIconWithText from './VAIconWithText/VAIconWithText'

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

    testInstance = component.UNSAFE_root
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

  describe('when the focused tab is Home', () => {
    it('should activate the Home icon', async () => {
      const homeIcon = testInstance.findAllByType(VAIconWithText)[0]
      expect(homeIcon.props.fill).toBe('active')
    })
  })

  describe('when the focused tab is Benefits', () => {
    it('should activate the Benefits icon', async () => {
      initializeTestInstance(1)
      const benefitsIcon = testInstance.findAllByType(VAIconWithText)[1]
      expect(benefitsIcon.props.fill).toBe('active')
    })
  })

  describe('when the focused tab is Health', () => {
    it('should activate the Health icon', async () => {
      initializeTestInstance(2)
      const healthIcon = testInstance.findAllByType(VAIconWithText)[2]
      expect(healthIcon.props.fill).toBe('active')
    })
  })

  describe('when the focused tab is Payments', () => {
    it('should activate the Payments icon', async () => {
      initializeTestInstance(3)
      const paymentsIcon = testInstance.findAllByType(VAIconWithText)[3]
      expect(paymentsIcon.props.fill).toBe('active')
    })
  })
})
