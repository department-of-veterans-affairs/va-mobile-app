import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { act, ReactTestInstance } from 'react-test-renderer'
import { context, mockNavProps, mockStore, renderWithProviders } from 'testUtils'

import {InitialState} from 'store/reducers'
import EstimatedDecisionDate from './EstimatedDecisionDate'

context('ClaimDetailsScreen', () => {
  let store: any
  let component: any
  let props: any
  let testInstance: ReactTestInstance

  beforeEach(() => {
    props = mockNavProps({ maxEstDate: '2020-12-20' })

    store = mockStore({
      ...InitialState,
    })

    act(() => {
      component = renderWithProviders(<EstimatedDecisionDate {...props} />, store)
    })

    testInstance = component.root
  })

  it('should initialize', async () => {
    expect(component).toBeTruthy()
  })
})
