import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { act, ReactTestInstance } from 'react-test-renderer'
import { context, mockNavProps, mockStore, renderWithProviders } from 'testUtils'

import {InitialState} from 'store/reducers'
import ClaimDetails from './ClaimDetails'
import {SegmentedControl} from 'components'
import ClaimStatus from './ClaimStatus/ClaimStatus'
import ClaimDetailsInfo from './ClaimDetailsInfo/ClaimDetailsInfo'

context('ClaimDetails', () => {
  let store: any
  let component: any
  let props: any
  let testInstance: ReactTestInstance

  beforeEach(() => {
    props = mockNavProps(undefined, undefined, { params: { claimID: '0', claimType: 'ACTIVE' } })

    store = mockStore({
      ...InitialState,
    })

    act(() => {
      component = renderWithProviders(<ClaimDetails {...props} />, store)
    })

    testInstance = component.root
  })

  it('should initialize', async () => {
    expect(component).toBeTruthy()
  })

  describe('when the selected tab is status', () => {
    it('should display the ClaimStatus component', async () => {
      testInstance.findByType(SegmentedControl).props.onChange('Status')
      expect(testInstance.findAllByType(ClaimStatus).length).toEqual(1)
    })
  })

  describe('when the selected tab is issues', () => {
    it('should display the ClaimDetailsInfo component', async () => {
      testInstance.findByType(SegmentedControl).props.onChange('Details')
      expect(testInstance.findAllByType(ClaimDetailsInfo).length).toEqual(1)
    })
  })
})
