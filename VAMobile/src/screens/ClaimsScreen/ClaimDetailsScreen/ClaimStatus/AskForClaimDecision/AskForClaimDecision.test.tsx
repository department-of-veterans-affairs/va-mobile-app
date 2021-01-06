import React from 'react'

import {context, mockNavProps, renderWithProviders} from "testUtils"
import { act, ReactTestInstance } from "react-test-renderer"

import AskForClaimDecision from './AskForClaimDecision'

context('AskForClaimDecision', () => {
  let component: any
  let testInstance: ReactTestInstance
  let props: any

  const initializeTestInstance = (): void => {
    props = mockNavProps(undefined, { setOptions: jest.fn() })

    act(() => {
      component = renderWithProviders(<AskForClaimDecision {...props} />)
    })

    testInstance = component.root
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  it('should initialize', async () => {
    expect(component).toBeTruthy()
  })
})
