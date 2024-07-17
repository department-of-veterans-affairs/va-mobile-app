import React from 'react'
import { Linking } from 'react-native'

import { fireEvent, screen } from '@testing-library/react-native'

import { claimsAndAppealsKeys } from 'api/claimsAndAppeals'
import { ClaimData } from 'api/types'
import * as api from 'store/api'
import { QueriesData, context, mockNavProps, render, waitFor, when } from 'testUtils'

import { claim as claimData } from '../claimData'
import ClaimDetailsScreen from './ClaimDetailsScreen'

const mockNavigationSpy = jest.fn()
jest.mock('utils/hooks', () => {
  const original = jest.requireActual('utils/hooks')
  return {
    ...original,
    useRouteNavigation: () => mockNavigationSpy,
  }
})

context('ClaimDetailsScreen', () => {
  const renderWithData = (claimType = 'Active', claim?: Partial<ClaimData>): void => {
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
      { params: { claimID: '0', claimType: claimType } },
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
      renderWithData('Active', {
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
      renderWithData('Active', {
        ...claimData,
      })
      await waitFor(() => fireEvent.press(screen.getByText('Details')))
      await waitFor(() => fireEvent.press(screen.getByText('Details')))

      await waitFor(() => expect(screen.getByText('Claim type')).toBeTruthy())
    })
  })

  describe('need help section', () => {
    it('should always display on claim status tab', async () => {
      when(api.get as jest.Mock)
        .calledWith(`/v0/claim/0`, {}, expect.anything())
        .mockResolvedValue({
          data: {
            ...claimData,
          },
        })
      renderWithData('Active', {
        ...claimData,
      })
      await waitFor(() => expect(screen.getByRole('header', { name: 'Need help?' })).toBeTruthy())
      await waitFor(() =>
        expect(
          screen.getByText(
            'Call our VA benefits hotline. We’re here Monday through Friday, 8:00 a.m. to 9:00 p.m. ET.',
          ),
        ).toBeTruthy(),
      )
      await waitFor(() => expect(screen.getByRole('link', { name: '800-827-1000' })).toBeTruthy())
      await waitFor(() => fireEvent.press(screen.getByRole('link', { name: '800-827-1000' })))
      await waitFor(() => expect(Linking.openURL).toHaveBeenCalled())
    })

    it('should display on claim details, to be renamed files tab', async () => {
      when(api.get as jest.Mock)
        .calledWith(`/v0/claim/0`, {}, expect.anything())
        .mockResolvedValue({
          data: {
            ...claimData,
          },
        })
      renderWithData('Active', {
        ...claimData,
      })
      await waitFor(() => fireEvent.press(screen.getByText('Details')))
      await waitFor(() => fireEvent.press(screen.getByText('Details')))
      await waitFor(() => expect(screen.getByRole('header', { name: 'Need help?' })).toBeTruthy())
    })
  })

  describe('when the claimType is ACTIVE', () => {
    describe('on click of Find out why we sometimes combine claims. list item', () => {
      it('should call useRouteNavigation', () => {
        when(api.get as jest.Mock)
          .calledWith(`/v0/claim/0`, {}, expect.anything())
          .mockResolvedValue({
            data: {
              ...claimData,
            },
          })
        renderWithData('Active', {
          ...claimData,
        })
        fireEvent.press(screen.getByRole('button', { name: 'Why does VA sometimes combine claims?' }))
        expect(mockNavigationSpy).toHaveBeenCalledWith('ConsolidatedClaimsNote')
      })
    })

    describe('on click of What should I do if I disagree with VA’s decision on my disability claim? list item', () => {
      it('should call useRouteNavigation', () => {
        when(api.get as jest.Mock)
          .calledWith(`/v0/claim/0`, {}, expect.anything())
          .mockResolvedValue({
            data: {
              ...claimData,
            },
          })
        renderWithData('Closed', {
          ...claimData,
        })
        fireEvent.press(
          screen.getByRole('button', {
            name: "What should I do if I disagree with VA's decision on my disability claim?",
          }),
        )
        expect(mockNavigationSpy).toHaveBeenCalledWith('WhatDoIDoIfDisagreement', {
          claimID: '600156928',
          claimStep: 3,
          claimType: 'Compensation',
        })
      })
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
