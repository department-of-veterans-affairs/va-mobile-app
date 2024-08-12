import React from 'react'

import { fireEvent, screen, waitFor } from '@testing-library/react-native'

import { claimsAndAppealsKeys } from 'api/claimsAndAppeals'
import { ClaimsAndAppealsListPayload } from 'api/types'
import { ClaimType } from 'constants/claims'
import { LARGE_PAGE_SIZE } from 'constants/common'
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
      id: '1',
      type: 'claim',
      attributes: {
        subtype: 'Compensation',
        completed: false,
        decisionLetterSent: false,
        dateFiled: '2020-10-01',
        updatedAt: '2020-10-05',
        displayTitle: 'Compensation',
        phase: 3,
        claimTypeCode: '',
        documentsNeeded: true,
        developmentLetterSent: false,
      },
    },
    {
      id: '2',
      type: 'appeal',
      attributes: {
        subtype: 'legacyAppeal',
        completed: false,
        decisionLetterSent: false,
        dateFiled: '2020-12-22',
        updatedAt: '2020-12-28',
        displayTitle: 'Insurance on docket appeal',
      },
    },
    {
      id: '3',
      type: 'claim',
      attributes: {
        subtype: 'Dependency',
        completed: false,
        decisionLetterSent: false,
        dateFiled: '2020-10-04',
        updatedAt: '2020-11-18',
        displayTitle: 'Dependency',
        phase: 6,
        claimTypeCode: '010LCOMP',
        documentsNeeded: false,
        developmentLetterSent: false,
      },
    },
  ],
  meta: {
    pagination: {
      currentPage: 1,
      perPage: 10,
      totalEntries: 2,
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
        queryKey: [claimsAndAppealsKeys.claimsAndAppeals, claimType],
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
          'page[size]': LARGE_PAGE_SIZE.toString(),
          'page[number]': '1',
          useCache: 'false',
        })
        .mockResolvedValue(mockPayload)
      initializeTestInstance('ACTIVE')
      await waitFor(() => expect(screen.getByText('Your active claims, decision reviews, and appeals')).toBeTruthy())
      await waitFor(() => expect(screen.queryByText('Your closed claims, decision reviews, and appeals')).toBeFalsy())

      await waitFor(() => expect(screen.getByText('Insurance on docket appeal')).toBeTruthy())
      await waitFor(() => expect(screen.getByText('Received December 22, 2020')).toBeTruthy())

      await waitFor(() => expect(screen.getByText('Dependency')).toBeTruthy())
      await waitFor(() => expect(screen.getByText('Received October 04, 2020')).toBeTruthy())
      await waitFor(() => expect(screen.getByText('Step 6 of 8: Preparing decision letter')).toBeTruthy())
      await waitFor(() => expect(screen.getByText('Moved to this step on November 18, 2020')).toBeTruthy())

      await waitFor(() => expect(screen.getByText('Compensation')).toBeTruthy())
      await waitFor(() => expect(screen.getByText('More information needed')).toBeTruthy())
      await waitFor(() => expect(screen.getByText('Received October 01, 2020')).toBeTruthy())
      await waitFor(() =>
        expect(screen.getByText('Step 3 of 5: Evidence gathering, review, and decision')).toBeTruthy(),
      )
      await waitFor(() => expect(screen.getByText('Moved to this step on October 05, 2020')).toBeTruthy())

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
          'page[size]': LARGE_PAGE_SIZE.toString(),
          'page[number]': '1',
          useCache: 'false',
        })
        .mockResolvedValue(mockPayload)
      await waitFor(() =>
        fireEvent.press(
          screen.getByRole('menuitem', {
            name: 'Compensation More information needed Received October 01, 2020 Step 3 of 5: Evidence gathering, review, and decision Moved to this step on October 05, 2020',
          }),
        ),
      )
      await waitFor(() =>
        expect(mockNavigationSpy).toBeCalledWith('ClaimDetailsScreen', { claimID: '1', claimType: 'ACTIVE' }),
      )
    })
  })

  describe('on click of an appeal', () => {
    it('should call useRouteNavigation', async () => {
      when(api.get as jest.Mock)
        .calledWith(`/v0/claims-and-appeals-overview`, {
          showCompleted: 'false',
          'page[size]': LARGE_PAGE_SIZE.toString(),
          'page[number]': '1',
          useCache: 'false',
        })
        .mockResolvedValue(mockPayload)
      await waitFor(() =>
        fireEvent.press(
          screen.getByRole('menuitem', {
            name: 'Insurance on docket appeal Received December 22, 2020',
          }),
        ),
      )
      await waitFor(() => expect(mockNavigationSpy).toBeCalledWith('AppealDetailsScreen', { appealID: '2' }))
    })
  })

  describe('where there are no claims or appeals', () => {
    it('should display the NoClaimsAndAppeals components', async () => {
      when(api.get as jest.Mock)
        .calledWith(`/v0/claims-and-appeals-overview`, {
          showCompleted: 'false',
          'page[size]': LARGE_PAGE_SIZE.toString(),
          'page[number]': '1',
          useCache: 'false',
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
