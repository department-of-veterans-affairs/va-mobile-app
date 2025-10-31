import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'

import TravelPayClaimsFilterCheckboxGroup from 'screens/HealthScreen/TravelPay/TravelPayClaims/Filter/TravelPayClaimsFilterCheckboxGroup'
import { context, render } from 'testUtils'
import { CheckboxOption, FILTER_KEY_ALL } from 'utils/travelPay'

const mockOnChange = jest.fn()

const CHECKBOX_OPTIONS: CheckboxOption[] = [
  {
    optionLabelKey: 'Option A',
    value: 'option_a',
  },
  {
    optionLabelKey: 'Option B',
    value: 'option_b',
  },
  {
    optionLabelKey: 'Option C',
    value: 'option_c',
  },
]

context('TravelPayClaimsFilterCheckboxGroup', () => {
  beforeEach(() => {
    mockOnChange.mockClear()
  })

  const initializeTestInstance = () => {
    render(
      <TravelPayClaimsFilterCheckboxGroup
        options={CHECKBOX_OPTIONS}
        onChange={mockOnChange}
        listTitle={'Test Checkbox Options'}
        selectedValues={new Set()}
        allLabelText="All"
      />,
    )
  }

  it('renders the correct elements', () => {
    initializeTestInstance()

    expect(screen.getByText('Test Checkbox Options')).toBeTruthy()

    expect(screen.getByTestId(`checkbox_${FILTER_KEY_ALL}`)).toBeTruthy()

    expect(screen.getByTestId(`checkbox_label_option_a`)).toBeTruthy()
    expect(screen.getByTestId(`checkbox_label_option_b`)).toBeTruthy()
    expect(screen.getByTestId(`checkbox_label_option_c`)).toBeTruthy()

    expect(screen.getByTestId(`checkbox_option_a`)).toBeTruthy()
    expect(screen.getByTestId(`checkbox_option_b`)).toBeTruthy()
    expect(screen.getByTestId(`checkbox_option_c`)).toBeTruthy()
  })

  it('calls onChange when a checkbox is changed', () => {
    initializeTestInstance()

    fireEvent.press(screen.getByTestId(`checkbox_option_a`))
    expect(mockOnChange).toHaveBeenCalledWith('option_a')
  })
})
