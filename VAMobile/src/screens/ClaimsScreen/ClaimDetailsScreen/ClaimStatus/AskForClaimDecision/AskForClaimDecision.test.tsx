import React from 'react'

import {context, mockNavProps, mockStore, renderWithProviders} from "testUtils"
import { act, ReactTestInstance } from "react-test-renderer"

import AskForClaimDecision from './AskForClaimDecision'
import {InitialState} from 'store/reducers'
import {AlertBox, CheckBox} from 'components'

context('AskForClaimDecision', () => {
  let component: any
  let testInstance: ReactTestInstance
  let props: any
  let store: any

  const initializeTestInstance = (submittedDecision: boolean): void => {
    props = mockNavProps(undefined, { setOptions: jest.fn() }, { params: { claimID: 'id' } })

    store = mockStore({
      ...InitialState,
      claimsAndAppeals: {
        ...InitialState.claimsAndAppeals,
        submittedDecision
      }
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

  describe('when submittedDecision is true', () => {
    it('should display an AlertBox', async () => {
      initializeTestInstance(true)
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
})
