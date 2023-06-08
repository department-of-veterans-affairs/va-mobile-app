import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance } from 'react-test-renderer'
import { TouchableWithoutFeedback } from 'react-native'
import Mock = jest.Mock

import { context, render, RenderAPI, waitFor } from 'testUtils'
import FooterButton from 'components/FooterButton'
import LargePanel from './LargePanel'
import TextView from 'components/TextView'

context('LargePanel', () => {
  let component: RenderAPI
  let testInstance: ReactTestInstance
  let onPressSpy: Mock

  const initializeTestInstance = (titleText?: string, leftButtonText?: string, rightButtonText?: string, footerButtonText?: string, onFooterButtonPress?: () => void): void => {
    onPressSpy = jest.fn(() => {})

    component = render(
      <LargePanel
        title={titleText}
        leftButtonText={leftButtonText}
        rightButtonText={rightButtonText}
        footerButtonText={footerButtonText}
        onFooterButtonPress={onFooterButtonPress}
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
      const button = testInstance.findAllByType(TouchableWithoutFeedback)
      expect(button.length).toEqual(0)
    })
    it('should be there when text is added', async () => {
      initializeTestInstance(undefined, 'cancel')
      const button = testInstance.findAllByType(TouchableWithoutFeedback)
      expect(button.length).toEqual(1)
      const textViews = testInstance.findAllByType(TextView)
      expect(textViews.length).toEqual(1)
      expect(textViews[0].props.children).toEqual('cancel')
    })
  })

  describe('right banner button', () => {
    it('should not be there', async () => {
      const button = testInstance.findAllByType(TouchableWithoutFeedback)
      expect(button.length).toEqual(0)
    })
    it('should be there when text is added', async () => {
      initializeTestInstance(undefined, undefined, 'done')
      const button = testInstance.findAllByType(TouchableWithoutFeedback)
      expect(button.length).toEqual(1)
      const textViews = testInstance.findAllByType(TextView)
      expect(textViews.length).toEqual(1)
      expect(textViews[0].props.children).toEqual('done')
    })
  })

  describe('footer button', () => {
    it('should not be there', async () => {
      const footerButton = testInstance.findAllByType(FooterButton)
      expect(footerButton.length).toEqual(0)
    })
    it('should not be there when text is added', async () => {
      initializeTestInstance(undefined, undefined, undefined, 'footer')
      const footerButton = testInstance.findAllByType(FooterButton)
      expect(footerButton.length).toEqual(0)
    })

    it('should not be there when onPress is added', async () => {
      initializeTestInstance(undefined, undefined, undefined, undefined, onPressSpy)
      const footerButton = testInstance.findAllByType(FooterButton)
      expect(footerButton.length).toEqual(0)
    })

    it('should be there when onPress and text is added', async () => {
      initializeTestInstance(undefined, undefined, undefined, 'footer', onPressSpy)
      const footerButton = testInstance.findAllByType(FooterButton)
      expect(footerButton.length).toEqual(1)
    })
  })
})
