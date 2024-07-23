import React from 'react'

import { context, fireEvent, render, screen } from 'testUtils'

import LargePanel from './LargePanel'

context('LargePanel', () => {
  const onPressSpy = jest.fn(() => {})

  const initializeTestInstance = (
    titleText?: string,
    leftButtonText?: string,
    rightButtonText?: string,
    footerButtonText?: string,
    onFooterButtonPress?: () => void,
  ): void => {
    render(
      <LargePanel
        title={titleText}
        leftButtonText={leftButtonText}
        rightButtonText={rightButtonText}
        footerButtonText={footerButtonText}
        onFooterButtonPress={onFooterButtonPress}
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
      expect(screen.getByText('cancel')).toBeTruthy()
      expect(screen.getByRole('button', { name: 'cancel' })).toBeTruthy()
    })
  })

  describe('right banner button', () => {
    it('should not be there', () => {
      expect(screen.queryByRole('button')).toBeFalsy()
    })
    it('should be there when text is added', () => {
      initializeTestInstance(undefined, undefined, 'close')
      expect(screen.getByRole('link', { name: 'close' })).toBeTruthy()
    })
  })

  describe('footer button', () => {
    it('should not be there', () => {
      expect(screen.queryByRole('button')).toBeFalsy()
    })
    it('should not be there when only text is added', async () => {
      initializeTestInstance(undefined, undefined, undefined, 'footer')
      expect(screen.queryByRole('button', { name: 'footer' })).toBeFalsy()
    })

    it('should not be there when only onPress is added', async () => {
      initializeTestInstance(undefined, undefined, undefined, undefined, onPressSpy)
      expect(screen.queryByRole('button')).toBeFalsy()
    })

    it('should be there when onPress and text is added', async () => {
      initializeTestInstance(undefined, undefined, undefined, 'footer', onPressSpy)
      expect(screen.getByRole('button', { name: 'footer' })).toBeTruthy()
      fireEvent.press(screen.getByRole('button', { name: 'footer' }))
      expect(onPressSpy).toHaveBeenCalled()
    })
  })
})
