import 'react-native'
import React from 'react'

// Note: test renderer must be required after react-native.
import { context, render, RenderAPI, waitFor } from 'testUtils'

import NoMatchInRecords from './NoMatchInRecords'

context('NoMatchInRecords', () => {
  let component: RenderAPI
  let testInstance: any

  beforeEach(async () => {
    await waitFor(() => {
      component = render(<NoMatchInRecords />)
    })

    testInstance = component.UNSAFE_root
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })
})
