import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'

import { context, render } from 'testUtils'

import DefaultList from './DefaultList'

context('DefaultList', () => {
  const onPressSpy = jest.fn()
  const items = [
    {
      textLines: [{ text: 'line 1 on the first button' }, { text: 'line 2 on the first button' }],
      testId: 'testid',
      a11yHintText: 'hinttext',
    },
    { textLines: [{ text: 'another line' }], a11yHintText: 'hint2', onPress: onPressSpy },
  ]

  beforeEach(() => {
    render(<DefaultList items={items} />)
  })

  it('renders a11yHint', () => {
    expect(screen.getByA11yHint('hinttext')).toBeTruthy()
  })

  it('renders a11yLabel', () => {
    expect(screen.getByLabelText('another-line')).toBeTruthy()
  })

  it('renders multiple lines', () => {
    expect(screen.getByText(/line 1 on the first button/)).toBeTruthy()
    expect(screen.getByText(/line 2 on the first button/)).toBeTruthy()
  })

  it('calls onPress when item is clicked', () => {
    fireEvent.press(screen.getByRole('button', { name: 'another line' }))
  })
})
