import 'react-native'
import React from 'react'
import * as api from 'store/api'
// Note: test renderer must be required after react-native.
import { ReactTestInstance } from 'react-test-renderer'
import { SegmentedControl } from '@department-of-veterans-affairs/mobile-component-library'
import { context, mockNavProps, render, when } from 'testUtils'

import AppealDetailsScreen from './AppealDetailsScreen'
import { ErrorsState, initialErrorsState, initializeErrorsByScreenID, InitialState } from 'store/slices'
import { appeal as appealData } from '../appealData'
import { ErrorComponent, LoadingComponent, TextView } from 'components'
import AppealStatus from './AppealStatus/AppealStatus'
import AppealIssues from './AppealIssues/AppealIssues'
import { AppealEventData, AppealTypes } from 'store/api/types'
import { CommonErrorTypesConstants } from 'constants/errors'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import { RenderAPI, waitFor } from '@testing-library/react-native'
import { StackNavigationOptions } from '@react-navigation/stack'

context('AppealDetailsScreen', () => {
  let component: RenderAPI
  let props: any
  let navHeaderSpy: any
  let testInstance: ReactTestInstance
  let goBack: jest.Mock
  let abortLoadSpy: jest.Mock
  let store: any

  const mockApiCall = (type?: AppealTypes, events?: Array<AppealEventData>) => {
    when(api.get as jest.Mock)
      .calledWith(`/v0/appeal/0`, {}, expect.anything())
      .mockResolvedValue({
        data: {
          ...appealData,
          type: type ? type : 'appeal',
          attributes: {
            ...appealData.attributes,
            events: events || appealData.attributes.events,
          },
        },
      })

    initializeTestInstance()
  }

  const initializeTestInstance = (loadingAppeal: boolean = false, errorsState: ErrorsState = initialErrorsState): void => {
    goBack = jest.fn()
    abortLoadSpy = jest.fn()
    props = mockNavProps(
      undefined,
      {
        navigate: jest.fn(),
        addListener: jest.fn(),
        setOptions: (options: Partial<StackNavigationOptions>) => {
          navHeaderSpy = {
            back: options.headerLeft ? options.headerLeft({}) : undefined,
          }
        },
        goBack,
      },
      { params: { appealID: '0' } },
    )

    component = render(<AppealDetailsScreen {...props} />, {
      preloadedState: {
        ...InitialState,
        claimsAndAppeals: {
          ...InitialState.claimsAndAppeals,
          loadingAppeal,
          cancelLoadingDetailScreen: {
            abort: abortLoadSpy,
          },
        },
        errors: errorsState,
      },
    })

    testInstance = component.UNSAFE_root
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
        initializeTestInstance(true)
        expect(testInstance.findByType(LoadingComponent)).toBeTruthy()
      })
    })
  })

  describe('when the selected tab is status', () => {
    it('should display the AppealStatus component', async () => {
      await waitFor(async () => {
        mockApiCall()
        initializeTestInstance()
      })

      await waitFor(() => {
        testInstance.findByType(SegmentedControl).props.onChange(0)
        expect(component.UNSAFE_root.findAllByType(AppealStatus).length).toEqual(1)
      })
    })
  })

  describe('when the selected tab is issues', () => {
    it('should display the AppealStatus component', async () => {
      await waitFor(async () => {
        mockApiCall()
        initializeTestInstance()
      })

      await waitFor(async () => {
        component.UNSAFE_root.findByType(SegmentedControl).props.onChange(1)
      })
      expect(component.UNSAFE_root.findAllByType(AppealIssues).length).toEqual(1)
    })
  })

  describe('when the type is higherLevelReview', () => {
    it('should display "Higher level review appeal for {{ programArea }}" as the title', async () => {
      mockApiCall('higherLevelReview')
      await waitFor(() => {
        expect(testInstance.findAllByType(TextView)[3].props.children).toEqual('Higher level review appeal for compensation')
      })
    })

    it('should display the submitted date as the event date where the type is "hlr_request"', async () => {
      await waitFor(async () => {
        mockApiCall('higherLevelReview', [
          { date: '2020-01-20', type: 'hlr_request' },
          { date: '2020-01-20', type: 'claim_decision' },
        ])
        initializeTestInstance()
      })
      await waitFor(() => {
        expect(testInstance.findAllByType(TextView)[5].props.children).toEqual('Submitted January 20, 2020')
      })
    })
  })

  describe('when the type is legacyAppeal', () => {
    it('should display "Appeal for {{ programArea }}" as the title', async () => {
      await waitFor(async () => {
        mockApiCall('legacyAppeal')
        initializeTestInstance()
      })

      await waitFor(() => {
        expect(testInstance.findAllByType(TextView)[3].props.children).toEqual('Appeal for compensation')
      })
    })

    it('should display the submitted date as the event date where the type is "nod"', async () => {
      await waitFor(async () => {
        mockApiCall('legacyAppeal', [
          { date: '2020-01-20', type: 'nod' },
          { date: '2020-10-31', type: 'claim_decision' },
        ])
        initializeTestInstance()
      })

      await waitFor(() => {
        expect(testInstance.findAllByType(TextView)[5].props.children).toEqual('Submitted January 20, 2020')
      })
    })
  })

  describe('when the type is appeal', () => {
    it('should display "Appeal for {{ programArea }}" as the title', async () => {
      await waitFor(async () => {
        mockApiCall('appeal')
        initializeTestInstance()
      })

      await waitFor(() => {
        expect(testInstance.findAllByType(TextView)[3].props.children).toEqual('Appeal for compensation')
      })
    })

    it('should display the submitted date as the event date where the type is "nod"', async () => {
      await waitFor(async () => {
        mockApiCall('appeal', [
          { date: '2020-01-20', type: 'nod' },
          { date: '2020-10-31', type: 'claim_decision' },
        ])
        initializeTestInstance()
      })

      await waitFor(() => {
        expect(testInstance.findAllByType(TextView)[5].props.children).toEqual('Submitted January 20, 2020')
      })
    })
  })

  describe('when the type is supplementalClaim', () => {
    it('should display "Supplemental claim appeal for {{ programArea }}" as the title', async () => {
      await waitFor(async () => {
        mockApiCall('supplementalClaim')
        initializeTestInstance()
      })

      await waitFor(() => {
        expect(testInstance.findAllByType(TextView)[3].props.children).toEqual('Supplemental claim appeal for compensation')
      })
    })

    it('should display the submitted date as the event date where the type is "sc_request"', async () => {
      await waitFor(async () => {
        mockApiCall('supplementalClaim', [
          { date: '2020-01-20', type: 'sc_request' },
          { date: '2020-10-31', type: 'claim_decision' },
        ])
        initializeTestInstance()
      })

      await waitFor(() => {
        expect(testInstance.findAllByType(TextView)[5].props.children).toEqual('Submitted January 20, 2020')
      })
    })
  })

  describe('when common error occurs', () => {
    it('should render error component when the stores screenID matches the components screenID', async () => {
      when(api.get as jest.Mock)
        .calledWith(`/v0/appeal/0`, {}, expect.anything())
        .mockRejectedValue({ networkError: true } as api.APIError)

      await waitFor(() => {
        initializeTestInstance(false)
      })

      expect(testInstance.findAllByType(ErrorComponent)).toHaveLength(1)
    })

    it('should not render error component when the stores screenID does not match the components screenID', async () => {
      const errorsByScreenID = initializeErrorsByScreenID()
      errorsByScreenID[ScreenIDTypesConstants.ASK_FOR_CLAIM_DECISION_SCREEN_ID] = CommonErrorTypesConstants.NETWORK_CONNECTION_ERROR

      const errorState: ErrorsState = {
        ...initialErrorsState,
        errorsByScreenID,
      }

      await waitFor(() => {
        initializeTestInstance(false, errorState)
        expect(testInstance.findAllByType(ErrorComponent)).toHaveLength(0)
      })
    })
  })
})
