import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.

import 'jest-styled-components'
import { ReactTestInstance, act } from 'react-test-renderer'

import { context, renderWithProviders, mockStore } from 'testUtils'
import CallHelpCenter from './CallHelpCenter'

context('ErrorComponent', () => {
  let store: any
  let component: any
  let testInstance: ReactTestInstance

  beforeEach(() => {
    store = mockStore({})

    act(() => {
      component = renderWithProviders(
        <CallHelpCenter />,
        store
      )
    })
    testInstance = component.root
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })
})
