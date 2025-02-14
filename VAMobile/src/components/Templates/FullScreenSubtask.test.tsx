import React from 'react'

import { IconProps } from '@department-of-veterans-affairs/mobile-component-library/src/components/Icon/Icon'

import { context, fireEvent, render, screen } from 'testUtils'

import FullScreenSubtask from './FullScreenSubtask'

context('FullScreenSubtask', () => {
  const onPressSpy = jest.fn(() => {})

  const initializeTestInstance = (
    titleText?: string,
    leftButtonText?: string,
    rightButtonText?: string,
    rightIconProps?: IconProps,
    primaryContentButtonText?: string,
    onPrimaryButtonPress?: () => void,
    secondaryContentButtonText?: string,
    onSecondaryButtonPress?: () => void,
  ): void => {
    render(
      <FullScreenSubtask
        title={titleText}
        leftButtonText={leftButtonText}
        rightButtonText={rightButtonText}
        rightIconProps={rightIconProps}
        primaryContentButtonText={primaryContentButtonText}
        onPrimaryContentButtonPress={onPrimaryButtonPress}
        secondaryContentButtonText={secondaryContentButtonText}
        onSecondaryContentButtonPress={onSecondaryButtonPress}
      />,
    )
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  describe('title', () => {
    it('should not be there', () => {
      expect(screen.queryByRole('header')).toBeFalsy()
    })
    it('should be there when title added', () => {
      initializeTestInstance('test')
      expect(screen.getByRole('header', { name: 'test' })).toBeTruthy()
    })
  })
  describe('left banner button', () => {
    it('should not be there', () => {
      expect(screen.queryByRole('button')).toBeFalsy()
    })
    it('should be there when text is added', () => {
      initializeTestInstance(undefined, 'cancel')
      expect(screen.getByRole('button', { name: 'cancel' })).toBeTruthy()
    })
  })

  describe('right banner button', () => {
    it('should not be there', () => {
      expect(screen.queryByRole('button')).toBeFalsy()
    })
    it('should be there when text is added', () => {
      initializeTestInstance(undefined, undefined, 'done')
      expect(screen.getByRole('button', { name: 'done' })).toBeTruthy()
    })
  })
  describe('primary content button', () => {
    it('should not be there when only text is added', () => {
      initializeTestInstance(undefined, undefined, undefined, undefined, 'Primary')
      expect(screen.queryByRole('button')).toBeFalsy()
    })

    it('should not be there when only onPress is added', () => {
      initializeTestInstance(undefined, undefined, undefined, undefined, undefined, onPressSpy)
      expect(screen.queryByRole('button')).toBeFalsy()
    })

    it('should be there when onPress and text is added', () => {
      initializeTestInstance(undefined, undefined, undefined, undefined, 'Primary', onPressSpy)
      expect(screen.getByRole('button', { name: 'Primary' })).toBeTruthy()
      fireEvent.press(screen.getByRole('button', { name: 'Primary' }))
      expect(onPressSpy).toHaveBeenCalled()
    })
  })
  describe('secondary content button', () => {
    it('should not be there when only text is added', () => {
      initializeTestInstance(undefined, undefined, undefined, undefined, undefined, undefined, 'Secondary')
      expect(screen.queryByRole('button')).toBeFalsy()
    })

    it('should not be there when only onPress is added', () => {
      initializeTestInstance(undefined, undefined, undefined, undefined, undefined, undefined, undefined, onPressSpy)
      expect(screen.queryByRole('button')).toBeFalsy()
    })

    it('should not be there when onPress and text is added and primary button is not present', () => {
      initializeTestInstance(undefined, undefined, undefined, undefined, undefined, undefined, 'Secondary', onPressSpy)
      expect(screen.queryByRole('button', { name: 'Secondary' })).toBeFalsy()
    })
    it('should be there when onPress and text is added and primary button is present', () => {
      initializeTestInstance(undefined, undefined, undefined, undefined, 'Primary', onPressSpy, 'Secondary', onPressSpy)
      expect(screen.getByRole('button', { name: 'Secondary' })).toBeTruthy()
    })
  })
})
