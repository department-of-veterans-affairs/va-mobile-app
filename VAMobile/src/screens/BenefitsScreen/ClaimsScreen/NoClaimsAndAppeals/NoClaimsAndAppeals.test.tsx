import React from 'react'
import { screen, waitFor } from '@testing-library/react-native'

import * as api from 'store/api'
import { QueriesData, context, render, when } from 'testUtils'
import NoClaimsAndAppeals from './NoClaimsAndAppeals'
import { ClaimTypeConstants } from '../ClaimsAndAppealsListView/ClaimsAndAppealsListView'
import { claimsAndAppealsKeys } from 'api/claimsAndAppeals'
import { claim } from '../claimData'
import { appeal } from '../appealData'

context('NoClaimsAndAppeals', () => {
  const initializeTestInstance = (metaErrors: any) => {
    let queriesData: QueriesData | undefined
    if (metaErrors) {
      queriesData = [{
        queryKey: claimsAndAppealsKeys.claimsAndAppeals,
        data: {
          meta: {
            errors: metaErrors,
          },
        },
      }]
    }
    render(<NoClaimsAndAppeals claimType={ClaimTypeConstants.ACTIVE} />, {queriesData})
  }

  it('initializes correctly with no claims or appeals', async () => {
    when(api.get as jest.Mock)
      .calledWith(`/v0/claims-and-appeals-overview`, {
        'page[number]': '1',
        'page[size]': '10',
        showCompleted: 'false',
      }, expect.anything())
      .mockReturnValue({
        data: [],
        meta: {
          errors: [
            {
              service: 'appeals'
            },
            {
              service: 'claims'
            },
          ],
        }
      })

    initializeTestInstance([
      {
        service: 'appeals'
      },
      {
        service: 'claims'
      },
    ])
    await waitFor(() =>expect(screen.getByRole('header', { name: "You don't have any submitted claims or appeals" })).toBeTruthy())
    await waitFor(() =>expect(screen.getByText('This app shows only completed claim and appeal applications. If you started a claim or appeal but haven’t finished it yet, go to eBenefits to work on it.')).toBeTruthy())

  })

  it('initializes correctly with no appeals', async () => {
    when(api.get as jest.Mock)
      .calledWith(`/v0/claims-and-appeals-overview`, {
        'page[number]': '1',
        'page[size]': '10',
        showCompleted: 'false',
      }, expect.anything())
      .mockReturnValue({
        data: [{...claim}],
        meta: {
          errors: [
            {
              service: 'appeals'
            },
          ],
        }
      })
    initializeTestInstance([
      {
        service: 'appeals'
      },
    ])
    await waitFor(() =>expect(screen.getByRole('header', { name: "You don't have any appeals" })).toBeTruthy())
    await waitFor(() =>expect(screen.getByText('This app shows only completed applications but you don’t have active appeals.')).toBeTruthy())

  })

  it('initializes correctly with no claims', async () => {
    when(api.get as jest.Mock)
      .calledWith(`/v0/claims-and-appeals-overview`, {
        'page[number]': '1',
        'page[size]': '10',
        showCompleted: 'false',
      }, expect.anything())
      .mockReturnValue({
        data: [{...appeal}],
        meta: {
          errors: [
            {
              service: 'claims'
            },
          ],
        }
      })
    initializeTestInstance([
      {
        service: 'claims'
      },
    ])
    await waitFor(() =>expect(screen.getByRole('header', { name: "You don't have any submitted claims" })).toBeTruthy())
    await waitFor(() =>expect(screen.getByText('This app shows only completed claim applications. If you started a claim but haven’t finished it yet, go to eBenefits to work on it.')).toBeTruthy())
  })
})
