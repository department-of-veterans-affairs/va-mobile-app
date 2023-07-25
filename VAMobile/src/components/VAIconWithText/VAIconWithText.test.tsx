import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance } from 'react-test-renderer'

import { context, render, RenderAPI } from 'testUtils'
import VAIconWithText from './VAIconWithText'

jest.mock('../../utils/platform', () => ({
  isIOS: jest.fn(() => false),
}))

context('VAIconWithText', () => {
  let component: RenderAPI
  let testInstance: ReactTestInstance

  beforeEach(() => {
    component = render(<VAIconWithText name="HomeSelected" label="Home" />)
    testInstance = component.UNSAFE_root
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })
})
