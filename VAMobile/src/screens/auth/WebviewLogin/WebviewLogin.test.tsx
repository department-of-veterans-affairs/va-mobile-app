import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { TestProviders, context, mockStore, mockNavProps } from 'testUtils'
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
    const mockProps = mockNavProps(
      {},
      {
        navigate: jest.fn(),
      },
    )

    act(() => {
      component = renderer.create(
        <TestProviders store={store}>
          <WebviewLogin {...mockProps}/>
        </TestProviders>,
      )
    })
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })
})
