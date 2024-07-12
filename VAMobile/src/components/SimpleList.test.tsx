import React from 'react'

import { context, fireEvent, render, screen } from 'testUtils'

import SimpleList from './SimpleList'

import Mock = jest.Mock

context('SimpleList', () => {
  let onPressSpy: Mock

  beforeEach(() => {
    onPressSpy = jest.fn(() => {})

    const items = [
      { text: 'one line', testId: 'testid', a11yHintText: 'hinttext' },
      { text: 'another line', a11yHintText: 'hint2', onPress: onPressSpy },
    ]

    render(<SimpleList items={items} />)
  })

  it('initializes correctly', () => {
    expect(screen.getByText('one line')).toBeTruthy()
    expect(screen.getByText('another line')).toBeTruthy()
  })

  it('should call onPress when one of the buttons has been clicked', () => {
    fireEvent.press(screen.getByText('another line'))
    expect(onPressSpy).toBeCalled()
  })
})
