import 'react-native'
import React from 'react'

// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance, act } from 'react-test-renderer'

import { context, renderWithProviders } from 'testUtils'
import RadioGroup, { RadioValueType } from './RadioGroup'
import Mock = jest.Mock

const mockOptions = [
  {
    value: 1,
    label: '1'
  },
  {
    value: 2,
    label: '2'
  },
  {
    value: 3,
    label: '3'
  }
]

context('VASelector', () => {
  let component: any
  let testInstance: ReactTestInstance
  let selected: RadioValueType
  let setSelected: Mock

  const initializeTestInstance = (selectedValue: RadioValueType ): void => {
    selected = selectedValue
    setSelected = jest.fn((updatedSelected) => selected = updatedSelected)

    act(() => {
      component = renderWithProviders(<RadioGroup onChange={setSelected} value={selected} options={mockOptions}/>)
    })

    testInstance = component.root
  }

  beforeEach(() => {
    initializeTestInstance(mockOptions[1].value)
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

})
