import 'react-native'
import React from 'react'

// Note: test renderer must be required after react-native.
import {context, renderWithProviders} from 'testUtils'
import { act } from 'react-test-renderer'

import NoMatchInRecords from './NoMatchInRecords'

context('NoMatchInRecords', () => {
  let component: any
  let testInstance: any

  beforeEach(() => {

    act(() => {
      component = renderWithProviders(<NoMatchInRecords />)
    })

    testInstance = component.root
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })
})
