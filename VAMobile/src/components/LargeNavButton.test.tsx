import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance, ReactTestRenderer, act } from 'react-test-renderer'
import Mock = jest.Mock

import {context, findByTestID, renderWithProviders} from 'testUtils'
import LargeNavButton from './LargeNavButton'
import {BackgroundVariant, BorderColorVariant, Box} from './index'
import {Pressable} from 'react-native'
import TextView from "./TextView";

context('LargeNavButton', () => {
  let component: ReactTestRenderer
  let testInstance: ReactTestInstance
  let onPressSpy: Mock

  const initializeTestInstance = (borderColorActive?: BorderColorVariant, backgroundColorActive?: BackgroundVariant, borderColor?: BorderColorVariant, backgroundColor?: BackgroundVariant): void => {
    onPressSpy = jest.fn(() => {})
    act(() => {
      component = renderWithProviders( <LargeNavButton title={'My Title'} subText={'My Subtext'} tagCount={45} a11yHint={'a11y'} onPress={onPressSpy} borderColor={borderColor} backgroundColor={backgroundColor} borderColorActive={borderColorActive} backgroundColorActive={backgroundColorActive} />)
    })
    testInstance = component.root
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()


    expect(testInstance.findAllByType(TextView)[0].props.children).toEqual('My Title')
    expect(testInstance.findAllByType(TextView)[1].props.children).toEqual(45)
    expect(testInstance.findAllByType(TextView)[2].props.children).toEqual('My Subtext')

  })

  it('should call onPress', async () => {
    testInstance.findByType(Pressable).props.onPress()
    expect(onPressSpy).toBeCalled()
  })

  describe('when the button is pressed in and borderColorActive is set in the props', () => {
    it('should set the border color to borderColorActive', async () => {
      initializeTestInstance('primary')
      testInstance.findByType(Pressable).props.onPressIn()
      expect(testInstance.findByType(Box).props.borderColor).toEqual('primary')
    })
  })

  describe('when the button is pressed in and backgroundColorActive is set in the props', () => {
    it('should set the background color to backgroundColorActive', async () => {
      initializeTestInstance(undefined, 'buttonPrimaryActive')
      testInstance.findByType(Pressable).props.onPressIn()
      expect(testInstance.findByType(Box).props.backgroundColor).toEqual('buttonPrimaryActive')
    })
  })

  describe('when the button is pressed in and then out', () => {
    it('should set backgroundColorActive and borderColorActive on in, and then revert to the given borderColor/backgroundColor', async () => {
      initializeTestInstance('primary', 'buttonPrimaryActive', 'secondary', 'buttonPrimary')
      testInstance.findByType(Pressable).props.onPressIn()
      expect(testInstance.findByType(Box).props.borderColor).toEqual('primary')
      expect(testInstance.findByType(Box).props.backgroundColor).toEqual('buttonPrimaryActive')
      testInstance.findByType(Pressable).props.onPressOut()
      expect(testInstance.findByType(Box).props.borderColor).toEqual('secondary')
      expect(testInstance.findByType(Box).props.backgroundColor).toEqual('buttonPrimary')
    })
  })
})
