import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import {render, context, RenderAPI, waitFor} from 'testUtils'

import PharmacyScreen from './Pharmacy'
import { ReactTestInstance } from 'react-test-renderer'

context('PharmacyScreen', () => {
  let component: RenderAPI
  let testInstance: ReactTestInstance

  const initializeTestInstance = () => {
    component = render(<PharmacyScreen />)
    testInstance = component.container
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  it('initializes correctly', async () => {
    await waitFor(() => {
      expect(component).toBeTruthy()
    })
  })
})
