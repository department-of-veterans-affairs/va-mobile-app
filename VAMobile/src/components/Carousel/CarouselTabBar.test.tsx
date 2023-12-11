import React from 'react'
import { NavigationHelpers, ParamListBase } from '@react-navigation/native'
import { BottomTabNavigationEventMap } from '@react-navigation/bottom-tabs/src/types'
import { context, fireEvent, render, screen } from 'testUtils'
import CarouselTabBar from './CarouselTabBar'
import { CarouselScreen, TextView } from '../index'

context('CarouselTabBar', () => {
  let t = jest.fn(() => { })
  let onCarouselEndSpy = jest.fn()
  let navigationSpy = jest.fn()

  const TestComponent = () => {
    return <TextView>Test Component</TextView>
  }

  const TestComponent2 = () => {
    return <TextView>Test Component2</TextView>
  }

  const listOfScreens: Array<CarouselScreen> = [
    {
      name: 'TestComponent',
      component: TestComponent,
      a11yHints: {
        skipHint: 'skip',
        continueHint: 'next',
        doneHint: 'done',
        backHint: 'back'
      }
    },
    {
      name: 'TestComponent2',
      component: TestComponent2,
      a11yHints: {
        skipHint: 'skip',
        continueHint: 'next',
        doneHint: 'done',
        backHint: 'back'
      }
    },
  ]

  const singleScreen: Array<CarouselScreen> = [{
    name: 'TestComponent',
    component: TestComponent,
    a11yHints: {
      skipHint: 'skip',
      continueHint: 'next',
      doneHint: 'done',
      backHint: 'back'
    }
  }]

  const initializeTestInstance = (screenList: Array<CarouselScreen>) => {
    render(
      <CarouselTabBar
        screenList={screenList}
        onCarouselEnd={onCarouselEndSpy}
        translation={t}
        navigation={{ navigate: navigationSpy } as unknown as NavigationHelpers<ParamListBase, BottomTabNavigationEventMap>}
      />,
    )
  }

  beforeEach(() => {
    initializeTestInstance(listOfScreens)
  })

  describe('the user should be able to navigate forward and backward', () => {
    it('should navigate to the next screen and back to the previous screen', () => {
      // clicking the next button
      fireEvent.press(screen.getByAccessibilityHint('next'))
      expect(navigationSpy).toHaveBeenCalled()
      expect(navigationSpy).toHaveBeenCalledWith('TestComponent2')

      //clicking the back button
      fireEvent.press(screen.getByAccessibilityHint('back'))
      expect(navigationSpy).toHaveBeenCalled()
      expect(navigationSpy).toHaveBeenCalledWith('TestComponent')
    })

    describe('on click of done', () => {
      it('should call onCarouselEnd', () => {
        initializeTestInstance(singleScreen)
        fireEvent.press(screen.getByAccessibilityHint('done'))
        expect(onCarouselEndSpy).toHaveBeenCalled()
      })
    })
  })

  describe('on click of skip', () => {
    it('should call onCarouselEnd', () => {
      fireEvent.press(screen.getByAccessibilityHint('skip'))
      expect(onCarouselEndSpy).toHaveBeenCalled()
    })
  })
})
