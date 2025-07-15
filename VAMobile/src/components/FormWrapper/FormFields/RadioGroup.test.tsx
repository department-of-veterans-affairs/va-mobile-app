import React from 'react'

import RadioGroup from 'components/FormWrapper/FormFields/RadioGroup'
import { context, fireEvent, render, screen } from 'testUtils'

import Mock = jest.Mock

const mockOptions = [
  {
    value: 1,
    optionLabelKey: '1',
  },
  {
    value: 2,
    optionLabelKey: '2',
  },
  {
    value: 3,
    optionLabelKey: '3',
  },
]

context('RadioGroup', () => {
  let selected: number
  let setSelected: Mock

  const initializeTestInstance = (selectedValue: number = 0, isRadioList = false, error = ''): void => {
    selected = selectedValue
    setSelected = jest.fn((updatedSelected) => (selected = updatedSelected))
    render(
      <RadioGroup<number>
        onChange={setSelected}
        value={selected}
        options={mockOptions}
        isRadioList={isRadioList}
        error={error}
      />,
    )
  }

  it('initializes correctly', () => {
    initializeTestInstance(1)
    expect(screen.getAllByRole('radio').length).toEqual(mockOptions.length)
    expect(screen.getAllByTestId('RadioButtonUnchecked').length).toEqual(mockOptions.length - 1)
    expect(screen.getAllByTestId('RadioButtonChecked').length).toEqual(1)
  })

  it('initializes correctly as a list', () => {
    initializeTestInstance(1, true)
    expect(screen.getAllByRole('radio').length).toEqual(mockOptions.length)
    expect(screen.getByTestId('1 option 1 of 3')).toBeTruthy()
    expect(screen.getByTestId('2 option 2 of 3')).toBeTruthy()
    expect(screen.getByTestId('3 option 3 of 3')).toBeTruthy()
  })

  it('calls setSelected on press', () => {
    initializeTestInstance(1)
    fireEvent.press(screen.getByRole('radio', { name: '2 ' }))
    expect(setSelected).toHaveBeenCalled()
  })
  it('should display Error text', () => {
    initializeTestInstance(1, false, 'ERROR')
    expect(screen.getByText('ERROR')).toBeTruthy()
  })
})
