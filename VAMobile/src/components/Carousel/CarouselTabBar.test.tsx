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
import {CarouselScreen, TextView} from '../index'

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

  const listOfScreens: Array<CarouselScreen>  = [
    { name: 'TestComponent', component: TestComponent },
    { name: 'TestComponent2', component: TestComponent2 }
  ]

  const singleScreen: Array<CarouselScreen>  = [
    { name: 'TestComponent', component: TestComponent }
  ]

  const initializeTestInstance = (screenList: Array<CarouselScreen>) => {
    act(() => {
      component = renderWithProviders(<CarouselTabBar screenList={screenList} onCarouselEnd={onCarouselEndSpy} translation={t} navigation={{ navigate: navigationSpy } as unknown as NavigationHelpers<ParamListBase, BottomTabNavigationEventMap>} />)
    })
    testInstance = component.root
  }

  beforeEach(() => {
    initializeTestInstance(listOfScreens)
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  describe('on click of continue', () => {
    it('should call navigation navigate', async () => {
      testInstance.findAllByType(Pressable)[1].props.onPress()
      expect(navigationSpy).toHaveBeenCalled()
      expect(navigationSpy).toHaveBeenCalledWith('TestComponent2')
    })
  })

  describe('when the user is on the last screen', () => {
    it('should hide the skip button', async () => {
      initializeTestInstance(singleScreen)
      const allButtons = testInstance.findAllByType(Pressable)
      expect(allButtons.length).toEqual(1)
    })

    describe('on click of done', () => {
      it('should call onCarouselEnd', async () => {
        initializeTestInstance(singleScreen)
        testInstance.findAllByType(Pressable)[0].props.onPress()
        expect(onCarouselEndSpy).toHaveBeenCalled()
      })
    })
  })

  describe('on click of skip', () => {
    it('should call onCarouselEnd', async () => {
      testInstance.findAllByType(Pressable)[0].props.onPress()
      expect(onCarouselEndSpy).toHaveBeenCalled()
    })
  })
})
