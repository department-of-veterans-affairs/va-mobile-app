import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { render, context } from 'testUtils'

import LoaGate from './LoaGate'
import { initialAuthState } from 'store/slices'

context('LoaGate', () => {
  let component: any

  beforeEach(() => {
    component = render(<LoaGate />, {
      preloadedState: {
        auth: { ...initialAuthState },
      },
    })
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })
})
