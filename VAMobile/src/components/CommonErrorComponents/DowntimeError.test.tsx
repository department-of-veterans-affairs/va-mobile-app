import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.

import 'jest-styled-components'
import { ReactTestInstance, act } from 'react-test-renderer'

import { context, renderWithProviders, mockStore } from 'testUtils'
import DowntimeError from "./DowntimeError";
import Mock = jest.Mock;

context('DowntimeError', () => {
  let store: any
  let component: any
  let testInstance: ReactTestInstance
  let onTryAgainSpy: Mock

  beforeEach(() => {
    store = mockStore({})

    act(() => {
      component = renderWithProviders(
        <DowntimeError feature={'feature name'} end={'2021-06-02T01:00:00.000Z'} />,
        store
      )
    })
    testInstance = component.root
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })
})