import React from 'react'

import { fireEvent, screen, waitFor } from '@testing-library/react-native'

import { claimsAndAppealsKeys } from 'api/claimsAndAppeals'
import { ClaimsAndAppealsListPayload } from 'api/types'
import { ClaimType } from 'constants/claims'
import * as api from 'store/api'
import { QueriesData, context, mockNavProps, render, when } from 'testUtils'
import { featureEnabled } from 'utils/remoteConfig'

import ClaimsAndAppealsListView from './ClaimsAndAppealsListView'

jest.mock('utils/remoteConfig')
when(featureEnabled).calledWith('claimPhaseExpansion').mockReturnValue(true)

const mockNavigationSpy = jest.fn()
jest.mock('utils/hooks', () => {
  const original = jest.requireActual('utils/hooks')
  return {
    ...original,
    useRouteNavigation: () => mockNavigationSpy,
  }
})

const mockPayload: ClaimsAndAppealsListPayload = {
  data: [
    {
      id: '0',
      type: 'appeal',
      attributes: {
        subtype: 'supplementalClaim',
        completed: false,
        decisionLetterSent: false,
        dateFiled: '2020-10-22',
        updatedAt: '2020-10-28',
        displayTitle: 'supplemental claim for disability compensation',
      },
    },
    {
      id: '2',
      type: 'claim',
      attributes: {
        subtype: 'Compensation',
        completed: false,
        decisionLetterSent: false,
        dateFiled: '2020-10-22',
        updatedAt: '2020-10-30',
        displayTitle: 'Compensation',
      },
    },
  ],
  meta: {
    pagination: {
      currentPage: 1,
      perPage: 10,
      totalEntries: 3,
    },
  },
}

const emptyPayload: ClaimsAndAppealsListPayload = {
  data: [],
  meta: {
    pagination: {
      currentPage: 1,
      perPage: 10,
      totalEntries: 0,
    },
  },
}

context('ClaimsAndAppealsListView', () => {
  const initializeTestInstance = (claimType: ClaimType, isEmpty?: boolean): void => {
    const props = mockNavProps({ claimType })
    const queriesData: QueriesData = [
      {
        queryKey: [claimsAndAppealsKeys.claimsAndAppeals, claimType, '1'],
        data: isEmpty ? emptyPayload : mockPayload,
      },
    ]
    render(<ClaimsAndAppealsListView {...props} />, { queriesData })
  }

  beforeEach(() => {
    initializeTestInstance('ACTIVE')
  })

  describe('Renders', () => {
    it('ClaimsAndAppealsListView', async () => {
      when(api.get as jest.Mock)
        .calledWith(`/v0/claims-and-appeals-overview`, {
          showCompleted: 'false',
          'page[size]': '10',
          'page[number]': '1',
        })
        .mockResolvedValue(mockPayload)
      initializeTestInstance('ACTIVE')
      await waitFor(() => expect(screen.getByText('Your active claims, decision reviews, and appeals')).toBeTruthy())
      await waitFor(() => expect(screen.queryByText('Your closed claims, decision reviews, and appeals')).toBeFalsy())
      await waitFor(() =>
        expect(
          screen.getByText('Supplemental claim for disability compensation updated on October 28, 2020'),
        ).toBeTruthy(),
      )
      await waitFor(() => expect(screen.getAllByText('Received October 22, 2020')).toBeTruthy())
      await waitFor(() => expect(screen.getByText('Claim for compensation updated on October 30, 2020')).toBeTruthy())
      initializeTestInstance('CLOSED')
      await waitFor(() => expect(screen.getByText('Your closed claims, decision reviews, and appeals')).toBeTruthy())
      await waitFor(() => expect(screen.queryByText('Your active claims, decision reviews, and appeals')).toBeFalsy())
    })
  })

  describe('on click of a claim', () => {
    it('should call useRouteNavigation', async () => {
      when(api.get as jest.Mock)
        .calledWith(`/v0/claims-and-appeals-overview`, {
          showCompleted: 'false',
          'page[size]': '10',
          'page[number]': '1',
        })
        .mockResolvedValue(mockPayload)
      await waitFor(() =>
        fireEvent.press(
          screen.getByRole('button', {
            name: 'Claim for compensation updated on October 30, 2020 Received October 22, 2020',
          }),
        ),
      )
      await waitFor(() =>
        expect(mockNavigationSpy).toBeCalledWith('ClaimDetailsScreen', { claimID: '2', claimType: 'ACTIVE' }),
      )
    })
  })

  describe('on click of an appeal', () => {
    it('should call useRouteNavigation', async () => {
      when(api.get as jest.Mock)
        .calledWith(`/v0/claims-and-appeals-overview`, {
          showCompleted: 'false',
          'page[size]': '10',
          'page[number]': '1',
        })
        .mockResolvedValue(mockPayload)
      await waitFor(() =>
        fireEvent.press(
          screen.getByRole('button', {
            name: 'Supplemental claim for disability compensation updated on October 28, 2020 Received October 22, 2020',
          }),
        ),
      )
      await waitFor(() => expect(mockNavigationSpy).toBeCalledWith('AppealDetailsScreen', { appealID: '0' }))
    })
  })

  describe('where there are no claims or appeals', () => {
    it('should display the NoClaimsAndAppeals components', async () => {
      when(api.get as jest.Mock)
        .calledWith(`/v0/claims-and-appeals-overview`, {
          showCompleted: 'false',
          'page[size]': '10',
          'page[number]': '1',
        })
        .mockResolvedValue(emptyPayload)
      initializeTestInstance('ACTIVE', true)
      await waitFor(() => expect(screen.getByText("You don't have any submitted claims or appeals")).toBeTruthy())
      await waitFor(() =>
        expect(
          screen.getByText(
            'This app shows only completed claim and appeal applications. If you started a claim or appeal but haven’t finished it yet, go to eBenefits to work on it.',
          ),
        ).toBeTruthy(),
      )
    })
  })
})
