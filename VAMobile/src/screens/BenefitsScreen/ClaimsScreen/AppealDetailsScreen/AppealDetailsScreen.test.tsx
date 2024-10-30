import React from 'react'

import { fireEvent, screen, waitFor } from '@testing-library/react-native'
import { DateTime } from 'luxon'

import { claimsAndAppealsKeys } from 'api/claimsAndAppeals'
import { AppealData } from 'api/types'
import * as api from 'store/api'
import { QueriesData, context, mockNavProps, render, when } from 'testUtils'

import { appeal as appealData } from '../appealData'
import AppealDetailsScreen from './AppealDetailsScreen'

context('AppealDetailsScreen', () => {
  const renderWithData = (appeal?: Partial<AppealData>): void => {
    let queriesData: QueriesData | undefined
    if (appeal) {
      queriesData = [
        {
          queryKey: [claimsAndAppealsKeys.appeal, '0'],
          data: {
            ...appeal,
          },
        },
      ]
    }

    const props = mockNavProps(
      undefined,
      {
        navigate: jest.fn(),
        addListener: jest.fn(),
        goBack: jest.fn(),
      },
      { params: { appealID: '0' } },
    )
    render(<AppealDetailsScreen {...props} />, { queriesData })
  }

  describe('when loadingClaim is set to true', () => {
    it('should show loading screen', async () => {
      renderWithData()
      expect(screen.getByText('Loading your appeal details...')).toBeTruthy()
    })
  })

  describe('when the selected tab is status', () => {
    it('should display the AppealStatus component', async () => {
      const date = DateTime.fromISO('2018-01-19T10:20:42-05:00')
      const dateTime = date.toLocaleString(Object.assign(DateTime.DATETIME_FULL, { day: '2-digit' }))
      when(api.get as jest.Mock)
        .calledWith(`/v0/appeal/0`, {})
        .mockResolvedValue({
          data: {
            ...appealData,
            type: 'appeal',
          },
        })
      renderWithData({
        ...appealData,
        type: 'appeal',
      })
      await waitFor(() => fireEvent.press(screen.getByRole('link', { name: 'Status' })))
      await waitFor(() => expect(screen.getByRole('header', { name: 'Appeal for compensation' })).toBeTruthy())
      await waitFor(() => expect(screen.getByText('Up to date as of ' + dateTime)).toBeTruthy())
      await waitFor(() => expect(screen.getByText('Received')).toBeTruthy())
      await waitFor(() => expect(screen.getByText('Review past events')).toBeTruthy())
      await waitFor(() => expect(screen.getByRole('header', { name: 'Current status' })).toBeTruthy())
      await waitFor(() =>
        expect(screen.getByRole('header', { name: 'A reviewer is examining your new evidence' })).toBeTruthy(),
      )
      await waitFor(() =>
        expect(
          screen.getByText(
            'A Supplemental Claim allows you to add new and relevant evidence to your case. When you filed a Supplemental Claim, you included new evidence or identified evidence that the Veterans Benefits Administration should obtain.',
          ),
        ).toBeTruthy(),
      )
      await waitFor(() =>
        expect(
          screen.getByText(
            'If you have more evidence to submit, you should do so as soon as possible. You can send new evidence to the Veterans Benefits Administration at:',
          ),
        ).toBeTruthy(),
      )
      await waitFor(() => expect(screen.getByText('Department of Veterans Affairs')).toBeTruthy())
      await waitFor(() => expect(screen.getByText('Evidence Intake Center')).toBeTruthy())
      await waitFor(() => expect(screen.getByText('PO Box 4444')).toBeTruthy())
      await waitFor(() => expect(screen.getByText('Janesville, WI 53547-4444')).toBeTruthy())
      await waitFor(() => expect(screen.getByText('Fax 844-531-7818')).toBeTruthy())
      await waitFor(() =>
        expect(
          screen.getByText(
            'A reviewer will look at this new evidence, as well as evidence VA already had, and determine whether it changes the decision. If needed, they may contact you to ask for more evidence or to schedule a new medical exam.',
          ),
        ).toBeTruthy(),
      )
      await waitFor(() => expect(screen.getByRole('header', { name: 'Appeals ahead of you' })).toBeTruthy())
      await waitFor(() => expect(screen.getByRole('header', { name: 'Need help?' })).toBeTruthy())
      await waitFor(() =>
        expect(
          screen.getByText(
            'Call our VA benefits hotline. We’re here Monday through Friday, 8:00 a.m. to 9:00 p.m. ET.',
          ),
        ).toBeTruthy(),
      )
      await waitFor(() => expect(screen.getByRole('link', { name: '800-827-1000' })).toBeTruthy())
      await waitFor(() =>
        expect(screen.getByText('To review more details about your appeal, go to VA.gov.')).toBeTruthy(),
      )
      await waitFor(() => expect(screen.getByRole('link', { name: 'Go to VA.gov' })).toBeTruthy())
    })
  })

  describe('when the selected tab is issues', () => {
    it('should display the AppealStatus component', async () => {
      when(api.get as jest.Mock)
        .calledWith(`/v0/appeal/0`, {})
        .mockResolvedValue({
          data: {
            ...appealData,
            type: 'appeal',
          },
        })
      renderWithData({
        ...appealData,
        type: 'appeal',
      })
      await waitFor(() => fireEvent.press(screen.getByRole('link', { name: 'Issues' })))
      await waitFor(() => expect(screen.getByRole('header', { name: 'Appeal for compensation' })).toBeTruthy())
      await waitFor(() => expect(screen.getByText('Received')).toBeTruthy())
      await waitFor(() => expect(screen.getByRole('header', { name: 'Currently on appeal' })).toBeTruthy())
      await waitFor(() => expect(screen.getByText('Service connection, Post-traumatic stress disorder')).toBeTruthy())
      await waitFor(() => expect(screen.getByText('Eligibility for loan guaranty benefits')).toBeTruthy())
      await waitFor(() => expect(screen.getByText('Service connected')).toBeTruthy())
      await waitFor(() => expect(screen.getByText('Other')).toBeTruthy())
      await waitFor(() => expect(screen.getByText('Validity of debt owed')).toBeTruthy())
      await waitFor(() => expect(screen.getByText('Effective date, pension benefits')).toBeTruthy())
      await waitFor(() => expect(screen.getByText('Rule 608 motion to withdraw')).toBeTruthy())
      await waitFor(() => expect(screen.getByText('Eligibility for pension, unemployability')).toBeTruthy())
      await waitFor(() => expect(screen.getByRole('header', { name: 'Need help?' })).toBeTruthy())
      await waitFor(() =>
        expect(
          screen.getByText(
            'Call our VA benefits hotline. We’re here Monday through Friday, 8:00 a.m. to 9:00 p.m. ET.',
          ),
        ).toBeTruthy(),
      )
      await waitFor(() => expect(screen.getByRole('link', { name: '800-827-1000' })).toBeTruthy())
      await waitFor(() =>
        expect(screen.getByText('To review more details about your appeal, go to VA.gov.')).toBeTruthy(),
      )
      await waitFor(() => expect(screen.getByRole('link', { name: 'Go to VA.gov' })).toBeTruthy())
    })
  })

  describe('when the type is higherLevelReview', () => {
    it('should display "Higher level review appeal for {{ programArea }}" as the title', async () => {
      when(api.get as jest.Mock)
        .calledWith(`/v0/appeal/0`, {})
        .mockResolvedValue({
          data: {
            ...appealData,
            type: 'higherLevelReview',
          },
        })
      renderWithData({
        ...appealData,
        type: 'higherLevelReview',
      })
      await waitFor(() => expect(screen.getByText('Higher level review appeal for compensation')).toBeTruthy())
    })

    it('should display the Received date as the event date where the type is "hlr_request"', async () => {
      when(api.get as jest.Mock)
        .calledWith(`/v0/appeal/0`, {})
        .mockResolvedValue({
          data: {
            ...appealData,
            type: 'higherLevelReview',
            attributes: {
              ...appealData.attributes,
              events: [
                { date: '2020-01-20', type: 'hlr_request' },
                { date: '2020-01-20', type: 'claim_decision' },
              ],
            },
          },
        })
      renderWithData({
        ...appealData,
        type: 'higherLevelReview',
        attributes: {
          ...appealData.attributes,
          events: [
            { date: '2020-01-20', type: 'hlr_request' },
            { date: '2020-01-20', type: 'claim_decision' },
          ],
        },
      })
      await waitFor(() => expect(screen.getByText('Received January 20, 2020')).toBeTruthy())
    })
  })

  describe('when the type is legacyAppeal', () => {
    it('should display "Appeal for {{ programArea }}" as the title', async () => {
      when(api.get as jest.Mock)
        .calledWith(`/v0/appeal/0`, {})
        .mockResolvedValue({
          data: {
            ...appealData,
            type: 'legacyAppeal',
          },
        })
      renderWithData({
        ...appealData,
        type: 'legacyAppeal',
      })
      await waitFor(() => expect(screen.getByRole('header', { name: 'Appeal for compensation' })).toBeTruthy())
    })

    it('should display the Received date as the event date where the type is "nod"', async () => {
      when(api.get as jest.Mock)
        .calledWith(`/v0/appeal/0`, {})
        .mockResolvedValue({
          data: {
            ...appealData,
            type: 'legacyAppeal',
            attributes: {
              ...appealData.attributes,
              events: [
                { date: '2020-01-20', type: 'nod' },
                { date: '2020-10-31', type: 'claim_decision' },
              ],
            },
          },
        })
      renderWithData({
        ...appealData,
        type: 'legacyAppeal',
        attributes: {
          ...appealData.attributes,
          events: [
            { date: '2020-01-20', type: 'nod' },
            { date: '2020-10-31', type: 'claim_decision' },
          ],
        },
      })
      await waitFor(() => expect(screen.getByText('Received January 20, 2020')).toBeTruthy())
    })
  })

  describe('when the type is appeal', () => {
    it('should display "Appeal for {{ programArea }}" as the title', async () => {
      when(api.get as jest.Mock)
        .calledWith(`/v0/appeal/0`, {})
        .mockResolvedValue({
          data: {
            ...appealData,
            type: 'appeal',
          },
        })
      renderWithData({
        ...appealData,
        type: 'appeal',
      })
      await waitFor(() => expect(screen.getByRole('header', { name: 'Appeal for compensation' })).toBeTruthy())
    })

    it('should display the Received date as the event date where the type is "nod"', async () => {
      when(api.get as jest.Mock)
        .calledWith(`/v0/appeal/0`, {})
        .mockResolvedValue({
          data: {
            ...appealData,
            type: 'appeal',
            attributes: {
              ...appealData.attributes,
              events: [
                { date: '2020-01-20', type: 'nod' },
                { date: '2020-10-31', type: 'claim_decision' },
              ],
            },
          },
        })
      renderWithData({
        ...appealData,
        type: 'appeal',
        attributes: {
          ...appealData.attributes,
          events: [
            { date: '2020-01-20', type: 'nod' },
            { date: '2020-10-31', type: 'claim_decision' },
          ],
        },
      })
      await waitFor(() => expect(screen.getByText('Received January 20, 2020')).toBeTruthy())
    })
  })

  describe('when the type is supplementalClaim', () => {
    it('should display "Supplemental claim appeal for {{ programArea }}" as the title', async () => {
      when(api.get as jest.Mock)
        .calledWith(`/v0/appeal/0`, {})
        .mockResolvedValue({
          data: {
            ...appealData,
            type: 'supplementalClaim',
          },
        })
      renderWithData({
        ...appealData,
        type: 'supplementalClaim',
      })
      await waitFor(() =>
        expect(screen.getByRole('header', { name: 'Supplemental claim appeal for compensation' })).toBeTruthy(),
      )
    })

    it('should display the Received date as the event date where the type is "sc_request"', async () => {
      when(api.get as jest.Mock)
        .calledWith(`/v0/appeal/0`, {})
        .mockResolvedValue({
          data: {
            ...appealData,
            type: 'supplementalClaim',
            attributes: {
              ...appealData.attributes,
              events: [
                { date: '2020-01-20', type: 'sc_request' },
                { date: '2020-10-31', type: 'claim_decision' },
              ],
            },
          },
        })
      renderWithData({
        ...appealData,
        type: 'supplementalClaim',
        attributes: {
          ...appealData.attributes,
          events: [
            { date: '2020-01-20', type: 'sc_request' },
            { date: '2020-10-31', type: 'claim_decision' },
          ],
        },
      })
      await waitFor(() => expect(screen.getByText('Received January 20, 2020')).toBeTruthy())
    })
  })

  describe('when common error occurs', () => {
    it('should render error component when the stores screenID matches the components screenID', async () => {
      when(api.get as jest.Mock)
        .calledWith(`/v0/appeal/0`, {})
        .mockRejectedValue({ networkError: true } as api.APIError)
      renderWithData()
      await waitFor(() => expect(screen.getByRole('header', { name: "The app can't be loaded." })).toBeTruthy())
    })
  })
})
