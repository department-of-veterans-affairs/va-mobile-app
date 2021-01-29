import React from 'react'

import {context, mockNavProps, mockStore, renderWithProviders} from "testUtils"
import { act, ReactTestInstance } from "react-test-renderer"

import AskForClaimDecision from './AskForClaimDecision'
import { ErrorsState, initialErrorsState, InitialState } from 'store/reducers'
import { AlertBox, CheckBox, ErrorComponent } from 'components'
import { CommonErrors } from 'constants/errors'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'

context('AskForClaimDecision', () => {
  let component: any
  let testInstance: ReactTestInstance
  let props: any
  let store: any

  const initializeTestInstance = (submittedDecision: boolean, error?: Error, errorsState: ErrorsState = initialErrorsState): void => {
    props = mockNavProps(undefined, { setOptions: jest.fn() }, { params: { claimID: 'id' } })

    store = mockStore({
      ...InitialState,
      claimsAndAppeals: {
        ...InitialState.claimsAndAppeals,
        submittedDecision,
        error
      },
      errors: errorsState
    })

    act(() => {
      component = renderWithProviders(<AskForClaimDecision {...props} />, store)
    })

    testInstance = component.root
  }

  beforeEach(() => {
    initializeTestInstance(false)
  })

  it('should initialize', async () => {
    expect(component).toBeTruthy()
  })

  describe('when submittedDecision is true and there is no error', () => {
    it('should display an AlertBox', async () => {
      initializeTestInstance(true, undefined)
      expect(testInstance.findAllByType(AlertBox).length).toEqual(1)
      expect(testInstance.findAllByType(CheckBox).length).toEqual(0)
    })
  })

  describe('when submittedDecision is false', () => {
    it('should display an CheckBox', async () => {
      expect(testInstance.findAllByType(CheckBox).length).toEqual(1)
      expect(testInstance.findAllByType(AlertBox).length).toEqual(0)
    })
  })

  describe('when common error occurs', () => {
    it('should render error component when the stores screenID matches the components screenID', async() => {
      const errorState: ErrorsState = {
        screenID: ScreenIDTypesConstants.ASK_FOR_CLAIM_DECISION_SCREEN_ID,
        errorType: CommonErrors.NETWORK_CONNECTION_ERROR,
        tryAgain: () => Promise.resolve()
      }

      initializeTestInstance(false, undefined, errorState)
      expect(testInstance.findAllByType(ErrorComponent)).toHaveLength(1)
    })

    it('should not render error component when the stores screenID does not match the components screenID', async() => {
      const errorState: ErrorsState = {
        screenID: undefined,
        errorType: CommonErrors.NETWORK_CONNECTION_ERROR,
        tryAgain: () => Promise.resolve()
      }

      initializeTestInstance(false, undefined, errorState)
      expect(testInstance.findAllByType(ErrorComponent)).toHaveLength(0)
    })
  })
})
