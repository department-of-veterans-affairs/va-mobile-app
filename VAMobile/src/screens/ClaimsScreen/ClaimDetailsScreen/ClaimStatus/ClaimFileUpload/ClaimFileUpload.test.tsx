import React from 'react'

import { context, renderWithProviders } from "testUtils"
import { act, ReactTestInstance } from "react-test-renderer"

import ClaimFileUpload from './ClaimFileUpload'

context('ClaimFileUpload', () => {
  let component: any
  let testInstance: ReactTestInstance

  beforeEach(() => {
    act(() => {
      component = renderWithProviders(<ClaimFileUpload />)
    })

    testInstance = component.root
  })

  it('should initialize', async () => {
    expect(component).toBeTruthy()
  })

})
