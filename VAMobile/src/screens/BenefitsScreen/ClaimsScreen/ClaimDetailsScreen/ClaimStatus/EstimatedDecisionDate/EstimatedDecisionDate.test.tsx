import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'
import { t } from 'i18next'
import { DateTime } from 'luxon'

import { context, mockNavProps, render } from 'testUtils'

import EstimatedDecisionDate from './EstimatedDecisionDate'

const mockExternalLinkSpy = jest.fn()

jest.mock('utils/hooks', () => {
  const original = jest.requireActual('utils/hooks')
  return {
    ...original,
    useExternalLink: () => mockExternalLinkSpy,
  }
})

context('EstimatedDecisionDate', () => {
  const initializeTestCase = (maxEstDate: string, showCovidMessage: boolean): void => {
    const props = mockNavProps({ maxEstDate, showCovidMessage })
    render(<EstimatedDecisionDate {...props} />)
  }

  it('Renders EstimatedDecisionDate', () => {
    initializeTestCase('2020-12-20', false)
    expect(screen.getByText(t('claimDetails.estimatedDecisionDate'))).toBeTruthy()
    expect(screen.getByText('December 20, 2020')).toBeTruthy()
    expect(screen.getByText(t('claimDetails.weEstimatedThis'))).toBeTruthy()
  })

  describe('when showCovidMessage is true', () => {
    it('should show an AlertBox and Button and should launch external link when button is pressed', () => {
      initializeTestCase('2020-12-20', true)
      expect(screen.getByText(t('claimDetails.covidMessage'))).toBeTruthy()
      expect(screen.getByText(t('claimDetails.reviewLocations'))).toBeTruthy()
      fireEvent.press(screen.getByRole('button', { name: t('claimDetails.reviewLocations') }))
      expect(mockExternalLinkSpy).toHaveBeenCalled()
    })
  })

  describe('when showCovidMessage is false', () => {
    describe('when the max estimated date exists', () => {
      describe('when the max estimated date is between today and 2 years from the future', () => {
        it('it will show the formatted date', () => {
          const dateBetweenNowAndTwoYears = DateTime.local().plus({ years: 1 })
          initializeTestCase(dateBetweenNowAndTwoYears.toISO(), false)
          expect(screen.getByText(dateBetweenNowAndTwoYears.toFormat('MMMM dd, yyyy'))).toBeTruthy()
          expect(screen.getByText(t('claimDetails.weBaseThis'))).toBeTruthy()
        })
      })

      describe('when the max estimated date is more than 2 years ago', () => {
        it('should show the message "Claim completion dates aren\'t available right now." instead of the date', () => {
          const dateMoreThanTwoYearsAgo = DateTime.local().plus({ years: 3 })
          initializeTestCase(dateMoreThanTwoYearsAgo.toISO(), false)
          expect(screen.getByText(t('claimDetails.estimatedDecisionDate'))).toBeTruthy()
          expect(screen.getByText(t('claimDetails.noEstimatedDecisionDate'))).toBeTruthy()
        })
      })

      describe('when the max estimated date is before today', () => {
        it('should show the formatted date and the message "We estimated your claim would be completed by now but we need more time."', () => {
          const dateBeforeToday = DateTime.local().minus({ years: 1 })
          initializeTestCase(dateBeforeToday.toISO(), false)
          expect(screen.getByText(dateBeforeToday.toFormat('MMMM dd, yyyy'))).toBeTruthy()
          expect(screen.getByText(t('claimDetails.weEstimatedThis'))).toBeTruthy()
        })
      })
    })

    describe('when the max estimated date does not exist', () => {
      it('should show the message "Claim completion dates aren\'t available right now." instead of the date', () => {
        initializeTestCase('', false)
        expect(screen.getByText(t('claimDetails.estimatedDecisionDate'))).toBeTruthy()
        expect(screen.getByText(t('claimDetails.noEstimatedDecisionDate'))).toBeTruthy()
      })
    })
  })
})
