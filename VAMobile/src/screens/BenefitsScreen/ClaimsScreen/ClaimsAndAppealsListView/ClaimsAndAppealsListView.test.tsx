import React from 'react'

import { fireEvent, screen, waitFor } from '@testing-library/react-native'
import { t } from 'i18next'

import { claimsAndAppealsKeys } from 'api/claimsAndAppeals'
import { ClaimsAndAppealsListPayload } from 'api/types'
import { ClaimType } from 'constants/claims'
import { LARGE_PAGE_SIZE } from 'constants/common'
import * as api from 'store/api'
import { QueriesData, context, mockNavProps, render, when } from 'testUtils'

import ClaimsAndAppealsListView from './ClaimsAndAppealsListView'

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
      await waitFor(() => expect(screen.getByText(t('claims.yourClaims', { claimType: 'active' }))).toBeTruthy())
      expect(screen.queryByText(t('claims.yourClaims', { claimType: 'closed' }))).toBeFalsy()

      expect(screen.getByText('Insurance on docket appeal')).toBeTruthy()
      expect(screen.getByText(t('claimDetails.receivedOn', { date: 'December 22, 2020' }))).toBeTruthy()

      expect(screen.getByText('Dependency')).toBeTruthy()
      expect(screen.getByText(t('claimDetails.receivedOn', { date: 'October 04, 2020' }))).toBeTruthy()
      expect(
        screen.getByText(`${t('stepXofY', { current: 6, total: 8 })}: ${t('claimPhase.8step.heading.phase6')}`),
      ).toBeTruthy()
      expect(screen.getByText(t('movedToThisStepOn', { date: 'November 18, 2020' }))).toBeTruthy()

      expect(screen.getByText('Compensation')).toBeTruthy()
      expect(screen.getByText(t('claims.moreInfoNeeded'))).toBeTruthy()
      expect(screen.getByText(t('claimDetails.receivedOn', { date: 'October 01, 2020' }))).toBeTruthy()
      expect(
        screen.getByText(`${t('stepXofY', { current: 3, total: 5 })}: ${t('claimPhase.5step.heading.phase3')}`),
      ).toBeTruthy()
      expect(screen.getByText(t('movedToThisStepOn', { date: 'October 05, 2020' }))).toBeTruthy()

      initializeTestInstance('CLOSED')
      await waitFor(() => expect(screen.getByText(t('claims.yourClaims', { claimType: 'closed' }))).toBeTruthy())
      expect(screen.queryByText(t('claims.yourClaims', { claimType: 'active' }))).toBeFalsy()
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
          screen.getByRole('link', {
            name: `Compensation ${t('claims.moreInfoNeeded')} ${t('claimDetails.receivedOn', { date: 'October 01, 2020' })} ${t('stepXofY', { current: 3, total: 5 })}: ${t('claimPhase.5step.heading.phase3')} ${t('movedToThisStepOn', { date: 'October 05, 2020' })}`,
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
          screen.getByRole('link', {
            name: `Insurance on docket appeal ${t('claimDetails.receivedOn', { date: 'December 22, 2020' })} ${t('movedToThisStepOn', { date: 'December 28, 2020' })}`,
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
      await waitFor(() => expect(screen.getByText(t('noClaims.youDontHaveAnyClaimsOrAppeals'))).toBeTruthy())
      expect(screen.getByText(t('noClaims.appOnlyShowsCompletedClaimsAndAppeals'))).toBeTruthy()
    })
  })
})
