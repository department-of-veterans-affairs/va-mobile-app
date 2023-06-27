import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance, act } from 'react-test-renderer'

import { context, render, RenderAPI, waitFor } from 'testUtils'
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
  let component: RenderAPI
  let testInstance: ReactTestInstance
  let selected: number
  let setSelected: Mock

  const initializeTestInstance = (selectedValue: number): void => {
    selected = selectedValue
    setSelected = jest.fn((updatedSelected) => (selected = updatedSelected))

    component = render(<RadioGroup<number> onChange={setSelected} value={selected} options={mockOptions} />)

    testInstance = component.UNSAFE_root
  }

  beforeEach(() => {
    initializeTestInstance(mockOptions[1].value)
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })
})
