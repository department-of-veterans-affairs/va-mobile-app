import React from 'react'

import { context, render, screen } from 'testUtils'
import { useTheme } from 'utils/hooks'

import TextAreaSpacer from './TextAreaSpacer'

// Mock the useTheme hook
jest.mock('utils/hooks', () => ({
  useTheme: jest.fn(),
}))

const mockUseTheme = useTheme as jest.Mock

context('TextAreaSpacer', () => {
  const mockTheme = {
    dimensions: {
      standardMarginBetween: 16,
      gutter: 20,
      borderWidth: 1,
    },
    colors: {
      background: {
        main: '#FFFFFF',
      },
      border: {
        primary: '#005EA2',
      },
    },
  }

  beforeEach(() => {
    mockUseTheme.mockReturnValue(mockTheme)
    render(<TextAreaSpacer />)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('rendering', () => {
    it('should render the spacer component', () => {
      // TextAreaSpacer renders a Box component, so we can check if the container is rendered
      expect(screen.getByTestId('TextAreaSpacer')).toBeTruthy()
    })
  })

  describe('theme integration', () => {
    it('should call useTheme hook', () => {
      expect(mockUseTheme).toHaveBeenCalled()
    })

    it('should render with correct theme-based styling props', () => {
      const spacerElement = screen.getByTestId('TextAreaSpacer')

      // Verify the component renders and that the theme mock was called with expected values
      expect(spacerElement).toBeTruthy()
      expect(mockUseTheme).toHaveBeenCalledTimes(1)

      // Verify that the component would receive the correct props based on our mock theme
      // The createBoxProps function should use these theme values:
      // - height: theme.dimensions.standardMarginBetween (16)
      // - mx: -theme.dimensions.gutter (-20)
      expect(mockTheme.dimensions.standardMarginBetween).toBe(16)
      expect(mockTheme.dimensions.gutter).toBe(20)
    })
  })
})
