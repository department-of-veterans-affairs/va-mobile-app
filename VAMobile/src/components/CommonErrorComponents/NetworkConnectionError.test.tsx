import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import Mock = jest.Mock
import { ReactTestInstance, act } from 'react-test-renderer'

import { context, renderWithProviders } from 'testUtils'
import NetworkConnectionError from "./NetworkConnectionError";

context('NetworkConnectionError', () => {
  let component: any
  let testInstance: ReactTestInstance
  let onTryAgainPressSpy: Mock

  beforeEach(() => {

    act(() => {
      component = renderWithProviders(
        <NetworkConnectionError onTryAgain={onTryAgainPressSpy} />
      )
    })
    testInstance = component.root
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })
})
