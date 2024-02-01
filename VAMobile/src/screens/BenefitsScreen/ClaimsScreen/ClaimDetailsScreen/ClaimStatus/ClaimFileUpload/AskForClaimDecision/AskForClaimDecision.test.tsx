import React from 'react'
import { screen, fireEvent, waitFor } from '@testing-library/react-native'

import * as api from 'store/api'
import { QueriesData, context, mockNavProps, render, when } from 'testUtils'
import AskForClaimDecision from './AskForClaimDecision'
import { claimsAndAppealsKeys } from 'api/claimsAndAppeals'
import { claim } from 'screens/BenefitsScreen/ClaimsScreen/claimData'

let mockNavigationSpy = jest.fn()
jest.mock('utils/hooks', () => {
  let original = jest.requireActual('utils/hooks')
  return {
    ...original,
    useRouteNavigation: () => mockNavigationSpy,
  }
})

when(api.get as jest.Mock)
  .calledWith(`/v0/claim/600156928/request-decision`, {}, expect.anything())
  .mockResolvedValue({})
  when(api.get as jest.Mock)
  .calledWith(`/v0/claim/600156928`, {}, expect.anything())
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

context('AskForClaimDecision', () => {
  let navigateSpy: any
  const initializeTestInstance = (): void => {
    navigateSpy = jest.fn()
    const props = mockNavProps(
      undefined,
      {
        navigate: jest.fn(),
        goBack: navigateSpy,
      },
      {
        params: { claimID: '600156928' },
      },
    )
    let queriesData: QueriesData | undefined
    queriesData = [{
      queryKey: [claimsAndAppealsKeys.claim, '600156928'],
      data: {
        ...claim,
        id: '600156928',
        type: 'evss_claims',
        attributes: {
          ...claim.attributes,
          open: false,
        },
      }
    }]

    render(<AskForClaimDecision {...props} />, {queriesData})
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  it('should initialize', () => {
    expect(screen.getByText('Claim evaluation')).toBeTruthy()
    expect(screen.getByRole('header', { name: 'Evaluation details' })).toBeTruthy()
    expect(screen.getByText("We sent you a letter in the mail asking for more evidence to support your claim. We’ll wait 30 days for your evidence. If you don’t have anything more you want to submit, let us know and we’ll go ahead and make a decision on your claim.")).toBeTruthy()
    expect(screen.getByText('Taking the full 30 days won’t affect:')).toBeTruthy()
    expect(screen.getByText('Whether you get VA benefits')).toBeTruthy()
    expect(screen.getByText('The payment amount')).toBeTruthy()
    expect(screen.getByText('Whether you get our help to gather evidence to support your claim')).toBeTruthy()
    expect(screen.getByText('The date benefits will begin if we approve your claim')).toBeTruthy()
    expect(screen.getByText("I have submitted all evidence that will support my claim and I’m not going to turn in any more information. I would like VA to make a decision on my claim based on the information already provided. (Required)")).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Request claim evaluation' })).toBeTruthy()
  })

  describe('when cancel button is pressed', () => {
    it('should call goBack', () => {
      fireEvent.press(screen.getByRole('button', { name: 'Cancel' }))
      expect(navigateSpy).toHaveBeenCalled()
    })
  })

  describe('when submitted decision is false or there is an erroror check box is not checked', () => {
    it('should not call navigation go back and display a field error when not checked', () => {
      expect(mockNavigationSpy).not.toHaveBeenCalledWith('ClaimDetailsScreen', { claimID: '600156928', claimType: 'CLOSED', focusOnSnackbar: true })
      fireEvent.press(screen.getByRole('button', { name: 'Request claim evaluation' }))
      expect(api.post).not.toBeCalledWith(`/v0/claim/600156928/request-decision`)
      expect(mockNavigationSpy).not.toHaveBeenCalledWith('ClaimDetailsScreen', { claimID: '600156928', claimType: 'CLOSED', focusOnSnackbar: true })
      expect(screen.getByText('Check the box to confirm the information is correct.')).toBeTruthy()
    })
  })

  describe('when common error occurs', () => {
    it('should render error component when the stores screenID matches the components screenID', async () => {
      when(api.get as jest.Mock)
        .calledWith(`/v0/claim/600156928`, {}, expect.anything())
        .mockRejectedValue('Error')
      initializeTestInstance()
      await waitFor(() =>expect(screen.getByRole('header', { name: "The VA mobile app isn't working right now" })).toBeTruthy())
    })
  })
})
