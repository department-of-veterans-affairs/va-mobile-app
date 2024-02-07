import React from 'react'
import { fireEvent, screen } from '@testing-library/react-native'

import { QueriesData, context, mockNavProps, render, waitFor, when } from 'testUtils'
import * as api from 'store/api'
import ClaimDetailsScreen from './ClaimDetailsScreen'
import { claim  as claimData } from '../claimData'
import { claimsAndAppealsKeys } from 'api/claimsAndAppeals'
import { ClaimData } from 'api/types/ClaimsAndAppealsData'

when(api.get as jest.Mock)
  .calledWith(`/v0/claim/0`, {}, expect.anything())
  .mockResolvedValue({
    data: {
      ...claimData,
    },
  })

context('ClaimDetailsScreen', () => {
  let props: any

  const renderWithData = (claim?: Partial<ClaimData>): void => {
    let queriesData: QueriesData | undefined
    if (claim) {
      queriesData = [{
        queryKey: [claimsAndAppealsKeys.claim, '0'],
        data: {
          ...claim
        }
      }]
    }

    props = mockNavProps(
      undefined,
      {
        navigate: jest.fn(),
        addListener: jest.fn(),
        goBack: jest.fn(),
      },
      { params: { claimID: '0', claimType: 'ACTIVE' } },
    )

   render(<ClaimDetailsScreen {...props} />, {queriesData})
  }

  describe('when loadingClaim is set to true', () => {
    it('should show loading screen', async () => {
      renderWithData()
      expect(screen.getByText('Loading your claim details...')).toBeTruthy()
    })
  })

  describe('when the selected tab is status', () => {
    it('should display the ClaimStatus component', async () => {
      renderWithData({
        ...claimData,
      },)
      expect(screen.getByTestId('Step 1 of 5. completed. Claim received June 6, 2019')).toBeTruthy()
    })
  })

  describe('when the selected tab is status', () => {
    it('should display the ClaimDetails component', async () => {
      renderWithData({
        ...claimData,
      },)
      fireEvent.press(screen.getByText('Details'))
      fireEvent.press(screen.getByText('Details'))

      expect(screen.getByText('Claim type')).toBeTruthy()
    })
  })

  describe('when common error occurs', () => {
    it('should render error component when the stores screenID matches the components screenID', async () => {
      when(api.get as jest.Mock)
        .calledWith(`/v0/claim/0`, {}, expect.anything())
        .mockRejectedValue({ networkError: true } as api.APIError)

      renderWithData()

      await waitFor(() =>expect(screen.getByRole('header', { name: "The VA mobile app isn't working right now" })).toBeTruthy())
    })
  })
})
