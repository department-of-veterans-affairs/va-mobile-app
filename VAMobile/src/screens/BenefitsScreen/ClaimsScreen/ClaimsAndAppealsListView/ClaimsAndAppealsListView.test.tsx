import React from 'react'
import { screen, fireEvent } from '@testing-library/react-native'

import { context, mockNavProps, render } from 'testUtils'
import ClaimsAndAppealsListView, { ClaimType } from './ClaimsAndAppealsListView'
import { InitialState } from 'store/slices'
import { ClaimsAndAppealsList } from 'store/api/types'
import { when } from 'jest-when'

let mockNavigationSpy = jest.fn()
jest.mock('utils/hooks', () => {
  let original = jest.requireActual('utils/hooks')
  return {
    ...original,
    useRouteNavigation: () => {
      return mockNavigationSpy
    },
  }
})

jest.mock('store/slices', () => {
  let actual = jest.requireActual('store/slices')
  return {
    ...actual,
    getClaimsAndAppeals: jest.fn(() => {
      return {
        type: '',
        payload: {},
      }
    }),
  }
})

context('ClaimsAndAppealsListView', () => {
  let props: any
  let mockNavigateToClaimDetailsScreenSpy: jest.Mock
  let mockNavigateToAppealDetailsScreenSpy: jest.Mock

  const initializeTestInstance = (claimType: ClaimType, isEmpty?: boolean): void => {
    mockNavigateToClaimDetailsScreenSpy = jest.fn()
    mockNavigateToAppealDetailsScreenSpy = jest.fn()

    when(mockNavigationSpy)
      .mockReturnValue(() => {})
      .calledWith('ClaimDetailsScreen', { claimID: '2', claimType: 'ACTIVE' })
      .mockReturnValue(mockNavigateToClaimDetailsScreenSpy)
      .calledWith('AppealDetailsScreen', { appealID: '0' })
      .mockReturnValue(mockNavigateToAppealDetailsScreenSpy)
    props = mockNavProps({ claimType })

    const activeClaimsAndAppeals: ClaimsAndAppealsList = [
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
    ]

    const closedClaimsAndAppeals: ClaimsAndAppealsList = [
      {
        id: '1',
        type: 'claim',
        attributes: {
          subtype: 'Compensation',
          completed: true,
          decisionLetterSent: true,
          dateFiled: '2020-10-25',
          updatedAt: '2020-10-31',
          displayTitle: 'Compensation',
        },
      },
    ]

    render(<ClaimsAndAppealsListView {...props} />, {
      preloadedState: {
        ...InitialState,
        claimsAndAppeals: {
          ...InitialState.claimsAndAppeals,
          claimsAndAppealsByClaimType: {
            ACTIVE: isEmpty ? [] : activeClaimsAndAppeals,
            CLOSED: isEmpty ? [] : closedClaimsAndAppeals,
          },
          claimsAndAppealsMetaPagination: {
            ACTIVE: {
              currentPage: 2,
              perPage: 1,
              totalEntries: 5,
            },
            CLOSED: {
              currentPage: 2,
              perPage: 1,
              totalEntries: 5,
            },
          },
        },
      },
    })
  }

  beforeEach(() => {
    initializeTestInstance('ACTIVE')
  })

  it('Renders ClaimsAndAppealsListView', () => {
    expect(screen.getByText('Your active claims and appeals')).toBeTruthy()
    expect(screen.queryByText('Your closed claims and appeals')).toBeFalsy()
    expect(screen.getByText('Supplemental claim for disability compensation updated on October 28, 2020')).toBeTruthy()
    expect(screen.getAllByText('Submitted October 22, 2020')).toBeTruthy()
    expect(screen.getByText('Claim for compensation updated on October 30, 2020')).toBeTruthy()
    initializeTestInstance('CLOSED')
    expect(screen.getByText('Your closed claims and appeals')).toBeTruthy()
    expect(screen.queryByText('Your active claims and appeals')).toBeFalsy()
  })

  describe('on click of a claim', () => {
    it('should call useRouteNavigation', () => {
      fireEvent.press(screen.getByRole('button', { name: 'Claim for compensation updated on October 30, 2020 Submitted October 22, 2020' }))
      expect(mockNavigateToClaimDetailsScreenSpy).toHaveBeenCalled()
    })
  })

  describe('on click of an appeal', () => {
    it('should call useRouteNavigation', () => {
      fireEvent.press(screen.getByRole('button', { name: 'Supplemental claim for disability compensation updated on October 28, 2020 Submitted October 22, 2020' }))
      expect(mockNavigateToAppealDetailsScreenSpy).toHaveBeenCalled()
    })
  })

  describe('where there are no claims or appeals', () => {
    it('should display the NoClaimsAndAppeals components', () => {
      initializeTestInstance('ACTIVE', true)
      expect(screen.getByText("You don't have any submitted claims or appeals")).toBeTruthy()
      expect(screen.getByText("This app shows only completed claim and appeal applications. If you started a claim or appeal but haven’t finished it yet, go to eBenefits to work on it.")).toBeTruthy()
    })
  })
})
