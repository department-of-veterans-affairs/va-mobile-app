import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import renderer, { ReactTestInstance, act } from 'react-test-renderer'
import Mock = jest.Mock

import { TestProviders, context } from 'testUtils'
import FocusedNavHeaderText from './FocusedNavHeaderText'

context('FocusedNavHeaderText', () => {
  let component: any
  let testInstance: ReactTestInstance
  let onSaveSpy: Mock

  beforeEach(() => {
    onSaveSpy = jest.fn(() => {})

    act(() => {
      component = renderer.create(
        <TestProviders>
          <FocusedNavHeaderText headerTitle={''} />
        </TestProviders>,
      )
    })

    testInstance = component.root
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })
})
