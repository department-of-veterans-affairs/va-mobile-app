import 'react-native'
import React from 'react'
import { screen } from '@testing-library/react-native'

import { context, render } from 'testUtils'
import { ErrorsState, initialErrorsState, initializeErrorsByScreenID } from 'store/slices'
import DisabilityRatingsScreen from './DisabilityRatingsScreen'
import { CommonErrorTypesConstants } from 'constants/errors'
import { RatingData, ScreenIDTypesConstants } from 'store/api/types'

let mockNavigationSpy = jest.fn()
const mockExternalLinkSpy = jest.fn()

jest.mock('utils/hooks', () => {
  let original = jest.requireActual('utils/hooks')

  return {
    ...original,
    useRouteNavigation: () => {
      return () => mockNavigationSpy
    },
    useExternalLink: () => mockExternalLinkSpy,
  }
})

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

  const initializeTestInstance = (ratingInfo = ratingDataMock, loading = false, errorState: ErrorsState = initialErrorsState) => {
    render(<DisabilityRatingsScreen />, {
      preloadedState: {
        disabilityRating: {
          ratingData: ratingInfo,
          loading,
          needsDataLoad: false,
          preloadComplete: true,
        },
        errors: errorState,
      },
    })
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  it('Renders Disability Ratings correctly and not render no disability ratings', () => {
    expect(screen.getAllByRole('header', { name: 'Combined disability rating' })).toBeTruthy()
    expect(screen.getByText('70%')).toBeTruthy()
    expect(screen.getByText("This rating doesn't include any disabilities for your claims that are still in process. You can check the status of your disability claims or appeals with the Claim Status tool.")).toBeTruthy()
    expect(screen.getAllByRole('header', { name: 'Individual ratings' })).toBeTruthy()
    expect(screen.getByText('50%')).toBeTruthy()
    expect(screen.getByText('PTSD')).toBeTruthy()
    expect(screen.getByText('Effective date:  12/01/2012')).toBeTruthy()
    expect(screen.getByText('30%')).toBeTruthy()
    expect(screen.getByText('Headaches, migraine')).toBeTruthy()
    expect(screen.getAllByText('Service-connected disability?  Yes')).toBeTruthy()
    expect(screen.getByText('Effective date:  08/09/2013')).toBeTruthy()
    expect(screen.getAllByRole('header', { name: 'Learn about VA disability ratings' })).toBeTruthy()
    expect(screen.getByText('To learn how we determined your VA combined disability rating, use our disability rating calculator and ratings table.')).toBeTruthy()
    expect(screen.getByRole('link', { name: 'About VA disability ratings' })).toBeTruthy()
    expect(screen.getAllByRole('header', { name: 'Need Help?' })).toBeTruthy()
    expect(screen.getByText("Call our VA benefits hotline. We’re here Monday through Friday, 8:00 a.m. to 9:00 p.m. ET.")).toBeTruthy()
    expect(screen.getByRole('link', { name: '800-827-1000' })).toBeTruthy()
    expect(screen.getByRole('link', { name: 'TTY: 711' })).toBeTruthy()
    expect(screen.queryByText('You do not have a VA combined disability rating on record.')).toBeFalsy()
  })

  describe('when loading is set to true', () => {
    it('should show loading screen', () => {
      initializeTestInstance(ratingDataMock, true)
      expect(screen.getByText('Loading your disability rating...')).toBeTruthy()
    })
  })

  describe('when there is no disability ratings', () => {
    it('should render no disability ratings', () => {
      initializeTestInstance({} as RatingData)
      expect(screen.getByText('You do not have a VA combined disability rating on record.')).toBeTruthy()
    })
  })

  describe('when there is an error', () => {
    it('should show an error screen', () => {
      const errorsByScreenID = initializeErrorsByScreenID()
      errorsByScreenID[ScreenIDTypesConstants.DISABILITY_RATING_SCREEN_ID] = CommonErrorTypesConstants.NETWORK_CONNECTION_ERROR

      const errorState: ErrorsState = {
        ...initialErrorsState,
        errorsByScreenID,
      }

      initializeTestInstance(ratingDataMock, undefined, errorState)
      expect(screen.getByText("The app can't be loaded.")).toBeTruthy()
    })
  })
})
