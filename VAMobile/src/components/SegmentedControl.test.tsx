import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance, act } from 'react-test-renderer'
import Mock = jest.Mock

import { context, renderWithProviders } from 'testUtils'
import SegmentedControl from './SegmentedControl'

context('SegmentedControl', () => {
  let component: any
  let testInstance: ReactTestInstance
  let onChangeSpy: Mock

  beforeEach(() => {
    onChangeSpy = jest.fn(() => {})

    act(() => {
      component = renderWithProviders(<SegmentedControl values={['0', '1']} titles={['tab0', 'tab1']} onChange={onChangeSpy} selected={0} />)
    })

    testInstance = component.root
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  it('should call onChange', async () => {
    testInstance.findByType(SegmentedControl).props.onChange()
    expect(onChangeSpy).toBeCalled()
  })
})
