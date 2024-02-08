import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'

import { context, render } from 'testUtils'

import Switch from './Switch'

context('Switch', () => {
  const onPressSpy = jest.fn(() => {})

  beforeEach(() => {
    render(<Switch onPress={onPressSpy} a11yHint="Test switch" />)
  })

  it('renders a11yHint for switch', () => {
    expect(screen.getByA11yHint('Test switch')).toBeTruthy()
  })

  it('calls onPress when switch is pressed', () => {
    fireEvent.press(screen.getByRole('switch'))
    expect(onPressSpy).toBeCalled()
  })
})
