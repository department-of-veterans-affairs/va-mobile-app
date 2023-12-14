import React from 'react'
import { StackNavigationOptions } from '@react-navigation/stack'
import { screen, fireEvent, waitFor } from '@testing-library/react-native'

import * as api from 'store/api'
import { context, mockNavProps, render, when } from 'testUtils'
import AppealDetailsScreen from './AppealDetailsScreen'
import { InitialState } from 'store/slices'
import { appeal as appealData } from '../appealData'
import { AppealEventData, AppealTypes } from 'store/api/types'

context('AppealDetailsScreen', () => {
  let props: any
  let navHeaderSpy: any
  let goBack: jest.Mock
  let abortLoadSpy: jest.Mock

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

  const initializeTestInstance = (loadingAppeal: boolean = false): void => {
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

   render(<AppealDetailsScreen {...props} />, {
      preloadedState: {
        ...InitialState,
        claimsAndAppeals: {
          ...InitialState.claimsAndAppeals,
          loadingAppeal,
          cancelLoadingDetailScreen: {
            abort: abortLoadSpy,
          },
        },
      },
    })
  }

  describe('when loadingClaim is set to true', () => {
    it('should show loading screen', () => {
      initializeTestInstance(true)
      expect(screen.getByText('Loading your appeal details...')).toBeTruthy()
    })
  })

  describe('when the selected tab is status', () => {
    it('should display the AppealStatus component', async () => {
      await waitFor(() => {
        mockApiCall()
        initializeTestInstance()
      })
      fireEvent.press(screen.getByRole('tab', { name: 'Status' }))
      expect(screen.getByRole('header', { name: 'Appeal for compensation' })).toBeTruthy()
      expect(screen.getByText('Submitted')).toBeTruthy()
      expect(screen.getByText('Review past events')).toBeTruthy()
      expect(screen.getByRole('header', { name: 'Current status' })).toBeTruthy()
      expect(screen.getByRole('header', { name: 'A reviewer is examining your new evidence' })).toBeTruthy()
      expect(screen.getByText('A Supplemental Claim allows you to add new and relevant evidence to your case. When you filed a Supplemental Claim, you included new evidence or identified evidence that the Veterans Benefits Administration should obtain.')).toBeTruthy()
      expect(screen.getByText('If you have more evidence to submit, you should do so as soon as possible. You can send new evidence to the Veterans Benefits Administration at:')).toBeTruthy()
      expect(screen.getByText('Department of Veterans Affairs')).toBeTruthy()
      expect(screen.getByText('Evidence Intake Center')).toBeTruthy()
      expect(screen.getByText('PO Box 4444')).toBeTruthy()
      expect(screen.getByText('Janesville, WI 53547-4444')).toBeTruthy()
      expect(screen.getByText('Fax 844-531-7818')).toBeTruthy()
      expect(screen.getByText('A reviewer will look at this new evidence, as well as evidence VA already had, and determine whether it changes the decision. If needed, they may contact you to ask for more evidence or to schedule a new medical exam.')).toBeTruthy()
      expect(screen.getByRole('header', { name: 'Appeals ahead of you' })).toBeTruthy()
      expect(screen.getByRole('header', { name: 'Need help?' })).toBeTruthy()
      expect(screen.getByText('Call our VA benefits hotline. We’re here Monday through Friday, 8:00 a.m. to 9:00 p.m. ET.')).toBeTruthy()
      expect(screen.getByRole('link', { name: '800-827-1000' })).toBeTruthy()
      expect(screen.getByText('To review more details about your appeal, visit VA.gov: ')).toBeTruthy()
      expect(screen.getByRole('link', { name: 'Visit VA.gov' })).toBeTruthy()
    })
  })

  describe('when the selected tab is issues', () => {
    it('should display the AppealStatus component', async () => {
      await waitFor(() => {
        mockApiCall()
        initializeTestInstance()
      })
      fireEvent.press(screen.getByRole('tab', { name: 'Issues' }))
      expect(screen.getByRole('header', { name: 'Appeal for compensation' })).toBeTruthy()
      expect(screen.getByText('Submitted')).toBeTruthy()
      expect(screen.getByRole('header', { name: 'Currently on appeal' })).toBeTruthy()
      expect(screen.getByText('Service connection, Post-traumatic stress disorder')).toBeTruthy()
      expect(screen.getByText('Eligibility for loan guaranty benefits')).toBeTruthy()
      expect(screen.getByText('Service connected')).toBeTruthy()
      expect(screen.getByText('Other')).toBeTruthy()
      expect(screen.getByText('Validity of debt owed')).toBeTruthy()
      expect(screen.getByText('Effective date, pension benefits')).toBeTruthy()
      expect(screen.getByText('Rule 608 motion to withdraw')).toBeTruthy()
      expect(screen.getByText('Eligibility for pension, unemployability')).toBeTruthy()
    })
  })

  describe('when the type is higherLevelReview', () => {
    it('should display "Higher level review appeal for {{ programArea }}" as the title', async () => {
      await waitFor(() => {
        mockApiCall('higherLevelReview')
        initializeTestInstance()
      })
      expect(screen.getByText('Higher level review appeal for compensation')).toBeTruthy()
    })

    it('should display the submitted date as the event date where the type is "hlr_request"', async () => {
      await waitFor(() => {
        mockApiCall('higherLevelReview', [
          { date: '2020-01-20', type: 'hlr_request' },
          { date: '2020-01-20', type: 'claim_decision' },
        ])
        initializeTestInstance()
      })
      expect(screen.getByText('Submitted January 20, 2020')).toBeTruthy()
    })
  })

  describe('when the type is legacyAppeal', () => {
    it('should display "Appeal for {{ programArea }}" as the title', async () => {
      await waitFor(() => {
        mockApiCall('legacyAppeal')
        initializeTestInstance()
      })
      expect(screen.getByRole('header', { name: 'Appeal for compensation' })).toBeTruthy()
    })

    it('should display the submitted date as the event date where the type is "nod"', async () => {
      await waitFor(() => {
        mockApiCall('legacyAppeal', [
          { date: '2020-01-20', type: 'nod' },
          { date: '2020-10-31', type: 'claim_decision' },
        ])
        initializeTestInstance()
      })
      expect(screen.getByText('Submitted January 20, 2020')).toBeTruthy()
    })
  })

  describe('when the type is appeal', () => {
    it('should display "Appeal for {{ programArea }}" as the title', async () => {
      await waitFor(() => {
        mockApiCall('appeal')
        initializeTestInstance()
      })
      expect(screen.getByRole('header', { name: 'Appeal for compensation' })).toBeTruthy()
    })

    it('should display the submitted date as the event date where the type is "nod"', async () => {
      await waitFor(() => {
        mockApiCall('appeal', [
          { date: '2020-01-20', type: 'nod' },
          { date: '2020-10-31', type: 'claim_decision' },
        ])
        initializeTestInstance()
      })
      expect(screen.getByText('Submitted January 20, 2020')).toBeTruthy()
    })
  })

  describe('when the type is supplementalClaim', () => {
    it('should display "Supplemental claim appeal for {{ programArea }}" as the title', async () => {
      await waitFor(() => {
        mockApiCall('supplementalClaim')
        initializeTestInstance()
      })
      expect(screen.getByRole('header', { name: 'Supplemental claim appeal for compensation' })).toBeTruthy()
    })

    it('should display the submitted date as the event date where the type is "sc_request"', async () => {
      await waitFor(() => {
        mockApiCall('supplementalClaim', [
          { date: '2020-01-20', type: 'sc_request' },
          { date: '2020-10-31', type: 'claim_decision' },
        ])
        initializeTestInstance()
      })
      expect(screen.getByText('Submitted January 20, 2020')).toBeTruthy()
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
      expect(screen.getByRole('header', { name: "The app can't be loaded." })).toBeTruthy()
    })
  })
})
