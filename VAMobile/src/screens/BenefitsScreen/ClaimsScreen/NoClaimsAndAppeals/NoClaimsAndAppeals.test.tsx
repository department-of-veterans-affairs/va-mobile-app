import React from 'react'
import { screen } from '@testing-library/react-native'

import { QueriesData, context, render } from 'testUtils'
import NoClaimsAndAppeals from './NoClaimsAndAppeals'
import { ClaimTypeConstants } from '../ClaimsAndAppealsListView/ClaimsAndAppealsListView'
import { claimsAndAppealsKeys } from 'api/claimsAndAppeals'


context('NoClaimsAndAppeals', () => {
  const initializeTestInstance = (metaErrors: any) => {
    let queriesData: QueriesData | undefined
    if (metaErrors) {
      queriesData = [{
        queryKey: claimsAndAppealsKeys.claimsAndAppeals,
        data: {
          meta: {
            errors: metaErrors
          },
        },
      }]
    }
    render(<NoClaimsAndAppeals claimType={ClaimTypeConstants.ACTIVE} />, {queriesData})
  }

  it('initializes correctly with no claims or appeals', async () => {
    initializeTestInstance([
      {
        service: 'appeals'
      },
      {
        service: 'claims'
      },
    ])
    expect(screen.getByRole('header', { name: "You don't have any submitted claims or appeals" })).toBeTruthy()
    expect(screen.getByText('This app shows only completed claim and appeal applications. If you started a claim or appeal but haven’t finished it yet, go to eBenefits to work on it.')).toBeTruthy()
  })

  it('initializes correctly with no appeals', async () => {
    initializeTestInstance([
      {
        service: 'appeals'
      },
    ])
    expect(screen.getByRole('header', { name: "You don't have any appeals" })).toBeTruthy()
    expect(screen.getByText('This app shows only completed applications but you don’t have active appeals.')).toBeTruthy()

  })

  it('initializes correctly with no claims', async () => {
    initializeTestInstance([
      {
        service: 'claims'
      },
    ])
    expect(screen.getByRole('header', { name: "You don't have any submitted claims" })).toBeTruthy()
    expect(screen.getByText('This app shows only completed claim applications. If you started a claim but haven’t finished it yet, go to eBenefits to work on it.')).toBeTruthy()
  })
})
