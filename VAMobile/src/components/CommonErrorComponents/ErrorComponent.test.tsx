import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.

import 'jest-styled-components'
import Mock = jest.Mock
import { ReactTestInstance, act } from 'react-test-renderer'

import { context, renderWithProviders, mockStore } from 'testUtils'
import ErrorComponent from "./ErrorComponent";

context('ErrorComponent', () => {
  let store: any
  let component: any
  let testInstance: ReactTestInstance
  let onTryAgainPressSpy: Mock

  beforeEach(() => {
    store = mockStore({
      errors: {
        errorType: "networkConnectionError",
        tryAgain: () => Promise.resolve()
      }
    })

    act(() => {
      component = renderWithProviders(
        <ErrorComponent onTryAgain={onTryAgainPressSpy} />,
        store
      )
    })
    testInstance = component.root
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })
})
