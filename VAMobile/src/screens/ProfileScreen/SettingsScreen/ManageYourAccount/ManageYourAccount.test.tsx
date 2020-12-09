import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { act } from 'react-test-renderer'
import { context, mockNavProps, mockStore, renderWithProviders } from 'testUtils'

import ManageYourAccount from './ManageYourAccount'
import { InitialState } from 'store/reducers'

context('ManageYourAccount', () => {
  let store: any
  let component: any

  beforeEach(() => {
    const props = mockNavProps(undefined, { setOptions: jest.fn() })

    store = mockStore({
      ...InitialState
    })

    act(() => {
      component = renderWithProviders(<ManageYourAccount {...props} />, store)
    })
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })
})
