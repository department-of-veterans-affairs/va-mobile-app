import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import renderer, { ReactTestInstance, act } from 'react-test-renderer'
import Mock = jest.Mock

import { context, render, RenderAPI, waitFor } from 'testUtils'
import FocusedNavHeaderText from './FocusedNavHeaderText'

context('FocusedNavHeaderText', () => {
  let component: RenderAPI
  let testInstance: ReactTestInstance
  let onSaveSpy: Mock

  beforeEach(() => {
    onSaveSpy = jest.fn(() => {})

    component = render(<FocusedNavHeaderText headerTitle={''} />)

    testInstance = component.UNSAFE_root
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })
})
