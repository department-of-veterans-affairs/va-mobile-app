import React from 'react'
import Mock = jest.Mock
import { context, fireEvent, render, screen } from 'testUtils'
import { VAIconProps } from 'components/VAIcon'
import HeaderBanner, { HeaderLeftButtonProps, HeaderRightButtonProps, HeaderStaticTitleProps } from './HeaderBanner'

context('HeaderBanner', () => {
  let onPressSpy: Mock
  onPressSpy = jest.fn(() => { })

  const initializeTestInstance = (
    titleText?: string,
    leftButtonText?: string,
    onLeftTitleButtonPress?: () => void,
    rightButtonText?: string,
    onRightTitleButtonPress?: () => void,
    rightVAIconProps?: VAIconProps,
  ): void => {
    let leftButton: HeaderLeftButtonProps | undefined = undefined
    if (leftButtonText && onLeftTitleButtonPress) {
      leftButton = { text: leftButtonText, onPress: onLeftTitleButtonPress }
    }
    const title: HeaderStaticTitleProps | undefined = titleText ? { type: 'Static', title: titleText } : undefined
    let rightButton: HeaderRightButtonProps | undefined = undefined
    if (rightButtonText && onRightTitleButtonPress) {
      if (rightVAIconProps) {
        rightButton = { text: rightButtonText, onPress: onRightTitleButtonPress, icon: rightVAIconProps }
      } else {
        rightButton = { text: rightButtonText, onPress: onRightTitleButtonPress }
      }
    }

    render(<HeaderBanner leftButton={leftButton} title={title} rightButton={rightButton} />)
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  describe('title', () => {
    it('should be there when title added', () => {
      initializeTestInstance('test')
      // TODO: why does getByText fail? 
      // expect(screen.getByText(/test/)).toBeTruthy()
      expect(screen.getByRole('header', { name: 'test' })).toBeTruthy()
    })
  })
  describe('left banner button', () => {
    it('should be there when text and on press is added', () => {
      initializeTestInstance(undefined, 'cancel', onPressSpy)
      expect(screen.getByRole('button', { name: 'cancel' })).toBeTruthy()
      fireEvent.press(screen.getByRole('button', { name: 'cancel' }))
      expect(onPressSpy).toHaveBeenCalled()
    })
  })

  describe('right banner button', () => {
    it('should be there when text and onpress is added', () => {
      initializeTestInstance(undefined, undefined, undefined, 'done', onPressSpy)
      expect(screen.getByRole('button', { name: 'done' })).toBeTruthy()
      fireEvent.press(screen.getByRole('button', { name: 'done' }))
      expect(onPressSpy).toHaveBeenCalled()
    })
  })
})
