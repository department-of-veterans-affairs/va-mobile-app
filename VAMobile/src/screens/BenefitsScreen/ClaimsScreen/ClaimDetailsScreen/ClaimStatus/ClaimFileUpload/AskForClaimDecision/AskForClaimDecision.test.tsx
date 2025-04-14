import React from 'react'

import { fireEvent, screen, waitFor } from '@testing-library/react-native'
import { t } from 'i18next'

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
  .calledWith(`/v0/claim/600156928/request-decision`, {})
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
      .calledWith(`/v0/claim/600156928`, {})
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
    await waitFor(() => expect(screen.getByText(t('askForClaimDecision.pageTitle'))).toBeTruthy())
    await waitFor(() => expect(screen.getByRole('header', { name: t('askForClaimDecision.title') })).toBeTruthy())
    await waitFor(() => expect(screen.getByText(t('askForClaimDecision.weSentYouALetter'))).toBeTruthy())
    await waitFor(() => expect(screen.getByText(t('askForClaimDecision.takingFull30Days'))).toBeTruthy())
    await waitFor(() => expect(screen.getByText(t('askForClaimDecision.whetherYouGetVABenefits'))).toBeTruthy())
    await waitFor(() => expect(screen.getByText(t('askForClaimDecision.paymentAmount'))).toBeTruthy())
    await waitFor(() => expect(screen.getByText(t('askForClaimDecision.whetherYouGetOurHelp'))).toBeTruthy())
    await waitFor(() => expect(screen.getByText(t('askForClaimDecision.dateBenefits'))).toBeTruthy())
    await waitFor(() => expect(screen.getByText(t('askForClaimDecision.haveSubmittedAllEvidence'))).toBeTruthy())
    await waitFor(() => expect(screen.getByRole('button', { name: t('askForClaimDecision.submit') })).toBeTruthy())
  })

  describe('when submitted decision is false or there is an erroror check box is not checked', () => {
    it('should not call navigation go back and display a field error when not checked', async () => {
      when(api.get as jest.Mock)
        .calledWith(`/v0/claim/600156928`, {})
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
      await waitFor(() => fireEvent.press(screen.getByRole('button', { name: t('askForClaimDecision.submit') })))
      await waitFor(() => expect(api.post).not.toBeCalledWith(`/v0/claim/600156928/request-decision`))
      await waitFor(() =>
        expect(mockNavigationSpy).not.toHaveBeenCalledWith('ClaimDetailsScreen', {
          claimID: '600156928',
          claimType: 'CLOSED',
          focusOnSnackbar: true,
        }),
      )
      await waitFor(() => expect(screen.getByText(t('askForClaimDecision.checkToConfirmInformation'))).toBeTruthy())
    })
  })

  describe('when common error occurs', () => {
    it('should render error component when the stores screenID matches the components screenID', async () => {
      when(api.get as jest.Mock)
        .calledWith(`/v0/claim/600156928`, {})
        .mockRejectedValue({ networkError: true } as api.APIError)
      initializeTestInstance()
      await waitFor(() =>
        expect(screen.getByRole('header', { name: t('errors.networkConnection.header') })).toBeTruthy(),
      )
    })
  })
})
