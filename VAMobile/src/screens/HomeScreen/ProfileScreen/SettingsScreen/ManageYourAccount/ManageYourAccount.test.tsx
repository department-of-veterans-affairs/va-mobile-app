import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { act } from 'react-test-renderer'
import { context, mockNavProps, render } from 'testUtils'

import ManageYourAccount from './ManageYourAccount'
import { InitialState } from 'store/slices'

context('ManageYourAccount', () => {
  let component: any

  beforeEach(() => {
    const props = mockNavProps(undefined, { setOptions: jest.fn() })

    component = render(<ManageYourAccount {...props} />, {
      preloadedState: {
        ...InitialState,
      },
    })
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })
})
