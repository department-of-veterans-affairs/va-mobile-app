import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { ReactTestInstance } from 'react-test-renderer'
import { context, mockNavProps, render, RenderAPI, waitFor } from 'testUtils'

import HowWillYouScreen from './HowWillYouScreen'

context('HowWillYouScreen', () => {
  let component: RenderAPI
  let testInstance: ReactTestInstance

  beforeEach(async () => {
    const props = mockNavProps({}, { setOptions: jest.fn(), navigate: jest.fn() })

    component = render(<HowWillYouScreen {...props} />)

    testInstance = component.UNSAFE_root
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })
})
