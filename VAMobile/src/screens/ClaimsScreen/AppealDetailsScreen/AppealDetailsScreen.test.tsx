import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { act, ReactTestInstance } from 'react-test-renderer'
import { context, mockNavProps, mockStore, renderWithProviders } from 'testUtils'

import AppealDetailsScreen from './AppealDetailsScreen'
import { InitialState } from 'store/reducers'
import { appeal } from '../appealData'
import { SegmentedControl, TextView } from 'components'
import AppealStatus from './AppealStatus/AppealStatus'
import AppealDetails from './AppealDetails/AppealDetails'
import { AppealEventData, AppealTypes } from 'store/api/types'

context('AppealDetailsScreen', () => {
  let component: any
  let props: any
  let store: any
  let testInstance: ReactTestInstance

  const initializeTestInstance = (type?: AppealTypes, events?: Array<AppealEventData>): void => {
    props = mockNavProps(undefined, undefined, { params: {appealID: '0'} })

    if (type) {
      appeal.type = type
    }

    if (events) {
      appeal.attributes.events = events
    }

    store = mockStore({
      ...InitialState,
      claimsAndAppeals: { ...InitialState.claimsAndAppeals, appeal }
    })

    act(() => {
      component = renderWithProviders(<AppealDetailsScreen {...props} />, store)
    })

    testInstance = component.root
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  it('should initialize', async () => {
    expect(component).toBeTruthy()
  })

  describe('when the selected tab is status', () => {
    it('should display the AppealStatus component', async () => {
      testInstance.findByType(SegmentedControl).props.onChange('Status')
      expect(testInstance.findAllByType(AppealStatus).length).toEqual(1)
    })
  })

  describe('when the selected tab is issues', () => {
    it('should display the AppealDetails component', async () => {
      testInstance.findByType(SegmentedControl).props.onChange('Details')
      expect(testInstance.findAllByType(AppealDetails).length).toEqual(1)
    })
  })

  describe('when the type is higherLevelReview', () => {
    it('should display "Higher level review appeal for {{ programArea }}" as the title', async () => {
      initializeTestInstance('higherLevelReview')
      expect(testInstance.findAllByType(TextView)[0].props.children).toEqual('Higher level review appeal for compensation')
    })

    it('should display the submitted date as the event date where the type is "hlr_request"', async () => {
      initializeTestInstance('higherLevelReview', [{ data: '2020-01-20', type: 'hlr_request' }, { data: '2020-01-20', type: 'claim_decision' }])
      expect(testInstance.findAllByType(TextView)[2].props.children).toEqual('Submitted January 20, 2020')
    })
  })

  describe('when the type is legacyAppeal', () => {
    it('should display "Appeal for {{ programArea }}" as the title', async () => {
      initializeTestInstance('legacyAppeal')
      expect(testInstance.findAllByType(TextView)[0].props.children).toEqual('Appeal for compensation')
    })

    it('should display the submitted date as the event date where the type is "nod"', async () => {
      initializeTestInstance('legacyAppeal', [{ data: '2020-01-20', type: 'nod' }, { data: '2020-10-31', type: 'claim_decision' }])
      expect(testInstance.findAllByType(TextView)[2].props.children).toEqual('Submitted January 20, 2020')
    })
  })

  describe('when the type is appeal', () => {
    it('should display "Appeal for {{ programArea }}" as the title', async () => {
      initializeTestInstance('appeal')
      expect(testInstance.findAllByType(TextView)[0].props.children).toEqual('Appeal for compensation')
    })

    it('should display the submitted date as the event date where the type is "nod"', async () => {
      initializeTestInstance('appeal', [{ data: '2020-01-20', type: 'nod' }, { data: '2020-10-31', type: 'claim_decision' }])
      expect(testInstance.findAllByType(TextView)[2].props.children).toEqual('Submitted January 20, 2020')
    })
  })

  describe('when the type is supplementalClaim', () => {
    it('should display "Supplemental claim appeal for {{ programArea }}" as the title', async () => {
      initializeTestInstance('supplementalClaim')
      expect(testInstance.findAllByType(TextView)[0].props.children).toEqual('Supplemental claim appeal for compensation')
    })

    it('should display the submitted date as the event date where the type is "sc_request"', async () => {
      initializeTestInstance('supplementalClaim', [{ data: '2020-01-20', type: 'sc_request' }, { data: '2020-10-31', type: 'claim_decision' }])
      expect(testInstance.findAllByType(TextView)[2].props.children).toEqual('Submitted January 20, 2020')
    })
  })
})
