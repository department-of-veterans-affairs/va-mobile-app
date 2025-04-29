import React from 'react'

import { screen } from '@testing-library/react-native'
import { t } from 'i18next'

import { claimsAndAppealsKeys } from 'api/claimsAndAppeals'
import { ClaimsAndAppealsGetDataMetaError, ClaimsAndAppealsListPayload } from 'api/types'
import { ClaimTypeConstants } from 'constants/claims'
import { LARGE_PAGE_SIZE } from 'constants/common'
import * as api from 'store/api'
import { QueriesData, context, render, waitFor, when } from 'testUtils'

import NoClaimsAndAppeals from './NoClaimsAndAppeals'

const mockPayload: ClaimsAndAppealsListPayload = {
  data: [],
  meta: {
    pagination: {
      currentPage: 1,
      perPage: 10,
      totalEntries: 3,
    },
  },
}

context('NoClaimsAndAppeals', () => {
  const initializeTestInstance = (
    claimType = ClaimTypeConstants.ACTIVE,
    errors: Array<ClaimsAndAppealsGetDataMetaError>,
  ) => {
    const queryPayload = mockPayload
    queryPayload.meta.errors = errors
    when(api.get as jest.Mock)
      .calledWith(`/v0/claims-and-appeals-overview`, {
        showCompleted: 'false',
        'page[size]': LARGE_PAGE_SIZE.toString(),
        'page[number]': '1',
        useCache: 'false',
      })
      .mockResolvedValue(queryPayload)
    const queriesData: QueriesData = [
      {
        queryKey: [claimsAndAppealsKeys.claimsAndAppeals, 'ACTIVE'],
        data: queryPayload,
      },
    ]
    render(<NoClaimsAndAppeals claimType={claimType} />, { queriesData })
  }

  it('initializes correctly for no claims or appeals', async () => {
    initializeTestInstance(ClaimTypeConstants.ACTIVE, [])
    await waitFor(() =>
      expect(screen.getByRole('header', { name: t('noClaims.youDontHaveAnyClaimsOrAppeals') })).toBeTruthy(),
    )
    expect(screen.getByText(t('noClaims.appOnlyShowsCompletedClaimsAndAppeals'))).toBeTruthy()
  })

  it('initializes correctly for no claims', async () => {
    initializeTestInstance(ClaimTypeConstants.ACTIVE, [
      {
        service: 'claims',
      },
    ])
    await waitFor(() => expect(screen.getByRole('header', { name: t('noClaims.youDontHaveAnyAppeals') })).toBeTruthy())
    expect(screen.getByText(t('noClaims.appOnlyShowsCompletedAppeals'))).toBeTruthy()
  })

  it('initializes correctly for no appeals', async () => {
    initializeTestInstance(ClaimTypeConstants.ACTIVE, [
      {
        service: 'appeals',
      },
    ])
    await waitFor(() => expect(screen.getByRole('header', { name: t('noClaims.youDontHaveAnyClaims') })).toBeTruthy())
    expect(screen.getByText(t('noClaims.appOnlyShowsCompletedClaims'))).toBeTruthy()
  })

  it('initializes correctly for closed claims and appeals', async () => {
    initializeTestInstance(ClaimTypeConstants.CLOSED, [])
    await waitFor(() =>
      expect(screen.getByRole('header', { name: t('noClaims.youDontHaveAnyClosedClaimsOrAppeals') })).toBeTruthy(),
    )
    expect(screen.queryByText(t('noClaims.appOnlyShowsCompletedClaims'))).toBeFalsy()
  })
})
