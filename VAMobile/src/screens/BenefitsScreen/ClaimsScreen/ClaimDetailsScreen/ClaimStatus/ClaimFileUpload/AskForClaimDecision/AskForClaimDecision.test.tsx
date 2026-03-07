import React from 'react'

import { fireEvent, screen, waitFor } from '@testing-library/react-native'
import { t } from 'i18next'

import { claimsAndAppealsKeys } from 'api/claimsAndAppeals'
import AskForClaimDecision from 'screens/BenefitsScreen/ClaimsScreen/ClaimDetailsScreen/ClaimStatus/ClaimFileUpload/AskForClaimDecision/AskForClaimDecision'
import { claim } from 'screens/BenefitsScreen/ClaimsScreen/claimData'
import * as api from 'store/api'
import { QueriesData, context, mockNavProps, render, when } from 'testUtils'

const mockNavigationSpy = jest.fn()
const mockAlertSpy = jest.fn()
jest.mock('utils/hooks', () => {
  const original = jest.requireActual('utils/hooks')
  return {
    ...original,
    useRouteNavigation: () => mockNavigationSpy,
    useShowActionSheet: () => mockAlertSpy,
  }
})

when(api.get as jest.Mock)
  .calledWith(`/v0/claim/600156928/request-decision`, {})
  .mockResolvedValue({})

context('AskForClaimDecision', () => {
  const claimData = {
    ...claim,
    id: '600156928',
    type: 'evss_claims',
    attributes: {
      ...claim.attributes,
      open: false,
      decisionLetterSent: true,
    },
  }

  const initializeTestInstance = (provider?: string): void => {
    const props = mockNavProps(
      undefined,
      {
        navigate: jest.fn(),
        goBack: jest.fn(),
      },
      {
        params: { claimID: '600156928', provider },
      },
    )
    const queriesData: QueriesData = [
      {
        queryKey: [claimsAndAppealsKeys.claim, '600156928'],
        data: claimData,
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

  describe('navigation after successful submit', () => {
    beforeEach(() => {
      mockNavigationSpy.mockReset()
      when(api.get as jest.Mock)
        .calledWith(`/v0/claim/600156928`, {})
        .mockResolvedValue({ data: claimData })
      ;(api.post as jest.Mock).mockResolvedValue({})
      mockAlertSpy.mockImplementation((_: unknown, callback: (idx: number) => void) => callback(0))
    })

    it('navigates to ClaimDetailsScreen with provider when provider param is set', async () => {
      initializeTestInstance('lighthouseV2')
      await waitFor(() => fireEvent.press(screen.getByText(t('askForClaimDecision.haveSubmittedAllEvidence'))))
      await waitFor(() => fireEvent.press(screen.getByRole('button', { name: t('askForClaimDecision.submit') })))
      await waitFor(() =>
        expect(mockNavigationSpy).toHaveBeenCalledWith('ClaimDetailsScreen', {
          claimID: '600156928',
          claimType: 'CLOSED',
          provider: 'lighthouseV2',
        }),
      )
    })

    it('navigates to ClaimDetailsScreen without provider when provider param is not set', async () => {
      initializeTestInstance()
      await waitFor(() => fireEvent.press(screen.getByText(t('askForClaimDecision.haveSubmittedAllEvidence'))))
      await waitFor(() => fireEvent.press(screen.getByRole('button', { name: t('askForClaimDecision.submit') })))
      await waitFor(() =>
        expect(mockNavigationSpy).toHaveBeenCalledWith('ClaimDetailsScreen', {
          claimID: '600156928',
          claimType: 'CLOSED',
          provider: undefined,
        }),
      )
    })
  })
})
