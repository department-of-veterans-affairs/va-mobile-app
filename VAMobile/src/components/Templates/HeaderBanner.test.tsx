import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance } from 'react-test-renderer'
import { TouchableWithoutFeedback } from 'react-native'
import Mock = jest.Mock

import { context, render, RenderAPI } from 'testUtils'
import { TextView, VAIconWithText, VAIconWithTextProps } from 'components'
import HeaderBanner, { HeaderLeftButtonProps, HeaderRightButtonProps, HeaderStaticTitleProps } from './HeaderBanner'

context('HeaderBanner', () => {
  let component: RenderAPI
  let testInstance: ReactTestInstance
  let onPressSpy: Mock

  const initializeTestInstance = (
    titleText?: string,
    leftButtonText?: string,
    onLeftTitleButtonPress?: () => void,
    rightButtonText?: string,
    onRightTitleButtonPress?: () => void,
    rightVAIconProps?: VAIconWithTextProps,
  ): void => {
    onPressSpy = jest.fn(() => {})

    let leftButton: HeaderLeftButtonProps | undefined = undefined
    if (leftButtonText && onLeftTitleButtonPress) {
      leftButton = { text: leftButtonText, onPress: onLeftTitleButtonPress }
    }
    const title: HeaderStaticTitleProps | undefined = titleText ? { type: 'Static', title: titleText } : undefined
    let rightButton: HeaderRightButtonProps | undefined = undefined
    if (onRightTitleButtonPress) {
      if (rightVAIconProps) {
        rightButton = { onPress: onRightTitleButtonPress, icon: rightVAIconProps }
      } else {
        rightButton = { text: rightButtonText, onPress: onRightTitleButtonPress }
      }
    }

    component = render(<HeaderBanner leftButton={leftButton} title={title} rightButton={rightButton} />)

    testInstance = component.container
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  describe('title', () => {
    it('should not be there', async () => {
      const textViews = testInstance.findAllByType(TextView)
      expect(textViews.length).toEqual(0)
    })
    it('should be there when title added', async () => {
      initializeTestInstance('test')
      const textViews = testInstance.findAllByType(TextView)
      expect(textViews.length).toEqual(1)
      expect(textViews[0].props.children).toEqual('test')
    })
  })
  describe('left banner button', () => {
    it('should not be there', async () => {
      const leftButton = testInstance.findAllByType(TouchableWithoutFeedback)
      expect(leftButton.length).toEqual(0)
    })
    it('should be there when text and on press is added', async () => {
      initializeTestInstance(undefined, 'cancel', onPressSpy)
      const leftButton = testInstance.findAllByType(TouchableWithoutFeedback)
      expect(leftButton.length).toEqual(1)
      const textViews = testInstance.findAllByType(TextView)
      expect(textViews.length).toEqual(1)
      expect(textViews[0].props.children).toEqual('cancel')
    })
  })

  describe('right banner button', () => {
    it('should not be there', async () => {
      const rightButton = testInstance.findAllByType(TouchableWithoutFeedback)
      expect(rightButton.length).toEqual(0)
    })
    it('should be there when text and onpress is added', async () => {
      initializeTestInstance(undefined, undefined, undefined, 'done', onPressSpy)
      const rightButton = testInstance.findAllByType(TouchableWithoutFeedback)
      expect(rightButton.length).toEqual(1)
      const textViews = testInstance.findAllByType(TextView)
      expect(textViews.length).toEqual(1)
      expect(textViews[0].props.children).toEqual('done')
    })
    it('should not have an icon when only text and on press is supplied', async () => {
      initializeTestInstance(undefined, undefined, undefined, 'done', onPressSpy)
      const icon = testInstance.findAllByType(VAIconWithText)
      expect(icon.length).toEqual(0)
    })
    it('should have an icon w/ text button when onpress and icon props are supplied', async () => {
      const rightIconProps: VAIconWithTextProps = {
        name: 'ProfileSelected',
        label: 'Profile',
      }
      initializeTestInstance(undefined, undefined, undefined, undefined, onPressSpy, rightIconProps)
      const icon = testInstance.findAllByType(VAIconWithText)
      expect(icon.length).toEqual(1)
    })
  })
})
