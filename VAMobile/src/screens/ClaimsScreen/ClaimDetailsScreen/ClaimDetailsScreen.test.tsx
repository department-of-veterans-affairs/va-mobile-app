import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { act, ReactTestInstance } from 'react-test-renderer'
import { context, mockNavProps, mockStore, renderWithProviders } from 'testUtils'

import {InitialState, initialClaimsAndAppealsState} from 'store/reducers'
import ClaimDetailsScreen from './ClaimDetailsScreen'
import {LoadingComponent, SegmentedControl} from 'components'
import ClaimStatus from './ClaimStatus/ClaimStatus'
import ClaimDetails from './ClaimDetails/ClaimDetails'
import { claim } from "../claimData";

context('ClaimDetailsScreen', () => {
  let store: any
  let component: any
  let props: any
  let testInstance: ReactTestInstance

  const initializeTestInstance = (loadingClaim = false) => {
    props = mockNavProps(undefined, undefined, { params: { claimID: '0', claimType: 'ACTIVE' } })

    store = mockStore({
      ...InitialState,
      claimsAndAppeals: {
        ...initialClaimsAndAppealsState,
        loadingClaim,
        claim: claim
      }
    })

    act(() => {
      component = renderWithProviders(<ClaimDetailsScreen {...props} />, store)
    })

    testInstance = component.root
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  it('should initialize', async () => {
    expect(component).toBeTruthy()
  })

  describe('when loadingClaim is set to true', () => {
    it('should show loading screen', async () => {
      initializeTestInstance(true)
      expect(testInstance.findByType(LoadingComponent)).toBeTruthy()
    })
  })

  describe('when the selected tab is status', () => {
    it('should display the ClaimStatus component', async () => {
      testInstance.findByType(SegmentedControl).props.onChange('Status')
      expect(testInstance.findAllByType(ClaimStatus).length).toEqual(1)
    })
  })

  describe('when the selected tab is issues', () => {
    it('should display the ClaimDetails component', async () => {
      testInstance.findByType(SegmentedControl).props.onChange('Details')
      expect(testInstance.findAllByType(ClaimDetails).length).toEqual(1)
    })
  })
})
