import React from 'react'
import * as ReactNative from 'react-native'

import { fireEvent, screen } from '@testing-library/react-native'

import FloatingButton from 'components/FloatingButton'
import { FAB_INLINE_FONT_SCALE_THRESHOLD } from 'constants/common'
import { context, render, waitFor } from 'testUtils'

const mockUseIsScreenReaderEnabled = jest.fn(() => false)
jest.mock('@department-of-veterans-affairs/mobile-component-library', () => {
  const actual = jest.requireActual('@department-of-veterans-affairs/mobile-component-library')
  return {
    ...actual,
    useIsScreenReaderEnabled: () => mockUseIsScreenReaderEnabled(),
  }
})

jest.mock('components', () => {
  const ReactActual = jest.requireActual('react')
  const ReactNativeActual = jest.requireActual('react-native')
  return {
    Box: (props: { children: React.ReactNode; style?: unknown }) => {
      return ReactActual.createElement(
        ReactNativeActual.View,
        { testID: 'floatingButtonRoot', style: props.style },
        props.children,
      )
    },
  }
})

context('FloatingButton', () => {
  const onPressSpy = jest.fn()

  const setWindowFontScale = (fontScale: number) => {
    ReactNative.Dimensions.get = jest.fn().mockReturnValue({
      width: 390,
      height: 844,
      scale: 3,
      fontScale,
    })
  }

  const initializeTestInstance = (isHidden: boolean = false) => {
    return render(
      <FloatingButton
        isHidden={isHidden}
        label="My Button Label"
        a11yLabel="My a11y Button Label"
        onPress={onPressSpy}
      />,
    )
  }

  beforeEach(() => {
    mockUseIsScreenReaderEnabled.mockReturnValue(false)
    setWindowFontScale(1)
    onPressSpy.mockReset()
    initializeTestInstance()
  })

  it('renders label', () => {
    expect(screen.getByRole('button', { name: 'My Button Label' })).toBeTruthy()
    expect(screen.getByLabelText('My a11y Button Label')).toBeTruthy()
  })

  it('calls onPress when clicked', () => {
    fireEvent.press(screen.getByRole('button', { name: 'My Button Label' }))
    expect(onPressSpy).toHaveBeenCalled()
  })

  describe('When isHidden is set to true', () => {
    it('should not display the floating button', async () => {
      initializeTestInstance(true)
      await waitFor(() => expect(screen.queryByRole('button', { name: 'My Button Label' })).toBeFalsy())
    })
  })

  describe('placement behavior', () => {
    it('uses floating style below threshold when screen reader is off', () => {
      setWindowFontScale(FAB_INLINE_FONT_SCALE_THRESHOLD - 0.1)
      initializeTestInstance()

      const rootBox = screen.getByTestId('floatingButtonRoot')
      expect(rootBox.props.style).toMatchObject({ position: 'absolute' })
    })

    it('uses inline style at threshold when screen reader is off', () => {
      setWindowFontScale(FAB_INLINE_FONT_SCALE_THRESHOLD)
      initializeTestInstance()

      const rootBox = screen.getByTestId('floatingButtonRoot')
      expect(rootBox.props.style).toEqual({})
    })

    it('uses inline style when screen reader is on, regardless of font scale', () => {
      setWindowFontScale(1)
      mockUseIsScreenReaderEnabled.mockReturnValue(true)
      initializeTestInstance()

      const rootBox = screen.getByTestId('floatingButtonRoot')
      expect(rootBox.props.style).toEqual({})
    })
  })
})
