import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance } from 'react-test-renderer'
import { Pressable } from 'react-native'

import { NavigationHelpers, ParamListBase } from '@react-navigation/native'
import { BottomTabNavigationEventMap } from '@react-navigation/bottom-tabs/src/types'

import { context, render, RenderAPI, waitFor } from 'testUtils'
import CarouselTabBar from './CarouselTabBar'
import { CarouselScreen, TextView } from '../index'

context('CarouselTabBar', () => {
  let component: RenderAPI
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

  const listOfScreens: Array<CarouselScreen> = [
    { name: 'TestComponent', component: TestComponent },
    { name: 'TestComponent2', component: TestComponent2 },
  ]

  const singleScreen: Array<CarouselScreen> = [{ name: 'TestComponent', component: TestComponent }]

  const initializeTestInstance = (screenList: Array<CarouselScreen>) => {
    component = render(
      <CarouselTabBar
        screenList={screenList}
        onCarouselEnd={onCarouselEndSpy}
        translation={t}
        navigation={{ navigate: navigationSpy } as unknown as NavigationHelpers<ParamListBase, BottomTabNavigationEventMap>}
      />,
    )
    testInstance = component.UNSAFE_root
  }

  beforeEach(() => {
    initializeTestInstance(listOfScreens)
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  describe('the user should be able to navigate forward and backward', () => {
    it('should navigate to the next screen and back to the previous screen', async () => {
      // clicking the next button
      await waitFor(() => {
        testInstance.findAllByType(Pressable)[1].props.onPress()
      })
      expect(navigationSpy).toHaveBeenCalled()
      expect(navigationSpy).toHaveBeenCalledWith('TestComponent2')

      //clicking the back button
      await waitFor(() => {
        testInstance.findAllByType(Pressable)[0].props.onPress()
      })
      expect(navigationSpy).toHaveBeenCalled()
      expect(navigationSpy).toHaveBeenCalledWith('TestComponent')
    })

    describe('on click of done', () => {
      it('should call onCarouselEnd', async () => {
        initializeTestInstance(singleScreen)
        await waitFor(() => {
          testInstance.findAllByType(Pressable)[0].props.onPress()
        })
        expect(onCarouselEndSpy).toHaveBeenCalled()
      })
    })
  })

  describe('on click of skip', () => {
    it('should call onCarouselEnd', async () => {
      await waitFor(() => {
        testInstance.findAllByType(Pressable)[0].props.onPress()
      })
      expect(onCarouselEndSpy).toHaveBeenCalled()
    })
  })
})
