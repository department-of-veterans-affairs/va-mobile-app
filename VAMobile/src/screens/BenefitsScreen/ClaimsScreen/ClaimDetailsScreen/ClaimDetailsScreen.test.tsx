import React from 'react'
import { Linking } from 'react-native'

import { fireEvent, screen } from '@testing-library/react-native'
import { t } from 'i18next'

import { claimsAndAppealsKeys } from 'api/claimsAndAppeals'
import { ClaimData } from 'api/types'
import { ClaimTypeConstants } from 'constants/claims'
import * as api from 'store/api'
import { QueriesData, context, mockNavProps, render, waitFor, when } from 'testUtils'
import { displayedTextPhoneNumber } from 'utils/formattingUtils'
import { featureEnabled } from 'utils/remoteConfig'

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

jest.mock('utils/remoteConfig')

context('ClaimDetailsScreen', () => {
  const renderWithData = (
    claimType = ClaimTypeConstants.ACTIVE,
    featureFlag: boolean = false,
    claim?: Partial<ClaimData>,
  ): void => {
    when(featureEnabled).calledWith('submitEvidenceExpansion').mockReturnValue(featureFlag)
    let queriesData: QueriesData | undefined
    if (claim) {
      queriesData = [
        {
          queryKey: [claimsAndAppealsKeys.claim, '600156928'],
          data: {
            ...claim,
          },
        },
        {
          queryKey: [claimsAndAppealsKeys.eFolderDocs],
          data: [],
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
      { params: { claimID: '600156928', claimType: claimType } },
    )

    render(<ClaimDetailsScreen {...props} />, { queriesData })
  }

  beforeEach(() => {
    when(api.get as jest.Mock)
      .calledWith(`/v0/claim/600156928`, {})
      .mockResolvedValue({
        data: {
          ...claimData,
        },
      })
    when(api.get as jest.Mock)
      .calledWith(`/v0/efolder/documents`, {})
      .mockResolvedValue({
        data: [],
      })
  })

  describe('when loadingClaim is set to true', () => {
    it('should show loading screen', async () => {
      renderWithData()
      expect(screen.getByText(t('claimInformation.loading'))).toBeTruthy()
    })
  })

  describe('submit evidence ', () => {
    it('submit evidence button should exist', async () => {
      renderWithData(ClaimTypeConstants.ACTIVE, true, {
        ...claimData,
        attributes: {
          ...claimData.attributes,
          phase: 2,
        },
      })
      await waitFor(() => expect(screen.getByRole('button', { name: t('claimDetails.submitEvidence') })).toBeTruthy())
    })
  })

  describe('when the selected tab is status', () => {
    it('should display the ClaimStatus component', async () => {
      renderWithData(ClaimTypeConstants.ACTIVE, false, {
        ...claimData,
      })
      await waitFor(() =>
        expect(
          screen.getByTestId(
            `${t('stepXofY', { current: 1, total: 8 })}. ${t('claimPhase.8step.heading.phase1')}. ${t('complete')}.`,
          ),
        ).toBeTruthy(),
      )
    })

    it('should display the Files component', async () => {
      renderWithData(ClaimTypeConstants.ACTIVE, true, {
        ...claimData,
      })
      await waitFor(() => fireEvent.press(screen.getByText(t('files'))))
      await waitFor(() => expect(screen.getByText('Mark_Webb_600156928_526.pdf')).toBeTruthy())
    })
  })

  describe('need help section', () => {
    it('should always display on claim status tab', async () => {
      renderWithData(ClaimTypeConstants.ACTIVE, false, {
        ...claimData,
      })
      await waitFor(() => expect(screen.getByRole('header', { name: t('claimDetails.needHelp') })).toBeTruthy())
      expect(screen.getByText(t('claimDetails.callVA'))).toBeTruthy()
      expect(screen.getByRole('link', { name: displayedTextPhoneNumber(t('8008271000')) })).toBeTruthy()
      fireEvent.press(screen.getByRole('link', { name: displayedTextPhoneNumber(t('8008271000')) }))
      await waitFor(() => expect(Linking.openURL).toHaveBeenCalled())
    })

    it('should display on claim files tab', async () => {
      renderWithData(ClaimTypeConstants.ACTIVE, true, {
        ...claimData,
      })
      await waitFor(() => fireEvent.press(screen.getByText(t('files'))))
      await waitFor(() => expect(screen.getByRole('header', { name: t('claimDetails.needHelp') })).toBeTruthy())
    })
  })

  describe('when the claimType is ACTIVE or closed', () => {
    it('Active should have file request alert and what you claimed sections', async () => {
      renderWithData(ClaimTypeConstants.ACTIVE, true, {
        ...claimData,
      })
      await waitFor(() =>
        expect(screen.getByRole('header', { name: t('claimDetails.whatYouHaveClaimed') })).toBeTruthy(),
      )
    })

    describe('Active on click of Find out why we sometimes combine claims.', () => {
      it('should call useRouteNavigation', async () => {
        renderWithData(ClaimTypeConstants.ACTIVE, false, {
          ...claimData,
        })
        await waitFor(() => fireEvent.press(screen.getByRole('link', { name: t('claimDetails.whyWeCombineLink') })))
        await waitFor(() => expect(mockNavigationSpy).toHaveBeenCalledWith('ConsolidatedClaimsNote'))
      })
    })

    it('Closed should have decision letter alert', async () => {
      renderWithData(ClaimTypeConstants.CLOSED, false, {
        ...claimData,
      })
      await waitFor(() => expect(screen.getByRole('heading', { name: t('claims.decisionLetterMailed') })).toBeTruthy())
    })

    describe('Closed on click of WhatDoIDoIfDisagreement', () => {
      it('should call useRouteNavigation', async () => {
        renderWithData(ClaimTypeConstants.CLOSED, false, {
          ...claimData,
        })
        await waitFor(() =>
          fireEvent.press(screen.getByRole('link', { name: t('claimDetails.learnWhatToDoIfDisagreeLink') })),
        )
        await waitFor(() =>
          expect(mockNavigationSpy).toHaveBeenCalledWith('WhatDoIDoIfDisagreement', {
            claimID: '600156928',
            claimStep: 3,
            claimType: 'Compensation',
          }),
        )
      })
    })
  })

  describe('when common error occurs', () => {
    it('should render error component when the stores screenID matches the components screenID', async () => {
      when(api.get as jest.Mock)
        .calledWith(`/v0/claim/600156928`, {})
        .mockRejectedValue({ networkError: true } as api.APIError)

      renderWithData()

      await waitFor(() =>
        expect(screen.getByRole('header', { name: t('errors.networkConnection.header') })).toBeTruthy(),
      )
    })
  })
})
