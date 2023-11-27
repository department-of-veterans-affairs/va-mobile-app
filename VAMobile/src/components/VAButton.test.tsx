import React from 'react'
import Mock = jest.Mock
import { context, fireEvent, render, screen } from 'testUtils'
import VAButton, { ButtonTypesConstants } from './VAButton'
import VAIcon, { VAIconProps } from './VAIcon'

context('VAButton', () => {
  let onPressSpy: Mock

  const initializeTestInstance = (disabled?: boolean, buttonType = ButtonTypesConstants.buttonPrimary, displayIcon = false): void => {
    onPressSpy = jest.fn(() => { })

    const iconProps: VAIconProps = { name: 'PaperClip', width: 16, height: 18 }

    render(
      <VAButton
        iconProps={displayIcon ? iconProps : undefined}
        label={'my button'}
        onPress={onPressSpy}
        buttonType={buttonType}
        disabled={disabled}
        disabledText={'my button instructions'}
      />,
    )
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  it('initializes correctly', () => {
    expect(screen.getByRole('button', { name: 'my button' })).toBeTruthy()
  })

  it('should call onChange', () => {
    fireEvent.press(screen.getByRole('button'))
    expect(onPressSpy).toBeCalled()
  })

  describe('when icon props are passed in', () => {
    it('should render a VAIcon', () => {
      initializeTestInstance(false, ButtonTypesConstants.buttonPrimary, true)
      expect(screen.UNSAFE_getAllByType(VAIcon).length).toEqual(1)
    })
  })

  describe('when disabled is true', () => {
    beforeEach(() => {
      initializeTestInstance(true)
    })
    it('should set the text color to "buttonDisabled"', () => {
      expect(screen.UNSAFE_getByProps({ color: 'buttonDisabled' })).toBeTruthy()
    })

    it('should set the background color to "buttonDisabled"', () => {
      expect(screen.UNSAFE_getByProps({ backgroundColor: 'buttonDisabled' })).toBeTruthy()
    })

    it('should show the disabled message', () => {
      expect(screen.getByText('my button instructions')).toBeTruthy()
    })
    it('should show accessibility state of disabled', () => {
      expect(screen.getByAccessibilityState({ disabled: true })).toBeTruthy()
    })
    it('should not register an onPress event', () => {
      fireEvent.press(screen.getByRole('button'))
      expect(onPressSpy).not.toHaveBeenCalled()
    })
  })

  describe('when different button types are passed in', () => {
    describe('when the button type is buttonPrimary (the default)', () => {
      it('should set the text color and background to buttonPrimary', () => {
        initializeTestInstance(false)
        // The <TextView>
        expect(screen.UNSAFE_getByProps({ color: 'buttonPrimary' }))
        // The surrounding <Box> element
        expect(screen.UNSAFE_getByProps({ backgroundColor: 'buttonPrimary' }))
      })
    })

    describe('when the button type is buttonSecondary', () => {
      it('should set the text color, background color, and border color to buttonSecondary', () => {
        initializeTestInstance(false, ButtonTypesConstants.buttonSecondary)
        // The <TextView>
        expect(screen.UNSAFE_getByProps({ color: 'buttonSecondary' }))
        // The surrounding <Box> element
        expect(screen.UNSAFE_getByProps({ backgroundColor: 'buttonSecondary', borderColor: 'buttonSecondary' }))
      })

    })

    describe('when the button type is buttonDestructive', () => {
      it('should set the text color, background color, and border color to buttonDestructive', () => {
        initializeTestInstance(false, ButtonTypesConstants.buttonDestructive)
        // The <TextView>
        expect(screen.UNSAFE_getByProps({ color: 'buttonDestructive' }))
        // The surrounding <Box> element
        expect(screen.UNSAFE_getByProps({ backgroundColor: 'buttonDestructive', borderColor: 'buttonDestructive' }))
      })
    })
  })
})
