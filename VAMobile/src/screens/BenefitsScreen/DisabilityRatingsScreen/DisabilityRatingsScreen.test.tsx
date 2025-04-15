import React from 'react'

import { screen } from '@testing-library/react-native'
import { t } from 'i18next'

import { RatingData } from 'api/types'
import * as api from 'store/api'
import { context, render, waitFor, when } from 'testUtils'
import { displayedTextPhoneNumber } from 'utils/formattingUtils'

import DisabilityRatingsScreen from './DisabilityRatingsScreen'

context('DisabilityRatingsScreen', () => {
  const ratingDataMock = {
    combinedDisabilityRating: 70,
    combinedEffectiveDate: '2013-08-09T00:00:00.000+00:00',
    legalEffectiveDate: '2013-08-09T00:00:00.000+00:00',
    individualRatings: [
      {
        decision: 'Service Connected',
        effectiveDate: '2012-12-01T00:00:00.000+00:00',
        ratingPercentage: 50,
        diagnosticText: 'PTSD',
        type: 'Post traumatic stress disorder',
      },
      {
        decision: 'Service Connected',
        effectiveDate: '2013-08-09T00:00:00.000+00:00',
        ratingPercentage: 30,
        diagnosticText: 'headaches, migraine',
        type: 'Migraine',
      },
    ],
  }

  const initializeTestInstance = () => {
    render(<DisabilityRatingsScreen />)
  }

  it('Renders Disability Ratings correctly and not render no disability ratings', async () => {
    when(api.get as jest.Mock)
      .calledWith('/v0/disability-rating')
      .mockResolvedValue({
        data: {
          type: 'string',
          id: 'string',
          attributes: ratingDataMock,
        },
      })
    initializeTestInstance()
    await waitFor(() =>
      expect(screen.getAllByRole('header', { name: t('disabilityRatingDetails.combinedTotalTitle') })).toBeTruthy(),
    )
    await waitFor(() => expect(screen.getByText(t('disabilityRatingDetails.percentage', { rate: 70 }))).toBeTruthy())
    await waitFor(() => expect(screen.getByText(t('disabilityRatingDetails.combinedTotalSummary'))).toBeTruthy())
    await waitFor(() =>
      expect(screen.getAllByRole('header', { name: t('disabilityRatingDetails.individualTitle') })).toBeTruthy(),
    )
    await waitFor(() => expect(screen.getByText(t('disabilityRatingDetails.percentage', { rate: 50 }))).toBeTruthy())
    await waitFor(() => expect(screen.getByText('PTSD')).toBeTruthy())
    await waitFor(() =>
      expect(
        screen.getByText(t('disabilityRatingDetails.effectiveDate', { dateEffective: '12/01/2012' })),
      ).toBeTruthy(),
    )
    await waitFor(() => expect(screen.getByText(t('disabilityRatingDetails.percentage', { rate: 30 }))).toBeTruthy())
    await waitFor(() => expect(screen.getByText('Headaches, migraine')).toBeTruthy())
    await waitFor(() =>
      expect(screen.getAllByText(t('disabilityRatingDetails.serviceConnected', { yesOrNo: 'Yes' }))).toBeTruthy(),
    )
    await waitFor(() =>
      expect(
        screen.getByText(t('disabilityRatingDetails.effectiveDate', { dateEffective: '08/09/2013' })),
      ).toBeTruthy(),
    )
    await waitFor(() => expect(screen.getAllByRole('header', { name: t('disabilityRating.learnAbout') })).toBeTruthy())
    await waitFor(() => expect(screen.getByText(t('disabilityRating.learnAboutSummary'))).toBeTruthy())
    await waitFor(() =>
      expect(screen.getByRole('link', { name: t('disabilityRating.learnAboutLinkTitle') })).toBeTruthy(),
    )
    await waitFor(() =>
      expect(screen.getAllByRole('header', { name: t('disabilityRatingDetails.needHelp') })).toBeTruthy(),
    )
    await waitFor(() => expect(screen.getByText(t('claimDetails.callVA'))).toBeTruthy())
    await waitFor(() =>
      expect(screen.getByRole('link', { name: displayedTextPhoneNumber(t('8008271000')) })).toBeTruthy(),
    )
    await waitFor(() => expect(screen.getByRole('link', { name: t('contactVA.tty.displayText') })).toBeTruthy())
    await waitFor(() =>
      expect(screen.queryByRole('header', { name: t('disabilityRating.noDisabilityRatings.title') })).toBeFalsy(),
    )
  })

  describe('when there is no disability ratings', () => {
    it('should render no disability ratings', async () => {
      when(api.get as jest.Mock)
        .calledWith('/v0/disability-rating')
        .mockResolvedValue({
          data: {
            type: 'string',
            id: 'string',
            attributes: {} as RatingData,
          },
        })
      initializeTestInstance()
      await waitFor(() =>
        expect(screen.getByRole('header', { name: t('disabilityRating.noDisabilityRatings.title') })).toBeTruthy(),
      )
    })
  })
})
