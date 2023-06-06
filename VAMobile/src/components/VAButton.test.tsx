import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance } from 'react-test-renderer'
import { Pressable } from 'react-native'
import Mock = jest.Mock

import { context, render, RenderAPI, waitFor } from 'testUtils'
import VAButton, { ButtonTypesConstants } from './VAButton'
import Box from './Box'
import TextView from './TextView'
import VAIcon, { VAIconProps } from './VAIcon'

context('VAButton', () => {
  let component: RenderAPI
  let testInstance: ReactTestInstance
  let onPressSpy: Mock

  const initializeTestInstance = (disabled?: boolean, buttonType = ButtonTypesConstants.buttonPrimary, displayIcon = false): void => {
    onPressSpy = jest.fn(() => {})

    const iconProps: VAIconProps = { name: 'PaperClip', width: 16, height: 18 }

    component = render(
      <VAButton
        iconProps={displayIcon ? iconProps : undefined}
        label={'my button'}
        onPress={onPressSpy}
        buttonType={buttonType}
        disabled={disabled}
        disabledText={'my button instructions'}
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

  it('should call onChange', async () => {
    testInstance.findByType(VAButton).props.onPress()
    expect(onPressSpy).toBeCalled()
  })

  describe('when icon props are passed in', () => {
    it('should render a VAIcon', async () => {
      initializeTestInstance(false, ButtonTypesConstants.buttonPrimary, true)
      expect(testInstance.findAllByType(VAIcon).length).toEqual(1)
    })
  })

  describe('when disabled is true', () => {
    it('should set the text color to "buttonDisabled"', async () => {
      initializeTestInstance(true)
      expect(testInstance.findAllByType(TextView)[0].props.color).toEqual('buttonDisabled')
    })

    it('should set the background color to "buttonDisabled"', async () => {
      initializeTestInstance(true)
      expect(testInstance.findAllByType(Box)[0].props.backgroundColor).toEqual('buttonDisabled')
    })

    it('should set the border color to "undefined"', async () => {
      initializeTestInstance(true)
      expect(testInstance.findAllByType(Box)[0].props.borderColor).toEqual(undefined)
    })

    it('should show the disabled message', async () => {
      initializeTestInstance(true)
      expect(testInstance.findAllByType(TextView)[1].props.children).toEqual('my button instructions')
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
          await waitFor(() => {
            initializeTestInstance(false)
            testInstance.findByType(Pressable).props.onPressIn()
            expect(testInstance.findByType(Box).props.backgroundColor).toEqual('buttonPrimaryActive')
            testInstance.findByType(Pressable).props.onPressOut()
            expect(testInstance.findByType(Box).props.backgroundColor).toEqual('buttonPrimary')
          })
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
          await waitFor(() => {
            initializeTestInstance(false, ButtonTypesConstants.buttonSecondary)
            testInstance.findByType(Pressable).props.onPressIn()
            expect(testInstance.findByType(Box).props.backgroundColor).toEqual('buttonSecondaryActive')
            testInstance.findByType(Pressable).props.onPressOut()
            expect(testInstance.findByType(Box).props.backgroundColor).toEqual('buttonSecondary')
          })
        })
      })
    })

    describe('when the button type is buttonDestructive', () => {
      it('should set the text color to buttonDestructive', async () => {
        initializeTestInstance(false, ButtonTypesConstants.buttonDestructive)
        expect(testInstance.findByType(TextView).props.color).toEqual('buttonDestructive')
      })

      it('should set the background color to buttonDestructive', async () => {
        initializeTestInstance(false, ButtonTypesConstants.buttonDestructive)
        expect(testInstance.findByType(Box).props.backgroundColor).toEqual('buttonDestructive')
      })

      it('should set the border color to buttonDestructive', async () => {
        initializeTestInstance(false, ButtonTypesConstants.buttonDestructive)
        expect(testInstance.findByType(Box).props.borderColor).toEqual('buttonDestructive')
      })

      describe('when the button is pressed in', () => {
        it('should set the backgroundColor to buttonDestructiveActive', async () => {
          await waitFor(() => {
            initializeTestInstance(false, ButtonTypesConstants.buttonDestructive)
            testInstance.findByType(Pressable).props.onPressIn()
            expect(testInstance.findByType(Box).props.backgroundColor).toEqual('buttonDestructiveActive')
            testInstance.findByType(Pressable).props.onPressOut()
            expect(testInstance.findByType(Box).props.backgroundColor).toEqual('buttonDestructive')
          })
        })
      })
    })
  })
})
