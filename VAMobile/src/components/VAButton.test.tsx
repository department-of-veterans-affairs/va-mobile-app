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

  it('should call onPress', () => {
    fireEvent.press(screen.getByRole('button'))
    expect(onPressSpy).toBeCalled()
  })

  describe('when disabled is true', () => {
    beforeEach(() => {
      initializeTestInstance(true)
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

})
