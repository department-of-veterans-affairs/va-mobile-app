import React from 'react'
import { fireEvent, screen } from '@testing-library/react-native'

import { context, render } from 'testUtils'
import FooterButton from './FooterButton'

context('FooterButton', () => {
  let onPressSpy = jest.fn(() => {})

  beforeEach(() => {
    render(<FooterButton text="Button text" onPress={onPressSpy} iconProps={{ name: 'Compose', testID: 'Compose' }} />)
  })

  it('renders text', () => {
    expect(screen.getByText('Button text')).toBeTruthy()
  })

  it('renders icon', () => {
    expect(screen.getByTestId('Compose')).toBeTruthy()
  })

  it('calls onPress when clicked', () => {
    fireEvent.press(screen.getByText('Button text'))
    expect(onPressSpy).toHaveBeenCalled()
  })
})
