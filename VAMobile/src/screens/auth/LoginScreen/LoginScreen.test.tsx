import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { render, context } from 'testUtils'

import LoginScreen from './LoginScreen'
import { initialAuthState } from 'store/slices'

context('LoginScreen', () => {
  let component: any

  beforeEach(() => {
    component = render(<LoginScreen />, {
      preloadedState: {
        auth: { ...initialAuthState },
      },
    })
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })
})
