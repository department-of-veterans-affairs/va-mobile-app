import React from 'react'

import { fireEvent, screen, waitFor } from '@testing-library/react-native'

import { claimsAndAppealsKeys } from 'api/claimsAndAppeals'
import { claim } from 'screens/BenefitsScreen/ClaimsScreen/claimData'
import * as api from 'store/api'
import { QueriesData, context, mockNavProps, render, when } from 'testUtils'

import AskForClaimDecision from './AskForClaimDecision'

const mockNavigationSpy = jest.fn()
jest.mock('utils/hooks', () => {
  const original = jest.requireActual('utils/hooks')
  return {
    ...original,
    useRouteNavigation: () => mockNavigationSpy,
  }
})

when(api.get as jest.Mock)
  .calledWith(`/v0/claim/600156928/request-decision`, {}, expect.anything())
  .mockResolvedValue({})

context('AskForClaimDecision', () => {
  const initializeTestInstance = (): void => {
    const props = mockNavProps(
      undefined,
      {
        navigate: jest.fn(),
        goBack: jest.fn(),
      },
      {
        params: { claimID: '600156928' },
      },
    )
    const queriesData: QueriesData = [
      {
        queryKey: [claimsAndAppealsKeys.claim, '600156928'],
        data: {
          ...claim,
          id: '600156928',
          type: 'evss_claims',
          attributes: {
            ...claim.attributes,
            open: false,
          },
        },
      },
    ]
    render(<AskForClaimDecision {...props} />, { queriesData })
  }

  it('should initialize', async () => {
    when(api.get as jest.Mock)
      .calledWith(`/v0/claim/600156928`, {}, undefined)
      .mockResolvedValue({
        data: {
          ...claim,
          id: '600156928',
          type: 'evss_claims',
          attributes: {
            ...claim.attributes,
            open: false,
          },
        },
      })
    initializeTestInstance()
    await waitFor(() => expect(screen.getByText('Claim evaluation')).toBeTruthy())
    await waitFor(() => expect(screen.getByRole('header', { name: 'Evaluation details' })).toBeTruthy())
    await waitFor(() =>
      expect(
        screen.getByText(
          'We sent you a letter in the mail asking for more evidence to support your claim. We’ll wait 30 days for your evidence. If you don’t have anything more you want to submit, let us know and we’ll go ahead and make a decision on your claim.',
        ),
      ).toBeTruthy(),
    )
    await waitFor(() => expect(screen.getByText('Taking the full 30 days won’t affect:')).toBeTruthy())
    await waitFor(() => expect(screen.getByText('Whether you get VA benefits')).toBeTruthy())
    await waitFor(() => expect(screen.getByText('The payment amount')).toBeTruthy())
    await waitFor(() =>
      expect(screen.getByText('Whether you get our help to gather evidence to support your claim')).toBeTruthy(),
    )
    await waitFor(() => expect(screen.getByText('The date benefits will begin if we approve your claim')).toBeTruthy())
    await waitFor(() =>
      expect(
        screen.getByText(
          'I have submitted all evidence that will support my claim and I’m not going to turn in any more information. I would like VA to make a decision on my claim based on the information already provided. (Required)',
        ),
      ).toBeTruthy(),
    )
    await waitFor(() => expect(screen.getByRole('button', { name: 'Request claim evaluation' })).toBeTruthy())
  })

  describe('when submitted decision is false or there is an erroror check box is not checked', () => {
    it('should not call navigation go back and display a field error when not checked', async () => {
      when(api.get as jest.Mock)
        .calledWith(`/v0/claim/600156928`, {}, undefined)
        .mockResolvedValue({
          data: {
            ...claim,
            id: '600156928',
            type: 'evss_claims',
            attributes: {
              ...claim.attributes,
              open: false,
            },
          },
        })
      initializeTestInstance()
      await waitFor(() =>
        expect(mockNavigationSpy).not.toHaveBeenCalledWith('ClaimDetailsScreen', {
          claimID: '600156928',
          claimType: 'CLOSED',
          focusOnSnackbar: true,
        }),
      )
      await waitFor(() => fireEvent.press(screen.getByRole('button', { name: 'Request claim evaluation' })))
      await waitFor(() => expect(api.post).not.toBeCalledWith(`/v0/claim/600156928/request-decision`))
      await waitFor(() =>
        expect(mockNavigationSpy).not.toHaveBeenCalledWith('ClaimDetailsScreen', {
          claimID: '600156928',
          claimType: 'CLOSED',
          focusOnSnackbar: true,
        }),
      )
      await waitFor(() => expect(screen.getByText('Check the box to confirm the information is correct.')).toBeTruthy())
    })
  })

  describe('when common error occurs', () => {
    it('should render error component when the stores screenID matches the components screenID', async () => {
      when(api.get as jest.Mock)
        .calledWith(`/v0/claim/600156928`, {}, undefined)
        .mockRejectedValue({ networkError: true } as api.APIError)
      initializeTestInstance()
      await waitFor(() => expect(screen.getByRole('header', { name: "The app can't be loaded." })).toBeTruthy())
    })
  })
})
