import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance } from 'react-test-renderer'
import Mock = jest.Mock

import { context, render, RenderAPI, waitFor } from 'testUtils'
import SegmentedControl from './SegmentedControl'

context('SegmentedControl', () => {
  let component: RenderAPI
  let testInstance: ReactTestInstance
  let onChangeSpy: Mock

  beforeEach(() => {
    onChangeSpy = jest.fn(() => {})

    component = render(<SegmentedControl values={['0', '1']} titles={['tab0', 'tab1']} onChange={onChangeSpy} selected={0} />)

    testInstance = component.UNSAFE_root
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  it('should call onChange', async () => {
    await waitFor(() => {
      testInstance.findByType(SegmentedControl).props.onChange()
      expect(onChangeSpy).toBeCalled()
    })
  })
})
