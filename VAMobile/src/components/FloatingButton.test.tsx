import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'

import { context, render } from 'testUtils'

import FloatingButton from './FloatingButton'

context('FloatingButton', () => {
  const onPressSpy = jest.fn()

  beforeEach(() => {
    render(<FloatingButton label={'My Button Label'} a11yLabel={'My a11y Button Label'} onPress={onPressSpy} />)
  })

  it('renders label', () => {
    expect(screen.getByRole('button', { name: 'My Button Label' })).toBeTruthy()
    expect(screen.getByLabelText('My a11y Button Label')).toBeTruthy()
  })

  it('calls onPress when clicked', () => {
    fireEvent.press(screen.getByRole('button', { name: 'My Button Label' }))
    expect(onPressSpy).toHaveBeenCalled()
  })
})
