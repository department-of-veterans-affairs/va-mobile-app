import 'react-native'
import React from 'react'
import * as api from 'store/api'
// Note: test renderer must be required after react-native.
import { act, ReactTestInstance } from 'react-test-renderer'
import { context, mockNavProps, render, waitForElementToBeRemoved, when } from 'testUtils'

import AppealDetailsScreen from './AppealDetailsScreen'
import { ErrorsState, initialErrorsState, initializeErrorsByScreenID, InitialState } from 'store/slices'
import { appeal as appealData } from '../appealData'
import { ErrorComponent, LoadingComponent, SegmentedControl, TextView } from 'components'
import AppealStatus from './AppealStatus/AppealStatus'
import AppealIssues from './AppealIssues/AppealIssues'
import { AppealEventData, AppealTypes } from 'store/api/types'
import { CommonErrorTypesConstants } from 'constants/errors'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import { cleanup, RenderAPI, waitFor } from '@testing-library/react-native'
import { DEFAULT_PAGE_SIZE } from 'constants/common'

context('AppealDetailsScreen', () => {
  let component: RenderAPI
  let props: any
  let testInstance: ReactTestInstance
  let store: any
  const initializeTestInstance = (type?: AppealTypes, events?: Array<AppealEventData>, loadingAppeal: boolean = false, errorsState: ErrorsState = initialErrorsState): void => {
    props = mockNavProps(undefined, undefined, { params: { appealID: '0' } })

    let appeal = {
      ...appealData,
      type: type ? type : 'appeal',
      attributes: {
        ...appealData.attributes,
        events: events || appealData.attributes.events,
      },
    }

    component = render(<AppealDetailsScreen {...props} />, {
      preloadedState: {
        ...InitialState,
        claimsAndAppeals: {
          ...InitialState.claimsAndAppeals,
          appeal,
          loadingAppeal,
        },
        errors: errorsState,
      },
    })

    testInstance = component.container
  }

  it('should initialize', async () => {
    await waitFor(() => {
      initializeTestInstance()
      expect(component).toBeTruthy()
    })
  })

  describe('when loadingClaim is set to true', () => {
    it('should show loading screen', async () => {
      await waitFor(() => {
        initializeTestInstance(undefined, undefined, true)
        expect(testInstance.findByType(LoadingComponent)).toBeTruthy()
      })
    })
  })

  describe('when the selected tab is status', () => {
    it('should display the AppealStatus component', async () => {
      await waitFor(() => {
        initializeTestInstance()
        testInstance.findByType(SegmentedControl).props.onChange('Status')
        expect(component.container.findAllByType(AppealStatus).length).toEqual(1)
        component.debug()
      })
    })
  })

  describe('when the selected tab is issues', () => {
    it('should display the AppealStatus component', async () => {
      await waitFor(async () => {
        when(api.get as jest.Mock)
          .calledWith(`/v0/appeal/0`)
          .mockResolvedValue({ data: appealData })

        initializeTestInstance()
      })

      await waitFor(async () => {
        component.container.findByType(SegmentedControl).props.onChange('Issues')
      })
      expect(component.container.findAllByType(AppealIssues).length).toEqual(1)
    })
  })

  describe('when the type is higherLevelReview', () => {
    it('should display "Higher level review appeal for {{ programArea }}" as the title', async () => {
      await waitFor(() => {
        initializeTestInstance('higherLevelReview')
        expect(testInstance.findAllByType(TextView)[0].props.children).toEqual('Higher level review appeal for compensation')
      })
    })

    it('should display the submitted date as the event date where the type is "hlr_request"', async () => {
      await waitFor(() => {
        initializeTestInstance('higherLevelReview', [
          { date: '2020-01-20', type: 'hlr_request' },
          { date: '2020-01-20', type: 'claim_decision' },
        ])
        expect(testInstance.findAllByType(TextView)[2].props.children).toEqual('Submitted January 20, 2020')
      })
    })
  })

  describe('when the type is legacyAppeal', () => {
    it('should display "Appeal for {{ programArea }}" as the title', async () => {
      await waitFor(() => {
        initializeTestInstance('legacyAppeal')
        expect(testInstance.findAllByType(TextView)[0].props.children).toEqual('Appeal for compensation')
      })
    })

    it('should display the submitted date as the event date where the type is "nod"', async () => {
      await waitFor(() => {
        initializeTestInstance('legacyAppeal', [
          { date: '2020-01-20', type: 'nod' },
          { date: '2020-10-31', type: 'claim_decision' },
        ])
        expect(testInstance.findAllByType(TextView)[2].props.children).toEqual('Submitted January 20, 2020')
      })
    })
  })

  describe('when the type is appeal', () => {
    it('should display "Appeal for {{ programArea }}" as the title', async () => {
      await waitFor(() => {
        initializeTestInstance('appeal')
        expect(testInstance.findAllByType(TextView)[0].props.children).toEqual('Appeal for compensation')
      })
    })

    it('should display the submitted date as the event date where the type is "nod"', async () => {
      await waitFor(() => {
        initializeTestInstance('appeal', [
          { date: '2020-01-20', type: 'nod' },
          { date: '2020-10-31', type: 'claim_decision' },
        ])
        expect(testInstance.findAllByType(TextView)[2].props.children).toEqual('Submitted January 20, 2020')
      })
    })
  })

  describe('when the type is supplementalClaim', () => {
    it('should display "Supplemental claim appeal for {{ programArea }}" as the title', async () => {
      await waitFor(() => {
        initializeTestInstance('supplementalClaim')
        expect(testInstance.findAllByType(TextView)[0].props.children).toEqual('Supplemental claim appeal for compensation')
      })
    })

    it('should display the submitted date as the event date where the type is "sc_request"', async () => {
      await waitFor(() => {
        initializeTestInstance('supplementalClaim', [
          { date: '2020-01-20', type: 'sc_request' },
          { date: '2020-10-31', type: 'claim_decision' },
        ])
        expect(testInstance.findAllByType(TextView)[2].props.children).toEqual('Submitted January 20, 2020')
      })
    })
  })

  describe('when common error occurs', () => {
    it('should render error component when the stores screenID matches the components screenID', async () => {
      const errorsByScreenID = initializeErrorsByScreenID()
      errorsByScreenID[ScreenIDTypesConstants.APPEAL_DETAILS_SCREEN_ID] = CommonErrorTypesConstants.NETWORK_CONNECTION_ERROR

      const errorState: ErrorsState = {
        ...initialErrorsState,
        errorsByScreenID,
      }

      await waitFor(() => {
        initializeTestInstance('appeal', undefined, false, errorState)
        expect(testInstance.findAllByType(ErrorComponent)).toHaveLength(1)
      })
    })

    it('should not render error component when the stores screenID does not match the components screenID', async () => {
      const errorsByScreenID = initializeErrorsByScreenID()
      errorsByScreenID[ScreenIDTypesConstants.ASK_FOR_CLAIM_DECISION_SCREEN_ID] = CommonErrorTypesConstants.NETWORK_CONNECTION_ERROR

      const errorState: ErrorsState = {
        ...initialErrorsState,
        errorsByScreenID,
      }

      await waitFor(() => {
        initializeTestInstance('appeal', undefined, false, errorState)
        expect(testInstance.findAllByType(ErrorComponent)).toHaveLength(0)
      })
    })
  })
})
