import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import {act, ReactTestInstance} from 'react-test-renderer'
import {context, mockNavProps, renderWithProviders} from 'testUtils'

import HowWillYouScreen from './HowWillYouScreen'

context('HowWillYouScreen', () => {
  let store: any
  let component: any
  let testInstance: ReactTestInstance

  beforeEach(() => {
    const props = mockNavProps({}, { setOptions: jest.fn(), navigate: jest.fn() })

    act(() => {
      component = renderWithProviders(<HowWillYouScreen {...props} />)
    })

    testInstance = component.root
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })
})
