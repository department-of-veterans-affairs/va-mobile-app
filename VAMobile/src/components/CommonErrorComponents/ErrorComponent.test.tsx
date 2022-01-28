import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.

import 'jest-styled-components'
import Mock = jest.Mock
import { ReactTestInstance, act } from 'react-test-renderer'

import { context, render, RenderAPI } from 'testUtils'
import ErrorComponent from './ErrorComponent'
import { ScreenIDTypesConstants } from 'store/api/types'

import { CommonErrorTypesConstants } from 'constants/errors'
import { initialErrorsState, initializeErrorsByScreenID } from 'store/slices'

context('ErrorComponent', () => {
  let store: any
  let component: any
  let testInstance: ReactTestInstance
  let onTryAgainPressSpy: Mock

  beforeEach(() => {
    const errorsByScreenID = initializeErrorsByScreenID()
    errorsByScreenID[ScreenIDTypesConstants.ASK_FOR_CLAIM_DECISION_SCREEN_ID] = CommonErrorTypesConstants.NETWORK_CONNECTION_ERROR

    component = render(<ErrorComponent onTryAgain={onTryAgainPressSpy} screenID={ScreenIDTypesConstants.ASK_FOR_CLAIM_DECISION_SCREEN_ID} />, {
      preloadedState: {
        errors: {
          ...initialErrorsState,
          errorsByScreenID,
        },
      },
    })

    testInstance = component.root
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })
})
