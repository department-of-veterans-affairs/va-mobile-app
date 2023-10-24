import 'react-native'
import React from 'react'

import { context, render } from 'testUtils'
import { screen } from '@testing-library/react-native'
import NoClaimsAndAppeals from './NoClaimsAndAppeals'
import { InitialState } from 'store/slices'
import { ClaimTypeConstants } from '../ClaimsAndAppealsListView/ClaimsAndAppealsListView'

context('NoClaimsAndAppeals', () => {
  const initializeTestInstance = async (claimsServiceError = false, appealsServiceError = false) => {
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

  it('initializes correctly', async () => {
    initializeTestInstance()
    expect(screen.getByText("You don't have any submitted claims or appeals")).toBeTruthy()
    expect(screen.getByText('This app shows only completed claim and appeal applications. If you started a claim or appeal but haven’t finished it yet, go to eBenefits to work on it.')).toBeTruthy()

    initializeTestInstance(true)
    expect(screen.getByText("You don't have any appeals")).toBeTruthy()
    expect(screen.getByText('This app shows only completed applications but you don’t have active appeals.')).toBeTruthy()

    initializeTestInstance(false, true)
    expect(screen.getByText("You don't have any submitted claims")).toBeTruthy()
    expect(screen.getByText('This app shows only completed claim applications. If you started a claim but haven’t finished it yet, go to eBenefits to work on it.')).toBeTruthy()
  })
})
