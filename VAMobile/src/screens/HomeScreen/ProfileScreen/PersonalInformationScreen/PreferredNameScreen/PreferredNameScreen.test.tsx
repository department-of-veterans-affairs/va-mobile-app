import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'

import { context, mockNavProps, render } from 'testUtils'

import PreferredNameScreen from './PreferredNameScreen'

context('PreferredNameScreen', () => {
  beforeEach(() => {
    const props = mockNavProps({}, { setOptions: jest.fn(), navigate: jest.fn() })
    render(<PreferredNameScreen {...props} />)
  })

  it('initializes correctly', () => {
    expect(screen.getByRole('header', { name: 'Preferred name' })).toBeTruthy()
    expect(screen.getByText("Share the name you'd like us to use when you come in to VA.")).toBeTruthy()
    expect(screen.getByText('25 characters maximum')).toBeTruthy()
    expect(screen.getByTestId('preferredNameTestID')).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Save' })).toBeTruthy()
  })

  describe('when name has a number in it', () => {
    it('should show error text', () => {
      fireEvent.changeText(screen.getByTestId('preferredNameTestID'), 'Bobby3')
      fireEvent.press(screen.getByRole('button', { name: 'Save' }))
      expect(screen.getByText('Enter letters only')).toBeTruthy()
    })
  })

  describe('when name has to many characters', () => {
    it('should show error text', () => {
      fireEvent.changeText(screen.getByTestId('preferredNameTestID'), 'abcdefghijklmnopqrstuvwxyz')
      fireEvent.press(screen.getByRole('button', { name: 'Save' }))
      expect(screen.getByText('Enter 25 characters or less for preferred name')).toBeTruthy()
    })
  })

  describe('when name ie empty', () => {
    it('should show error text', () => {
      fireEvent.press(screen.getByRole('button', { name: 'Save' }))
      expect(screen.getByText('Enter a preferred name')).toBeTruthy()
    })
  })
})
