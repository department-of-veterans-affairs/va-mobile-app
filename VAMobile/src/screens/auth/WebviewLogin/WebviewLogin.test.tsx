import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { TestProviders, context, mockStore } from 'testUtils'
import renderer, { act } from 'react-test-renderer'

import { initialAuthState } from '../../../store/reducers'
import WebviewLogin from "./WebviewLogin";

context('WebviewLogin', () => {
  let store: any
  let component: any

  beforeEach(() => {
    store = mockStore({
      auth: {...initialAuthState},
    })

    act(() => {
      component = renderer.create(
        <TestProviders store={store}>
          <WebviewLogin />
        </TestProviders>,
      )
    })
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })
})
