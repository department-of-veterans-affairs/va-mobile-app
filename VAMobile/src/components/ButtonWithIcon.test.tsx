import 'react-native'
import React from 'react'
import { ReactTestInstance } from 'react-test-renderer'
import Mock = jest.Mock
import { Pressable } from 'react-native'

import { context, render, RenderAPI, waitFor } from 'testUtils'
import Box, { BackgroundVariant, BorderColorVariant } from './Box'
import ButtonWithIcon from './ButtonWithIcon'
import TextView from './TextView'
import VAIcon from './VAIcon'

context('ButtonWithIcon', () => {
  let component: RenderAPI
  let testInstance: ReactTestInstance
  let onPressSpy: Mock

  const initializeTestInstance = (
    borderColorActive?: BorderColorVariant,
    backgroundColorActive?: BackgroundVariant,
    borderColor?: BorderColorVariant,
    backgroundColor?: BackgroundVariant,
  ): void => {
    onPressSpy = jest.fn(() => {})

    component = render(
      <ButtonWithIcon
        a11yHint={'a11y'}
        onPress={onPressSpy}
        borderColor={borderColor}
        backgroundColor={backgroundColor}
        borderColorActive={borderColorActive}
        backgroundColorActive={backgroundColorActive}
        buttonText={'My Text'}
        iconName={'PaperClip'}
      />,
    )

    testInstance = component.container
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
    expect(testInstance.findAllByType(TextView)[0].props.children).toEqual('My Text')
    const icons = testInstance.findAllByType(VAIcon)
    expect(icons[0].props).toEqual({ name: 'PaperClip', fill: 'buttonWithIcon', height: 24, width: 24 })
    expect(icons[1].props).toEqual({ name: 'ArrowRight', fill: 'largeNav', height: 16, width: 16 })
  })

  it('should call onPress', async () => {
    await waitFor(() => {
      testInstance.findByType(Pressable).props.onPress()
      expect(onPressSpy).toBeCalled()
    })
  })

  describe('when the button is pressed', () => {
    it('should set the border color default color if borderColorActive was not set', async () => {
      initializeTestInstance()
      await waitFor(() => {
        testInstance.findByType(Pressable).props.onPressIn()
        expect(testInstance.findByType(Box).props.borderColor).toEqual('#112e52')
      })
    })

    it('should set the border color borderColorActive color if it was set', async () => {
      initializeTestInstance('primary')
      await waitFor(() => {
        testInstance.findByType(Pressable).props.onPressIn()
        expect(testInstance.findByType(Box).props.borderColor).toEqual('primary')
      })
    })
  })

  describe('when the button is pressed in and backgroundColorActive is set in the props', () => {
    it('should set the background color to backgroundColorActive', async () => {
      initializeTestInstance(undefined, 'buttonPrimaryActive')
      await waitFor(() => {
        testInstance.findByType(Pressable).props.onPressIn()
        expect(testInstance.findByType(Box).props.backgroundColor).toEqual('buttonPrimaryActive')
      })
    })
  })

  describe('when the button is pressed in and then out', () => {
    it('should set backgroundColorActive and borderColorActive on in, and then revert to the given borderColor/backgroundColor', async () => {
      initializeTestInstance('primary', 'buttonPrimaryActive', 'secondary', 'buttonPrimary')
      await waitFor(() => {
        testInstance.findByType(Pressable).props.onPressIn()
        expect(testInstance.findByType(Box).props.borderColor).toEqual('primary')
        expect(testInstance.findByType(Box).props.backgroundColor).toEqual('buttonPrimaryActive')
        testInstance.findByType(Pressable).props.onPressOut()
        expect(testInstance.findByType(Box).props.borderColor).toEqual('secondary')
        expect(testInstance.findByType(Box).props.backgroundColor).toEqual('buttonPrimary')
      })
    })
  })
})
