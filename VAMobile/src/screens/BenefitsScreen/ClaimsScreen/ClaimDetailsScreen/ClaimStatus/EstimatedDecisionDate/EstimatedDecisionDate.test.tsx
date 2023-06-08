import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { act, ReactTestInstance } from 'react-test-renderer'

import { DateTime } from 'luxon'

import { context, mockNavProps, mockStore, render } from 'testUtils'
import { InitialState } from 'store/slices'
import EstimatedDecisionDate from './EstimatedDecisionDate'
import { AlertBox, TextView, VAButton } from 'components'
import { RenderAPI } from '@testing-library/react-native'

const mockExternalLinkSpy = jest.fn()

jest.mock('utils/hooks', () => {
  const original = jest.requireActual('utils/hooks')
  const theme = jest.requireActual('styles/themes/standardTheme').default

  return {
    ...original,
    useExternalLink: () => mockExternalLinkSpy,
  }
})

context('EstimatedDecisionDate', () => {
  let store: any
  let component: RenderAPI
  let props: any
  let testInstance: ReactTestInstance

  const initializeTestCase = (maxEstDate: string, showCovidMessage: boolean): void => {
    props = mockNavProps({ maxEstDate, showCovidMessage })

    component = render(<EstimatedDecisionDate {...props} />, { preloadedState: { ...InitialState } })
    testInstance = component.UNSAFE_root
  }

  beforeEach(() => {
    initializeTestCase('2020-12-20', false)
  })

  it('should initialize', async () => {
    expect(component).toBeTruthy()
  })

  describe('when showCovidMessage is true', () => {
    beforeEach(async () => {
      initializeTestCase('2020-12-20', true)
    })

    it('should show an AlertBox and VAButton', async () => {
      expect(testInstance.findAllByType(AlertBox).length).toEqual(1)
      expect(testInstance.findAllByType(VAButton).length).toEqual(1)
    })

    describe('on click of the va button', () => {
      it('should launch external link', () => {
        testInstance.findByType(VAButton).props.onPress()
        expect(mockExternalLinkSpy).toHaveBeenCalled()
      })
    })
  })

  describe('when showCovidMessage is false', () => {
    describe('when the max estimated date exists', () => {
      describe('when the max estimated date is between today and 2 years from the future', () => {
        it('it will show the formatted date', async () => {
          const dateBetweenNowAndTwoYears = DateTime.local().plus({ years: 1 })
          initializeTestCase(dateBetweenNowAndTwoYears.toISO(), false)

          const textViews = testInstance.findAllByType(TextView)
          expect(textViews[1].props.children).toEqual(dateBetweenNowAndTwoYears.toFormat('MMMM dd, yyyy'))
          expect(textViews[2].props.children).toEqual('We base this on claims similar to yours. It isn’t an exact date.')
        })
      })

      describe('when the max estimated date is more than 2 years ago', () => {
        let textViews: ReactTestInstance[]
        beforeEach(async () => {
          const dateMoreThanTwoYearsAgo = DateTime.local().plus({ years: 3 })
          initializeTestCase(dateMoreThanTwoYearsAgo.toISO(), false)
          textViews = testInstance.findAllByType(TextView)
        })

        it('should show the message "Claim completion dates aren\'t available right now." instead of the date', async () => {
          expect(textViews[1].props.children).toEqual("Claim completion dates aren't available right now.")
        })

        it('should not show text after the no date message', async () => {
          expect(textViews.length).toEqual(2)
          expect(textViews[0].props.children).toEqual('Estimated decision date:')
          expect(textViews[1].props.children).toEqual("Claim completion dates aren't available right now.")
        })
      })

      describe('when the max estimated date is before today', () => {
        it('should show the formatted date and the message "We estimated your claim would be completed by now but we need more time."', async () => {
          const dateBeforeToday = DateTime.local().minus({ years: 1 })
          initializeTestCase(dateBeforeToday.toISO(), false)

          const textViews = testInstance.findAllByType(TextView)
          expect(textViews[1].props.children).toEqual(dateBeforeToday.toFormat('MMMM dd, yyyy'))
          expect(textViews[2].props.children).toEqual('We estimated your claim would be completed by now but we need more time.')
        })
      })
    })

    describe('when the max estimated date does not exist', () => {
      let textViews: ReactTestInstance[]
      beforeEach(async () => {
        initializeTestCase('', false)
        textViews = testInstance.findAllByType(TextView)
      })

      it('should show the message "Claim completion dates aren\'t available right now." instead of the date', async () => {
        expect(textViews[1].props.children).toEqual("Claim completion dates aren't available right now.")
      })

      it('should not show text after the no date message', async () => {
        expect(textViews.length).toEqual(2)
        expect(textViews[0].props.children).toEqual('Estimated decision date:')
        expect(textViews[1].props.children).toEqual("Claim completion dates aren't available right now.")
      })
    })
  })
})
