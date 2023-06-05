import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance, act } from 'react-test-renderer'

import { context, render, RenderAPI, waitFor } from 'testUtils'
import VAImage from './VAImage'

jest.mock('../../utils/platform', () => ({
  isIOS: jest.fn(() => false),
}))

context('VAIconTests', () => {
  let component: RenderAPI
  let testInstance: ReactTestInstance

  beforeEach(() => {
    component = render(<VAImage name={'PaperCheck'} a11yLabel={'testId'} marginX={10} />)
    testInstance = component.UNSAFE_root
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })
})
