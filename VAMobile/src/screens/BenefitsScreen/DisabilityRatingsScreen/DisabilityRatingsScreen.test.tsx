import React from 'react'

import { screen } from '@testing-library/react-native'

import { disabilityRatingKeys } from 'api/disabilityRating'
import { RatingData } from 'api/types'
import { QueriesData, context, render } from 'testUtils'

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

  const initializeTestInstance = (ratingInfo = ratingDataMock) => {
    const queriesData: QueriesData = [
      {
        queryKey: disabilityRatingKeys.disabilityRating,
        data: ratingInfo,
      },
    ]

    render(<DisabilityRatingsScreen />, { queriesData })
  }

  it('Renders Disability Ratings correctly and not render no disability ratings', () => {
    initializeTestInstance()
    expect(screen.getAllByRole('header', { name: 'Combined disability rating' })).toBeTruthy()
    expect(screen.getByText('70%')).toBeTruthy()
    expect(
      screen.getByText(
        "This rating doesn't include any disabilities for your claims that are still in process. You can check the status of your disability claims or appeals with the Claim Status tool.",
      ),
    ).toBeTruthy()
    expect(screen.getAllByRole('header', { name: 'Individual ratings' })).toBeTruthy()
    expect(screen.getByText('50%')).toBeTruthy()
    expect(screen.getByText('PTSD')).toBeTruthy()
    expect(screen.getByText('Effective date:  12/01/2012')).toBeTruthy()
    expect(screen.getByText('30%')).toBeTruthy()
    expect(screen.getByText('Headaches, migraine')).toBeTruthy()
    expect(screen.getAllByText('Service-connected disability?  Yes')).toBeTruthy()
    expect(screen.getByText('Effective date:  08/09/2013')).toBeTruthy()
    expect(screen.getAllByRole('header', { name: 'Learn about VA disability ratings' })).toBeTruthy()
    expect(
      screen.getByText(
        'To learn how we determined your VA combined disability rating, use our disability rating calculator and ratings table.',
      ),
    ).toBeTruthy()
    expect(screen.getByRole('link', { name: 'About VA disability ratings' })).toBeTruthy()
    expect(screen.getAllByRole('header', { name: 'Need Help?' })).toBeTruthy()
    expect(
      screen.getByText('Call our VA benefits hotline. We’re here Monday through Friday, 8:00 a.m. to 9:00 p.m. ET.'),
    ).toBeTruthy()
    expect(screen.getByRole('link', { name: '800-827-1000' })).toBeTruthy()
    expect(screen.getByRole('link', { name: 'TTY: 711' })).toBeTruthy()
    expect(
      screen.queryByRole('header', { name: 'You do not have a VA combined disability rating on record.' }),
    ).toBeFalsy()
  })

  describe('when there is no disability ratings', () => {
    it('should render no disability ratings', () => {
      initializeTestInstance({} as RatingData)
      expect(
        screen.getByRole('header', { name: 'You do not have a VA combined disability rating on record.' }),
      ).toBeTruthy()
    })
  })
})
