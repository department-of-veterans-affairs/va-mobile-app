import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance, act } from 'react-test-renderer'
import {Pressable} from 'react-native'
import Mock = jest.Mock

import { context, renderWithProviders } from 'testUtils'
import VAButton, {ButtonTypesConstants} from './VAButton'
import Box from './Box'
import TextView from './TextView'

context('VAButton', () => {
  let component: any
  let testInstance: ReactTestInstance
  let onPressSpy: Mock

  const initializeTestInstance = (disabled?: boolean, buttonType = ButtonTypesConstants.buttonPrimary): void => {
    onPressSpy = jest.fn(() => {})

    act(() => {
      component = renderWithProviders(<VAButton label={'my bytton'} onPress={onPressSpy} buttonType={buttonType} disabled={disabled} />)
    })
    testInstance = component.root
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  it('should call onChange', async () => {
    testInstance.findByType(VAButton).props.onPress()
    expect(onPressSpy).toBeCalled()
  })

  describe('when disabled is true', () => {
    it('should set the text color to "buttonDisabled"', async () => {
      initializeTestInstance(true)
      expect(testInstance.findByType(TextView).props.color).toEqual('buttonDisabled')
    })

    it('should set the background color to "buttonDisabled"', async () => {
      initializeTestInstance(true)
      expect(testInstance.findByType(Box).props.backgroundColor).toEqual('buttonDisabled')
    })

    it('should set the border color to "undefined"', async () => {
      initializeTestInstance(true)
      expect(testInstance.findByType(Box).props.borderColor).toEqual(undefined)
    })
  })

  describe('when disabled is false', () => {
    describe('when the button type is buttonPrimary', () => {
      it('should set the text color to buttonPrimary', async () => {
        initializeTestInstance(false)
        expect(testInstance.findByType(TextView).props.color).toEqual('buttonPrimary')
      })

      it('should set the background color to buttonPrimary', async () => {
        initializeTestInstance(false)
        expect(testInstance.findByType(Box).props.backgroundColor).toEqual('buttonPrimary')
      })

      it('should set the border color to undefined', async () => {
        initializeTestInstance(false)
        expect(testInstance.findByType(Box).props.borderColor).toEqual(undefined)
      })

      describe('when the button is pressed in', () => {
        it('should set the backgroundColor to buttonPrimaryActive', async () => {
          initializeTestInstance(false)
          testInstance.findByType(Pressable).props.onPressIn()
          expect(testInstance.findByType(Box).props.backgroundColor).toEqual('buttonPrimaryActive')
          testInstance.findByType(Pressable).props.onPressOut()
          expect(testInstance.findByType(Box).props.backgroundColor).toEqual('buttonPrimary')
        })
      })
    })

    describe('when the button type is buttonSecondary', () => {
      it('should set the text color to buttonSecondary', async () => {
        initializeTestInstance(false, ButtonTypesConstants.buttonSecondary)
        expect(testInstance.findByType(TextView).props.color).toEqual('buttonSecondary')
      })

      it('should set the background color to buttonSecondary', async () => {
        initializeTestInstance(false, ButtonTypesConstants.buttonSecondary)
        expect(testInstance.findByType(Box).props.backgroundColor).toEqual('buttonSecondary')
      })

      it('should set the border color to buttonSecondary', async () => {
        initializeTestInstance(false, ButtonTypesConstants.buttonSecondary)
        expect(testInstance.findByType(Box).props.borderColor).toEqual('buttonSecondary')
      })

      describe('when the button is pressed in', () => {
        it('should set the backgroundColor to buttonSecondaryActive', async () => {
          initializeTestInstance(false, ButtonTypesConstants.buttonSecondary)
          testInstance.findByType(Pressable).props.onPressIn()
          expect(testInstance.findByType(Box).props.backgroundColor).toEqual('buttonSecondaryActive')
          testInstance.findByType(Pressable).props.onPressOut()
          expect(testInstance.findByType(Box).props.backgroundColor).toEqual('buttonSecondary')
        })
      })
    })
  })
})
