import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance, act } from 'react-test-renderer'
import {Pressable} from 'react-native'

import { NavigationHelpers, ParamListBase, TabNavigationState } from '@react-navigation/native'
import {BottomTabNavigationEventMap} from '@react-navigation/bottom-tabs/src/types'

import { context, renderWithProviders } from 'testUtils'
import CarouselTabBar from './CarouselTabBar'
import {TextView} from './index'


context('CarouselTabBar', () => {
  let component: any
  let testInstance: ReactTestInstance
  let t = jest.fn(() => {})
  let onCarouselEndSpy = jest.fn()
  let navigationSpy = jest.fn()

  const TestComponent = () => {
    return <TextView>Test Component</TextView>
  }

  const TestComponent2 = () => {
    return <TextView>Test Component2</TextView>
  }

  beforeEach(() => {
    const screenList = [
      { name: 'TestComponent', component: TestComponent },
      { name: 'TestComponent2', component: TestComponent2 }
    ]

    act(() => {
      component = renderWithProviders(<CarouselTabBar screenList={screenList} onCarouselEnd={onCarouselEndSpy} translation={t} navigation={{ navigate: navigationSpy } as unknown as NavigationHelpers<ParamListBase, BottomTabNavigationEventMap>} />)
    })
    testInstance = component.root
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  describe('on click of continue', () => {
    describe('when the user is on the last screen', () => {
      it('should call onCarouselEnd', async () => {
        testInstance.findAllByType(Pressable)[1].props.onPress()
        expect(onCarouselEndSpy).not.toHaveBeenCalled()
        testInstance.findAllByType(Pressable)[1].props.onPress()
        expect(onCarouselEndSpy).not.toHaveBeenCalled()
        testInstance.findAllByType(Pressable)[1].props.onPress()
        expect(onCarouselEndSpy).toHaveBeenCalled()
      })
    })

    it('should call navigation navigate', async () => {
      testInstance.findAllByType(Pressable)[1].props.onPress()
      expect(navigationSpy).toHaveBeenCalled()
      expect(navigationSpy).toHaveBeenCalledWith('TestComponent2')
    })
  })

  describe('on click of skip', () => {
    it('should call onCarouselEnd', async () => {
      testInstance.findAllByType(Pressable)[0].props.onPress()
      expect(onCarouselEndSpy).toHaveBeenCalled()
    })
  })
})
