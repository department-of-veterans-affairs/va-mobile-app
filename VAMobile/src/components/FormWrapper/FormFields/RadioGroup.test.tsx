import React from 'react'

import { context, fireEvent, render, screen } from 'testUtils'

import RadioGroup from './RadioGroup'

import Mock = jest.Mock

const mockOptions = [
  {
    value: 1,
    labelKey: '1',
  },
  {
    value: 2,
    labelKey: '2',
  },
  {
    value: 3,
    labelKey: '3',
  },
]

context('RadioGroup', () => {
  let selected: number
  let setSelected: Mock

  const initializeTestInstance = (selectedValue: number = 0): void => {
    selected = selectedValue
    setSelected = jest.fn((updatedSelected) => (selected = updatedSelected))
    render(<RadioGroup<number> onChange={setSelected} value={selected} options={mockOptions} />)
  }

  beforeEach(() => {
    initializeTestInstance(1)
  })

  it('initializes correctly', () => {
    expect(screen.getAllByRole('radio').length).toEqual(mockOptions.length)
    expect(screen.getAllByTestId('RadioButtonUnchecked').length).toEqual(mockOptions.length - 1)
    expect(screen.getAllByTestId('RadioButtonChecked').length).toEqual(1)
  })

  it('calls setSelected on press', () => {
    fireEvent.press(screen.getByRole('radio', { name: '2 ' }))
    expect(setSelected).toHaveBeenCalled()
  })
})
