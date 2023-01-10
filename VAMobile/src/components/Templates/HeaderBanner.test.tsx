import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance } from 'react-test-renderer'
import { TouchableWithoutFeedback } from 'react-native'
import Mock = jest.Mock

import { context, render, RenderAPI } from 'testUtils'
import { TextView } from 'components'
import VAIcon, { VAIconProps } from 'components/VAIcon'
import HeaderBanner from './HeaderBanner'

context('HeaderBanner', () => {
  let component: RenderAPI
  let testInstance: ReactTestInstance
  let onPressSpy: Mock

  const initializeTestInstance = (titleText?:string ,leftButtonText?:string, onLeftTitleButtonPress?:() => void, leftVAIconProps?:VAIconProps, rightButtonText?:string, onRightTitleButtonPress?:() => void, rightVAIconProps?:VAIconProps): void => {
    onPressSpy = jest.fn(() => {})

    component = render(
      <HeaderBanner title={titleText} leftButtonText={leftButtonText} onLeftTitleButtonPress={onLeftTitleButtonPress} leftVAIconProps={leftVAIconProps} rightButtonText={rightButtonText} onRightTitleButtonPress={onRightTitleButtonPress} rightVAIconProps={rightVAIconProps}
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
    it('should not be there when text only is added', async () => {
        initializeTestInstance(undefined, 'cancel')
        const leftButton = testInstance.findAllByType(TouchableWithoutFeedback)
        expect(leftButton.length).toEqual(0) 
    })
    it('should not be there when on press only is added', async () => {
        initializeTestInstance(undefined, undefined, onPressSpy)
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
    it('should not have an icon when only text and on press is added', async () => {
        initializeTestInstance(undefined, 'done', onPressSpy)
        const icon = testInstance.findAllByType(VAIcon)
        expect(icon.length).toEqual(0) 
    })
    it('should have an icon w/ text button when text, onpress, and icon props are supplied', async () => {
        const leftIconProps: VAIconProps = {
            name: 'ProfileSelected',
            fill: 'largeNav',
            height: 22,
            width: 22,
        }
        initializeTestInstance(undefined, 'done', onPressSpy, leftIconProps)
        const icon = testInstance.findAllByType(VAIcon)
        expect(icon.length).toEqual(1) 
    })
  })

  describe('right banner button', () => {
    it('should not be there', async () => {
        const rightButton = testInstance.findAllByType(TouchableWithoutFeedback)
        expect(rightButton.length).toEqual(0) 
    })
    it('should not be there when text only is added', async () => {
        initializeTestInstance(undefined, undefined, undefined, undefined, 'done')
        const rightButton = testInstance.findAllByType(TouchableWithoutFeedback)
        expect(rightButton.length).toEqual(0) 
    })
    it('should not be there when onpress only is added', async () => {
        initializeTestInstance(undefined, undefined, undefined, undefined, undefined, onPressSpy)
        const rightButton = testInstance.findAllByType(TouchableWithoutFeedback)
        expect(rightButton.length).toEqual(0) 
    })
    it('should be there when text and onpress is added', async () => {
        initializeTestInstance(undefined, undefined, undefined, undefined, 'done', onPressSpy)
        const rightButton = testInstance.findAllByType(TouchableWithoutFeedback)
        expect(rightButton.length).toEqual(1) 
        const textViews = testInstance.findAllByType(TextView)
        expect(textViews.length).toEqual(1) 
        expect(textViews[0].props.children).toEqual('done')
    })
    it('should not have an icon when only text and on press is supplied', async () => {
        initializeTestInstance(undefined, undefined, undefined, undefined, 'done', onPressSpy)
        const icon = testInstance.findAllByType(VAIcon)
        expect(icon.length).toEqual(0) 
    })
    it('should have an icon w/ text button when text, onpress, and icon props are supplied', async () => {
        const rightIconProps: VAIconProps = {
            name: 'ProfileSelected',
            fill: 'largeNav',
            height: 22,
            width: 22,
        }
        initializeTestInstance(undefined, undefined, undefined, undefined, 'done', onPressSpy, rightIconProps)
        const icon = testInstance.findAllByType(VAIcon)
        expect(icon.length).toEqual(1) 
    })
  })
})