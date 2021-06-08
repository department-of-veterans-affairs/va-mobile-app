import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.

import 'jest-styled-components'
import Mock = jest.Mock
import { ReactTestInstance, act } from 'react-test-renderer'

import { context, renderWithProviders, mockStore } from 'testUtils'
import ErrorComponent from './ErrorComponent'
import { ScreenIDTypesConstants } from 'store/api/types'
import { initializeErrorsByScreenID } from 'store/reducers'
import { CommonErrorTypesConstants } from 'constants/errors'

context('ErrorComponent', () => {
  let store: any
  let component: any
  let testInstance: ReactTestInstance
  let onTryAgainPressSpy: Mock

  beforeEach(() => {
    const errorsByScreenID = initializeErrorsByScreenID()
    errorsByScreenID[ScreenIDTypesConstants.ASK_FOR_CLAIM_DECISION_SCREEN_ID] = CommonErrorTypesConstants.NETWORK_CONNECTION_ERROR

    store = mockStore({
      errors: {
        errorsByScreenID,
        tryAgain: () => Promise.resolve()
      }
    })

    act(() => {
      component = renderWithProviders(
        <ErrorComponent onTryAgain={onTryAgainPressSpy} screenID={ScreenIDTypesConstants.ASK_FOR_CLAIM_DECISION_SCREEN_ID}/>,
        store
      )
    })
    testInstance = component.root
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })
})
