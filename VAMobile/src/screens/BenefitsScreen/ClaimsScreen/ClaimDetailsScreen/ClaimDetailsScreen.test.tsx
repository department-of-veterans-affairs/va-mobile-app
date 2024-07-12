import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'

import { claimsAndAppealsKeys } from 'api/claimsAndAppeals'
import { ClaimData } from 'api/types'
import * as api from 'store/api'
import { QueriesData, context, mockNavProps, render, waitFor, when } from 'testUtils'
import { featureEnabled } from 'utils/remoteConfig'

import { claim as claimData } from '../claimData'
import ClaimDetailsScreen from './ClaimDetailsScreen'

jest.mock('utils/remoteConfig')

context('ClaimDetailsScreen', () => {
  const renderWithData = (featureFlag: boolean = false, claim?: Partial<ClaimData>): void => {
    when(featureEnabled).calledWith('claimPhaseExpansion').mockReturnValue(featureFlag)
    let queriesData: QueriesData | undefined
    if (claim) {
      queriesData = [
        {
          queryKey: [claimsAndAppealsKeys.claim, '0'],
          data: {
            ...claim,
          },
        },
      ]
    }

    const props = mockNavProps(
      undefined,
      {
        navigate: jest.fn(),
        addListener: jest.fn(),
        setOptions: jest.fn(),
        goBack: jest.fn(),
      },
      { params: { claimID: '0', claimType: 'ACTIVE' } },
    )

    render(<ClaimDetailsScreen {...props} />, { queriesData })
  }

  describe('when loadingClaim is set to true', () => {
    it('should show loading screen', async () => {
      renderWithData()
      expect(screen.getByText('Loading your claim details...')).toBeTruthy()
    })
  })

  describe('when the selected tab is status', () => {
    it('should display the ClaimStatus component', async () => {
      when(api.get as jest.Mock)
        .calledWith(`/v0/claim/0`, {}, expect.anything())
        .mockResolvedValue({
          data: {
            ...claimData,
          },
        })
      renderWithData(false, {
        ...claimData,
      })
      await waitFor(() =>
        expect(screen.getByTestId('Step 1 of 5. completed. Claim received June 6, 2019')).toBeTruthy(),
      )
    })

    it('should display the ClaimDetails component', async () => {
      when(api.get as jest.Mock)
        .calledWith(`/v0/claim/0`, {}, expect.anything())
        .mockResolvedValue({
          data: {
            ...claimData,
          },
        })
      renderWithData(false, {
        ...claimData,
      })
      await waitFor(() => fireEvent.press(screen.getByText('Details')))
      await waitFor(() => fireEvent.press(screen.getByText('Details')))

      await waitFor(() => expect(screen.getByText('Claim type')).toBeTruthy())
    })

    it('should display the Files component', async () => {
      when(api.get as jest.Mock)
        .calledWith(`/v0/claim/0`, {}, expect.anything())
        .mockResolvedValue({
          data: {
            ...claimData,
          },
        })
      renderWithData(true, {
        ...claimData,
      })
      await waitFor(() => fireEvent.press(screen.getByText('Files')))
      await waitFor(() => fireEvent.press(screen.getByText('File')))

      await waitFor(() => expect(screen.getByText('Mark_Webb_600156928_526.pdf')).toBeTruthy())
    })
  })

  describe('when common error occurs', () => {
    it('should render error component when the stores screenID matches the components screenID', async () => {
      when(api.get as jest.Mock)
        .calledWith(`/v0/claim/0`, {}, expect.anything())
        .mockRejectedValue({ networkError: true } as api.APIError)

      renderWithData()

      await waitFor(() => expect(screen.getByRole('header', { name: "The app can't be loaded." })).toBeTruthy())
    })
  })
})
