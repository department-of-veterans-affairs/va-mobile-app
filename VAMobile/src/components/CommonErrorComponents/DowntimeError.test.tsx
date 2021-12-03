import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.

import 'jest-styled-components'
import { ReactTestInstance, act } from 'react-test-renderer'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'

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
        <DowntimeError screenID={ScreenIDTypesConstants.APPOINTMENTS_SCREEN_ID} />,
        store
      )
    })
    testInstance = component.root
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })
})