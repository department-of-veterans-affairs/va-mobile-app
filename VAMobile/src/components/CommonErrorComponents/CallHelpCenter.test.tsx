import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.

import 'jest-styled-components'
import { ReactTestInstance, act } from 'react-test-renderer'

import { context, render, RenderAPI } from 'testUtils'
import CallHelpCenter from './CallHelpCenter'

context('ErrorComponent', () => {
  let component: RenderAPI
  let testInstance: ReactTestInstance

  beforeEach(() => {
    component = render(<CallHelpCenter />)

    testInstance = component.UNSAFE_root
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })
})
