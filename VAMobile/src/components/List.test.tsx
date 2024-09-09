import React from 'react'

import { context, fireEvent, render, screen } from 'testUtils'

import List from './List'
import TextView from './TextView'

import Mock = jest.Mock

context('List', () => {
  let onPressSpy: Mock

  beforeEach(() => {
    onPressSpy = jest.fn(() => {})

    const items = [
      {
        content: <TextView>Hello</TextView>,
        a11yHintText: 'military hint',
        onPress: onPressSpy,
        testId: 'military-information',
      },
    ]

    render(<List items={items} />)
  })

  it('initializes correctly', () => {
    expect(screen.getByText('Hello')).toBeTruthy()
  })

  it('should call onPress when one of the buttons has been clicked', () => {
    fireEvent.press(screen.getByRole('link', { name: 'Hello' }))
    expect(onPressSpy).toBeCalled()
  })
})
