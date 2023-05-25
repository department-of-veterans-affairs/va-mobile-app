import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance } from 'react-test-renderer'
import { TouchableWithoutFeedback } from 'react-native'
import Mock = jest.Mock

import { context, render, RenderAPI, waitFor } from 'testUtils'
import { TextView, VAButton } from 'components'
import FullScreenSubtask from './FullScreenSubtask'
import VAIcon, { VAIconProps } from 'components/VAIcon'

context('FullScreenSubtask', () => {
  let component: RenderAPI
  let testInstance: ReactTestInstance
  let onPressSpy: Mock

  const initializeTestInstance = (
    titleText?: string,
    leftButtonText?: string,
    rightButtonText?: string,
    rightVAIconProps?: VAIconProps,
    primaryContentButtonText?: string,
    onPrimaryButtonPress?: () => void,
    secondaryContentButtonText?: string,
    onSecondaryButtonPress?: () => void,
  ): void => {
    onPressSpy = jest.fn(() => {})

    component = render(
      <FullScreenSubtask
        title={titleText}
        leftButtonText={leftButtonText}
        rightButtonText={rightButtonText}
        rightVAIconProps={rightVAIconProps}
        primaryContentButtonText={primaryContentButtonText}
        onPrimaryContentButtonPress={onPrimaryButtonPress}
        secondaryContentButtonText={secondaryContentButtonText}
        onSecondaryContentButtonPress={onSecondaryButtonPress}
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
      const pressable = testInstance.findAllByType(TouchableWithoutFeedback)
      expect(pressable.length).toEqual(0)
    })
    it('should be there when text is added', async () => {
      initializeTestInstance(undefined, 'cancel')
      const pressable = testInstance.findAllByType(TouchableWithoutFeedback)
      expect(pressable.length).toEqual(1)
      const textViews = testInstance.findAllByType(TextView)
      expect(textViews.length).toEqual(1)
      expect(textViews[0].props.children).toEqual('cancel')
    })
  })

  describe('right banner button', () => {
    it('should not be there', async () => {
      const pressable = testInstance.findAllByType(TouchableWithoutFeedback)
      expect(pressable.length).toEqual(0)
    })
    it('should be there when text is added', async () => {
      initializeTestInstance(undefined, undefined, 'done')
      const pressable = testInstance.findAllByType(TouchableWithoutFeedback)
      expect(pressable.length).toEqual(1)
      const textViews = testInstance.findAllByType(TextView)
      expect(textViews.length).toEqual(1)
      expect(textViews[0].props.children).toEqual('done')
    })
    it('should not have an icon when only text is supplied', async () => {
      initializeTestInstance(undefined, undefined, 'done', undefined)
      const icon = testInstance.findAllByType(VAIcon)
      expect(icon.length).toEqual(0)
    })
    it('should not have an icon when no text is supplied', async () => {
      const rightIconProps: VAIconProps = {
        name: 'ProfileSelected',
        fill: 'largeNav',
        height: 22,
        width: 22,
      }
      initializeTestInstance(undefined, undefined, undefined, rightIconProps)
      const icon = testInstance.findAllByType(VAIcon)
      expect(icon.length).toEqual(0)
    })
    it('should have an icon w/ text button when both text and icon props are supplied', async () => {
      const rightIconProps: VAIconProps = {
        name: 'ProfileSelected',
        fill: 'largeNav',
        height: 22,
        width: 22,
      }
      initializeTestInstance(undefined, undefined, 'done', rightIconProps)
      const icon = testInstance.findAllByType(VAIcon)
      expect(icon.length).toEqual(1)
    })
  })
  describe('primary content button', () => {
    it('should not be there', async () => {
      const contentButtons = testInstance.findAllByType(VAButton)
      expect(contentButtons.length).toEqual(0)
    })
    it('should not be there when only text is added', async () => {
      initializeTestInstance(undefined, undefined, undefined, undefined, 'Primary')
      const contentButtons = testInstance.findAllByType(VAButton)
      expect(contentButtons.length).toEqual(0)
    })

    it('should not be there when only onPress is added', async () => {
      initializeTestInstance(undefined, undefined, undefined, undefined, undefined, onPressSpy)
      const contentButtons = testInstance.findAllByType(VAButton)
      expect(contentButtons.length).toEqual(0)
    })

    it('should be there when onPress and text is added', async () => {
      initializeTestInstance(undefined, undefined, undefined, undefined, 'Primary', onPressSpy)
      const contentButtons = testInstance.findAllByType(VAButton)
      expect(contentButtons.length).toEqual(1)
    })
  })
  describe('secondary content button', () => {
    it('should not be there', async () => {
      const contentButtons = testInstance.findAllByType(VAButton)
      expect(contentButtons.length).toEqual(0)
    })
    it('should not be there when only text is added', async () => {
      initializeTestInstance(undefined, undefined, undefined, undefined, undefined, undefined, 'Secondary')
      const contentButtons = testInstance.findAllByType(VAButton)
      expect(contentButtons.length).toEqual(0)
    })

    it('should not be there when only onPress is added', async () => {
      initializeTestInstance(undefined, undefined, undefined, undefined, undefined, undefined, undefined, onPressSpy)
      const contentButtons = testInstance.findAllByType(VAButton)
      expect(contentButtons.length).toEqual(0)
    })

    it('should not be there when onPress and text is added and primary button is not present', async () => {
      initializeTestInstance(undefined, undefined, undefined, undefined, undefined, undefined, 'Secondary', onPressSpy)
      const contentButtons = testInstance.findAllByType(VAButton)
      expect(contentButtons.length).toEqual(0)
    })
    it('should be there when onPress and text is added and primary button is present', async () => {
      initializeTestInstance(undefined, undefined, undefined, undefined, 'Primary', onPressSpy, 'Secondary', onPressSpy)
      const contentButtons = testInstance.findAllByType(VAButton)
      expect(contentButtons.length).toEqual(2)
    })
  })
})
