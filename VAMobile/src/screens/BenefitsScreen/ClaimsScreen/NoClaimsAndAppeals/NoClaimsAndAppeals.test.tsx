import React from 'react'
import { screen } from '@testing-library/react-native'

import { context, render } from 'testUtils'
import NoClaimsAndAppeals from './NoClaimsAndAppeals'
import { InitialState } from 'store/slices'
import { ClaimTypeConstants } from '../ClaimsAndAppealsListView/ClaimsAndAppealsListView'

context('NoClaimsAndAppeals', () => {
  const initializeTestInstance = (claimsServiceError = false, appealsServiceError = false) => {
    render(<NoClaimsAndAppeals claimType={ClaimTypeConstants.ACTIVE} />, {
      preloadedState: {
        ...InitialState,
        claimsAndAppeals: {
          ...InitialState.claimsAndAppeals,
          claimsServiceError,
          appealsServiceError,
        },
      },
    })
  }

  it('initializes correctly', () => {
    initializeTestInstance()
    expect(screen.getByRole('header', { name: "You don't have any submitted claims or appeals" })).toBeTruthy()
    expect(screen.getByText('This app shows only completed claim and appeal applications. If you started a claim or appeal but haven’t finished it yet, go to eBenefits to work on it.')).toBeTruthy()

    initializeTestInstance(true)
    expect(screen.getByRole('header', { name: "You don't have any appeals" })).toBeTruthy()
    expect(screen.getByText('This app shows only completed applications but you don’t have active appeals.')).toBeTruthy()

    initializeTestInstance(false, true)
    expect(screen.getByRole('header', { name: "You don't have any submitted claims" })).toBeTruthy()
    expect(screen.getByText('This app shows only completed claim applications. If you started a claim but haven’t finished it yet, go to eBenefits to work on it.')).toBeTruthy()
  })
})
