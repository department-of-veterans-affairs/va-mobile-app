import React from 'react'

import { screen } from '@testing-library/react-native'

import { RootState } from 'store'
import { RefillRequestSummaryItems } from 'store/api'
import { PrescriptionState, initialPrescriptionState } from 'store/slices'
import { context, mockNavProps, render } from 'testUtils'
import { defaultPrescriptionsList as mockData } from 'utils/tests/prescription'

import RefillRequestSummary from './RefillRequestSummary'

context('RefillRequestSummary', () => {
  const initializeTestInstance = (prescriptionState?: Partial<PrescriptionState>) => {
    const props = mockNavProps({}, { setOptions: jest.fn(), navigate: jest.fn(), addListener: jest.fn() })
    const store: Partial<RootState> = {
      prescriptions: {
        ...initialPrescriptionState,
        ...prescriptionState,
      },
    }
    render(<RefillRequestSummary {...props} />, { preloadedState: store })
  }

  describe('when all request submit successfully', () => {
    it('should display successful summary', () => {
      initializeTestInstance({
        refillRequestSummaryItems: [
          {
            data: mockData[0],
            submitted: true,
          },
        ] as RefillRequestSummaryItems,
      })

      expect(screen.getByText('We got your refill requests')).toBeTruthy()
      expect(screen.getByText('Refill request summary')).toBeTruthy()
      expect(screen.getByText('ALLOPURINOL 100MG TAB')).toBeTruthy()
      expect(screen.getByText('Rx #: 3636691')).toBeTruthy()
      expect(screen.getByText('What’s next')).toBeTruthy()
      expect(
        screen.getByText(
          "We're reviewing your refill request. Once approved, the VA pharmacy will process your refill.",
        ),
      ).toBeTruthy()
      expect(
        screen.getByText(
          'If you have questions about the status of your refill, contact your provider or local VA pharmacy.',
        ),
      ).toBeTruthy()
      expect(screen.getByRole('link', { name: 'Go to all pending refills' })).toBeTruthy()
    })
  })

  describe('when all request failed', () => {
    it('should display fail summary', () => {
      initializeTestInstance({
        refillRequestSummaryItems: [
          {
            data: mockData[0],
            submitted: false,
          },
        ] as RefillRequestSummaryItems,
      })

      expect(screen.getByText("We didn't get 1 refill requests")).toBeTruthy()
      expect(
        screen.getByText("We're sorry. Something went wrong on our end. Try again or contact your local VA pharmacy."),
      ).toBeTruthy()
      expect(screen.getByRole('button', { name: 'Try again' })).toBeTruthy()
      expect(screen.getByText('Refill request summary')).toBeTruthy()
      expect(screen.getByText('ALLOPURINOL 100MG TAB')).toBeTruthy()
      expect(screen.getByText('Rx #: 3636691')).toBeTruthy()
      expect(screen.queryByText('What’s next')).toBeFalsy()
    })
  })

  describe('when some request succeed and some failed', () => {
    it('should display mix summary', () => {
      initializeTestInstance({
        refillRequestSummaryItems: [
          {
            data: mockData[0],
            submitted: true,
          },
          {
            data: mockData[1],
            submitted: false,
          },
        ] as RefillRequestSummaryItems,
      })
      expect(screen.getByRole('button', { name: 'Try again' })).toBeTruthy()
      expect(screen.getByRole('link', { name: 'Go to all pending refills' })).toBeTruthy()
      expect(screen.getByText("We didn't get 1 refill requests")).toBeTruthy()
      expect(
        screen.getByText("We're sorry. Something went wrong on our end. Try again or contact your local VA pharmacy."),
      ).toBeTruthy()
      expect(screen.getByText('Refill request summary')).toBeTruthy()
      expect(screen.getByText('ALLOPURINOL 100MG TAB')).toBeTruthy()
      expect(screen.getByText('Rx #: 3636691')).toBeTruthy()
      expect(screen.getByText('AMLODIPINE BESYLATE 10MG TAB')).toBeTruthy()
      expect(screen.getByText('Rx #: 3636711A')).toBeTruthy()
      expect(screen.getByText('What’s next')).toBeTruthy()
      expect(
        screen.getByText(
          "We're reviewing your refill request. Once approved, the VA pharmacy will process your refill.",
        ),
      ).toBeTruthy()
      expect(
        screen.getByText(
          'If you have questions about the status of your refill, contact your provider or local VA pharmacy.',
        ),
      ).toBeTruthy()
    })
  })
})
