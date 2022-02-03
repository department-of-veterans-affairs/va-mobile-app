import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { render, context, mockNavProps, waitFor } from 'testUtils'

import WebviewLogin from './WebviewLogin'
import { initialAuthState } from 'store/slices'

context('WebviewLogin', () => {
  let component: any

  beforeEach(async () => {
    const mockProps = mockNavProps(
      {},
      {
        navigate: jest.fn(),
      },
    )

    await waitFor(() => {
      component = render(<WebviewLogin {...mockProps} />, {
        preloadedState: {
          auth: { ...initialAuthState },
        },
      })
    })
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })
})
